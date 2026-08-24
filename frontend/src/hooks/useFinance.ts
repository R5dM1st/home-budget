import { useCallback, useEffect, useMemo, useState } from "react";

import { api } from "../services/api";
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

export function useFinance() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [categorySpending, setCategorySpending] = useState<CategorySpending[]>([]);
  const [daily, setDaily] = useState<DailyCashFlow[]>([]);
  const [history, setHistory] = useState<MonthlyPoint[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [budgetLimits, setBudgetLimits] = useState<BudgetLimit[]>([]);
  const [recurring, setRecurring] = useState<RecurringTransaction[]>([]);
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const expenseCategories = useMemo(
    () => categories.filter((category) => category.type === "expense"),
    [categories],
  );
  const incomeCategories = useMemo(
    () => categories.filter((category) => category.type === "income"),
    [categories],
  );

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [
        accountsData,
        categoriesData,
        transactionsData,
        summaryData,
        categoryData,
        dailyData,
        historyData,
        budgetsData,
        limitsData,
        recurringData,
        goalsData,
      ] = await Promise.all([
        api.getAccounts(),
        api.getCategories(),
        api.getTransactions(year, month),
        api.getSummary(year, month),
        api.getCategorySpending(year, month),
        api.getDailyCashFlow(year, month),
        api.getHistory(year, month, 6),
        api.getBudgets(),
        api.getBudgetLimits(year, month),
        api.getRecurring(),
        api.getGoals(),
      ]);

      setAccounts(accountsData);
      setCategories(categoriesData);
      setTransactions(transactionsData);
      setSummary(summaryData);
      setCategorySpending(categoryData);
      setDaily(dailyData);
      setHistory(historyData);
      setBudgets(budgetsData);
      setBudgetLimits(limitsData);
      setRecurring(recurringData);
      setGoals(goalsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger tes finances.");
    } finally {
      setIsLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  function previousMonth() {
    if (month === 1) {
      setMonth(12);
      setYear((value) => value - 1);
    } else {
      setMonth((value) => value - 1);
    }
  }

  function nextMonth() {
    if (month === 12) {
      setMonth(1);
      setYear((value) => value + 1);
    } else {
      setMonth((value) => value + 1);
    }
  }

  async function saveTransaction(payload: TransactionPayload, transaction?: Transaction | null) {
    if (transaction) await api.updateTransaction(transaction.id, payload);
    else await api.createTransaction(payload);
    await refresh();
  }

  async function removeTransaction(transaction: Transaction) {
    await api.deleteTransaction(transaction.id);
    await refresh();
  }

  async function saveAccount(payload: AccountPayload, account?: Account | null) {
    if (account) await api.updateAccount(account.id, payload);
    else await api.createAccount(payload);
    await refresh();
  }

  async function archiveAccount(account: Account) {
    await api.toggleArchiveAccount(account.id);
    await refresh();
  }

  async function saveBudget(amount: string) {
    await api.setBudget(year, month, amount);
    await refresh();
  }

  async function saveBudgetLimit(categoryId: number, amount: string) {
    await api.setBudgetLimit(year, month, categoryId, amount);
    await refresh();
  }

  async function removeBudgetLimit(categoryId: number) {
    await api.deleteBudgetLimit(year, month, categoryId);
    await refresh();
  }

  async function saveRecurring(payload: RecurringPayload, item?: RecurringTransaction | null) {
    if (item) await api.updateRecurring(item.id, payload);
    else await api.createRecurring(payload);
    await refresh();
  }

  async function removeRecurring(item: RecurringTransaction) {
    await api.deleteRecurring(item.id);
    await refresh();
  }

  async function generateDue() {
    const result = await api.generateDue();
    await refresh();
    return result.generated;
  }

  async function saveGoal(payload: SavingGoalPayload, goal?: SavingGoal | null) {
    if (goal) await api.updateGoal(goal.id, payload);
    else await api.createGoal(payload);
    await refresh();
  }

  async function removeGoal(goal: SavingGoal) {
    await api.deleteGoal(goal.id);
    await refresh();
  }

  return {
    year,
    month,
    setYear,
    setMonth,
    previousMonth,
    nextMonth,
    accounts,
    categories,
    expenseCategories,
    incomeCategories,
    transactions,
    summary,
    categorySpending,
    daily,
    history,
    budgets,
    budgetLimits,
    recurring,
    goals,
    isLoading,
    error,
    setError,
    refresh,
    saveTransaction,
    removeTransaction,
    saveAccount,
    archiveAccount,
    saveBudget,
    saveBudgetLimit,
    removeBudgetLimit,
    saveRecurring,
    removeRecurring,
    generateDue,
    saveGoal,
    removeGoal,
  };
}
