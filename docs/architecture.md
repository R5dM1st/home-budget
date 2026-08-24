# Architecture — Home Budget Finance V2

## Principe

Home Budget Finance reste un monolithe web volontairement simple : une SPA React consomme une API FastAPI, qui centralise toute la logique métier et accède à PostgreSQL via SQLAlchemy.

## Flux

```text
UI React
  |
  | JSON / HTTP
  v
FastAPI routes
  |
  v
Services métier
  |
  v
SQLAlchemy
  |
  v
PostgreSQL
```

## Modèle transactionnel

La V2 introduit les types `expense`, `income` et `transfer`.

### Dépense

```text
Compte courant -- 72,40 € --> extérieur
```

### Revenu

```text
extérieur -- 2 400 € --> Compte courant
```

### Transfert

```text
Compte courant -- 500 € --> Épargne
```

Le transfert modifie les soldes des deux comptes mais n'entre pas dans le calcul des dépenses mensuelles.

Ce modèle est plus simple qu'un ledger comptable en partie double complet, mais il prépare naturellement une future migration vers `journals` + `entries` si le projet en a besoin.

## Analytics

Le backend calcule les agrégats depuis les transactions, jamais depuis des valeurs dupliquées dans le frontend :

- solde de compte ;
- patrimoine net ;
- revenus ;
- dépenses ;
- cash-flow ;
- répartition par catégorie ;
- historique mensuel ;
- consommation du budget.

## Récurrences

Les récurrences sont des modèles de transactions. L'endpoint `POST /api/recurring/generate-due` matérialise les occurrences dues et avance `next_date`.

Une future version pourra exécuter ce traitement automatiquement avec un scheduler.
