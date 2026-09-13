'use client';

import { useState } from 'react';
import KenyaMap from '@/components/KenyaMap';
import CountyNarrativePanel from '@/components/CountyNarrativePanel';
import { CountyDetailChart } from '@/components/lazy';
import type { CountySummary, CountySeries } from '@/lib/types';
import type { CountyNarratives } from '@/lib/narratives';
import data from '@/data/malnutrition_data.json';

interface MapClientProps {
  summary: CountySummary[];
  narratives: CountyNarratives;
  initialCounty: string;
}

const countySeries = data.county_series as Record<string, CountySeries>;

export default function MapClient({ summary, narratives, initialCounty }: MapClientProps) {
  const [selectedCounty, setSelectedCounty] = useState(initialCounty);
  const selectedSummary = summary.find((s) => s.county === selectedCounty);
  const selectedNarrative = narratives[selectedCounty];

  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-cyan-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <header className="text-center mb-4">
          <h1 className="text-3xl font-extrabold text-slate-900">Interactive Kenya Malnutrition Map</h1>
          <p className="text-slate-600 mt-2 max-w-2xl mx-auto">
            Click any county to explore the underlying causes, a family&apos;s story, local initiatives,
            and the progress being made. Data is paired with context to answer the &quot;why&quot; behind the numbers.
          </p>
        </header>

        {/* Map */}
        <KenyaMap
          summary={summary}
          selectedCounty={selectedCounty}
          onSelect={setSelectedCounty}
        />

        {/* Two-column: chart + narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: county chart */}
          <div>
            <CountyDetailChart
              series={countySeries[selectedCounty]}
              county={selectedCounty}
            />
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
      </div>
    </main>
  );
}
