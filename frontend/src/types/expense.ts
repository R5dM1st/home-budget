export const EXPENSE_CATEGORIES = [
  "Logement",
  "Courses",
  "Transport",
  "Factures",
  "Loisirs",
  "Abonnements",
  "Shopping",
  "Autre",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export interface Expense {
  id: number;
  date: string;
  description: string;
  amount: string;
  category: ExpenseCategory;
  created_at: string;
}

export interface ExpensePayload {
  date: string;
  description: string;
  amount: string;
  category: ExpenseCategory;
}
