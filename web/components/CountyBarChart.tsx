'use client';

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import type { CountySummary } from '@/lib/types';
import { getRiskLevel } from '@/lib/types';

const riskColors: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  moderate: '#eab308',
  low: '#10b981',
};

export default function CountyBarChart({ summary }: { summary: CountySummary[] }) {
  const data = summary.map((s) => ({
    name: s.county,
    cases: s.predicted_cases,
    level: getRiskLevel(s.predicted_cases),
  }));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm h-full">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-brand-600" aria-hidden="true" />
        <h2 className="text-lg font-bold text-slate-900">Cases by County</h2>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis type="number" stroke="#64748b" fontSize={11} />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#64748b"
            fontSize={11}
            width={70}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '13px',
            }}
            formatter={(v: number) => [v.toLocaleString(), 'Predicted Cases']}
          />
          <Bar dataKey="cases" name="Predicted Cases" radius={[0, 4, 4, 0]}>
            {data.map((entry, idx) => (
              <Cell key={idx} fill={riskColors[entry.level]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        {Object.entries(riskColors).map(([k, v]) => (
          <span key={k} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded" style={{ background: v }} />
            <span className="capitalize text-slate-600">{k}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
