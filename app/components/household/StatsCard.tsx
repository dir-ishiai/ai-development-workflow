interface StatsCardProps {
  title: string;
  amount: number;
  subtitle: string;
  icon: string;
  type: 'income' | 'expense' | 'balance';
}

export function StatsCard({ title, amount, subtitle, icon, type }: StatsCardProps) {
  const getAmountColor = () => {
    if (type === 'income') return 'text-green-600';
    if (type === 'expense') return 'text-red-600';
    return amount >= 0 ? 'text-slate-900' : 'text-red-600';
  };

  const getAmountPrefix = () => {
    if (type === 'balance' && amount < 0) return '-¥';
    if (type === 'balance') return amount > 0 ? '+¥' : '¥';
    return '¥';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-slate-600">{title}</h3>
        <span className="text-xl">{icon}</span>
      </div>
      <div className={`text-3xl font-bold ${getAmountColor()}`}>
        {getAmountPrefix()}{Math.abs(amount).toLocaleString()}
      </div>
      <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
    </div>
  );
}
