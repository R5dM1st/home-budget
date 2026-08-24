# Home Budget Finance — V2

Home Budget Finance est une application personnelle de gestion financière construite avec **React, TypeScript, Vite, Tailwind CSS, Recharts, FastAPI, SQLAlchemy, Alembic et PostgreSQL**.

Cette V2 fait évoluer le MVP « dépenses + budget » vers un vrai cockpit financier : **comptes, dépenses, revenus, transferts, budgets par catégorie, récurrences, objectifs d'épargne et analytics**.

L'objectif n'est pas de cloner Firefly III ou Cashew. Home Budget reprend plutôt certaines idées de produit solides — comptes, flux, automatisation, visibilité du patrimoine — dans une interface et une architecture personnelles, volontairement plus simples à comprendre et à faire évoluer.

## Fonctionnalités incluses

### Comptes

- compte courant ;
- épargne ;
- espèces ;
- carte / crédit ;
- solde initial ;
- solde courant calculé à partir des transactions ;
- archivage ;
- couleur personnalisée.

### Transactions

Un seul journal gère trois types :

- **dépense** : sort d'un compte ;
- **revenu** : entre sur un compte ;
- **transfert** : passe d'un compte vers un autre sans être considéré comme une dépense.

Le frontend permet ajout, modification, suppression, recherche et filtres.

### Catégories

Des catégories de base sont créées automatiquement au premier démarrage : Logement, Courses, Transport, Factures, Loisirs, Abonnements, Shopping, Santé, Salaire, etc.

Aucune transaction d'exemple n'est créée.

### Budgets

- budget global mensuel ;
- limites mensuelles par catégorie ;
- dépensé / restant / pourcentage consommé.

### Récurrences

- hebdomadaire ;
- mensuelle ;
- annuelle ;
- dépense, revenu ou transfert ;
- bouton pour générer les échéances arrivées à date.

### Objectifs d'épargne

- cible ;
- montant déjà épargné ;
- date cible ;
- compte associé optionnel ;
- progression visuelle.

### Analytics

- patrimoine net ;
- revenus ;
- dépenses ;
- cash-flow ;
- répartition par catégorie ;
- courbe quotidienne ;
- tendance sur les six derniers mois.

### UI

- sidebar desktop ;
- navigation mobile ;
- thème clair / sombre / système ;
- accents Océan, Violet, Émeraude ;
- formulaires en modales ;
- interface responsive ;
- dashboard personnel « cockpit financier ».

## Architecture

```text
React / TypeScript / Vite / Tailwind / Recharts
                       |
                      HTTP
                       |
                    FastAPI
                       |
                    Services
                       |
                  SQLAlchemy
                       |
                  PostgreSQL
```

Modèle métier principal :

```text
accounts
   |\
   | \ source / destination
   |  \
transactions ---- categories
   |
   +---- analytics

monthly_budgets
budget_limits ---- categories

recurring_transactions
saving_goals ---- accounts
```

Le modèle V2 est **transfer-aware** : un transfert de 500 € du compte courant vers l'épargne ne gonfle pas les dépenses mensuelles.

## Démarrage recommandé — base propre

Comme cette V2 modifie le modèle métier et que le projet précédent ne contient que des données de démonstration, le chemin le plus simple est de repartir avec un volume PostgreSQL vide.

À la racine :

```powershell
Copy-Item .env.example .env
```

Édite `.env` et remplace `change_me` par ton mot de passe.

Puis :

```powershell
docker compose down -v
docker compose up --build
```

Accès :

- Frontend : `http://localhost:5173`
- API : `http://127.0.0.1:8000`
- Swagger : `http://127.0.0.1:8000/docs`

Le backend applique automatiquement les migrations Alembic au démarrage.

## Démarrage local

### PostgreSQL

```powershell
docker compose up -d db
```

### Backend

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
alembic upgrade head
python -m uvicorn app.main:app --reload
```

### Frontend

Dans un second terminal :

```powershell
cd frontend
npm install
npm run dev
```

## Premier parcours dans l'application

1. Ouvre **Comptes** et crée ton compte courant.
2. Ajoute éventuellement un compte épargne.
3. Reviens sur **Vue d'ensemble**.
4. Crée un revenu ou une dépense avec **Nouvelle transaction**.
5. Définis ton budget mensuel dans **Budgets**.
6. Ajoute une limite par catégorie si besoin.
7. Crée tes charges fixes dans **Récurrences**.
8. Ajoute un projet dans **Objectifs**.

L'application démarre volontairement sans transactions d'exemple.

## API principale

### Accounts

- `GET /api/accounts`
- `POST /api/accounts`
- `PUT /api/accounts/{id}`
- `PATCH /api/accounts/{id}/archive`

### Transactions

- `GET /api/transactions`
- `POST /api/transactions`
- `GET /api/transactions/{id}`
- `PUT /api/transactions/{id}`
- `DELETE /api/transactions/{id}`

### Categories

- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`

### Budgets

- `GET /api/budgets`
- `GET /api/budgets/{year}/{month}`
- `PUT /api/budgets/{year}/{month}`
- `GET /api/budgets/{year}/{month}/limits`
- `PUT /api/budgets/{year}/{month}/limits/{category_id}`
- `DELETE /api/budgets/{year}/{month}/limits/{category_id}`

### Recurring

- `GET /api/recurring`
- `POST /api/recurring`
- `PUT /api/recurring/{id}`
- `DELETE /api/recurring/{id}`
- `POST /api/recurring/generate-due`

### Goals

- `GET /api/goals`
- `POST /api/goals`
- `PUT /api/goals/{id}`
- `DELETE /api/goals/{id}`

### Analytics

- `GET /api/analytics/{year}/{month}/summary`
- `GET /api/analytics/{year}/{month}/categories`
- `GET /api/analytics/{year}/{month}/daily`
- `GET /api/analytics/{year}/{month}/history`
- `GET /api/analytics/accounts`

## Tests

Depuis la racine ou `backend/` avec le bon `PYTHONPATH` :

```powershell
cd backend
pytest
```

## Ce qui n'est volontairement pas encore inclus

Cette V2 ne prétend pas être un clone complet de Firefly III. Les prochaines briques intéressantes sont :

- moteur de règles automatique ;
- import CSV bancaire avec staging et déduplication ;
- tags ;
- pièces jointes ;
- authentification ;
- vraie comptabilité en journal / écritures doubles ;
- plusieurs devises avec taux de change ;
- CI/CD et tests frontend.

Le projet reste volontairement monolithique et compréhensible avant d'ajouter des briques Data Engineering plus lourdes.
