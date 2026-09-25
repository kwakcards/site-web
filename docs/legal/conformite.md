# Conformité légale : état des lieux

> Document de travail établi à partir des textes officiels (vérifiés le 25 septembre 2026).
> Ce n'est pas un avis juridique : une relecture des CGV et de la politique de
> confidentialité par un professionnel du droit reste recommandée avant l'ouverture.

## 1. À faire par Kwak avant l'ouverture de la boutique (bloquant)

| #   | Action                                                                                                                                                                                                                                                                     | Pourquoi                                                                                                                                                                     |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Compléter `src/config/legal.ts` : nom ou dénomination, forme juridique, adresse, SIRET, immatriculation (RNE/RCS), régime de TVA, email, téléphone, directeur de la publication, délai d'expédition                                                                        | Mentions obligatoires (LCEN art. 1-1 ; C. conso L111-1, L221-5). Tant qu'un champ manque, un avertissement s'affiche en tête des pages légales.                              |
| 2   | Adhérer à un médiateur de la consommation référencé ([liste officielle](https://www.economie.gouv.fr/mediation-conso/vous-etes-un-professionnel/choisir-un-mediateur-de-la-consommation/mediateurs-references)) puis renseigner nom, site et adresse dans `legal.mediator` | Obligation L612-1 ; affichage des coordonnées sur le site et dans les CGV (R616-1). Amende administrative jusqu'à 3 000 € (personne physique) ou 15 000 € (personne morale). |
| 3   | Si des cartes d'occasion sont achetées à des particuliers pour être revendues : déclaration préalable en préfecture (revendeur d'objets mobiliers) et tenue d'un registre (« livre de police »)                                                                            | Code pénal art. 321-7 et R321-1 s. Défaut de registre : jusqu'à 6 mois d'emprisonnement et 30 000 € d'amende. Défaut de déclaration : contravention de 5ᵉ classe.            |
| 4   | Accepter les accords de traitement des données (DPA) de Vercel, Supabase et Resend depuis les comptes de Kwak                                                                                                                                                              | RGPD art. 28 (contrat avec chaque sous-traitant).                                                                                                                            |
| 5   | Vérifier le régime de TVA (franchise en base, régime de la marge pour les biens d'occasion) avec un comptable                                                                                                                                                              | Mention de TVA sur les prix et les factures.                                                                                                                                 |
| 6   | Vercel : passer en plan Pro avant l'ouverture                                                                                                                                                                                                                              | Le plan Hobby interdit l'usage commercial.                                                                                                                                   |
| 7   | Tenir à jour `docs/legal/registre-des-traitements.md`                                                                                                                                                                                                                      | RGPD art. 30 (traitements non occasionnels).                                                                                                                                 |
| 8   | Confirmer les valeurs par défaut de `src/config/shop.ts` : forfait de livraison (4,90 €), seuil de livraison offerte (100 €), moyens de paiement, et le délai de paiement de 72 h (`legal.paymentDeadlineHours`)                                                           | Elles sont affichées (bandeau, CGV, FAQ, llms.txt) et engagent le vendeur : prix et frais doivent être exacts (C. conso L112-1, L111-1).                                     |

## 2. Déjà en place dans le code

| Obligation                                                                                                                               | Texte                                                                                         | Où                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Mentions légales (éditeur, directeur de publication, hébergeur avec adresse et téléphone)                                                | LCEN art. 1-1 (loi SREN du 21 mai 2024) ; sanctions art. 1-2                                  | `/mentions-legales`                         |
| CGV complètes : identité, produits, prix, commande, paiement, livraison, rétractation, garanties, médiation, archivage, droit applicable | C. conso L111-1, L221-5, L221-14, L216-1 s., L221-18 s., L217-1 s., L612-1 s., L213-1, R631-3 | `/cgv`                                      |
| Encadré sur les garanties légales, reproduit mot pour mot                                                                                | Annexe à l'art. D. 211-2 (décret n° 2022-946)                                                 | `LegalGuaranteeBox`                         |
| Présomption de 12 mois pour les biens d'occasion                                                                                         | C. conso L217-7                                                                               | `/cgv#garanties`                            |
| Fonction de rétractation en ligne : « Renoncer au contrat ici », puis « Confirmer la rétractation », visible en permanence               | C. conso L221-21, D221-5 (décret n° 2026-3), en vigueur depuis le 19 juin 2026                | Footer, `/retractation#renoncer` (voir § 3) |
| Modèle de formulaire de rétractation                                                                                                     | Annexe à l'art. R. 221-1                                                                      | `/retractation`, annexe des CGV             |
| Prix barré = prix le plus bas des 30 derniers jours                                                                                      | C. conso L112-1-1                                                                             | CGV art. 4 (contrôle technique : voir § 3)  |
| Aucune référence à la plateforme européenne RLL (fermée le 20 juillet 2025)                                                              | Règlement (UE) 2024/3228                                                                      | CGV, mentions légales                       |
| Politique de confidentialité (finalités, bases légales, durées, destinataires, transferts, droits, CNIL)                                 | RGPD art. 12 à 14 ; loi n° 78-17                                                              | `/confidentialite`                          |
| Pas de bannière cookies : uniquement des traceurs strictement nécessaires, déclarés                                                      | Loi n° 78-17 art. 82 ; CNIL, délibération n° 2020-091                                         | `/cookies`                                  |
| Conditions d'utilisation (dont robots et agents IA)                                                                                      | Recommandé                                                                                    | `/conditions-utilisation`                   |
| Livraison, retours, remboursements (résumé, renvoie aux CGV)                                                                             | Non obligatoire en tant que page ; informations obligatoires via les CGV                      | `/politique-de-remboursement`               |
| Minimisation des données                                                                                                                 | RGPD art. 5.1.c                                                                               | `docs/legal/donnees-personnelles.md`        |
| Accessibilité WCAG 2.2 AA                                                                                                                | Bonne pratique (voir `docs/accessibilite.md`)                                                 | Tout le site                                |

## 3. À intégrer dans les prochaines phases (bloquant avant d'accepter des commandes)

- **Phase 2 (base de données)**
  - table `withdrawal_requests` avec horodatage, et branchement de `submitWithdrawal` ;
  - historique des prix (`product_price_history`) et contrôle du prix barré en base (L112-1-1) ;
  - effacement automatique des empreintes IP après 30 jours au plus ;
  - archivage des commandes (10 ans pour les pièces comptables et les contrats d'au moins 120 €).
- **Phase 5 (admin)**
  - prix de référence barré proposé automatiquement ;
  - export et suppression des données d'un client (droits d'accès, de portabilité et d'effacement) ;
  - le délai de paiement réglable doit rester aligné avec la CGV (`legal.paymentDeadlineHours`).
- **Phase 6 (commande et emails)**
  - case « J'accepte les CGV » non précochée ;
  - récapitulatif avant validation et bouton **« Commander avec obligation de paiement »** (L221-14) ;
  - email de confirmation (support durable) contenant le récapitulatif, les CGV et le formulaire de rétractation (L221-13) ;
  - version des CGV enregistrée avec la commande ;
  - accusé de réception de rétractation par email, avec le contenu, la date et l'heure (D221-5) ;
  - newsletter en opt-in séparé, non précoché, avec lien de désinscription dans chaque email (L34-5 CPCE) ;
  - mention d'information courte sous chaque formulaire, avec lien vers la politique de confidentialité ;
  - téléphone facultatif ; adresse demandée uniquement en cas d'envoi ; pas de civilité.
- **Phase 8 (mise en ligne)**
  - domaine vérifié chez Resend ;
  - suppression des commandes de test ;
  - vérification finale : `missingLegalInfo()` doit renvoyer une liste vide.

## 4. Accessibilité (European Accessibility Act)

Depuis le 28 juin 2025, l'EAA impose l'accessibilité aux sites de commerce en ligne,
**sauf aux microentreprises** (moins de 10 salariés et chiffre d'affaires ou total de bilan
inférieur à 2 M€) prestataires de services, exemptées automatiquement. Kwak & Cards
applique néanmoins le niveau WCAG 2.2 AA (voir `docs/accessibilite.md`) : l'exemption tombe
dès que les seuils sont dépassés.

## 5. Sources consultées

- [Légifrance : décret n° 2026-3 du 5 janvier 2026](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053298978) (fonction de rétractation, art. D221-5)
- [Légifrance : article L221-21](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044563193), [L221-14](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032226854), [L221-24](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032226828), [L217-7](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044152587), [L112-1-1](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044549592), [L612-2](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032224802), [R616-1](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032808378), [D213-1](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032807208), [R631-3](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032808504)
- Décret n° 2022-946 du 29 juin 2022 (encadré des garanties légales, annexe à l'art. D. 211-2)
- [Annexe à l'article R221-1](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032887061) (modèle de formulaire de rétractation)
- [CNIL : cookies et traceurs](https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi) et [référentiel « gestion commerciale »](https://www.cnil.fr/sites/cnil/files/atoms/files/referentiel_traitements-donnees-caractere-personnel_gestion-activites-commerciales.pdf)
- [DGCCRF : directive accessibilité](https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/professionnels-vos-produits-et-services-doivent-etre-conformes-la-directive-accessibilite)
- [DGE : revendeurs d'objets mobiliers](https://www.entreprises.gouv.fr/la-dge/publications/demarrer-la-vente-de-biens-doccasion-tout-savoir-sur-la-declaration-pour)
- Fermeture de la plateforme RLL : [règlement (UE) 2024/3228](https://eur-lex.europa.eu/eli/reg/2024/3228/oj)
- Prestataires : [Vercel, politique de confidentialité](https://vercel.com/legal/privacy-notice) (adhésion au DPF), [Supabase](https://supabase.com/privacy), [Resend, DPA](https://resend.com/legal/dpa) (DPF et clauses contractuelles types)
