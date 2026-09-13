'use client';

import { useState, useEffect } from 'react';
import { Bell, Mail, BellOff, AlertTriangle, TrendingUp, MapPin } from 'lucide-react';

interface Alert {
  id: string;
  county: string;
  level: 'critical' | 'high' | 'moderate';
  message: string;
  triggered_at: string;
  metric: string;
  value: number;
}

const MOCK_ALERTS: Alert[] = [
  {
    id: 'alert-001',
    county: 'Turkana',
    level: 'critical',
    message: 'GAM prevalence exceeds 30% — IPC Phase 4 (Critical). Immediate therapeutic feeding scale-up required.',
    triggered_at: '2026-09-13T14:00:00Z',
    metric: 'GAM rate',
    value: 30.8,
  },
  {
    id: 'alert-002',
    county: 'Garissa',
    level: 'critical',
    message: 'Predicted acute malnutrition cases rising — drought-driven surge anticipated in next 4 weeks.',
    triggered_at: '2026-09-13T13:30:00Z',
    metric: 'Predicted cases',
    value: 3008,
  },
  {
    id: 'alert-003',
    county: 'Mandera',
    level: 'high',
    message: 'Wasting rate above 7% emergency threshold — IMAM capacity should be reinforced.',
    triggered_at: '2026-09-13T12:15:00Z',
    metric: 'Wasting rate',
    value: 7.5,
  },
  {
    id: 'alert-004',
    county: 'Kilifi',
    level: 'high',
    message: 'Stunting remains highest in Kenya at 37% — sustained IYCF intervention needed.',
    triggered_at: '2026-09-13T10:45:00Z',
    metric: 'Stunting rate',
    value: 37.0,
  },
  {
    id: 'alert-005',
    county: 'Wajir',
    level: 'moderate',
    message: 'Water access dropped below 50% — WASH intervention recommended to prevent infection-driven malnutrition.',
    triggered_at: '2026-09-13T09:20:00Z',
    metric: 'Water access',
    value: 48,
  },
];

const LEVEL_STYLES: Record<Alert['level'], { bg: string; text: string; border: string; icon: string }> = {
  critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: '🔴' },
  high:     { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: '🟠' },
  moderate: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: '🟡' },
};

export default function AlertsClient() {
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [counties, setCounties] = useState<string[]>([]);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushStatus, setPushStatus] = useState<'unsupported' | 'denied' | 'granted' | 'default'>('default');

  // Check browser push notification support
  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPushStatus('unsupported');
    } else {
      setPushStatus(Notification.permission as 'default' | 'granted' | 'denied');
    }
  }, []);

  const enablePush = async () => {
    if (pushStatus === 'unsupported') {
      alert('Push notifications are not supported in this browser.');
      return;
    }
    const permission = await Notification.requestPermission();
    setPushStatus(permission);
    if (permission === 'granted') {
      setPushEnabled(true);
      // Send a test notification
      new Notification('🟢 Alerts enabled', {
        body: 'You will now receive push notifications when county malnutrition risk levels change.',
        icon: '/favicon.ico',
      });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    // In production this would POST to /api/alerts/subscribe
    if (pushEnabled && pushStatus === 'granted') {
      new Notification('📧 Subscription confirmed', {
        body: `You will receive email + push alerts for ${counties.length || 'all'} counties.`,
        icon: '/favicon.ico',
      });
    }
  };

  const toggleCounty = (county: string) => {
    setCounties((prev) =>
      prev.includes(county) ? prev.filter((c) => c !== county) : [...prev, county],
    );
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const criticalCount = alerts.filter((a) => a.level === 'critical').length;
  const highCount = alerts.filter((a) => a.level === 'high').length;

  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-cyan-50/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <header className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mb-4 shadow-lg">
            <Bell className="w-7 h-7 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Malnutrition Alerts</h1>
          <p className="text-slate-600 mt-2">
            Active risk alerts across Kenya. Subscribe to get notified by email or browser push.
          </p>
        </header>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-extrabold text-red-700">{criticalCount}</p>
            <p className="text-xs text-red-600 uppercase tracking-wide">Critical</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-extrabold text-orange-700">{highCount}</p>
            <p className="text-xs text-orange-600 uppercase tracking-wide">High</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-extrabold text-slate-700">{alerts.length}</p>
            <p className="text-xs text-slate-600 uppercase tracking-wide">Total Active</p>
          </div>
        </div>

        {/* Subscription form */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Subscribe to Alerts</h2>
          {subscribed ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center gap-3">
              <Bell className="w-5 h-5 text-emerald-600" aria-hidden="true" />
              <p className="text-sm text-emerald-900">
                <strong>Subscribed!</strong> You&apos;ll receive alerts at <code>{email}</code>
                {counties.length > 0 && ` for ${counties.length} ${counties.length === 1 ? 'county' : 'counties'}`}
                {pushEnabled && ' + browser push'}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Counties to monitor (leave empty for all)</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                  {Object.keys(MOCK_ALERTS.reduce((acc, a) => { acc[a.county] = true; return acc; }, {} as Record<string, boolean>)).sort().map((c) => (
                    <label key={c} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer p-1.5 rounded hover:bg-slate-50">
                      <input type="checkbox" checked={counties.includes(c)} onChange={() => toggleCounty(c)} className="w-3.5 h-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
              {/* Push notification opt-in */}
              <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
                {pushStatus === 'unsupported' ? (
                  <BellOff className="w-5 h-5 text-slate-400" aria-hidden="true" />
                ) : pushStatus === 'granted' ? (
                  <Bell className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                ) : (
                  <Bell className="w-5 h-5 text-slate-400" aria-hidden="true" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">Browser push notifications</p>
                  <p className="text-xs text-slate-500">
                    {pushStatus === 'unsupported' ? 'Not supported in this browser' :
                     pushStatus === 'granted' ? '✅ Enabled — you will receive desktop push alerts' :
                     pushStatus === 'denied' ? '❌ Blocked — enable in your browser settings' :
                     'Get instant desktop alerts when risk levels change'}
                  </p>
                </div>
                {pushStatus !== 'granted' && pushStatus !== 'unsupported' && pushStatus !== 'denied' && (
                  <button type="button" onClick={enablePush} className="text-xs font-medium text-emerald-700 hover:underline px-3 py-1.5 rounded border border-emerald-300 hover:bg-emerald-50">
                    Enable
                  </button>
                )}
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                <Mail className="w-4 h-4" aria-hidden="true" />
                Subscribe
              </button>
            </form>
          )}
        </section>

        {/* Active alerts list */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">Active Alerts</h2>
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" aria-hidden="true" />
                <p className="text-sm text-emerald-900 font-medium">No active alerts — all counties within normal range.</p>
              </div>
            ) : (
              alerts.map((alert) => {
                const s = LEVEL_STYLES[alert.level];
                return (
                  <div key={alert.id} className={`rounded-xl border p-4 ${s.bg} ${s.border}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-xl shrink-0" aria-hidden="true">{s.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.bg} ${s.text} border ${s.border} capitalize`}>
                            {alert.level}
                          </span>
                          <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-900">
                            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                            {alert.county}
                          </span>
                          <span className="text-xs text-slate-500 ml-auto">
                            {new Date(alert.triggered_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 mb-2">{alert.message}</p>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="inline-flex items-center gap-1 text-slate-600">
                            <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                            {alert.metric}: <strong className={s.text}>{alert.value}</strong>
                          </span>
                        </div>
                      </div>
                      <button onClick={() => dismissAlert(alert.id)} className="text-slate-400 hover:text-slate-600 text-xs shrink-0" aria-label={`Dismiss ${alert.county} alert`}>
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
