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