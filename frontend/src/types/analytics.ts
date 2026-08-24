export interface MonthlySummary {
  year: number;
  month: number;
  budget: string | null;
  total_spent: string;
  remaining: string | null;
  percentage_used: string | null;
  transaction_count: number;
  average_expense: string;
}

export interface CategorySpending {
  category: string;
  amount: string;
  transaction_count: number;
}

export interface DailySpending {
  date: string;
  amount: string;
  transaction_count: number;
}

export interface MonthlyComparison {
  year: number;
  month: number;
  previous_year: number;
  previous_month: number;
  current_total: string;
  previous_total: string;
  difference: string;
  change_percentage: string | null;
}

export interface TopExpense {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: string;
}
