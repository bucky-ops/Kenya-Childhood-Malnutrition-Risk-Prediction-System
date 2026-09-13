'use client';

import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend,
} from 'recharts';
import { MapPin } from 'lucide-react';
import type { CountySeries } from '@/lib/types';

export default function CountyDetailChart({
  series,
  county,
}: {
  series: CountySeries;
  county: string;
}) {
  if (!series) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <p className="text-slate-500 text-center py-12">No data for {county}.</p>
      </div>
    );
  }

  const data = series.dates.map((d, i) => ({
    date: d.slice(0, 7),
    actual: series.actual[i],
    predicted: series.predicted[i],
  }));

  const totalActual = series.actual.reduce((a, b) => a + b, 0);
  const totalPredicted = series.predicted.reduce((a, b) => a + b, 0);
  const mae = series.actual.reduce((s, a, i) => s + Math.abs(a - series.predicted[i]), 0) / series.actual.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-brand-600" aria-hidden="true" />
          <h2 className="text-lg font-bold text-slate-900">{county} County</h2>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Actual</p>
            <p className="font-bold text-emerald-700">{totalActual.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Predicted</p>
            <p className="font-bold text-brand-700">{Math.round(totalPredicted).toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide">MAE</p>
            <p className="font-bold text-slate-700">{mae.toFixed(1)}</p>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
          <Line
            type="monotone"
            dataKey="actual"
            name="Actual Cases"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="predicted"
            name="Predicted Cases"
            stroke="#ef4444"
            strokeWidth={2.5}
            strokeDasharray="6 4"
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
