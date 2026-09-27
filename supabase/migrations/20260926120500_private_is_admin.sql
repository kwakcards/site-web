-- is_admin() passe dans un schéma « private », non exposé par l'API REST :
-- les policies RLS l'utilisent, mais elle n'est plus appelable via /rest/v1/rpc
-- (recommandation de l'audit de sécurité Supabase).

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  )
$$;

revoke execute on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

alter policy "Lecture de son profil (ou de tous pour l'admin)" on public.profiles
  using (id = (select auth.uid()) or (select private.is_admin()));

alter policy "Catégories visibles lisibles par tous" on public.categories
  using (is_visible or (select private.is_admin()));
alter policy "Admin : ajouter une catégorie" on public.categories
  with check ((select private.is_admin()));
alter policy "Admin : modifier une catégorie" on public.categories
  using ((select private.is_admin())) with check ((select private.is_admin()));
alter policy "Admin : supprimer une catégorie" on public.categories
  using ((select private.is_admin()));

alter policy "Produits visibles lisibles par tous" on public.products
  using (is_visible or (select private.is_admin()));
alter policy "Admin : ajouter un produit" on public.products
  with check ((select private.is_admin()));
alter policy "Admin : modifier un produit" on public.products
  using ((select private.is_admin())) with check ((select private.is_admin()));
alter policy "Admin : supprimer un produit" on public.products
  using ((select private.is_admin()));

alter policy "Photos des produits visibles lisibles par tous" on public.product_images
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id and (p.is_visible or (select private.is_admin()))
    )
  );
alter policy "Admin : ajouter une photo" on public.product_images
  with check ((select private.is_admin()));
alter policy "Admin : modifier une photo" on public.product_images
  using ((select private.is_admin())) with check ((select private.is_admin()));
alter policy "Admin : supprimer une photo" on public.product_images
  using ((select private.is_admin()));

alter policy "Admin : lire l'historique des prix" on public.product_price_history
  using ((select private.is_admin()));

alter policy "Admin : lire les médias" on storage.objects
  using (bucket_id = 'media' and (select private.is_admin()));
alter policy "Admin : ajouter des médias" on storage.objects
  with check (bucket_id = 'media' and (select private.is_admin()));
alter policy "Admin : modifier des médias" on storage.objects
  using (bucket_id = 'media' and (select private.is_admin()));
alter policy "Admin : supprimer des médias" on storage.objects
  using (bucket_id = 'media' and (select private.is_admin()));

drop function public.is_admin();
