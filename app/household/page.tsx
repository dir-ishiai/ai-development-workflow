'use client';

import { useState } from 'react';
import { useHouseholdData } from '@/app/hooks/useHouseholdData';
import { TransactionForm } from '@/app/components/household/TransactionForm';
import { StatsCard } from '@/app/components/household/StatsCard';
import { TransactionItem } from '@/app/components/household/TransactionItem';
import { PieChart } from '@/app/components/household/PieChart';

type TabType = 'overview' | 'history' | 'breakdown';

export default function HouseholdPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const {
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getMonthlyStats,
    getMonthlyTransactions,
    getCategoryBreakdown,
    isLoaded,
  } = useHouseholdData();

  const stats = getMonthlyStats(selectedYear, selectedMonth);
  const transactions = getMonthlyTransactions(selectedYear, selectedMonth);
  const incomeBreakdown = getCategoryBreakdown(selectedYear, selectedMonth, 'income');
  const expenseBreakdown = getCategoryBreakdown(selectedYear, selectedMonth, 'expense');

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl">💰</span>
            <h1 className="text-4xl font-bold text-slate-900">家計簿アプリ</h1>
          </div>
          <p className="text-slate-600">収入と支出を記録して、家計を管理しましょう</p>
        </div>

        {/* タブナビゲーション */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="inline-block mr-2">📊</span>
              概要
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="inline-block mr-2">📋</span>
              取引履歴
            </button>
            <button
              onClick={() => setActiveTab('breakdown')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'breakdown'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="inline-block mr-2">🎯</span>
              カテゴリ内訳
            </button>
          </div>
        </div>

        {/* 月選択 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                if (selectedMonth === 1) {
                  setSelectedYear(selectedYear - 1);
                  setSelectedMonth(12);
                } else {
                  setSelectedMonth(selectedMonth - 1);
                }
              }}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="前月"
            >
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-slate-900 min-w-[200px] text-center">
              {selectedYear}年{selectedMonth}月の収支
            </h2>
            <button
              onClick={() => {
                if (selectedMonth === 12) {
                  setSelectedYear(selectedYear + 1);
                  setSelectedMonth(1);
                } else {
                  setSelectedMonth(selectedMonth + 1);
                }
              }}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="翌月"
            >
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* 概要タブ */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 統計カード */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="収入"
                amount={stats.income}
                subtitle={`${stats.transactionCount}件の取引`}
                icon="📈"
                type="income"
              />
              <StatsCard
                title="支出"
                amount={stats.expense}
                subtitle={`${stats.transactionCount}件の取引`}
                icon="📉"
                type="expense"
              />
              <StatsCard
                title="収支"
                amount={stats.balance}
                subtitle="赤字"
                icon="💰"
                type="balance"
              />
            </div>

            {/* 取引フォーム */}
            <TransactionForm onSubmit={addTransaction} />
          </div>
        )}

        {/* 取引履歴タブ */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">取引履歴</h2>
              {transactions.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  この月の取引はありません
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <TransactionItem
                      key={transaction.id}
                      transaction={transaction}
                      onUpdate={updateTransaction}
                      onDelete={deleteTransaction}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* カテゴリ内訳タブ */}
        {activeTab === 'breakdown' && (
          <div className="space-y-8">
            {/* 収入の内訳 */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">収入の内訳</h2>
              {incomeBreakdown.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  収入データがありません
                </div>
              ) : (
                <div className="space-y-8">
                  <PieChart data={incomeBreakdown} />
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                            カテゴリ
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                            金額
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                            割合
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                            件数
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {incomeBreakdown.map((item) => (
                          <tr key={item.category} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-3 px-4 text-sm text-slate-900">{item.category}</td>
                            <td className="py-3 px-4 text-sm text-right text-green-600 font-medium">
                              ¥{item.amount.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-sm text-right text-slate-600">
                              {item.percentage.toFixed(1)}%
                            </td>
                            <td className="py-3 px-4 text-sm text-right text-slate-600">
                              {item.transactionCount}件
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* 支出の内訳 */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">支出の内訳</h2>
              {expenseBreakdown.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  支出データがありません
                </div>
              ) : (
                <div className="space-y-8">
                  <PieChart data={expenseBreakdown} />
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                            カテゴリ
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                            金額
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                            割合
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                            件数
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenseBreakdown.map((item) => (
                          <tr key={item.category} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-3 px-4 text-sm text-slate-900">{item.category}</td>
                            <td className="py-3 px-4 text-sm text-right text-red-600 font-medium">
                              ¥{item.amount.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-sm text-right text-slate-600">
                              {item.percentage.toFixed(1)}%
                            </td>
                            <td className="py-3 px-4 text-sm text-right text-slate-600">
                              {item.transactionCount}件
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
