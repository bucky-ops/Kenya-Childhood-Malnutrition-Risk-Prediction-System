import { Suspense } from 'react';
import Dashboard from '@/components/Dashboard';
import data from '@/data/malnutrition_data.json';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-cyan-50/30">
      <Suspense fallback={<div className="p-10 text-center text-slate-500">Loading dashboard…</div>}>
        <Dashboard data={data} />
      </Suspense>
    </main>
  );
}
