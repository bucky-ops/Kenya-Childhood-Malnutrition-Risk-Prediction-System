'use client';

import { useState, useMemo } from 'react';
import {
  Activity, AlertTriangle, Database, Heart, MapPin,
  TrendingDown, TrendingUp, Stethoscope, Calendar, Gauge,
} from 'lucide-react';
import type { MalnutritionData } from '@/lib/types';
import { getRiskLevel, getRiskColor, getRiskDot } from '@/lib/types';
import StatCard from './StatCard';
import NationalTrendChart from './NationalTrendChart';
import CountyBarChart from './CountyBarChart';
import CountyDetailChart from './CountyDetailChart';
import CountyTable from './CountyTable';
import ValidationPanel from './ValidationPanel';
import Header from './Header';

export default function Dashboard({ data }: { data: MalnutritionData }) {
  const [selectedCounty, setSelectedCounty] = useState<string>(data.counties[0] ?? '');

  const totalPredicted = useMemo(
    () => data.summary.reduce((s, r) => s + r.predicted_cases, 0),
    [data.summary],
  );
  const totalActual = useMemo(
    () => data.summary.reduce((s, r) => s + r.acute_malnutrition_cases, 0),
    [data.summary],
  );
  const avgMae = useMemo(
    () => data.summary.length
      ? data.summary.reduce((s, r) => s + r.mae, 0) / data.summary.length
      : 0,
    [data.summary],
  );
  const criticalCounties = useMemo(
    () => data.summary.filter((c) => getRiskLevel(c.predicted_cases) === 'critical').length,
    [data.summary],
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header generatedAt={data.generated_at} totalRecords={data.total_records} />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Total Predicted Cases"
            value={totalPredicted.toLocaleString()}
            subtext={`across ${data.counties.length} counties`}
            color="brand"
          />
          <StatCard
            icon={<Activity className="w-5 h-5" />}
            label="Total Actual Cases"
            value={totalActual.toLocaleString()}
            subtext={`${data.date_range.start} → ${data.date_range.end}`}
            color="emerald"
          />
          <StatCard
            icon={<Gauge className="w-5 h-5" />}
            label="Mean Absolute Error"
            value={avgMae.toFixed(1)}
            subtext="lower is better"
            color="accent"
          />
          <StatCard
            icon={<AlertTriangle className="w-5 h-5" />}
            label="Critical-Risk Counties"
            value={criticalCounties.toString()}
            subtext=">5,000 predicted cases"
            color="savanna"
          />
        </section>

        {/* National trend + county bar */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <NationalTrendChart trend={data.national_trend} />
          </div>
          <div className="lg:col-span-1">
            <CountyBarChart summary={data.summary} />
          </div>
        </section>

        {/* County detail */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-600" aria-hidden="true" />
              County-Level Detail
            </h2>
            <label htmlFor="county-select" className="sr-only">Select a county to inspect</label>
            <select
              id="county-select"
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent shadow-sm"
            >
              {data.counties.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <CountyDetailChart
            series={data.county_series[selectedCounty]}
            county={selectedCounty}
          />
        </section>

        {/* County ranking table */}
        <section>
          <CountyTable summary={data.summary} onSelect={setSelectedCounty} />
        </section>

        {/* Validation panel */}
        <section>
          <ValidationPanel issues={data.validation_issues} />
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 pt-6 mt-8 text-center text-sm text-slate-500">
          <p className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-brand-500" aria-hidden="true" />
            <span className="font-medium">An open-source Digital Public Good</span>
          </p>
          <p>
            Built for humanitarian impact through ethical AI and open data.
            Predictions are for programmatic planning only — individual clinical
            decisions must be made by qualified health professionals.
          </p>
          <p className="mt-3 text-xs">
            <Database className="inline w-3 h-3 mr-1" aria-hidden="true" />
            Data sources: WHO · UNICEF · DHIS2 · Kenya MoH
          </p>
        </footer>
      </div>
    </div>
  );
}
