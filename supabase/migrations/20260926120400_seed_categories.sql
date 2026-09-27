-- Catégories de départ (communes au développement et à la production).
-- Elles se renomment, se réordonnent ou se masquent ensuite dans l'admin.

insert into public.categories (slug, name, description, sort_order)
values
  ('cartes-a-l-unite', 'Cartes à l''unité',
   'Cartes d''occasion vendues à l''unité, photographiées et décrites avec leur état.', 1),
  ('cartes-gradees', 'Cartes gradées',
   'Cartes évaluées et scellées par une société de gradation (PSA, PCA, CGC…).', 2),
  ('scelle', 'Scellé',
   'Boosters, displays, coffrets et produits neufs dans leur emballage d''origine.', 3),
  ('collector', 'Collector',
   'Pièces rares, éditions limitées et objets de collection.', 4),
  ('accessoires', 'Accessoires',
   'Protège-cartes, toploaders, classeurs et boîtes de rangement.', 5)
on conflict (slug) do nothing;
