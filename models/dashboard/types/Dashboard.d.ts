export interface TransactionByCategory {
  category_name: string;
  transaction_count: number;
  total_amount: string;
  id: string | null;
}

export interface TransactionsByMonth {
  [key: string]: string;
}

export interface DashboardData {
  total_balance: string;
  total_income: string;
  total_expense: string;
  expenses_by_category: TransactionByCategory[];
  incomes_by_category: TransactionByCategory[];
  transactions_by_month: TransactionsByMonth;
}
