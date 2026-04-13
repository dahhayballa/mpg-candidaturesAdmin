# 🏢 Dashboard Recrutement

Application de gestion et visualisation des candidatures, construite avec React, TypeScript, Tailwind CSS et Supabase.

## Stack technique

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** — styles utilitaires
- **Recharts** — graphiques interactifs
- **Lucide React** — icônes
- **Supabase** — base de données PostgreSQL

## Démarrage rapide

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Remplir les valeurs dans `.env` :

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Lancer le serveur de développement

```bash
npm run dev
```

L'application sera disponible sur [http://localhost:5173](http://localhost:5173)

## Mode Mock vs Supabase réel

Par défaut, l'application utilise des **données mock** (aucune connexion requise).

Pour basculer vers Supabase réel, modifier dans `src/services/StatisticsService.ts` :

```ts
export const USE_MOCK = false  // ← changer à false
```

## Structure du projet

```
src/
├── components/
│   ├── StatsCard.tsx          # Cartes KPI
│   ├── SpecialtyChart.tsx     # Graphique à barres (Recharts)
│   ├── SpecialtyStatsTable.tsx # Tableau des stats par spécialité
│   ├── FilterSidebar.tsx      # Panneau de filtres avancés
│   ├── CandidateTable.tsx     # Table CRUD des candidats
│   ├── CandidateModal.tsx     # Modal création/édition
│   └── ToastContainer.tsx     # Notifications
├── services/
│   ├── supabaseClient.ts      # Client Supabase
│   └── StatisticsService.ts   # Données mock + fonctions Supabase
├── hooks/
│   └── useToast.ts            # Hook notifications
├── types/
│   └── index.ts               # Types TypeScript
├── App.tsx                    # Composant principal
├── main.tsx                   # Point d'entrée
└── index.css                  # Styles Tailwind
```

## Fonctionnalités

### Dashboard
- **KPI Cards** : Total candidatures, sélectionnés, taux de sélection, nb spécialités
- **Graphique** : Barres horizontales Total vs Sélectionnés par spécialité
- **Tableau récap** : Stats filtrables par spécialité avec badges de taux

### Gestion des candidats (CRUD)
- **Lecture** : Table paginée avec 15 candidats par page
- **Création** : Modal avec formulaire complet
- **Modification** : Édition inline via modal
- **Suppression** : Avec confirmation

### Filtres avancés
- Recherche textuelle (nom, email, téléphone)
- Filtre par spécialité
- Filtre par état (sélectionné, en attente, rejeté, réservé)
- Toggle : CV présent, Retenu, Dossier complet
- Slider score minimum

## Scripts disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run preview  # Prévisualiser le build
npm run lint     # Vérifier le code
```

## Schéma Supabase

Le schéma complet de la base de données est dans `supabase-schema.sql` à la racine du projet.
