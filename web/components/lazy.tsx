/**
 * Lazy-loaded chart components.
 *
 * Recharts is the heaviest dependency in the bundle (~80 kB gzipped).
 * By dynamically importing each chart with `next/dynamic` and a lightweight
 * skeleton fallback, we defer loading the chart library until the dashboard
 * is actually rendered — improving First Contentful Paint (FCP) and
 * Largest Contentful Paint (LCP) Core Web Vitals.
 *
 * Usage (replaces direct imports):
 *   import { NationalTrendChart, CountyBarChart } from '@/components/lazy';
 */
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import type { CountySummary, NationalTrend, CountySeries } from '@/lib/types';

/** Lightweight inline skeleton shown while the chart module loads. */
function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm animate-pulse"
      style={{ height }}
      aria-hidden="true"
      aria-label="Loading chart…"
    >
      <div className="h-4 w-48 bg-slate-200 rounded mb-4" />
      <div className="h-full w-full bg-slate-100 rounded" />
    </div>
  );
}

export const NationalTrendChart: ComponentType<{ trend: NationalTrend }> = dynamic(
  () => import('./NationalTrendChart'),
  {
    loading: () => <ChartSkeleton height={300} />,
    ssr: true, // keep SSR for SEO + first paint
  },
) as ComponentType<{ trend: NationalTrend }>;

export const CountyBarChart: ComponentType<{ summary: CountySummary[] }> = dynamic(
  () => import('./CountyBarChart'),
  {
    loading: () => <ChartSkeleton height={300} />,
    ssr: true,
  },
) as ComponentType<{ summary: CountySummary[] }>;

export const CountyDetailChart: ComponentType<{ series: CountySeries; county: string }> = dynamic(
  () => import('./CountyDetailChart'),
  {
    loading: () => <ChartSkeleton height={320} />,
    ssr: true,
  },
) as ComponentType<{ series: CountySeries; county: string }>;
