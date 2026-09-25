# Kwak & Cards

Boutique en ligne de cartes à collectionner (TCG) : cartes à l'unité, cartes
gradées, produits scellés, pièces collector et accessoires.

La v1 permet de commander en ligne avec un **paiement hors ligne** (virement,
PayPal, Wero…). Le paiement par carte (Stripe) sera ajouté dans un second temps.

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

```bash
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

## Variables d'environnement

Toutes les variables sont documentées dans [`.env.example`](.env.example).
Les variables `NEXT_PUBLIC_*` sont publiques ; toutes les autres sont réservées
au serveur. Aucun secret n'est versionné (`.env*` est ignoré par git, sauf
l'exemple).

## Identité visuelle

L'identité est centralisée pour pouvoir changer de logo ou de couleurs sans
toucher aux composants :

| Fichier                                                     | Contenu                                                               |
| ----------------------------------------------------------- | --------------------------------------------------------------------- |
| `src/styles/theme.css`                                      | couleurs, dégradé, lueur, rayon des coins                             |
| `src/styles/fonts.ts`                                       | typographies (Knewave, Archivo Black, Inter)                          |
| `src/config/brand.ts`                                       | nom, baseline, description, chemins du logo                           |
| `public/brand/`                                             | logo détouré (`logo.png`) et logo sur fond noir (`logo-on-black.png`) |
| `src/app/icon.png`, `apple-icon.png`, `opengraph-image.png` | favicon et image de partage                                           |
| `docs/brand/`                                               | fichier source du logo                                                |

Les composants utilisent uniquement les tokens (`bg-primary`, `text-muted-foreground`,
`font-display`, `shadow-glow`…), jamais de couleurs en dur.

## Structure

```
src/
├── app/
│   ├── (shop)/          pages publiques (bandeau + header + footer)
│   └── layout.tsx       racine : typos, métadonnées, notifications
├── components/
│   ├── ui/              primitives shadcn
│   ├── brand/           logo et motifs décoratifs (éclaboussure, trio de cartes)
│   ├── layout/          bandeau d'annonce, header, menu mobile, footer
│   └── product/         carte produit, prix, badges
├── config/              marque, navigation, valeurs par défaut de la boutique
├── lib/                 utilitaires (montants, variables d'environnement…)
└── styles/              thème et typographies
```

## Avancement

- [x] Phase 1 : socle technique et thème
- [ ] Phase 2 : schéma de données et authentification
- [ ] Phase 3 : landing page
- [ ] Phase 4 : catalogue et fiche produit
- [ ] Phase 5 : espace admin
- [ ] Phase 6 : panier et commande (paiement hors ligne)
- [ ] Phase 7 : pages légales
- [ ] Phase 8 : mise en ligne

## Passation

Tous les comptes appartiennent à Kwak. Cette section sera complétée au fil des
phases (création d'un admin, migrations de base, déploiement, révocation des
accès temporaires).
