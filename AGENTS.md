<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Conventions du projet Kwak & Cards

- Interface et contenus en français ; code (noms de variables, fonctions) en anglais.
- Identité centralisée : couleurs dans `src/styles/theme.css`, typos dans `src/styles/fonts.ts`,
  nom et logo dans `src/config/brand.ts`. Pas de couleur en dur dans les composants : utiliser
  les tokens (`bg-primary`, `text-muted-foreground`, `font-display`, `tactile`…).
- Éléments interactifs (boutons, liens-boutons, puces, cartes cliquables, champs) : même relief que
  le bouton « Rechercher une carte », via le composant `Button` ou les utilitaires `tactile` /
  `tactile-field` / `ledge-*` (`src/app/globals.css`). Pas de lueur (glow) ni de style shadcn par
  défaut : c'est ce qui donne un rendu générique. Les liens dans un texte restent soulignés.
- Montants toujours en centimes (entiers) ; formatage via `formatPrice` (`src/lib/money.ts`).
- Variables d'environnement lues via `src/lib/env.ts` (public) ; documentées dans `.env.example`.
- Autorisation revérifiée dans chaque Server Action (ne jamais se reposer uniquement sur `proxy.ts`).
- Avant de commiter : `npm run check` puis `npm run build`.

## Conformité légale et accessibilité (à respecter à chaque évolution)

- Voir `docs/legal/conformite.md`, `docs/legal/donnees-personnelles.md` et `docs/accessibilite.md`.
- Informations légales centralisées dans `src/config/legal.ts` : ne jamais les écrire en dur ailleurs.
- Aucun traceur non indispensable (mesure d'audience, pixel, contenu intégré, police chargée depuis
  un CDN) sans bannière de consentement conforme CNIL ; toute clé de stockage va dans
  `src/config/storage.ts` et dans la page `/cookies`. Seule exception : Vercel Speed Insights,
  mesure de performance anonyme sans cookie ni identifiant, dispensée de consentement (conditions
  CNIL de la mesure d'audience) ; pages privées et paramètres d'URL filtrés dans
  `src/lib/performance-events.ts`. Ne pas y ajouter Vercel Web Analytics ni un autre outil sans
  revoir cette analyse.
- Toute nouvelle donnée personnelle : justifier sa nécessité, puis mettre à jour l'inventaire, le
  registre et `/confidentialite`. Pas de civilité ni de date de naissance ; le téléphone reste facultatif.
- Libellés légaux exacts : « Commander avec obligation de paiement » (L221-14), « Renoncer au
  contrat ici » et « Confirmer la rétractation » (D221-5). L'encadré des garanties légales
  (`LegalGuaranteeBox`) ne se reformule jamais.
- Prix barré = prix le plus bas pratiqué sur les 30 jours précédant la réduction (L112-1-1).
- Accessibilité WCAG 2.2 AA : texte alternatif sur toute image, libellés de formulaires, focus
  visible, pas d'animation sans moyen de la mettre en pause, contrastes testés
  (`src/styles/theme-contrast.test.ts`).
