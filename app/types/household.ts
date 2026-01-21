export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
  | '給料'
  | '副業'
  | 'その他収入'
  | '食費'
  | '住居'
  | '光熱費'
  | '交通費'
  | '医療費'
  | '娯楽'
  | '衣服'
  | '教育'
  | 'その他支出';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  date: string; // ISO 8601 format (YYYY-MM-DD)
  createdAt: string;
}

export interface MonthlyStats {
  income: number;
  expense: number;
  balance: number;
  transactionCount: number;
}

export interface CategoryBreakdown {
  category: TransactionCategory;
  amount: number;
  percentage: number;
  transactionCount: number;
}
