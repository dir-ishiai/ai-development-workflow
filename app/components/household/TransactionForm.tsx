'use client';

import { useState } from 'react';
import type { TransactionType, TransactionCategory } from '@/app/types/household';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/app/constants/household';

interface TransactionFormProps {
  onSubmit: (
    type: TransactionType,
    amount: number,
    category: TransactionCategory,
    description: string,
    date: string
  ) => void;
}

export function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<TransactionCategory | ''>('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !category || !date) {
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return;
    }

    onSubmit(type, numAmount, category, description, date);

    // フォームをリセット
    setAmount('');
    setCategory('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6">+ 新しい取引を追加</h2>

        <div className="space-y-6">
          {/* 取引種類 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">取引種類</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setType('income');
                  setCategory('');
                }}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                  type === 'income'
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                収入
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('expense');
                  setCategory('');
                }}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                  type === 'expense'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                支出
              </button>
            </div>
          </div>

          {/* 金額と日付 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-semibold text-slate-700 mb-2">
                金額
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">¥</span>
                <input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-semibold text-slate-700 mb-2">
                日付
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* カテゴリ */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-2">
              カテゴリ
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as TransactionCategory)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              required
            >
              <option value="">カテゴリを選択してください</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 説明 */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
              説明（任意）
            </label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="詳細を入力してください"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 送信ボタン */}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors"
          >
            追加
          </button>
        </div>
      </div>
    </form>
  );
}
