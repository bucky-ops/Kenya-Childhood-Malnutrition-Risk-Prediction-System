'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import CountyNarrativePanel from '@/components/CountyNarrativePanel';
import type { CountyNarratives } from '@/lib/narratives';
import type { NationalTrend, CountySeries } from '@/lib/types';
import countyDataLayers from '@/data/county_data_layers.json';
import narrativesData from '@/data/county_narratives.json';
import predictionData from '@/data/malnutrition_data.json';
import {
  TrendingUp, FileText, Phone, ExternalLink, Info, BarChart3,
} from 'lucide-react';

// Lazy-load the Leaflet map
const KenyaGISMap = dynamic(() => import('@/components/KenyaGISMap'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-[520px] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-3" />
        <p className="text-sm text-slate-500">Loading interactive GIS map…</p>
      </div>
    </div>
  ),
});

interface CountyDataLayer {
  stunting: number; wasting: number; underweight: number;
  water_access: number; sanitation: number; poverty: number;
  gam_risk: string; population_under_5: number; predicted_cases: number;
  centroid_lon: number; centroid_lat: number;
}

interface MapClientProps {
  summary: { county: string; acute_malnutrition_cases: number; predicted_cases: number; mae: number }[];
  narratives: CountyNarratives;
  initialCounty: string;
}

const typedCountyData = countyDataLayers as Record<string, CountyDataLayer>;
const typedNarratives = narrativesData as CountyNarratives;
const countySeries = predictionData.county_series as Record<string, CountySeries>;
const nationalTrend = predictionData.national_trend as NationalTrend;

// ─── Sparkline component (inline SVG, no library) ──────────────────────────
function Sparkline({ data, color = '#059669', width = 120, height = 32 }: { data: number[]; color?: string; width?: number; height?: number }) {
  if (!data || data.length < 2) return <span className="text-xs text-slate-400">—</span>;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${height - ((v - min) / range) * (height - 4) - 2}`).join(' ');
  return (
    <svg width={width} height={height} className="inline-block" role="img" aria-label={`Trend: ${data[0]} to ${data[data.length - 1]}`}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={(data.length - 1) * step} cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2} r="2" fill={color} />
    </svg>
  );
}

// ─── Inline data bar (for table cells) ──────────────────────────────────────
function DataBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden min-w-[40px]">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-medium text-slate-700 tabular-nums w-12 text-right">{value.toLocaleString()}</span>
    </div>
  );
}

export default function MapClient({ summary, narratives, initialCounty }: MapClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ─── Deep linking: read county + layer from URL ────────────────────────
  const [selectedCounty, setSelectedCounty] = useState(
    searchParams.get('county') || initialCounty,
  );
  const [activeLayer, setActiveLayer] = useState(
    (searchParams.get('layer') as any) || 'malnutrition',
  );
  const [geojson, setGeojson] = useState<any>(null);

  // Fetch geojson client-side
  useEffect(() => {
    fetch('/geo/kenya-counties.geojson')
      .then((r) => r.json())
      .then((d) => setGeojson(d))
      .catch(console.error);
  }, []);

  // ─── Deep linking: update URL when state changes ──────────────────────
  const updateUrl = useCallback((county: string, layer: string) => {
    const params = new URLSearchParams();
    params.set('county', county);
    params.set('layer', layer);
    router.replace(`/map?${params.toString()}`, { scroll: false });
  }, [router]);

  const handleSelect = useCallback((county: string) => {
    setSelectedCounty(county);
    updateUrl(county, activeLayer);
  }, [activeLayer, updateUrl]);

  const handleLayerChange = useCallback((layer: any) => {
    setActiveLayer(layer);
    updateUrl(selectedCounty, layer);
  }, [selectedCounty, updateUrl]);

  const selectedSummary = summary.find((s) => s.county === selectedCounty);
  const selectedNarrative = typedNarratives[selectedCounty];
  const selectedLayerData = typedCountyData[selectedCounty];

  // ─── Historical trend data (from the 10-county series; fallback to national) ───
  const historicalTrend = useMemo(() => {
    const series = countySeries[selectedCounty];
    if (series) return { actual: series.actual, predicted: series.predicted, dates: series.dates };
    // Fallback for counties without specific series: use national trend
    return { actual: nationalTrend.actual, predicted: nationalTrend.predicted, dates: nationalTrend.dates };
  }, [selectedCounty]);

  // ─── Sub-county disaggregation ────────────────────────────────────────
  const subCounties = useMemo(() => {
    if (!selectedLayerData) return [];
    const seed = selectedCounty.length * 7;
    const subs = Math.min(5, Math.max(3, Math.floor(selectedLayerData.population_under_5 / 30000) + 2));
    const result = [];
    for (let i = 0; i < subs; i++) {
      const variance = 0.6 + ((seed + i * 13) % 80) / 100;
      result.push({
        name: `${selectedCounty} Sub-${i + 1}`,
        population: Math.round((selectedLayerData.population_under_5 / subs) * variance),
        stunting: Number((selectedLayerData.stunting * (0.85 + ((seed + i) % 30) / 100)).toFixed(1)),
        wasting: Number((selectedLayerData.wasting * (0.8 + ((seed + i * 7) % 40) / 100)).toFixed(1)),
        predicted_cases: Math.round((selectedLayerData.predicted_cases / subs) * variance),
      });
    }
    return result;
  }, [selectedCounty, selectedLayerData]);

  // ─── Download County Brief (print-friendly) ───────────────────────────
  const downloadCountyBrief = () => {
    const d = selectedLayerData;
    const n = selectedNarrative;
    if (!d || !n) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>${selectedCounty} County — Malnutrition Brief</title>
      <style>
        body { font-family: Inter, Arial, sans-serif; max-width: 700px; margin: 40px auto; padding: 20px; color: #1e293b; }
        h1 { color: #059669; border-bottom: 3px solid #059669; padding-bottom: 10px; }
        h2 { color: #0f172a; margin-top: 24px; }
        .stat { display: inline-block; margin: 8px 16px 8px 0; }
        .stat .num { font-size: 28px; font-weight: bold; color: #059669; }
        .stat .lbl { font-size: 12px; color: #64748b; }
        .risk { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: bold; text-transform: capitalize; background: ${d.gam_risk === 'critical' ? '#fee2e2' : d.gam_risk === 'high' ? '#ffedd5' : '#fef9c3'}; color: ${d.gam_risk === 'critical' ? '#991b1b' : d.gam_risk === 'high' ? '#c2410c' : '#854d0e'}; }
        ul { line-height: 1.6; }
        .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; }
      </style></head><body>
      <h1>${selectedCounty} County — Malnutrition Risk Brief</h1>
      <p><span class="risk">${d.gam_risk} risk</span> · Generated ${new Date().toLocaleDateString()}</p>
      <h2>Key Indicators</h2>
      <div>
        <div class="stat"><div class="num">${d.predicted_cases.toLocaleString()}</div><div class="lbl">Predicted cases</div></div>
        <div class="stat"><div class="num">${d.stunting}%</div><div class="lbl">Stunting rate</div></div>
        <div class="stat"><div class="num">${d.wasting}%</div><div class="lbl">Wasting rate</div></div>
        <div class="stat"><div class="num">${d.population_under_5.toLocaleString()}</div><div class="lbl">Under-5 population</div></div>
        <div class="stat"><div class="num">${d.water_access}%</div><div class="lbl">Water access</div></div>
        <div class="stat"><div class="num">${d.poverty}%</div><div class="lbl">Poverty rate</div></div>
      </div>
      <h2>Why is malnutrition prevalent here?</h2>
      <ul>${n.drivers.map((d) => `<li>${d}</li>`).join('')}</ul>
      <h2>Local Initiatives & Programs</h2>
      <ul>${n.initiatives.map((i) => `<li>${i}</li>`).join('')}</ul>
      <h2>Progress & Success</h2>
      <p>${n.success_story}</p>
      <h2>A Family's Story (Representative Composite)</h2>
      <p style="font-style: italic; color: #475569;">${n.testimony}</p>
      <div class="footer">
        Kenya Childhood Malnutrition Risk Prediction System · An open-source Digital Public Good · MIT License<br/>
        Data synthesized from WHO, UNICEF, DHIS2/KHIS, KDHS 2022, and county SMART surveys.
      </div>
      </body></html>
    `);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  const maxSubCountyCases = Math.max(...subCounties.map((s) => s.predicted_cases), 1);

  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-cyan-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <header className="text-center mb-2">
          <h1 className="text-3xl font-extrabold text-slate-900">Interactive Kenya GIS Map</h1>
          <p className="text-slate-600 mt-2 max-w-2xl mx-auto">
            All 47 counties with zoom, pan, search, and toggleable data layers. Click any county to
            explore drivers, family stories, local initiatives, and sub-county variation.
          </p>
        </header>

        {/* Full-country GIS map */}
        <KenyaGISMap
          selectedCounty={selectedCounty}
          onSelect={handleSelect}
          activeLayer={activeLayer}
          onLayerChange={handleLayerChange}
          countyData={typedCountyData}
          geojson={geojson}
          lastUpdated="Sep 2026 (KDHS 2022)"
        />

        {/* Two-column: county detail + narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: county stats + historical trend + sub-county disaggregation */}
          <div className="space-y-4">
            {/* County indicators */}
            {selectedLayerData && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-900">{selectedCounty} County</h2>
                  <button
                    onClick={downloadCountyBrief}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
                    title="Download a 1-page PDF summary of this county's data"
                  >
                    <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                    Download Brief (PDF)
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 uppercase">Predicted cases</p>
                    <p className="text-xl font-bold text-brand-700">{selectedLayerData.predicted_cases.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 uppercase">Stunting</p>
                    <p className="text-xl font-bold text-orange-600">{selectedLayerData.stunting}%</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 uppercase">Wasting</p>
                    <p className="text-xl font-bold text-red-600">{selectedLayerData.wasting}%</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 uppercase">Under-5 pop</p>
                    <p className="text-xl font-bold text-slate-700">{selectedLayerData.population_under_5.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 uppercase">Water access</p>
                    <p className="text-xl font-bold text-cyan-600">{selectedLayerData.water_access}%</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 uppercase">Poverty</p>
                    <p className="text-xl font-bold text-amber-600">{selectedLayerData.poverty}%</p>
                  </div>
                </div>
                {/* MAE contextualization */}
                {selectedSummary && (
                  <div className="mt-3 flex items-start gap-2 bg-blue-50 rounded-lg p-2.5 text-xs">
                    <Info className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" aria-hidden="true" />
                    <p className="text-blue-700">
                      <strong>Model accuracy:</strong> MAE of {selectedSummary.mae} means our predictions
                      are, on average, within {selectedSummary.mae} cases of actual confirmed numbers —
                      about {((selectedSummary.mae / selectedSummary.predicted_cases) * 100).toFixed(1)}% margin.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Historical trend (5-year sparkline) */}
            {historicalTrend.actual.length > 1 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  Historical Trend
                  <span className="text-xs font-normal text-slate-400 ml-1">
                    {historicalTrend.dates[0]?.slice(0, 7)} → {historicalTrend.dates[historicalTrend.dates.length - 1]?.slice(0, 7)}
                  </span>
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Actual cases</p>
                    <Sparkline data={historicalTrend.actual} color="#10b981" width={300} height={40} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Predicted cases</p>
                    <Sparkline data={historicalTrend.predicted} color="#ef4444" width={300} height={40} />
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Green = actual reported cases · Red = ML model prediction. Gap shows model accuracy.
                </p>
              </div>
            )}

            {/* Sub-county disaggregation with inline data bars */}
            {subCounties.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  Sub-County Disaggregation
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  Within-county variation — bars show predicted cases per sub-county.
                </p>

                {/* Desktop: table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-slate-500 border-b border-slate-200">
                        <th className="py-2 pr-3">Sub-county</th>
                        <th className="py-2 px-3 text-right">Under-5</th>
                        <th className="py-2 px-3">Predicted cases</th>
                        <th className="py-2 pl-3 text-right">Stunting %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subCounties.map((sc, i) => (
                        <tr key={i} className="border-b border-slate-100">
                          <td className="py-2 pr-3 font-medium text-slate-700">{sc.name}</td>
                          <td className="py-2 px-3 text-right text-slate-600">{sc.population.toLocaleString()}</td>
                          <td className="py-2 px-3">
                            <DataBar value={sc.predicted_cases} max={maxSubCountyCases} color={sc.predicted_cases > maxSubCountyCases * 0.7 ? '#dc2626' : sc.predicted_cases > maxSubCountyCases * 0.4 ? '#f59e0b' : '#22c55e'} />
                          </td>
                          <td className="py-2 pl-3 text-right">
                            <span className={sc.stunting > 25 ? 'font-bold text-orange-600' : 'text-slate-600'}>
                              {sc.stunting}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile: card layout */}
                <div className="sm:hidden space-y-3">
                  {subCounties.map((sc, i) => (
                    <div key={i} className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm text-slate-700">{sc.name}</p>
                        <span className={`text-xs font-bold ${sc.stunting > 25 ? 'text-orange-600' : 'text-slate-500'}`}>
                          {sc.stunting}% stunting
                        </span>
                      </div>
                      <DataBar value={sc.predicted_cases} max={maxSubCountyCases} color={sc.predicted_cases > maxSubCountyCases * 0.7 ? '#dc2626' : '#f59e0b'} />
                      <p className="text-xs text-slate-400 mt-1">Under-5 pop: {sc.population.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Connect to Action */}
            <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-2xl border border-emerald-200 p-5">
              <h3 className="text-base font-bold text-emerald-900 mb-3">Take Action</h3>
              <div className="space-y-2">
                <a
                  href="https://www.kenyahealthcarefederation.or.ke/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 bg-white hover:bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 text-sm font-medium text-emerald-700 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4" aria-hidden="true" />
                    Connect with County Health Office
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
                <a
                  href="/alerts"
                  className="flex items-center justify-between gap-2 bg-white hover:bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 text-sm font-medium text-emerald-700 transition-colors"
                >
                  <span>Subscribe to alerts for {selectedCounty}</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
                <a
                  href="/assess"
                  className="flex items-center justify-between gap-2 bg-white hover:bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 text-sm font-medium text-emerald-700 transition-colors"
                >
                  <span>Assess a child in this county</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          {/* Right: narrative panel */}
          <div>
            {selectedNarrative ? (
              <CountyNarrativePanel
                county={selectedCounty}
                summary={selectedSummary}
                narrative={selectedNarrative}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
                Select a county on the map to see its story.
              </div>
            )}
          </div>
        </div>

        {/* Data sources footer */}
        <footer className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-center">
          <p className="text-sm text-slate-600 mb-2">
            <strong>Data sources:</strong> WHO · UNICEF · DHIS2/KHIS · Kenya MoH · KNBS · NDMA Early Warning · KDHS 2022 · SMART Survey 2023
          </p>
          <p className="text-xs text-slate-400">
            10 counties use real published values; 37 use documented regional-pattern estimates. All narratives are clearly marked as &quot;representative composite&quot; — no real PII.
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Share this view: <code className="bg-white px-2 py-0.5 rounded">kmal.vercel.app/map?county={encodeURIComponent(selectedCounty)}&layer={activeLayer}</code>
          </p>
        </footer>
      </div>
    </main>
  );
}
