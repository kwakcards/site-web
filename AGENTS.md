<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Conventions du projet Kwak & Cards

- Interface et contenus en français ; code (noms de variables, fonctions) en anglais.
- Identité centralisée : couleurs dans `src/styles/theme.css`, typos dans `src/styles/fonts.ts`,
  nom et logo dans `src/config/brand.ts`. Pas de couleur en dur dans les composants : utiliser
  les tokens (`bg-primary`, `text-muted-foreground`, `font-display`, `shadow-glow`…).
- Montants toujours en centimes (entiers) ; formatage via `formatPrice` (`src/lib/money.ts`).
- Variables d'environnement lues via `src/lib/env.ts` (public) ; documentées dans `.env.example`.
- Autorisation revérifiée dans chaque Server Action (ne jamais se reposer uniquement sur `proxy.ts`).
- Avant de commiter : `npm run check` puis `npm run build`.
