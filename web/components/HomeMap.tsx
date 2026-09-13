'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import countyDataLayers from '@/data/county_data_layers.json';

interface CountyData {
  stunting: number; wasting: number; underweight: number;
  water_access: number; sanitation: number; poverty: number;
  gam_risk: string; population_under_5: number; predicted_cases: number;
  centroid_lon: number; centroid_lat: number;
}

// Lazy-load the heavy Leaflet map (client-only, no SSR)
const KenyaGISMap = dynamic(() => import('@/components/KenyaGISMap'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-[560px] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-3" />
        <p className="text-sm text-slate-500">Loading Kenya map…</p>
      </div>
    </div>
  ),
});

export default function HomeMap({ selectedCounty }: { selectedCounty: string }) {
  const router = useRouter();
  const [activeLayer, setActiveLayer] = useState<'malnutrition' | 'wasting' | 'stunting' | 'wash' | 'poverty'>('malnutrition');
  const [geojson, setGeojson] = useState<any>(null);

  useEffect(() => {
    fetch('/geo/kenya-counties.geojson')
      .then((r) => r.json())
      .then((d) => setGeojson(d))
      .catch(console.error);
  }, []);

  return (
    <KenyaGISMap
      selectedCounty={selectedCounty}
      onSelect={(c: string) => router.push(`/map?county=${encodeURIComponent(c)}`)}
      activeLayer={activeLayer}
      onLayerChange={setActiveLayer}
      countyData={countyDataLayers as Record<string, CountyData>}
      geojson={geojson}
      lastUpdated="Sep 2026"
    />
  );
}
