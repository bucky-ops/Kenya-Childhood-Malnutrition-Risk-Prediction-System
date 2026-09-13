'use client';

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

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
  return (
    <KenyaGISMap
      selectedCounty={selectedCounty}
      onSelect={(c: string) => router.push(`/map?county=${encodeURIComponent(c)}`)}
    />
  );
}
