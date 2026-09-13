import { Suspense } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import Loading from './loading';
import HomeMap from '@/components/HomeMap';
import countyDataLayers from '@/data/county_data_layers.json';
import narratives from '@/data/county_narratives.json';
import type { CountyNarratives } from '@/lib/narratives';

const typedNarratives = narratives as CountyNarratives;

interface CountyDataLayer {
  stunting: number; wasting: number; underweight: number;
  water_access: number; sanitation: number; poverty: number;
  gam_risk: string; population_under_5: number; predicted_cases: number;
  centroid_lon: number; centroid_lat: number;
}

const countyData = countyDataLayers as Record<string, CountyDataLayer>;

function getRiskBadge(risk: string) {
  const styles: Record<string, string> = {
    critical: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    moderate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-green-100 text-green-700 border-green-200',
  };
  return styles[risk] || styles.low;
}

export default function HomePage() {
  // Sort counties by predicted_cases descending (highest risk first)
  const sortedCounties = Object.entries(countyData)
    .sort(([, a], [, b]) => b.predicted_cases - a.predicted_cases);

  const totalPredicted = sortedCounties.reduce((s, [, d]) => s + d.predicted_cases, 0);
  const criticalCount = sortedCounties.filter(([, d]) => d.gam_risk === 'critical').length;
  const highCount = sortedCounties.filter(([, d]) => d.gam_risk === 'high').length;

  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-cyan-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Kenya Childhood Malnutrition Risk Map
          </h1>
          <p className="text-slate-600 mt-2 max-w-2xl mx-auto">
            Interactive GIS map of all 47 Kenya counties. Click any county to explore its
            malnutrition data, drivers, and local initiatives.
          </p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <span><strong className="text-slate-900">{totalPredicted.toLocaleString()}</strong> <span className="text-slate-500">predicted cases</span></span>
            <span><strong className="text-red-600">{criticalCount}</strong> <span className="text-slate-500">critical</span></span>
            <span><strong className="text-orange-600">{highCount}</strong> <span className="text-slate-500">high-risk</span></span>
          </div>
        </header>

        {/* The Kenya GIS Map — front and center */}
        <section>
          <Suspense fallback={<Loading />}>
            <HomeMap selectedCounty="Garissa" />
          </Suspense>
        </section>

        {/* County grid — all 47 counties */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-600" aria-hidden="true" />
              All 47 Counties
            </h2>
            <Link href="/map" className="inline-flex items-center gap-1 text-sm text-emerald-700 hover:text-emerald-800 font-medium">
              Open full map <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {sortedCounties.map(([county, d]) => (
              <Link
                key={county}
                href={`/map?county=${encodeURIComponent(county)}`}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700">{county}</h3>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border capitalize shrink-0 ${getRiskBadge(d.gam_risk)}`}>
                    {d.gam_risk}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs text-slate-600">
                  <span>Predicted: <strong className="text-brand-700">{d.predicted_cases.toLocaleString()}</strong></span>
                  <span>Stunting: <strong className="text-orange-600">{d.stunting}%</strong></span>
                  <span>Wasting: <strong className="text-red-600">{d.wasting}%</strong></span>
                  <span>Under-5: <strong>{d.population_under_5.toLocaleString()}</strong></span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 pt-6 mt-8 text-center text-sm text-slate-500">
          <p>
            <Link href="/map" className="text-emerald-700 hover:underline">Explore the full interactive map</Link>
            {' · '}
            <Link href="/assess" className="text-emerald-700 hover:underline">Assess a child</Link>
            {' · '}
            <Link href="/about" className="text-emerald-700 hover:underline">About</Link>
          </p>
          <p className="mt-2 text-xs">An open-source Digital Public Good · MIT License · WHO DQR-compliant</p>
        </footer>
      </div>
    </main>
  );
}
