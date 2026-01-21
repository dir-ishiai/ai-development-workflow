'use client';

import { CATEGORY_COLORS } from '@/app/constants/household';
import type { CategoryBreakdown } from '@/app/types/household';

interface PieChartProps {
  data: CategoryBreakdown[];
}

export function PieChart({ data }: PieChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        データがありません
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.amount, 0);
  let currentAngle = 0;

  const slices = data.map((item) => {
    const percentage = (item.amount / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    return {
      ...item,
      startAngle,
      angle,
      percentage,
    };
  });

  const size = 300;
  const center = size / 2;
  const radius = size / 2 - 10;

  const createArcPath = (startAngle: number, angle: number) => {
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (startAngle + angle - 90) * (Math.PI / 180);

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices.map((slice, index) => (
          <g key={slice.category}>
            <path
              d={createArcPath(slice.startAngle, slice.angle)}
              fill={CATEGORY_COLORS[slice.category]}
              stroke="white"
              strokeWidth="2"
            />
          </g>
        ))}
      </svg>

      <div className="mt-6 grid grid-cols-2 gap-3 w-full max-w-md">
        {data.map((item) => (
          <div key={item.category} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded flex-shrink-0"
              style={{ backgroundColor: CATEGORY_COLORS[item.category] }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-900 truncate">{item.category}</div>
              <div className="text-xs text-slate-500">
                ¥{item.amount.toLocaleString()} ({item.percentage.toFixed(1)}%)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
