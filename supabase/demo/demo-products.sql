-- =============================================================================
-- Articles FICTIFS de démonstration : projet Supabase de DÉVELOPPEMENT uniquement.
-- Ne jamais exécuter sur la base de production.
--
-- Tous les slugs commencent par « demo- ». Les photos sont ajoutées ensuite par
-- le script scripts/demo/demo-catalog.mts (voir README, « Données de démonstration »).
-- Le script est rejouable : un article déjà présent n'est pas recréé.
-- =============================================================================

with demo (
  slug, category, name, game, set_name, card_number, language, rarity, condition,
  is_graded, grading_company, grade, price_cents, stock, is_visible, days_ago, description
) as (
  values
  -- Cartes à l'unité -----------------------------------------------------------
  ('demo-dracaufeu-ex-flammes-obsidiennes-223-197', 'cartes-a-l-unite', 'Dracaufeu ex',
   'Pokémon', 'Flammes Obsidiennes', '223/197', 'FR', 'Illustration spéciale rare', 'NM',
   false, null::text, null::numeric, 8990, 1, true, 2,
   'Sortie de booster puis placée directement sous sleeve et toploader. Centrage correct, surface sans rayure visible, coins nets.'),
  ('demo-pikachu-ex-etincelles-deferlantes-238-191', 'cartes-a-l-unite', 'Pikachu ex',
   'Pokémon', 'Étincelles Déferlantes', '238/191', 'FR', 'Illustration spéciale rare', 'NM',
   false, null, null, 6490, 2, true, 5,
   'Carte en très bel état, jamais jouée. Un léger blanchiment est visible sur un coin au dos, à l''examen attentif.'),
  ('demo-mew-ex-151-205-165', 'cartes-a-l-unite', 'Mew ex',
   'Pokémon', '151', '205/165', 'FR', 'Hyper rare', 'NM',
   false, null, null, 3990, 1, true, 60,
   'Version dorée de Mew ex, extension 151. Surface brillante intacte, bords propres.'),
  ('demo-salameche-151-168-165', 'cartes-a-l-unite', 'Salamèche',
   'Pokémon', '151', '168/165', 'FR', 'Illustration rare', 'M',
   false, null, null, 1490, 5, true, 25,
   'Illustration pleine carte. État parfait : sortie de booster, aucune trace.'),
  ('demo-ronflex-151-143-165', 'cartes-a-l-unite', 'Ronflex',
   'Pokémon', '151', '143/165', 'FR', 'Rare', 'GD',
   false, null, null, 250, 6, true, 40,
   'Carte jouée en deck : usure des bords et petites rayures, sans pliure. Idéale pour compléter un classeur à petit prix.'),
  ('demo-monkey-d-luffy-leader-op01-003', 'cartes-a-l-unite', 'Monkey D. Luffy (Leader)',
   'One Piece', 'Romance Dawn', 'OP01-003', 'EN', 'Leader alternatif', 'EX',
   false, null, null, 2490, 3, true, 12,
   'Version alternative du leader Luffy. Légère usure visible sur deux coins, surface propre.'),
  ('demo-roronoa-zoro-op01-025', 'cartes-a-l-unite', 'Roronoa Zoro',
   'One Piece', 'Romance Dawn', 'OP01-025', 'JP', 'Super rare', 'NM',
   false, null, null, 1250, 4, true, 33,
   'Édition japonaise. Très bon centrage, aucun défaut visible à l''œil nu.'),
  ('demo-elsa-esprit-des-neiges-207-204', 'cartes-a-l-unite', 'Elsa, Esprit des neiges',
   'Disney Lorcana', 'Premier Chapitre', '207/204', 'FR', 'Enchantée', 'NM',
   false, null, null, 14900, 1, true, 9,
   'Version enchantée, la rareté la plus recherchée du Premier Chapitre. Conservée sous double protection depuis l''ouverture.'),
  ('demo-son-goku-fb01-139', 'cartes-a-l-unite', 'Son Goku',
   'Dragon Ball Super', 'Awakened Pulse', 'FB01-139', 'EN', 'Secret rare', 'NM',
   false, null, null, 1990, 0, true, 50,
   'Carte secrète de la première extension Fusion World.'),
  ('demo-lot-50-cartes-communes-pokemon', 'cartes-a-l-unite', 'Lot de 50 cartes communes Pokémon',
   'Pokémon', null, null, 'FR', 'Commune', 'EX',
   false, null, null, 990, 3, false, 1,
   'Lot en préparation : ce produit est masqué et n''apparaît pas sur la boutique.'),

  -- Cartes gradées -------------------------------------------------------------
  ('demo-dracaufeu-set-de-base-4-102-pca-8-5', 'cartes-gradees', 'Dracaufeu, Set de base',
   'Pokémon', 'Set de base', '4/102', 'FR', 'Holo rare', null,
   true, 'PCA', 8.5, 89000, 1, true, 70,
   'Le Dracaufeu holographique du tout premier set français, gradé 8,5 par PCA. Boîtier sans rayure.'),
  ('demo-evoli-151-133-165-psa-10', 'cartes-gradees', 'Évoli',
   'Pokémon', '151', '133/165', 'FR', 'Commune', null,
   true, 'PSA', 10, 7990, 2, true, 4,
   'Gradée PSA 10 (Gem Mint).'),
  ('demo-monkey-d-luffy-gear-5-op05-119-psa-10', 'cartes-gradees', 'Monkey D. Luffy, Gear 5',
   'One Piece', 'Awakening of the New Era', 'OP05-119', 'JP', 'Secret rare', null,
   true, 'PSA', 10, 24900, 1, true, 18,
   'Édition japonaise gradée PSA 10.'),
  ('demo-mewtwo-set-de-base-10-102-cgc-9', 'cartes-gradees', 'Mewtwo, Set de base',
   'Pokémon', 'Set de base', '10/102', 'EN', 'Holo rare', null,
   true, 'CGC', 9, 19900, 1, true, 45,
   'Édition anglaise du Set de base, gradée 9 par CGC.'),
  ('demo-rayquaza-vmax-218-203-collect-aura-9-5', 'cartes-gradees', 'Rayquaza VMAX',
   'Pokémon', 'Évolution Céleste', '218/203', 'FR', 'Rare secrète alternative', null,
   true, 'Collect Aura', 9.5, 32900, 0, true, 80,
   'Illustration alternative d''Évolution Céleste, gradée 9,5 par Collect Aura.'),

  -- Scellé ---------------------------------------------------------------------
  ('demo-display-flammes-obsidiennes-36-boosters', 'scelle', 'Display Flammes Obsidiennes (36 boosters)',
   'Pokémon', 'Flammes Obsidiennes', null, 'FR', null, null,
   false, null, null, 18990, 3, true, 20,
   'Display scellé d''origine contenant 36 boosters de 10 cartes.'),
  ('demo-coffret-dresseur-d-elite-151', 'scelle', 'Coffret Dresseur d''élite 151',
   'Pokémon', '151', null, 'FR', null, null,
   false, null, null, 8990, 2, true, 90,
   'Coffret scellé : 9 boosters, 65 protège-cartes, dés et marqueurs, guide du joueur.'),
  ('demo-booster-one-piece-op-07', 'scelle', 'Booster One Piece OP-07',
   'One Piece', '500 Years in the Future', null, 'JP', null, null,
   false, null, null, 690, 24, true, 7,
   'Booster japonais scellé de 6 cartes.'),
  ('demo-deck-de-demarrage-lorcana-chapitre-5', 'scelle', 'Deck de démarrage Lorcana, Chapitre 5',
   'Disney Lorcana', 'Ciel Scintillant', null, 'FR', null, null,
   false, null, null, 1690, 4, true, 30,
   'Deck prêt à jouer de 60 cartes, avec un booster et des jetons de dommages.'),
  ('demo-tripack-etincelles-deferlantes', 'scelle', 'Tripack Étincelles Déferlantes',
   'Pokémon', 'Étincelles Déferlantes', null, 'FR', null, null,
   false, null, null, 1790, 0, true, 15,
   'Trois boosters et une carte promo, sous blister.'),

  -- Collector ------------------------------------------------------------------
  ('demo-coffret-collection-ultra-premium-dracaufeu', 'collector', 'Coffret Collection Ultra-Premium Dracaufeu',
   'Pokémon', null, null, 'FR', null, null,
   false, null, null, 21900, 1, true, 11,
   'Coffret collector scellé : cartes promo en métal, boosters et accessoires exclusifs.'),
  ('demo-piece-en-metal-kwak-and-cards', 'collector', 'Pièce en métal Kwak & Cards, édition limitée',
   null, null, null, null, null, null,
   false, null, null, 3990, 10, true, 1,
   'Pièce de jeu en métal gravée, numérotée à 100 exemplaires.'),

  -- Accessoires ----------------------------------------------------------------
  ('demo-proteges-cartes-mats-noirs-x100', 'accessoires', 'Protège-cartes mats noirs (x100)',
   null, null, null, null, null, null,
   false, null, null, 1290, 15, true, 35,
   'Format standard 66 x 91 mm, finition mate, sans acide ni PVC.'),
  ('demo-classeur-9-cases-zippe-kwak-and-cards', 'accessoires', 'Classeur 9 cases zippé Kwak & Cards',
   null, null, null, null, null, null,
   false, null, null, 2990, 8, true, 3,
   '360 cartes en pochettes à chargement latéral, fermeture éclair, couverture rigide.'),
  ('demo-toploaders-35-pt-x25', 'accessoires', 'Toploaders 35 pt (x25)',
   null, null, null, null, null, null,
   false, null, null, 490, 30, true, 55,
   'Protections rigides pour cartes sous sleeve.')
)
insert into public.products (
  slug, category_id, name, game, set_name, card_number, language, rarity, condition,
  is_graded, grading_company, grade, price_cents, stock, is_visible, published_at, created_at,
  description
)
select
  demo.slug, categories.id, demo.name, demo.game, demo.set_name, demo.card_number, demo.language,
  demo.rarity, demo.condition, demo.is_graded, demo.grading_company, demo.grade, demo.price_cents,
  demo.stock, demo.is_visible,
  case when demo.is_visible then now() - make_interval(days => demo.days_ago) end,
  now() - make_interval(days => demo.days_ago),
  demo.description || E'\n\nArticle fictif de démonstration : il sera supprimé avant l''ouverture de la boutique.'
from demo
join public.categories on categories.slug = demo.category
on conflict (slug) do nothing;

-- Le premier prix de chaque article est daté de sa mise en ligne fictive, pour que
-- les promotions ci-dessous respectent la règle du prix de référence (L112-1-1).
update public.product_price_history as history
set valid_from = products.created_at
from public.products
where products.id = history.product_id
  and products.slug like 'demo-%'
  and history.valid_from > products.created_at
  and not exists (
    select 1 from public.product_price_history as other
    where other.product_id = history.product_id and other.id <> history.id
  );

-- Promotions : le prix barré est l'ancien prix, pratiqué depuis plus de 30 jours.
update public.products as products
set price_cents = promo.price_cents, compare_at_price_cents = promo.compare_at_price_cents
from (
  values
    ('demo-mew-ex-151-205-165', 3490, 3990),
    ('demo-mewtwo-set-de-base-10-102-cgc-9', 17900, 19900),
    ('demo-coffret-dresseur-d-elite-151', 7990, 8990),
    ('demo-proteges-cartes-mats-noirs-x100', 990, 1290)
) as promo (slug, price_cents, compare_at_price_cents)
where products.slug = promo.slug
  and products.compare_at_price_cents is null;

-- Pour retirer toutes les données de démonstration, utilise plutôt le script
-- scripts/demo/demo-catalog.mts avec l'option « remove » : il supprime aussi les
-- fichiers photo du stockage.
