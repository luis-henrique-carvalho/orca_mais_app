import { z } from "zod";
// TODO: Better way to import this type
export enum TransactionType {
  income = "income",
  expense = "expense",
}

export const transactionTypeLabels: Record<TransactionType, string> = {
  [TransactionType.income]: "Receita",
  [TransactionType.expense]: "Despesa",
};

export const transactionSchema = z.object({
  name: z.string().min(5, "Nome é obrigatório"),
  amount: z.number().min(0.01, "Valor é obrigatório"),
  category_id: z.string().min(1, "Categoria é obrigatória"),
  transaction_type: z.nativeEnum(TransactionType),
  description: z.string().min(3, "Descrição é obrigatória"),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
