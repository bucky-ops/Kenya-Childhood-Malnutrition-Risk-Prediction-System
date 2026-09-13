import { Suspense } from 'react';
import Dashboard from '@/components/Dashboard';
import data from '@/data/malnutrition_data.json';
import Loading from './loading';

export default function HomePage() {
  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-cyan-50/30">
      <Suspense fallback={<Loading />}>
        <Dashboard data={data} />
      </Suspense>
    </main>
  );
}
