'use client';

import { useState } from 'react';
import type { Transaction, TransactionType, TransactionCategory } from '@/app/types/household';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/app/constants/household';

interface TransactionItemProps {
  transaction: Transaction;
  onUpdate: (id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => void;
  onDelete: (id: string) => void;
}

export function TransactionItem({ transaction, onUpdate, onDelete }: TransactionItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editType, setEditType] = useState<TransactionType>(transaction.type);
  const [editAmount, setEditAmount] = useState(transaction.amount.toString());
  const [editCategory, setEditCategory] = useState<TransactionCategory>(transaction.category);
  const [editDescription, setEditDescription] = useState(transaction.description);
  const [editDate, setEditDate] = useState(transaction.date);

  const categories = editType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSave = () => {
    const numAmount = parseFloat(editAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return;
    }

    onUpdate(transaction.id, {
      type: editType,
      amount: numAmount,
      category: editCategory,
      description: editDescription,
      date: editDate,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditType(transaction.type);
    setEditAmount(transaction.amount.toString());
    setEditCategory(transaction.category);
    setEditDescription(transaction.description);
    setEditDate(transaction.date);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
        {/* 取引種類 */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setEditType('income')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              editType === 'income'
                ? 'bg-green-600 text-white'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            収入
          </button>
          <button
            type="button"
            onClick={() => setEditType('expense')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              editType === 'expense'
                ? 'bg-red-600 text-white'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            支出
          </button>
        </div>

        {/* 金額 */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">金額</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">¥</span>
            <input
              type="number"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* カテゴリ */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">カテゴリ</label>
          <select
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value as TransactionCategory)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* 説明 */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">説明</label>
          <input
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 日付 */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">日付</label>
          <input
            type="date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* アクションボタン */}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            保存
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
          >
            キャンセル
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`text-2xl font-bold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {transaction.type === 'income' ? '+' : '-'}¥{transaction.amount.toLocaleString()}
            </span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
              {transaction.category}
            </span>
          </div>
          {transaction.description && (
            <p className="text-slate-600 text-sm mb-2">{transaction.description}</p>
          )}
          <p className="text-slate-500 text-xs">
            {new Date(transaction.date).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="編集"
          >
            <svg
              className="w-5 h-5 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => {
              if (confirm('この取引を削除しますか？')) {
                onDelete(transaction.id);
              }
            }}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="削除"
          >
            <svg
              className="w-5 h-5 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
