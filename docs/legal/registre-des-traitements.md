# Registre des activités de traitement (RGPD, article 30)

Registre tenu par le responsable du traitement, à mettre à jour à chaque nouveau traitement.
Modèle simplifié inspiré du [registre CNIL](https://www.cnil.fr/fr/RGPD-le-registre-des-activites-de-traitement).

**Responsable du traitement** : [À COMPLÉTER : nom ou dénomination sociale], Kwak & Cards,
[adresse], [email]. Pas de délégué à la protection des données (non obligatoire).

**Sous-traitants communs** (accord de traitement des données à accepter depuis les comptes de l'entreprise) :

- Vercel Inc. : hébergement du site (États-Unis ; DPF + clauses contractuelles types) ;
- Supabase Pte. Ltd. : base de données, stockage, authentification (données hébergées dans l'UE, à Stockholm) ;
- Plus Five Five, Inc. « Resend » : emails (États-Unis ; DPF + clauses contractuelles types).

**Mesures de sécurité communes** :

- HTTPS ;
- règles d'accès en base (RLS) sur toutes les tables ;
- admin protégé par authentification ;
- clés secrètes uniquement côté serveur ;
- mots de passe hachés ;
- aucune donnée de carte bancaire.

---

## 1. Gestion des commandes et de la relation client

- **Finalité** : prise de commande, paiement hors ligne, préparation, livraison ou remise en main propre, service client.
- **Base légale** : exécution du contrat (6.1.b).
- **Personnes concernées** : clients.
- **Données** :
  - email, nom et prénom ;
  - adresse de livraison (en cas d'envoi) ;
  - téléphone (facultatif) ;
  - contenu de la commande, moyens de livraison et de paiement choisis ;
  - note facultative.
- **Destinataires** :
  - le vendeur ;
  - les sous-traitants ;
  - le transporteur ;
  - le service de paiement choisi par le client.
- **Durées** : relation contractuelle, puis archives pendant 5 ans (preuve).

## 2. Comptabilité et archivage des contrats

- **Finalité** : obligations comptables et fiscales ; conservation des contrats électroniques d'au moins 120 € (C. conso L213-1).
- **Base légale** : obligation légale (6.1.c).
- **Données** : identité, adresse, détail et montant des commandes, date et moyen de paiement.
- **Destinataires** : le vendeur, son expert-comptable, l'administration fiscale sur demande.
- **Durée** : 10 ans.

## 3. Droit de rétractation, garanties et réclamations

- **Finalité** : réception horodatée et traitement des rétractations et réclamations, remboursements.
- **Base légale** : obligation légale (6.1.c).
- **Données** :
  - nom et prénom, email, numéro de commande, articles ;
  - date et heure de la demande ;
  - IBAN si remboursement par virement (supprimé après remboursement).
- **Durée** : 5 ans à compter de la demande.

## 4. Newsletter

- **Finalité** : envoi d'informations commerciales par email.
- **Base légale** : consentement (6.1.a ; CPCE L34-5).
- **Données** : email, date et origine de l'inscription.
- **Durée** : jusqu'à la désinscription, ou 3 ans après le dernier contact.

## 5. Sécurité et prévention des abus

- **Finalité** : limiter les commandes en attente par client, protéger le site.
- **Base légale** : intérêt légitime (6.1.f).
- **Données** : empreinte HMAC de l'adresse IP ; journaux techniques de l'hébergeur.
- **Durée** :
  - empreinte : 30 jours maximum ;
  - journaux : durée limitée fixée par l'hébergeur.

## 6. Exercice des droits des personnes

- **Finalité** : répondre aux demandes d'accès, de rectification, d'effacement, d'opposition, etc.
- **Base légale** : obligation légale (6.1.c).
- **Durée** : jusqu'à la réponse, puis 5 ans (preuve).

## 7. Compte d'administration

- **Finalité** : accès sécurisé du vendeur à la gestion de la boutique.
- **Base légale** : intérêt légitime (6.1.f).
- **Données** : email, mot de passe haché, journaux de connexion.
- **Durée** : durée d'existence du compte.
