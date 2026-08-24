export type AccountType = "checking" | "savings" | "cash" | "credit";
export type TransactionType = "expense" | "income" | "transfer";
export type CategoryType = "expense" | "income";
export type RecurringFrequency = "weekly" | "monthly" | "yearly";

export interface Account {
  id: number;
  name: string;
  type: AccountType;
  currency: string;
  opening_balance: string;
  balance: string;
  color: string;
  is_archived: boolean;
  created_at: string;
}

export interface AccountPayload {
  name: string;
  type: AccountType;
  currency: string;
  opening_balance: string;
  color: string;
}

export interface Category {
  id: number;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  created_at: string;
}

export interface Transaction {
  id: number;
  date: string;
  description: string;
  type: TransactionType;
  amount: string;
  source_account_id: number | null;
  source_account_name: string | null;
  destination_account_id: number | null;
  destination_account_name: string | null;
  category_id: number | null;
  category_name: string | null;
  category_color: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TransactionPayload {
  date: string;
  description: string;
  type: TransactionType;
  amount: string;
  source_account_id: number | null;
  destination_account_id: number | null;
  category_id: number | null;
  notes: string | null;
}

export interface DashboardSummary {
  year: number;
  month: number;
  budget: string | null;
  expenses: string;
  income: string;
  cash_flow: string;
  remaining: string | null;
  percentage_used: string | null;
  net_worth: string;
  transaction_count: number;
  account_count: number;
}

export interface CategorySpending {
  category_id: number | null;
  category: string;
  color: string;
  amount: string;
  transaction_count: number;
}

export interface DailyCashFlow {
  date: string;
  expenses: string;
  income: string;
}

export interface MonthlyPoint {
  year: number;
  month: number;
  expenses: string;
  income: string;
  cash_flow: string;
}

export interface Budget {
  id: number;
  year: number;
  month: number;
  amount: string;
  created_at: string;
  updated_at: string;
}

export interface BudgetLimit {
  id: number;
  year: number;
  month: number;
  category_id: number;
  category_name: string;
  category_color: string;
  amount: string;
  spent: string;
  remaining: string;
  percentage_used: string | null;
}

export interface RecurringTransaction {
  id: number;
  name: string;
  description: string;
  type: TransactionType;
  amount: string;
  frequency: RecurringFrequency;
  next_date: string;
  source_account_id: number | null;
  destination_account_id: number | null;
  category_id: number | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecurringPayload {
  name: string;
  description: string;
  type: TransactionType;
  amount: string;
  frequency: RecurringFrequency;
  next_date: string;
  source_account_id: number | null;
  destination_account_id: number | null;
  category_id: number | null;
  notes: string | null;
  is_active: boolean;
}

export interface SavingGoal {
  id: number;
  name: string;
  target_amount: string;
  current_amount: string;
  target_date: string | null;
  account_id: number | null;
  color: string;
  progress_percentage: string;
  created_at: string;
}

export interface SavingGoalPayload {
  name: string;
  target_amount: string;
  current_amount: string;
  target_date: string | null;
  account_id: number | null;
  color: string;
}
