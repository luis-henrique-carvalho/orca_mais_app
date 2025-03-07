export interface Transaction {
  id: string;
  amount: string;
  category: Category;
  created_at: string;
  description: string;
  name: string;
  transaction_type: "income" | "expense";
}
