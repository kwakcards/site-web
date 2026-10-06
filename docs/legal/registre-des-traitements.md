# Registre des activités de traitement (RGPD, article 30)

Registre tenu par le responsable du traitement, à mettre à jour à chaque nouveau traitement.
Modèle simplifié inspiré du [registre CNIL](https://www.cnil.fr/fr/RGPD-le-registre-des-activites-de-traitement).

**Responsable du traitement** : Gil DA SILVA EI (Kwak & Cards), 19 rue Jean-Baptiste Clément,
78500 Sartrouville, kwak.cards@gmail.com. Pas de délégué à la protection des données (non obligatoire).

**Sous-traitants communs** (accord de traitement des données à accepter depuis les comptes de l'entreprise) :

- Vercel Inc. : hébergement du site (États-Unis ; DPF + clauses contractuelles types) ;
- Supabase Pte. Ltd. : base de données, stockage, authentification (données hébergées dans l'UE, à Stockholm) ;
- Plus Five Five, Inc. « Resend » : emails (États-Unis ; DPF + clauses contractuelles types).

**Messagerie** : Gmail (Google), pour les échanges par email avec les clients et les vendeurs
(UE et États-Unis ; DPF). Un compte Gmail gratuit n'offre pas d'accord de traitement des
données ; un compte Google Workspace en propose un.

**Mesures de sécurité communes** :

- HTTPS ;
- règles d'accès en base (RLS) sur toutes les tables ;
- admin protégé par authentification ;
- clés secrètes uniquement côté serveur ;
- mots de passe hachés ;
- aucune donnée de carte bancaire.

---

## 1. Gestion des commandes et de la relation client

- **Finalité** : prise de commande, paiement hors ligne, préparation, livraison, service client.
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

## 7. Rachat de collection (`/rachat`)

- **Finalité** : étudier les collections proposées par des particuliers et leur faire une offre.
- **Base légale** : mesures précontractuelles à la demande de la personne (6.1.b).
- **Personnes concernées** : vendeurs particuliers.
- **Données** :
  - prénom, nom, email, ville ; téléphone (facultatif) ;
  - description de la collection ; liste, photos et message (facultatifs) ;
  - certification de propriété des articles.
- **Destinataires** : le vendeur ; Supabase (hébergement des données et des photos, UE).
- **Sécurité** : création seule pour le public (aucune relecture), photos dans un espace privé
  (8 au plus, envoi limité à 1 heure), limite de 3 demandes par email et par jour.
- **Durée** : sans rachat, 12 mois au plus après le dernier échange (suppression depuis
  l'admin) ; en cas de rachat, données du registre des objets d'occasion et de la comptabilité
  selon les durées légales.

## 8. Compte d'administration

- **Finalité** : accès sécurisé du vendeur à la gestion de la boutique.
- **Base légale** : intérêt légitime (6.1.f).
- **Données** : email, mot de passe haché, journaux de connexion.
- **Durée** : durée d'existence du compte.

## 9. Mesure des performances du site (Vercel Speed Insights)

- **Finalité** : mesurer la vitesse de chargement et d'affichage des pages (Web Vitals) pour améliorer le site.
- **Base légale** : intérêt légitime (6.1.f) ; traceur dispensé de consentement (conditions CNIL des outils de mesure d'audience : statistiques anonymes réservées à l'éditeur, pas de suivi de la navigation ni de recoupement).
- **Personnes concernées** : visiteurs du site (pas l'espace d'administration ni la connexion, exclus par `src/lib/performance-events.ts`).
- **Données** : adresse de la page sans paramètres, mesures de performance, type d'appareil, navigateur, système, pays, débit réseau ; ni cookie, ni identifiant, ni adresse IP associée aux mesures.
- **Destinataires** : le vendeur ; Vercel (sous-traitant, États-Unis ; DPF + clauses contractuelles types).
- **Durée** : statistiques anonymes consultées sur 30 jours au plus.
