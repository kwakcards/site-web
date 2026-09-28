# Kwak & Cards

Boutique en ligne de cartes à collectionner (TCG) : cartes à l'unité, cartes
gradées, produits scellés, pièces collector et accessoires.

**Ce que fait la V1 aujourd'hui**

- Vitrine : accueil (catégories et derniers ajouts lus en base), catalogue avec recherche
  (sans accents, mots dans n'importe quel ordre), filtres (jeu, langue, état, gradation, stock),
  tri et pagination, fiche produit (galerie, caractéristiques, prix barré légal, stock).
- Administration (`/admin`) : connexion, tableau de bord, liste des produits, création,
  modification, duplication, masquage et suppression d'un article, avec ses photos
  (compressées dans le navigateur puis envoyées sur Supabase Storage).
- Pages légales, accessibilité WCAG 2.2 AA, données structurées et `/llms.txt`.

**Pas encore disponible** : la commande en ligne (panier, commande avec paiement hors ligne :
virement, PayPal, Wero…), les emails, puis le paiement par carte (Stripe). En attendant, chaque
fiche produit invite à contacter la boutique (interrupteur `onlineOrdering` dans
`src/config/shop.ts`).

## Stack

| Rôle                  | Outil                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------- |
| Framework             | [Next.js 16](https://nextjs.org) (App Router, TypeScript, Cache Components)            |
| Interface             | [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (Radix) |
| Données, auth, images | [Supabase](https://supabase.com) (Postgres + RLS, Auth, Storage)                       |
| Emails                | [Resend](https://resend.com)                                                           |
| Hébergement           | [Vercel](https://vercel.com)                                                           |
| Tests                 | [Vitest](https://vitest.dev)                                                           |

## Prérequis

- Node.js 20.9 ou plus récent, et npm
- Accès aux comptes du projet (Supabase, Resend, Vercel) : voir [Passation](#passation)

## Installation

Le code est sur le GitHub de l'entreprise, dans le dépôt privé
[`kwakcards/site-web`](https://github.com/kwakcards/site-web) (accès sur invitation du compte
`kwakcards`).

```bash
git clone https://github.com/kwakcards/site-web.git kwak-and-cards
cd kwak-and-cards
npm install
cp .env.example .env.local   # puis compléter les valeurs
npm run dev                  # http://localhost:3000
```

Le styleguide (couleurs, typos, composants) est visible en développement sur
<http://localhost:3000/dev/styleguide>. Cette page n'existe pas en production.

## Scripts

| Commande                      | Rôle                                             |
| ----------------------------- | ------------------------------------------------ |
| `npm run dev`                 | serveur de développement                         |
| `npm run build` / `npm start` | build et serveur de production                   |
| `npm run lint`                | ESLint                                           |
| `npm run typecheck`           | génère les types de routes Next puis lance `tsc` |
| `npm run test`                | tests unitaires (Vitest)                         |
| `npm run check`               | lint + typecheck + tests                         |
| `npm run format`              | formatage Prettier                               |

Script de démonstration (voir [Données de démonstration](#données-de-démonstration)) :
`node --env-file=.env.local scripts/demo/demo-catalog.mts <images | remove | preview <dossier>>`.

## Variables d'environnement

Toutes les variables sont documentées dans [`.env.example`](.env.example).
Les variables `NEXT_PUBLIC_*` sont publiques ; toutes les autres sont réservées
au serveur. Aucun secret n'est versionné (`.env*` est ignoré par git, sauf
l'exemple).

### Déploiement sur Vercel

À saisir dans Vercel → Settings → Environment Variables **avant le premier déploiement** (les
pages sont pré-rendues à partir de la base : sans ces variables, le build échoue). Les valeurs
se trouvent dans Supabase → Project Settings → API Keys (clé « publishable »).

| Variable                               | Production                                                       | Preview                            |
| -------------------------------------- | ---------------------------------------------------------------- | ---------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | URL du projet de production                                      | URL de `kwakcards-dev`             |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | clé publishable du projet de production                          | clé publishable de `kwakcards-dev` |
| `NEXT_PUBLIC_SITE_URL`                 | adresse définitive du site (sinon l'adresse Vercel est utilisée) | à laisser vide                     |

Les variables `NEXT_PUBLIC_*` sont intégrées au build : après une modification, il faut
redéployer. Les autres variables de `.env.example` (Resend, clé secrète, `IP_HASH_SECRET`)
serviront avec la commande en ligne ; `DEMO_ADMIN_*` ne va jamais sur Vercel.

## Base de données (Supabase)

Deux projets dans l'organisation Supabase de l'entreprise :

| Projet               | Usage                                                                |
| -------------------- | -------------------------------------------------------------------- |
| `kwakcards-dev`      | développement local et previews Vercel                               |
| projet de production | site en ligne (6 migrations appliquées le 28/09/2026, sans articles) |

Le schéma est versionné dans [`supabase/migrations/`](supabase/migrations), à appliquer **dans
l'ordre** (éditeur SQL de Supabase, ou `supabase db push` avec la CLI) :

| Migration                    | Contenu                                                                               |
| ---------------------------- | ------------------------------------------------------------------------------------- |
| `…120000_extensions_helpers` | extensions (`pg_trgm`, `unaccent`, `citext`), fonctions utilitaires                   |
| `…120100_profiles_roles`     | profils et rôles (`customer` / `admin`), créés à l'inscription                        |
| `…120200_catalog`            | catégories, produits, photos, historique des prix, règle du prix barré, facettes, RLS |
| `…120300_storage_media`      | bucket public `media` (photos), écriture réservée à l'admin                           |
| `…120400_seed_categories`    | les 5 catégories de départ                                                            |
| `…120500_private_is_admin`   | fonction `private.is_admin()` utilisée par toutes les règles RLS                      |

Sécurité : la RLS est active sur toutes les tables. Les visiteurs ne lisent que les produits
visibles ; seules les sessions admin peuvent écrire (base et photos). Chaque action serveur de
l'admin revérifie en plus le rôle (`requireAdmin`).

Règle du prix barré (C. conso L112-1-1) : chaque prix est historisé ; un prix barré ne peut pas
dépasser le prix le plus bas pratiqué pendant les 30 jours précédant la réduction. La base
refuse tout prix barré non conforme, et l'admin affiche la valeur maximale autorisée.

## Administration

- Adresse : `/admin` (redirige vers `/connexion` si besoin). Le bouton « Admin » apparaît
  dans le header quand un admin est connecté.
- **Créer le compte de Gil** (à faire par lui, sur chaque projet Supabase) :
  1. Authentication → Users → _Add user_ → _Create new user_ : son email et un mot de passe
     qu'il choisit, case _Auto Confirm User_ cochée ;
  2. SQL Editor :
     `update public.profiles set role = 'admin' where email = 'son-email@exemple.fr';`
  3. Authentication → Sign In / Providers : désactiver _Allow new users to sign up_
     (pas de comptes clients en V1).
- Photos : JPEG, PNG, WebP ou AVIF, 12 par produit. Elles sont redimensionnées (1 600 px),
  converties en WebP et débarrassées de leurs métadonnées (GPS…) dans le navigateur, puis
  rangées dans `media/products/<id du produit>/`. Une photo retirée est supprimée du stockage à
  l'enregistrement ; supprimer un produit supprime tout son dossier.
- Limite connue : une photo envoyée dans un formulaire finalement abandonné reste dans le
  stockage (quelques centaines de Ko). Un nettoyage automatique pourra être ajouté.

## Données de démonstration

25 articles **fictifs** (24 visibles, 1 masqué, 4 en promotion) permettent de montrer la V1.
Leurs slugs commencent par `demo-` et leurs visuels portent la mention « Visuel de
démonstration ». Uniquement sur le projet **dev** :

```bash
# 1. Articles : exécuter supabase/demo/demo-products.sql dans l'éditeur SQL du projet dev
# 2. Visuels (compte admin de démo défini dans .env.local) :
node --env-file=.env.local scripts/demo/demo-catalog.mts images
# Tout supprimer (articles et fichiers) :
node --env-file=.env.local scripts/demo/demo-catalog.mts remove
```

Le compte admin de démo (`DEMO_ADMIN_EMAIL` / `DEMO_ADMIN_PASSWORD` dans `.env.local`) n'existe
que sur le projet dev ; il ne doit jamais être créé en production.

## Identité visuelle

L'identité est centralisée pour pouvoir changer de logo ou de couleurs sans
toucher aux composants :

| Fichier                                                     | Contenu                                                               |
| ----------------------------------------------------------- | --------------------------------------------------------------------- |
| `src/styles/theme.css`                                      | couleurs, dégradé, relief des éléments interactifs, rayon des coins   |
| `src/styles/fonts.ts`                                       | typographies (Knewave, Archivo Black, Inter)                          |
| `src/config/brand.ts`                                       | nom, baseline, description, chemins du logo                           |
| `public/brand/`                                             | logo détouré (`logo.png`) et logo sur fond noir (`logo-on-black.png`) |
| `src/app/icon.png`, `apple-icon.png`, `opengraph-image.png` | favicon et image de partage                                           |
| `docs/brand/`                                               | fichier source du logo                                                |

Les composants utilisent uniquement les tokens (`bg-primary`, `text-muted-foreground`,
`font-display`, `tactile`…), jamais de couleurs en dur.

**Relief des éléments interactifs.** Boutons, liens-boutons, puces, pagination, cartes
cliquables et champs reprennent le style du bouton « Rechercher une carte » : typo « CARDS »
en capitales pour les boutons, bordure épaisse et bord inférieur plein qui s'enfonce au clic.
Il est défini une seule fois dans `src/app/globals.css` (`tactile`, `tactile-field`,
`ledge-*`) avec ses couleurs dans `theme.css` (`--brand-edge`, `--brand-ledge-depth`…) ; le
composant `Button` l'applique à toutes ses variantes. Les liens placés dans un texte (pages
légales, pied de page, fil d'Ariane) restent des liens soulignés, pour la lisibilité.

## Conformité légale et accessibilité

- [`docs/legal/conformite.md`](docs/legal/conformite.md) : obligations vérifiées, ce qui est en
  place, et **ce que Gil, le propriétaire, doit faire avant l'ouverture** (informations légales, médiateur…).
- [`docs/legal/donnees-personnelles.md`](docs/legal/donnees-personnelles.md) : inventaire des
  données collectées, avec la justification de chaque champ.
- [`docs/legal/registre-des-traitements.md`](docs/legal/registre-des-traitements.md) : registre
  RGPD (article 30).
- [`docs/accessibilite.md`](docs/accessibilite.md) : WCAG 2.2 AA, contrastes, agents IA.
- Les informations légales de la boutique se complètent dans un seul fichier :
  [`src/config/legal.ts`](src/config/legal.ts). Tant qu'il manque une information obligatoire,
  un avertissement s'affiche en tête des pages légales.

## Structure

```
src/
├── app/
│   ├── (shop)/          pages publiques : accueil, boutique, produit, connexion, pages légales
│   ├── (admin)/admin/   administration (protégée) : tableau de bord, produits
│   ├── sitemap.ts       plan du site (pages, catégories, fiches produits)
│   └── layout.tsx       racine : typos, métadonnées, notifications
├── components/
│   ├── ui/              primitives shadcn
│   ├── admin/           formulaire produit, envoi des photos, suppression, visibilité
│   ├── catalog/         filtres, catégories, pagination
│   ├── home/            sections de l'accueil
│   ├── brand/           logo et motifs décoratifs (éclaboussure, trio de cartes)
│   ├── layout/          bandeau d'annonce, header, menu mobile, footer, fil d'Ariane
│   └── product/         carte produit, prix, badges, galerie, caractéristiques
├── config/              marque, navigation, catalogue, valeurs par défaut de la boutique
├── lib/                 utilitaires (montants, slugs, validation, Supabase, authentification…)
├── server/
│   ├── queries/         lectures (catalogue public en cache, admin sans cache)
│   └── actions/         actions serveur (connexion, produits, rétractation)
├── proxy.ts             session Supabase et protection de /admin
└── styles/              thème et typographies
supabase/
├── migrations/          schéma versionné
└── demo/                articles fictifs (projet dev uniquement)
scripts/demo/            visuels des articles fictifs
```

## Avancement

- [x] Phase 1 : socle technique et thème
- [x] Phase 2 : schéma du catalogue et authentification admin (tables des commandes : phase 6)
- [x] Phase 3 : accueil (catégories, derniers ajouts, réassurance) ; carrousel et newsletter à venir
- [x] Phase 4 : catalogue et fiche produit
- [x] Phase 5 (partie produits) : admin des produits et des photos ; catégories, bannières,
      réglages et commandes à venir
- [ ] Phase 6 : panier et commande (paiement hors ligne), emails
- [x] Phase 7 : pages légales (textes à compléter par Gil, voir `docs/legal/conformite.md`)
- [ ] Phase 8 : mise en ligne
- [ ] Plus tard : paiement par carte (Stripe)

## Passation

Tous les comptes (Supabase, Vercel, Resend, GitHub, domaine) appartiennent à l'entreprise de
Gil, le propriétaire.

- [ ] Gil crée son compte admin sur le projet dev (voir [Administration](#administration)).
- [x] Migrations appliquées sur le projet de production (5 catégories, aucun article).
- [x] Compte admin de Gil créé en production (`kwak.cards@gmail.com`).
- [ ] Désactiver les inscriptions publiques sur les deux projets Supabase (Authentication →
      Sign In / Providers → « Allow new users to sign up »).
- [ ] Supprimer les données de démonstration et le compte admin de démo du projet dev quand ils
      ne servent plus (`scripts/demo/demo-catalog.mts remove`, puis Authentication → Users).
- [x] Dépôt poussé sur le GitHub de l'entreprise : `kwakcards/site-web`, privé.
- [ ] Déployer sur le compte Vercel de l'entreprise (voir [Déploiement sur Vercel](#déploiement-sur-vercel)),
      puis mettre l'adresse du site dans Supabase → Authentication → URL Configuration → Site URL.
- [ ] Révoquer les accès temporaires : connecteur Supabase utilisé pendant le développement, et
      collaborateurs GitHub qui n'ont plus besoin d'accès (Settings → Collaborators).
