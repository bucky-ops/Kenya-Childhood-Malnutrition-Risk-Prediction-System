'use client';

import { Table2, ChevronRight } from 'lucide-react';
import type { CountySummary } from '@/lib/types';
import { getRiskLevel, getRiskColor, getRiskDot } from '@/lib/types';

export default function CountyTable({
  summary,
  onSelect,
}: {
  summary: CountySummary[];
  onSelect: (county: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-200">
        <Table2 className="w-5 h-5 text-brand-600" aria-hidden="true" />
        <h2 className="text-lg font-bold text-slate-900">County Risk Ranking</h2>
        <span className="ml-auto text-xs text-slate-500">
          Click a row to inspect →
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-left">
              <th className="px-5 py-3 font-semibold">Rank</th>
              <th className="px-5 py-3 font-semibold">County</th>
              <th className="px-5 py-3 font-semibold text-right">Predicted Cases</th>
              <th className="px-5 py-3 font-semibold text-right">Actual Cases</th>
              <th className="px-5 py-3 font-semibold text-right">MAE</th>
              <th className="px-5 py-3 font-semibold">Risk Level</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {summary.map((c, i) => {
              const level = getRiskLevel(c.predicted_cases);
              return (
                <tr
                  key={c.county}
                  onClick={() => onSelect(c.county)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelect(c.county);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Inspect ${c.county} county: ${c.predicted_cases.toLocaleString()} predicted cases, risk level ${level}`}
                  className="border-t border-slate-100 hover:bg-emerald-50/50 hover:cursor-pointer focus:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 transition-colors"
                >
                  <td className="px-5 py-3 text-slate-500 font-mono">#{i + 1}</td>
                  <td className="px-5 py-3 font-semibold text-slate-900">{c.county}</td>
                  <td className="px-5 py-3 text-right font-bold text-brand-700">
                    {c.predicted_cases.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-right text-emerald-700">
                    {c.acute_malnutrition_cases.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-right text-slate-600">{c.mae}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getRiskColor(level)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${getRiskDot(level)}`} />
                      {level}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
