'use client';

import { ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import type { ValidationIssue } from '@/lib/types';

export default function ValidationPanel({ issues }: { issues: ValidationIssue[] }) {
  const highSeverity = issues.filter((i) => i.issue.toLowerCase().includes('high') || i.check === 'dates').length;
  const hasIssues = issues.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-200">
        <ShieldCheck className="w-5 h-5 text-emerald-600" aria-hidden="true" />
        <h2 className="text-lg font-bold text-slate-900">Data Quality Validation (WHO DQR)</h2>
        {hasIssues && (
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-medium text-amber-700">
            <AlertTriangle className="w-3 h-3" aria-hidden="true" />
            {highSeverity} issue{highSeverity !== 1 ? 's' : ''} flagged
          </span>
        )}
      </div>
      <div className="p-5">
        {!hasIssues ? (
          <div className="flex items-center gap-3 text-emerald-700 bg-emerald-50 rounded-lg p-4">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            <p className="text-sm">
              All data quality checks passed. Predictions are based on validated, complete data.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {issues.map((issue, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <Info className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    {issue.check}
                  </p>
                  <p className="text-sm text-slate-600 mt-0.5">{issue.issue}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-4 text-xs text-slate-500">
          Validation runs against WHO Data Quality Review (DQR) standards:
          completeness, timeliness, internal consistency, external consistency, and accuracy.
        </p>
      </div>
    </div>
  );
}
