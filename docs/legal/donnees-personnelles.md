# Inventaire des données personnelles

Règle du projet : **on ne collecte que ce qui est nécessaire** (RGPD art. 5.1.c). Toute
nouvelle donnée doit être justifiée ici, puis reportée dans le registre des traitements
et dans la politique de confidentialité (`/confidentialite`).

## Formulaires et champs

### Commande (phase 6)

| Champ                                | Statut                                   | Justification                                                                     |
| ------------------------------------ | ---------------------------------------- | --------------------------------------------------------------------------------- |
| Email                                | obligatoire                              | Confirmation de commande, instructions de paiement, suivi, accusé de rétractation |
| Nom et prénom                        | obligatoire                              | Identification de la commande, étiquette d'envoi, remise en main propre           |
| Adresse postale                      | obligatoire **uniquement si envoi**      | Livraison                                                                         |
| Téléphone                            | **facultatif**                           | Utile au transporteur pour prévenir d'une livraison ; jamais exigé                |
| Mode de livraison, moyen de paiement | obligatoire                              | Exécution de la commande                                                          |
| Note                                 | facultatif                               | Précision éventuelle du client                                                    |
| Acceptation des CGV                  | obligatoire (case non précochée)         | Preuve de l'acceptation (horodatage)                                              |
| Inscription newsletter               | facultatif (case séparée, non précochée) | Consentement distinct, jamais lié à la commande                                   |

### Rétractation en ligne (`/retractation`)

| Champ              | Statut      | Justification                                     |
| ------------------ | ----------- | ------------------------------------------------- |
| Nom et prénom      | obligatoire | Identité, exigée par l'art. D221-5                |
| Email              | obligatoire | Envoi de l'accusé de réception (art. D221-5)      |
| Numéro de commande | obligatoire | Identification du contrat (art. D221-5)           |
| Articles concernés | facultatif  | Rétractation partielle ; vide = toute la commande |

### Newsletter (phase 3)

| Champ                            | Statut      | Justification          |
| -------------------------------- | ----------- | ---------------------- |
| Email                            | obligatoire | Envoi de la newsletter |
| Date et origine de l'inscription | automatique | Preuve du consentement |

### Remboursement par virement

| Champ | Statut                   | Justification                                                                             |
| ----- | ------------------------ | ----------------------------------------------------------------------------------------- |
| IBAN  | uniquement si nécessaire | Remboursement d'une commande payée par virement ; supprimé une fois le remboursement fait |

### Données techniques

| Donnée                                                | Justification                                                       | Durée                                                                   |
| ----------------------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Empreinte HMAC de l'adresse IP (jamais l'IP en clair) | Limiter les commandes en attente par client (anti-blocage du stock) | Effacée au paiement, à l'annulation ou à l'expiration, 30 jours maximum |
| Cookies d'authentification Supabase                   | Session du vendeur dans l'admin                                     | Durée de la session                                                     |
| Panier (localStorage `kwak-cart`)                     | Contenu du panier, sans donnée personnelle                          | Jusqu'à la commande ou au vidage                                        |

## Données volontairement non collectées

- compte client, mot de passe client ;
- civilité, date de naissance, genre ;
- données de carte bancaire ;
- adresse IP en clair, géolocalisation ;
- mesure d'audience, pixels publicitaires, profilage ;
- polices ou contenus chargés depuis des services tiers par le navigateur.

## Où sont stockées les données

| Donnée                                                                                 | Service                   | Localisation                                   |
| -------------------------------------------------------------------------------------- | ------------------------- | ---------------------------------------------- |
| Base de données (commandes, rétractations, newsletter), images, authentification admin | Supabase (compte de Kwak) | UE, Stockholm (Suède)                          |
| Site et journaux techniques                                                            | Vercel (compte de Kwak)   | États-Unis, DPF + clauses contractuelles types |
| Emails transactionnels                                                                 | Resend (compte de Kwak)   | États-Unis, DPF + clauses contractuelles types |
