-- Catalogue : catégories, produits, photos, historique des prix.

-- ---------------------------------------------------------------------------
-- Catégories
-- ---------------------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 1 and 80),
  description text,
  image_path text,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Produits (montants en centimes)
-- ---------------------------------------------------------------------------
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category_id uuid not null references public.categories (id) on delete restrict,
  name text not null check (char_length(name) between 1 and 160),
  game text,
  set_name text,
  card_number text,
  language text,
  rarity text,
  condition text,
  is_graded boolean not null default false,
  grading_company text,
  grade numeric(3, 1) check (grade is null or (grade >= 1 and grade <= 10)),
  price_cents integer not null check (price_cents >= 0),
  compare_at_price_cents integer
    check (compare_at_price_cents is null or compare_at_price_cents > price_cents),
  -- Prix de référence mémorisé au début d'une promotion (C. conso L112-1-1).
  promo_reference_cents integer,
  stock integer not null default 0 check (stock >= 0),
  description text,
  is_visible boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Texte de recherche sans accents ni majuscules (index trigram).
  search_text text generated always as (
    lower(public.immutable_unaccent(
      coalesce(name, '') || ' ' || coalesce(game, '') || ' ' || coalesce(set_name, '') || ' '
      || coalesce(card_number, '') || ' ' || coalesce(rarity, '')
    ))
  ) stored,
  constraint products_graded_fields check (
    (is_graded and grading_company is not null and grade is not null)
    or (not is_graded and grading_company is null and grade is null)
  )
);

create index products_category_id_idx on public.products (category_id);
create index products_visible_published_idx on public.products (is_visible, published_at desc);
create index products_price_idx on public.products (price_cents);
create index products_search_idx on public.products using gin (search_text extensions.gin_trgm_ops);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Historique des prix : preuve du prix de référence des promotions
-- ---------------------------------------------------------------------------
create table public.product_price_history (
  id bigint generated always as identity primary key,
  product_id uuid not null references public.products (id) on delete cascade,
  price_cents integer not null check (price_cents >= 0),
  valid_from timestamptz not null default now()
);

create index product_price_history_product_idx
  on public.product_price_history (product_id, valid_from desc);

-- Prix le plus bas pratiqué au cours des 30 jours précédant `p_at` : le prix en
-- vigueur au début de la fenêtre et ceux appliqués pendant la fenêtre.
create or replace function public.lowest_price_30d(p_product_id uuid, p_at timestamptz default now())
returns integer
language sql
stable
set search_path = ''
as $$
  select min(price_cents)
  from (
    (
      select price_cents
      from public.product_price_history
      where product_id = p_product_id and valid_from <= p_at - interval '30 days'
      order by valid_from desc
      limit 1
    )
    union all
    (
      select price_cents
      from public.product_price_history
      where product_id = p_product_id
        and valid_from > p_at - interval '30 days'
        and valid_from <= p_at
    )
  ) as prices
$$;

-- Avant écriture d'un produit :
-- - date de première mise en ligne (tri « Derniers ajouts ») ;
-- - contrôle du prix barré : il ne peut pas dépasser le prix le plus bas pratiqué
--   au cours des 30 jours précédant la réduction (C. conso L112-1-1). Pendant une
--   promotion (réductions successives), la référence reste celle du début.
create or replace function public.products_before_write()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.is_visible and new.published_at is null then
    new.published_at := now();
  end if;

  if new.compare_at_price_cents is null then
    new.promo_reference_cents := null;
  elsif tg_op = 'UPDATE'
    and old.compare_at_price_cents is not null
    and old.promo_reference_cents is not null then
    new.promo_reference_cents := old.promo_reference_cents;
  elsif tg_op = 'UPDATE' then
    new.promo_reference_cents := public.lowest_price_30d(new.id);
  else
    -- Produit tout juste créé : aucun prix antérieur, donc pas de prix barré.
    new.promo_reference_cents := null;
  end if;

  if new.compare_at_price_cents is not null
    and (new.promo_reference_cents is null
      or new.compare_at_price_cents > new.promo_reference_cents) then
    raise exception using
      errcode = 'P0001',
      message = 'PRICE_REFERENCE',
      detail = coalesce(new.promo_reference_cents::text, ''),
      hint = 'Le prix barré ne peut pas dépasser le prix le plus bas des 30 derniers jours.';
  end if;

  return new;
end;
$$;

create trigger products_before_write
  before insert or update on public.products
  for each row execute function public.products_before_write();

-- Après écriture : enregistre chaque nouveau prix dans l'historique.
create or replace function public.products_log_price()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' or new.price_cents is distinct from old.price_cents then
    insert into public.product_price_history (product_id, price_cents)
    values (new.id, new.price_cents);
  end if;
  return null;
end;
$$;

revoke execute on function public.products_log_price() from public, anon, authenticated;

create trigger products_log_price
  after insert or update of price_cents on public.products
  for each row execute function public.products_log_price();

-- ---------------------------------------------------------------------------
-- Photos des produits (fichiers dans le bucket « media »)
-- ---------------------------------------------------------------------------
create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  storage_path text not null unique,
  alt text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index product_images_product_idx on public.product_images (product_id, sort_order);

-- ---------------------------------------------------------------------------
-- Facettes des filtres du catalogue (produits visibles uniquement)
-- ---------------------------------------------------------------------------
create or replace function public.catalog_facets(p_category_id uuid default null)
returns table (facet text, value text, total bigint)
language sql
stable
set search_path = ''
as $$
  with visible as (
    select *
    from public.products
    where is_visible and (p_category_id is null or category_id = p_category_id)
  )
  select 'game', game, count(*) from visible where game is not null group by game
  union all
  select 'set_name', set_name, count(*) from visible where set_name is not null group by set_name
  union all
  select 'language', language, count(*) from visible where language is not null group by language
  union all
  select 'rarity', rarity, count(*) from visible where rarity is not null group by rarity
  union all
  select 'condition', condition, count(*) from visible where condition is not null group by condition
  union all
  select 'grading_company', grading_company, count(*)
  from visible where grading_company is not null group by grading_company
$$;

-- ---------------------------------------------------------------------------
-- Sécurité : lecture publique de ce qui est visible, écriture réservée à l'admin
-- ---------------------------------------------------------------------------
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_price_history enable row level security;

create policy "Catégories visibles lisibles par tous"
  on public.categories for select
  to anon, authenticated
  using (is_visible or (select public.is_admin()));

create policy "Admin : ajouter une catégorie"
  on public.categories for insert to authenticated
  with check ((select public.is_admin()));

create policy "Admin : modifier une catégorie"
  on public.categories for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admin : supprimer une catégorie"
  on public.categories for delete to authenticated
  using ((select public.is_admin()));

create policy "Produits visibles lisibles par tous"
  on public.products for select
  to anon, authenticated
  using (is_visible or (select public.is_admin()));

create policy "Admin : ajouter un produit"
  on public.products for insert to authenticated
  with check ((select public.is_admin()));

create policy "Admin : modifier un produit"
  on public.products for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admin : supprimer un produit"
  on public.products for delete to authenticated
  using ((select public.is_admin()));

create policy "Photos des produits visibles lisibles par tous"
  on public.product_images for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id and (p.is_visible or (select public.is_admin()))
    )
  );

create policy "Admin : ajouter une photo"
  on public.product_images for insert to authenticated
  with check ((select public.is_admin()));

create policy "Admin : modifier une photo"
  on public.product_images for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admin : supprimer une photo"
  on public.product_images for delete to authenticated
  using ((select public.is_admin()));

-- L'historique des prix est écrit uniquement par le déclencheur ; lecture admin.
create policy "Admin : lire l'historique des prix"
  on public.product_price_history for select to authenticated
  using ((select public.is_admin()));
