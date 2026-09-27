-- Bucket public « media » (photos produits, bannières…) : lecture publique par
-- URL, écriture réservée à l'admin. 10 Mo maximum par fichier, images seulement.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;

create policy "Admin : lire les médias"
  on storage.objects for select to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));

create policy "Admin : ajouter des médias"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (select public.is_admin()));

create policy "Admin : modifier des médias"
  on storage.objects for update to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));

create policy "Admin : supprimer des médias"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
