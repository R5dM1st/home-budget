# Migration depuis Home Budget MVP / Pro

Cette V2 change le modèle de données : l'ancienne table `expenses` est remplacée par `accounts` + `transactions`.

## Cas recommandé : tu n'as que des données d'exemple

C'est le cas le plus simple et le plus propre.

Avant toute chose, conserve ton ancien projet avec Git :

```powershell
git add .
git commit -m "chore: checkpoint before finance v2"
git switch -c feat/finance-v2
```

Ensuite copie le contenu de la V2 dans ton dépôt en conservant ton propre `.env`.

Puis recrée le volume PostgreSQL :

```powershell
docker compose down -v
docker compose up --build
```

Cela repart avec une base vide. Les catégories par défaut seront créées automatiquement, mais **aucune transaction ni aucun compte d'exemple** ne sera ajouté.

## Si tu veux conserver l'ancienne base

La migration Alembic `b7c2a91e4f10` est chaînée après `68bfd194d3d6`.

Elle :

1. élargit le montant du budget mensuel à `NUMERIC(14,2)` ;
2. supprime l'ancienne table MVP `expenses` ;
3. crée `accounts` ;
4. crée `categories` ;
5. crée `transactions` ;
6. crée `budget_limits` ;
7. crée `recurring_transactions` ;
8. crée `saving_goals`.

Donc si tu as de vraies dépenses à conserver, **ne lance pas cette migration directement** : il faudrait d'abord écrire une migration de données qui crée un compte source et transforme les anciennes dépenses en transactions.

Dans ton cas actuel, où les données sont seulement des exemples, la réinitialisation du volume est préférable.

## Vérification

Après démarrage :

```powershell
docker compose exec db psql -U home_budget_user -d home_budget
```

Puis :

```sql
\dt
```

Tu dois notamment voir :

```text
accounts
categories
transactions
monthly_budgets
budget_limits
recurring_transactions
saving_goals
alembic_version
```

Et :

```sql
SELECT * FROM transactions;
```

doit être vide au premier lancement.
