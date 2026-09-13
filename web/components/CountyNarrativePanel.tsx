'use client';

import { Users, HeartPulse, Sprout, TrendingUp, BookOpen } from 'lucide-react';
import type { CountySummary } from '@/lib/types';
import { getRiskLevel, getRiskColor, getRiskDot } from '@/lib/types';
import type { CountyNarrative } from '@/lib/narratives';

interface CountyNarrativePanelProps {
  county: string;
  summary?: CountySummary;
  narrative: CountyNarrative;
}

export default function CountyNarrativePanel({ county, summary, narrative }: CountyNarrativePanelProps) {
  const level = summary ? getRiskLevel(summary.predicted_cases) : 'low';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-6 py-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-2xl font-bold">{county} County</h2>
          {summary && (
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
              <span className={`w-2 h-2 rounded-full ${getRiskDot(level)}`} />
              {level} risk · {summary.predicted_cases.toLocaleString()} predicted cases
            </span>
          )}
        </div>
        {summary && (
          <div className="flex gap-6 mt-3 text-sm">
            <span><strong>{summary.acute_malnutrition_cases.toLocaleString()}</strong> actual cases</span>
            <span><strong>{summary.mae}</strong> MAE</span>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Drivers */}
        <section>
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-3">
            <Users className="w-4 h-4 text-brand-600" aria-hidden="true" />
            Why is malnutrition prevalent here?
          </h3>
          <ul className="space-y-2">
            {narrative.drivers.map((d, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-700">
                <span className="text-brand-500 mt-0.5 shrink-0">▸</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Testimony */}
        <section className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4">
          <h3 className="flex items-center gap-2 text-base font-bold text-amber-900 mb-2">
            <HeartPulse className="w-4 h-4" aria-hidden="true" />
            A Family's Story
          </h3>
          <p className="text-sm text-amber-900 italic leading-relaxed">{narrative.testimony}</p>
        </section>

        {/* Initiatives */}
        <section>
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-3">
            <Sprout className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            Local Initiatives & Programs
          </h3>
          <ul className="space-y-2">
            {narrative.initiatives.map((init, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-700">
                <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                <span>{init}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Success Story */}
        <section className="bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg p-4">
          <h3 className="flex items-center gap-2 text-base font-bold text-emerald-900 mb-2">
            <TrendingUp className="w-4 h-4" aria-hidden="true" />
            Progress & Success
          </h3>
          <p className="text-sm text-emerald-900 leading-relaxed">{narrative.success_story}</p>
        </section>
      </div>
    </div>
  );
}
