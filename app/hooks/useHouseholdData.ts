'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Transaction, MonthlyStats, CategoryBreakdown, TransactionType, TransactionCategory } from '@/app/types/household';

const STORAGE_KEY = 'household-transactions';

export function useHouseholdData() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // LocalStorageからデータを読み込む
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTransactions(parsed);
      } catch (error) {
        console.error('Failed to parse stored transactions:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // LocalStorageにデータを保存する
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }
  }, [transactions, isLoaded]);

  // 取引を追加
  const addTransaction = useCallback((
    type: TransactionType,
    amount: number,
    category: TransactionCategory,
    description: string,
    date: string
  ) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      type,
      amount,
      category,
      description,
      date,
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  }, []);

  // 取引を更新
  const updateTransaction = useCallback((id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  // 取引を削除
  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  // 月ごとの統計を計算
  const getMonthlyStats = useCallback((year: number, month: number): MonthlyStats => {
    const monthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getFullYear() === year && date.getMonth() + 1 === month;
    });

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
      transactionCount: monthTransactions.length,
    };
  }, [transactions]);

  // 月ごとの取引を取得
  const getMonthlyTransactions = useCallback((year: number, month: number): Transaction[] => {
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getFullYear() === year && date.getMonth() + 1 === month;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  // カテゴリ別内訳を計算
  const getCategoryBreakdown = useCallback((
    year: number,
    month: number,
    type: TransactionType
  ): CategoryBreakdown[] => {
    const monthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getFullYear() === year && date.getMonth() + 1 === month && t.type === type;
    });

    const total = monthTransactions.reduce((sum, t) => sum + t.amount, 0);

    const categoryMap = new Map<TransactionCategory, { amount: number; count: number }>();

    monthTransactions.forEach(t => {
      const current = categoryMap.get(t.category) || { amount: 0, count: 0 };
      categoryMap.set(t.category, {
        amount: current.amount + t.amount,
        count: current.count + 1,
      });
    });

    return Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        percentage: total > 0 ? (data.amount / total) * 100 : 0,
        transactionCount: data.count,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getMonthlyStats,
    getMonthlyTransactions,
    getCategoryBreakdown,
    isLoaded,
  };
}
