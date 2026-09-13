import Link from 'next/link';
import { Home, HeartPulse } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50/30 to-cyan-50/30 px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg">
          <HeartPulse className="w-10 h-10 text-white" aria-hidden="true" />
        </div>
        <p className="text-7xl font-extrabold text-slate-900 mb-2">404</p>
        <h1 className="text-2xl font-bold text-slate-700 mb-3">
          Page not found
        </h1>
        <p className="text-slate-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          The dashboard home page has all the malnutrition predictions.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <Home className="w-4 h-4" aria-hidden="true" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
