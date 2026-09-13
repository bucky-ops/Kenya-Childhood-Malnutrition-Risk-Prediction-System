'use client';

import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, Area, AreaChart,
} from 'recharts';
import { TrendingDown } from 'lucide-react';
import type { NationalTrend } from '@/lib/types';

export default function NationalTrendChart({ trend }: { trend: NationalTrend }) {
  const data = trend.dates.map((d, i) => ({
    date: d.slice(0, 7), // YYYY-MM
    actual: trend.actual[i],
    predicted: trend.predicted[i],
  }));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm h-full">
      <div className="flex items-center gap-2 mb-4">
        <TrendingDown className="w-5 h-5 text-brand-600" aria-hidden="true" />
        <h2 className="text-lg font-bold text-slate-900">National Trend: Actual vs Predicted</h2>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '13px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '13px' }} />
          <Area
            type="monotone"
            dataKey="actual"
            name="Actual Cases"
            stroke="#10b981"
            strokeWidth={2.5}
            fill="url(#actualGrad)"
          />
          <Area
            type="monotone"
            dataKey="predicted"
            name="Predicted Cases"
            stroke="#ef4444"
            strokeWidth={2.5}
            strokeDasharray="6 4"
            fill="url(#predGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
      <p className="mt-2 text-xs text-slate-500">
        The dashed red line shows ML predictions; the solid green line shows reported cases.
      </p>
    </div>
  );
}
