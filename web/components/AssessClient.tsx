'use client';

import { useState } from 'react';
import { ClipboardCheck, AlertTriangle, CheckCircle, Activity, Baby } from 'lucide-react';
import { assessRisk, type AssessmentInput, type AssessmentResult } from '@/lib/risk-engine';

export default function AssessClient() {
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [form, setForm] = useState<AssessmentInput>({
    age_months: 18,
    sex: 'male',
    weight_kg: 9,
    height_cm: 75,
    muac_mm: undefined,
    dietary_diversity: 4,
    meals_per_day: 3,
    recent_illness: false,
    breastfeeding: false,
    caregiver_education: 'primary',
    improved_water: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(assessRisk(form));
  };

  const num = (field: keyof AssessmentInput, value: string) => {
    const n = value === '' ? undefined : Number(value);
    setForm({ ...form, [field]: n });
  };

  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-cyan-50/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <header className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg">
            <ClipboardCheck className="w-7 h-7 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Assess a Child&apos;s Risk</h1>
          <p className="text-slate-600 mt-2 max-w-2xl mx-auto">
            Enter the child&apos;s measurements and context below. You&apos;ll get an immediate
            WHO z-score-based malnutrition risk classification with recommendations.
          </p>
        </header>

        {/* Privacy notice */}
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-3 text-sm text-amber-900">
          <strong>Privacy:</strong> This tool processes data in your browser — nothing is sent to a server
          or stored. Use a pseudonym, not the child&apos;s real name.
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ─── Input form ─── */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Child&apos;s Information</h2>

            {/* Anthropometrics */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-1">Age (months) <span className="text-red-500">*</span></label>
                <input id="age" type="number" min={6} max={60} required value={form.age_months} onChange={(e) => setForm({ ...form, age_months: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label htmlFor="sex" className="block text-sm font-medium text-slate-700 mb-1">Sex <span className="text-red-500">*</span></label>
                <select id="sex" value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value as 'male' | 'female' })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-slate-700 mb-1">Weight (kg) <span className="text-red-500">*</span></label>
                <input id="weight" type="number" step="0.1" min={0} required value={form.weight_kg} onChange={(e) => num('weight_kg', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-slate-700 mb-1">Height (cm) <span className="text-red-500">*</span></label>
                <input id="height" type="number" step="0.5" min={0} required value={form.height_cm} onChange={(e) => num('height_cm', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="col-span-2">
                <label htmlFor="muac" className="block text-sm font-medium text-slate-700 mb-1">MUAC (mm) <span className="text-slate-400 font-normal">— optional but recommended</span></label>
                <input id="muac" type="number" min={0} max={300} value={form.muac_mm ?? ''} onChange={(e) => num('muac_mm', e.target.value)} placeholder="e.g. 120" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <p className="text-xs text-slate-400 mt-1">&lt; 115 mm = SAM, 115-124 mm = MAM, ≥ 125 mm = normal</p>
              </div>
            </div>

            {/* Dietary */}
            <h3 className="text-sm font-bold text-slate-700 pt-2 border-t border-slate-100">Dietary & Health</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="diversity" className="block text-sm font-medium text-slate-700 mb-1">Food groups (last 24h)</label>
                <input id="diversity" type="number" min={0} max={7} value={form.dietary_diversity ?? ''} onChange={(e) => num('dietary_diversity', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <p className="text-xs text-slate-400 mt-1">0-7: grains, legumes, dairy, eggs, meat/fish, veg, fruit</p>
              </div>
              <div>
                <label htmlFor="meals" className="block text-sm font-medium text-slate-700 mb-1">Meals per day</label>
                <input id="meals" type="number" min={0} max={10} value={form.meals_per_day ?? ''} onChange={(e) => num('meals_per_day', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input type="checkbox" checked={form.recent_illness ?? false} onChange={(e) => setForm({ ...form, recent_illness: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                Illness in last 2 weeks (diarrhoea / fever / respiratory)
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input type="checkbox" checked={form.breastfeeding ?? false} onChange={(e) => setForm({ ...form, breastfeeding: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                Currently breastfeeding
              </label>
            </div>

            {/* Socioeconomic */}
            <h3 className="text-sm font-bold text-slate-700 pt-2 border-t border-slate-100">Socioeconomic & Environment</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="education" className="block text-sm font-medium text-slate-700 mb-1">Caregiver education</label>
                <select id="education" value={form.caregiver_education} onChange={(e) => setForm({ ...form, caregiver_education: e.target.value as AssessmentInput['caregiver_education'] })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="none">No formal education</option>
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="tertiary">Tertiary</option>
                </select>
              </div>
              <div>
                <label htmlFor="water" className="block text-sm font-medium text-slate-700 mb-1">Improved water source?</label>
                <select id="water" value={form.improved_water === undefined ? '' : form.improved_water ? 'yes' : 'no'} onChange={(e) => setForm({ ...form, improved_water: e.target.value === 'yes' })} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="">— select —</option>
                  <option value="yes">Yes (piped / borehole / treated)</option>
                  <option value="no">No (river / pond / unprotected)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
              Assess Risk
            </button>
          </form>

          {/* ─── Result ─── */}
          <div className="space-y-4">
            {!result ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 h-full flex flex-col items-center justify-center">
                <Baby className="w-12 h-12 text-slate-300 mb-3" aria-hidden="true" />
                <p className="text-sm">Fill in the form and click &quot;Assess Risk&quot; to see the result here.</p>
              </div>
            ) : (
              <>
                {/* Risk banner */}
                <div
                  className="rounded-2xl border-2 p-5 shadow-sm"
                  style={{ borderColor: result.risk_color, background: `${result.risk_color}0d` }}
                >
                  <div className="flex items-center gap-3">
                    {result.immediate_action ? (
                      <AlertTriangle className="w-8 h-8 shrink-0" style={{ color: result.risk_color }} aria-hidden="true" />
                    ) : result.risk === 'normal' ? (
                      <CheckCircle className="w-8 h-8 shrink-0" style={{ color: result.risk_color }} aria-hidden="true" />
                    ) : (
                      <Activity className="w-8 h-8 shrink-0" style={{ color: result.risk_color }} aria-hidden="true" />
                    )}
                    <div>
                      <h2 className="text-xl font-bold" style={{ color: result.risk_color }}>
                        {result.risk_label}
                      </h2>
                      {result.immediate_action && (
                        <p className="text-sm text-red-700 font-medium">⚠️ Seek medical attention immediately</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Z-scores */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">WHO Z-Scores</h3>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-xs text-slate-500">Weight-for-Height</p>
                      <p className={`text-2xl font-bold ${result.whz !== null && result.whz < -2 ? 'text-red-600' : 'text-slate-700'}`}>
                        {result.whz !== null ? result.whz.toFixed(2) : '—'}
                      </p>
                      <p className="text-xs text-slate-400">Wasting</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Height-for-Age</p>
                      <p className={`text-2xl font-bold ${result.haz !== null && result.haz < -2 ? 'text-orange-600' : 'text-slate-700'}`}>
                        {result.haz !== null ? result.haz.toFixed(2) : '—'}
                      </p>
                      <p className="text-xs text-slate-400">Stunting</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Weight-for-Age</p>
                      <p className={`text-2xl font-bold ${result.waz !== null && result.waz < -2 ? 'text-amber-600' : 'text-slate-700'}`}>
                        {result.waz !== null ? result.waz.toFixed(2) : '—'}
                      </p>
                      <p className="text-xs text-slate-400">Underweight</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 text-center">Z-scores: &lt; -3 = severe, -3 to -2 = moderate, &gt; -2 = normal</p>
                </div>

                {/* Findings */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">Findings</h3>
                  <ul className="space-y-1.5">
                    {result.findings.map((f, i) => (
                      <li key={i} className="text-sm text-slate-700 flex gap-2">
                        <span className="text-slate-400 shrink-0">▸</span>{f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5">
                  <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wide mb-2">Recommendations</h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((r, i) => (
                      <li key={i} className="text-sm text-emerald-900 flex gap-2">
                        <span className="text-emerald-500 shrink-0">✓</span>{r}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
