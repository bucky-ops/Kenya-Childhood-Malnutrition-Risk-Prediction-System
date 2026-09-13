import { clsx } from 'clsx';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext?: string;
  color: 'brand' | 'emerald' | 'accent' | 'savanna';
}

const colorMap = {
  brand: { bg: 'bg-brand-50', icon: 'bg-brand-500', text: 'text-brand-700', value: 'text-brand-900' },
  emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-500', text: 'text-emerald-700', value: 'text-emerald-900' },
  accent: { bg: 'bg-accent-50', icon: 'bg-accent-500', text: 'text-accent-700', value: 'text-accent-700' },
  savanna: { bg: 'bg-savanna-50', icon: 'bg-savanna-500', text: 'text-savanna-700', value: 'text-savanna-700' },
};

export default function StatCard({ icon, label, value, subtext, color }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className={clsx(
      'animate-fade-in-up rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow',
      'flex items-start justify-between gap-3',
    )}>
      <div className="min-w-0">
        <p className={clsx('text-xs font-semibold uppercase tracking-wide', c.text)}>{label}</p>
        <p className={clsx('mt-1 text-3xl font-extrabold', c.value)}>{value}</p>
        {subtext && (
          <p className="mt-1 text-xs text-slate-500 truncate">{subtext}</p>
        )}
      </div>
      <div className={clsx('rounded-xl p-2.5 text-white shrink-0', c.icon)}>
        {icon}
      </div>
    </div>
  );
}
