/**
 * Loading fallback shown while the dashboard data is being prepared.
 * Matches the dashboard's card layout to reduce Cumulative Layout Shift.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-cyan-50/30">
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-cyan-600 h-24 animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse"
            >
              <div className="h-3 w-24 bg-slate-200 rounded mb-3" />
              <div className="h-8 w-20 bg-slate-200 rounded mb-2" />
              <div className="h-2 w-32 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 rounded-2xl border border-slate-200 bg-white animate-pulse" />
          <div className="lg:col-span-1 h-80 rounded-2xl border border-slate-200 bg-white animate-pulse" />
        </div>
        <div className="h-96 rounded-2xl border border-slate-200 bg-white animate-pulse" />
      </div>
    </div>
  );
}
