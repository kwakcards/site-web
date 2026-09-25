# Accessibilité : humains et agents IA

Référentiel visé : **WCAG 2.2 niveau AA** (équivalent au RGAA pour le web).

Statut légal : Kwak & Cards est une microentreprise, exemptée des obligations de
l'European Accessibility Act pour les services (moins de 10 salariés et moins de 2 M€
de chiffre d'affaires ou de bilan). Le niveau AA est appliqué quand même : c'est une
bonne pratique, et l'exemption tombe dès que ces seuils sont dépassés.

## Contrastes (vérifiés automatiquement)

Le test `src/styles/theme-contrast.test.ts` lit `src/styles/theme.css` et échoue si une
couleur passe sous les seuils. Valeurs actuelles :

| Paire                                                        | Rapport | Seuil |
| ------------------------------------------------------------ | ------- | ----- |
| Texte crème `#f2ebe1` sur fond `#0a0a0b`                     | 16,7:1  | 4,5:1 |
| Texte secondaire `#a8a299` sur fond                          | 7,8:1   | 4,5:1 |
| Texte secondaire sur surface surélevée `#1b1b1e`             | 6,8:1   | 4,5:1 |
| Jaune `#f8c028` (prix, liens) sur fond                       | 11,8:1  | 4,5:1 |
| Texte noir sur bouton jaune                                  | 11,8:1  | 4,5:1 |
| Rouge d'erreur `#ff5c50` sur fond                            | 6,5:1   | 4,5:1 |
| Contour des champs `#77726a` sur fond (corrigé, avant 1,4:1) | 4,2:1   | 3:1   |
| Anneau de focus (jaune à 50 %) sur fond                      | 3,6:1   | 3:1   |

## Ce qui est en place

- **Langue** : `lang="fr"`, titres de page uniques, un seul `h1` par page, niveaux de titres respectés.
- **Repères** : lien d'évitement « Aller au contenu » (premier élément au clavier), `header`, `nav` nommées, `main#contenu`, `footer`, région « Annonces ».
- **Navigation clavier** : tous les contrôles sont atteignables, avec un focus visible.
  - Menu mobile : focus piégé dans le panneau, fermeture avec Échap, retour du focus.
  - Page courante signalée par `aria-current="page"`.
- **Mouvement** :
  - bandeau défilant avec un bouton pause/lecture (critère 2.2.2) et une pause au survol ;
  - défilement arrêté si `prefers-reduced-motion` ;
  - effets de survol désactivés dans ce même cas.
- **Images** :
  - chaque `<img>` a un texte alternatif (logo : « Kwak & Cards » ; produit : son nom) ;
  - l'image de partage a son `opengraph-image.alt.txt` ;
  - les SVG décoratifs et les icônes sont masqués (`aria-hidden`) ;
  - les boutons composés d'une icône seule ont un nom accessible.
- **Formulaires** :
  - libellés associés, mention « obligatoire » ou « facultatif » dans le libellé ;
  - erreurs liées au champ (`aria-describedby`, `aria-invalid`) ;
  - `autocomplete` (critère 1.3.5) ;
  - focus déplacé à chaque étape ;
  - messages annoncés (`role="status"`).
- **Liens** : soulignés dans les textes (critère 1.4.1), intitulés explicites.
- **FAQ** : éléments natifs `<details>`, utilisables sans JavaScript, avec le contenu présent dans le HTML.
- **Cibles tactiles** : au moins 24 × 24 px (critère 2.5.8) ; boutons d'icône en 40 à 44 px.
- **Impression** : l'habillage (header, bandeau, footer) est masqué, notamment pour imprimer le formulaire de rétractation.

## Agents IA et robots

- HTML sémantique rendu côté serveur : le contenu ne dépend pas de JavaScript.
- `/llms.txt` : résumé du site, pages clés, règles d'achat et consignes pour les agents (ne jamais commander sans accord explicite).
- `/sitemap.xml` et `/robots.txt` : les robots sont autorisés sur les pages publiques ; `/admin`, `/panier`, `/commande`, `/connexion` et `/dev` sont exclus.
- Données structurées schema.org :
  - `OnlineStore` avec sa politique de retour de 14 jours ;
  - `WebSite` ;
  - `FAQPage` sur la FAQ ;
  - `Product` à venir sur les fiches produits (phase 4).
- Conditions d'utilisation : section dédiée aux agents (`/conditions-utilisation#agents`).
- Filtres du catalogue (phase 4) : état dans l'URL, pour qu'un agent puisse partager ou rejouer une recherche.

## Vérifier

1. `npm run test` : contrastes et logique.
2. Audit automatique axe-core sur chaque page (sans violation attendue).
3. Parcours au clavier seul : Tab, Maj+Tab, Entrée, Échap.
4. Lecteur d'écran : VoiceOver (macOS ou iOS) sur l'accueil, une page légale et la rétractation.
5. Zoom à 200 % et largeur de 320 px : pas de perte de contenu ni de défilement horizontal.
