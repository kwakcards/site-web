-- Demandes de rachat de collection (formulaire public /rachat).
--
-- Le visiteur peut seulement CRÉER une demande (colonnes autorisées une à une) ;
-- il ne peut ni la relire ni la modifier. Ses photos vont dans un bucket privé,
-- dans le dossier <id>/<jeton>/ de sa demande, pendant 1 heure et 8 photos au plus.
-- Seul l'admin lit, modifie et supprime demandes et photos.

create table public.buyback_requests (
  id uuid primary key,
  upload_token uuid not null,
  first_name text not null check (char_length(first_name) between 1 and 80),
  last_name text not null check (char_length(last_name) between 1 and 80),
  email text not null check (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  phone text check (phone is null or char_length(phone) between 6 and 30),
  city text not null check (char_length(city) between 1 and 100),
  item_types text[] not null check (cardinality(item_types) between 1 and 6),
  games text[] not null default '{}' check (cardinality(games) <= 10),
  languages text[] not null check (cardinality(languages) between 1 and 5),
  volume text not null check (volume in ('petite', 'moyenne', 'grosse')),
  expected_value text not null
    check (expected_value in ('moins-100', '100-500', '500-1000', '1000-5000', 'plus-5000')),
  summary text not null check (char_length(summary) between 2 and 300),
  card_list text check (card_list is null or char_length(card_list) <= 10000),
  message text check (message is null or char_length(message) <= 2000),
  owner_certified boolean not null check (owner_certified),
  status text not null default 'nouvelle'
    check (status in ('nouvelle', 'en-cours', 'conclue', 'refusee')),
  admin_note text check (admin_note is null or char_length(admin_note) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index buyback_requests_created_idx on public.buyback_requests (created_at desc);
create index buyback_requests_email_idx on public.buyback_requests (email, created_at desc);

create trigger buyback_requests_set_updated_at
  before update on public.buyback_requests
  for each row execute function public.set_updated_at();

-- Anti-abus : 3 demandes par email sur 24 h, 30 demandes par heure au total.
create or replace function private.buyback_insert_allowed(p_email text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select count(*) from public.buyback_requests
      where email = lower(p_email) and created_at > now() - interval '24 hours') < 3
    and (select count(*) from public.buyback_requests
      where created_at > now() - interval '1 hour') < 30
$$;

-- Envoi d'une photo : chemin <id>/<jeton>/<fichier>, demande créée il y a moins
-- d'une heure, 8 photos maximum par demande.
create or replace function private.buyback_upload_allowed(p_name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    p_name ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}/[a-z0-9-]+\.(webp|jpe?g|png)$'
    and exists (
      select 1 from public.buyback_requests r
      where r.id::text = split_part(p_name, '/', 1)
        and r.upload_token::text = split_part(p_name, '/', 2)
        and r.created_at > now() - interval '1 hour'
    )
    and (
      select count(*) from storage.objects o
      where o.bucket_id = 'buyback' and o.name like split_part(p_name, '/', 1) || '/%'
    ) < 8
$$;

revoke execute on function private.buyback_insert_allowed(text) from public;
revoke execute on function private.buyback_upload_allowed(text) from public;
grant execute on function private.buyback_insert_allowed(text) to anon, authenticated;
grant execute on function private.buyback_upload_allowed(text) to anon, authenticated;

-- Droits : création seulement, colonne par colonne ; lecture et gestion par l'admin.
revoke all on public.buyback_requests from anon, authenticated;
grant insert (
  id, upload_token, first_name, last_name, email, phone, city, item_types, games,
  languages, volume, expected_value, summary, card_list, message, owner_certified
) on public.buyback_requests to anon, authenticated;
grant select, update, delete on public.buyback_requests to authenticated;

alter table public.buyback_requests enable row level security;

create policy "Rachat : envoyer une demande"
  on public.buyback_requests for insert to anon, authenticated
  with check (private.buyback_insert_allowed(email));

create policy "Admin : lire les demandes de rachat"
  on public.buyback_requests for select to authenticated
  using ((select private.is_admin()));

create policy "Admin : modifier une demande de rachat"
  on public.buyback_requests for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "Admin : supprimer une demande de rachat"
  on public.buyback_requests for delete to authenticated
  using ((select private.is_admin()));

-- Photos : bucket privé, 5 Mo par fichier, images seulement.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('buyback', 'buyback', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "Rachat : envoyer des photos"
  on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'buyback' and private.buyback_upload_allowed(name));

create policy "Admin : voir les photos de rachat"
  on storage.objects for select to authenticated
  using (bucket_id = 'buyback' and (select private.is_admin()));

create policy "Admin : supprimer les photos de rachat"
  on storage.objects for delete to authenticated
  using (bucket_id = 'buyback' and (select private.is_admin()));
