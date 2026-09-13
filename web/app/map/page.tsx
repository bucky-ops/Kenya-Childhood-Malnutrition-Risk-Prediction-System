import KenyaMap from '@/components/KenyaMap';
import CountyNarrativePanel from '@/components/CountyNarrativePanel';
import MapClient from '@/components/MapClient';
import data from '@/data/malnutrition_data.json';
import narratives from '@/data/county_narratives.json';
import type { CountyNarratives } from '@/lib/narratives';

export const metadata = {
  title: 'Interactive County Map',
  description: 'Explore malnutrition risk across Kenya with an interactive GIS map, county drivers, family stories, local initiatives, and success stories.',
};

const typedNarratives = narratives as CountyNarratives;

export default function MapPage() {
  return (
    <MapClient
      summary={data.summary}
      narratives={typedNarratives}
      initialCounty={data.counties[0] ?? 'Garissa'}
    />
  );
}
