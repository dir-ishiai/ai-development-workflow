import type { TransactionCategory } from '@/app/types/household';

export const INCOME_CATEGORIES: TransactionCategory[] = [
  '給料',
  '副業',
  'その他収入',
];

export const EXPENSE_CATEGORIES: TransactionCategory[] = [
  '食費',
  '住居',
  '光熱費',
  '交通費',
  '医療費',
  '娯楽',
  '衣服',
  '教育',
  'その他支出',
];

export const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  // 収入
  '給料': '#10b981',
  '副業': '#34d399',
  'その他収入': '#6ee7b7',

  // 支出
  '食費': '#ef4444',
  '住居': '#f97316',
  '光熱費': '#f59e0b',
  '交通費': '#eab308',
  '医療費': '#84cc16',
  '娯楽': '#06b6d4',
  '衣服': '#8b5cf6',
  '教育': '#ec4899',
  'その他支出': '#6b7280',
};
