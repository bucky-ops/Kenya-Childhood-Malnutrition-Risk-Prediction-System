import { Suspense } from 'react';
import MapClient from '@/components/MapClient';
import data from '@/data/malnutrition_data.json';
import narratives from '@/data/county_narratives.json';
import type { CountyNarratives } from '@/lib/narratives';

export const metadata = {
  title: 'Interactive Kenya GIS Map',
  description: 'Full-country interactive GIS map of Kenya showing malnutrition, stunting, wasting, WASH access, and poverty data across all 47 counties with zoom, pan, search, deep linking, and sub-county disaggregation.',
};

const typedNarratives = narratives as CountyNarratives;

export default function MapPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-3" />
          <p className="text-sm text-slate-500">Loading interactive map…</p>
        </div>
      </div>
    }>
      <MapClient
        summary={data.summary}
        narratives={typedNarratives}
        initialCounty="Garissa"
      />
    </Suspense>
  );
}
