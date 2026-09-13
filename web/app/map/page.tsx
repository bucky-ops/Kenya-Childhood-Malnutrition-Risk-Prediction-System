import MapClient from '@/components/MapClient';
import data from '@/data/malnutrition_data.json';
import narratives from '@/data/county_narratives.json';
import type { CountyNarratives } from '@/lib/narratives';

export const metadata = {
  title: 'Interactive Kenya GIS Map',
  description: 'Full-country interactive GIS map of Kenya showing malnutrition, stunting, wasting, WASH access, and poverty data across all 47 counties with zoom, pan, and sub-county disaggregation.',
};

const typedNarratives = narratives as CountyNarratives;

export default function MapPage() {
  // Use Garissa (a critical-risk county) as the initial selection
  return (
    <MapClient
      summary={data.summary}
      narratives={typedNarratives}
      initialCounty="Garissa"
    />
  );
}
