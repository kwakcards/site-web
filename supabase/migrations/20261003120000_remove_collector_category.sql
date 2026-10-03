-- Catégorie « Collector » supprimée à la demande du propriétaire (3 octobre 2026).
-- Ses éventuels produits passent d'abord dans « Scellé ».

update public.products
set category_id = (select id from public.categories where slug = 'scelle')
where category_id = (select id from public.categories where slug = 'collector');

delete from public.categories where slug = 'collector';
