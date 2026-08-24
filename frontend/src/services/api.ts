import type {
  Account,
  AccountPayload,
  Budget,
  BudgetLimit,
  Category,
  CategorySpending,
  DailyCashFlow,
  DashboardSummary,
  MonthlyPoint,
  RecurringPayload,
  RecurringTransaction,
  SavingGoal,
  SavingGoalPayload,
  Transaction,
  TransactionPayload,
} from "../types/finance";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
    ...options,
  });

  if (!response.ok) {
    let message = `Erreur API ${response.status}`;
    try {
      const body = await response.json();
      if (typeof body?.detail === "string") message = body.detail;
    } catch {
      // Ignore invalid JSON errors and keep the HTTP fallback.
    }
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  getAccounts: (includeArchived = false) =>
    request<Account[]>(`/api/accounts?include_archived=${includeArchived}`),
  createAccount: (payload: AccountPayload) =>
    request<Account>("/api/accounts", { method: "POST", body: JSON.stringify(payload) }),
  updateAccount: (id: number, payload: AccountPayload) =>
    request<Account>(`/api/accounts/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  toggleArchiveAccount: (id: number) =>
    request<Account>(`/api/accounts/${id}/archive`, { method: "PATCH" }),

  getCategories: (type?: "expense" | "income") =>
    request<Category[]>(`/api/categories${type ? `?type=${type}` : ""}`),

  getTransactions: (year: number, month: number) =>
    request<Transaction[]>(`/api/transactions?year=${year}&month=${month}&limit=500`),
  createTransaction: (payload: TransactionPayload) =>
    request<Transaction>("/api/transactions", { method: "POST", body: JSON.stringify(payload) }),
  updateTransaction: (id: number, payload: TransactionPayload) =>
    request<Transaction>(`/api/transactions/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteTransaction: (id: number) =>
    request<void>(`/api/transactions/${id}`, { method: "DELETE" }),

  getSummary: (year: number, month: number) =>
    request<DashboardSummary>(`/api/analytics/${year}/${month}/summary`),
  getCategorySpending: (year: number, month: number) =>
    request<CategorySpending[]>(`/api/analytics/${year}/${month}/categories`),
  getDailyCashFlow: (year: number, month: number) =>
    request<DailyCashFlow[]>(`/api/analytics/${year}/${month}/daily`),
  getHistory: (year: number, month: number, months = 6) =>
    request<MonthlyPoint[]>(`/api/analytics/${year}/${month}/history?months=${months}`),

  getBudgets: () => request<Budget[]>("/api/budgets"),
  setBudget: (year: number, month: number, amount: string) =>
    request<Budget>(`/api/budgets/${year}/${month}`, {
      method: "PUT",
      body: JSON.stringify({ amount }),
    }),
  getBudgetLimits: (year: number, month: number) =>
    request<BudgetLimit[]>(`/api/budgets/${year}/${month}/limits`),
  setBudgetLimit: (year: number, month: number, categoryId: number, amount: string) =>
    request<BudgetLimit>(`/api/budgets/${year}/${month}/limits/${categoryId}`, {
      method: "PUT",
      body: JSON.stringify({ amount }),
    }),
  deleteBudgetLimit: (year: number, month: number, categoryId: number) =>
    request<void>(`/api/budgets/${year}/${month}/limits/${categoryId}`, { method: "DELETE" }),

  getRecurring: () => request<RecurringTransaction[]>("/api/recurring"),
  createRecurring: (payload: RecurringPayload) =>
    request<RecurringTransaction>("/api/recurring", { method: "POST", body: JSON.stringify(payload) }),
  updateRecurring: (id: number, payload: RecurringPayload) =>
    request<RecurringTransaction>(`/api/recurring/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteRecurring: (id: number) => request<void>(`/api/recurring/${id}`, { method: "DELETE" }),
  generateDue: () => request<{ generated: number }>("/api/recurring/generate-due", { method: "POST" }),

  getGoals: () => request<SavingGoal[]>("/api/goals"),
  createGoal: (payload: SavingGoalPayload) =>
    request<SavingGoal>("/api/goals", { method: "POST", body: JSON.stringify(payload) }),
  updateGoal: (id: number, payload: SavingGoalPayload) =>
    request<SavingGoal>(`/api/goals/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteGoal: (id: number) => request<void>(`/api/goals/${id}`, { method: "DELETE" }),
};
