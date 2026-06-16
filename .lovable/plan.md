## Espace Admin Pro - PROXITEC

Système complet de gestion interne avec authentification, rôles, catalogue dynamique, ventes, interventions et facturation.

### 1. Authentification & Rôles
- Page `/auth` (connexion uniquement, pas d'inscription publique)
- 2 rôles: `admin` et `vendeur` (table `user_roles` séparée + fonction `has_role` SECURITY DEFINER)
- Création de comptes vendeurs uniquement par l'admin (depuis le dashboard)
- Aucun accès client au tableau de bord
- Redirection automatique selon rôle après login

### 2. Base de données (Lovable Cloud)
Tables:
- `profiles` (id, full_name, email)
- `user_roles` (user_id, role: admin|vendeur)
- `products` (name, description, category, price, stock_quantity, image_url, is_visible) → affichés sur le site public
- `clients` (name, company, phone, email, address)
- `interventions` (client_id, date, type, description, technicien, status, notes) — admin uniquement
- `invoices` (numero, client_name, vendeur_id, total, date, status)
- `invoice_items` (invoice_id, product_id, quantity, unit_price, subtotal)
- `prints_log` (vendeur_id, date, type: impression|photocopie, quantity, unit_price, total) — saisie vendeur

RLS:
- Admin: accès total
- Vendeur: lecture produits + clients (nom), création factures + lignes impressions
- Public (anon): lecture des produits visibles uniquement

### 3. Dashboard Admin (`/admin`)
Sidebar pro avec sections:
- **Vue d'ensemble**: KPIs (CA jour/mois, nb factures, stock bas, interventions en cours)
- **Produits**: table CRUD complète (ajout/modif/suppression, quantité, prix, image, visibilité site)
- **Clients**: liste + fiche détaillée avec historique des interventions
- **Interventions**: création/édition fiches d'intervention liées à un client
- **Factures**: toutes les factures (admin + vendeur), filtres date/vendeur, export
- **Impressions/Photocopies**: vue consolidée
- **Vendeurs**: création de comptes vendeurs, gestion
- **Rapports**: génération journalière/mensuelle (ventes, stock, impressions)

### 4. Dashboard Vendeur (`/vendeur`)
Interface minimale et focalisée:
- **Nouvelle facture**: sélection produits (autocomplete), quantités, total auto, impression PDF
- **Impressions/Photocopies**: petit formulaire (type, qté, prix unitaire) + total du jour
- **Mes factures du jour**: liste rapide

### 5. Intégration site public
- `Products.tsx` (page catalogue existante) lit depuis la table `products` au lieu du tableau statique
- Mise à jour stock automatique à la création de facture
- Bouton WhatsApp conservé pour commandes clients

### 6. Facturation PDF
- Template facture pro avec logo PROXITEC, numéro auto-incrémenté (FA-2026-0001)
- Bouton "Imprimer" → `window.print()` avec CSS print dédié
- Infos: client, lignes produits, sous-total, total

### Technique
- React Router: routes protégées `<ProtectedRoute role="admin">`
- Auth: `supabase.auth` + listener `onAuthStateChange`
- UI: shadcn (sidebar, table, dialog, form, toast)
- Validation: zod sur tous les formulaires
- Numérotation factures: séquence Postgres

### Livraison en 2 phases
**Phase 1 (ce tour)**: migrations DB + auth + dashboards admin/vendeur + CRUD produits + facturation + impressions + intégration catalogue public.
**Phase 2 (tour suivant si besoin)**: rapports avancés / export PDF stylisés / graphiques.

Confirme et je lance la migration DB puis tout le code.