'use client';

import {
  Users, HeartPulse, Sprout, TrendingUp, ExternalLink,
} from 'lucide-react';
import type { CountySummary } from '@/lib/types';
import { getRiskLevel, getRiskDot } from '@/lib/types';
import type { CountyNarrative } from '@/lib/narratives';

// Map of known organization names to their Kenya-specific URLs
const ORG_LINKS: Record<string, string> = {
  'UNICEF': 'https://www.unicef.org/kenya/nutrition',
  'Save the Children': 'https://www.savethechildren.org/where-we-work/africa/kenya',
  'NDMA': 'https://www.ndma.go.ke/',
  'World Vision': 'https://www.worldvision.org/where-we-work/kenya',
  'AMPATH': 'https://www.ampathkenya.org/',
  'USAID': 'https://www.usaid.gov/kenya/global-health/health',
  'WFP': 'https://www.w3.org/WFP/kenya',
  'WHO': 'https://www.afro.who.int/countries/kenya',
  'WHO-AFRO': 'https://www.afro.who.int/countries/kenya',
  'Kenya Red Cross': 'https://www.redcross.or.ke/',
  'AMREF': 'https://amref.org/kenya/',
  'AMREF Flying Doctors': 'https://amref.org/kenya/',
  'Concern Worldwide': 'https://www.concern.net/where-we-work/kenya',
  'Nutrition International': 'https://www.nutritionintl.org/where-we-work/africa/kenya/',
  'Caritas': 'https://www.caritas.org/where-we-work/africa/kenya/',
  'MSF': 'https://www.msf.org/kenya',
  'CDC': 'https://www.cdc.gov/globalhealth/countries/kenya/default.htm',
  'CDC/PEPFAR': 'https://www.cdc.gov/globalhealth/countries/kenya/default.htm',
  'PEPFAR': 'https://www.state.gov/pepfar/',
  'WiRED International': 'https://wiredinternational.org/',
  'GAIN': 'https://gainhealth.org/countries/kenya',
  'KHIS': 'https://hiskenya.org/',
  'Jameel Observatory': 'https://www.jameelobservatory.org/',
};

// Parse an initiative string and return clickable org links
function renderInitiative(text: string, idx: number) {
  // Find org names in the text and make them clickable
  const parts: { text: string; link?: string }[] = [];
  let remaining = text;
  let found = true;

  while (found && remaining.length > 0) {
    found = false;
    for (const [org, url] of Object.entries(ORG_LINKS)) {
      const idx = remaining.indexOf(org);
      if (idx >= 0) {
        if (idx > 0) parts.push({ text: remaining.slice(0, idx) });
        parts.push({ text: org, link: url });
        remaining = remaining.slice(idx + org.length);
        found = true;
        break;
      }
    }
  }
  if (remaining.length > 0) parts.push({ text: remaining });

  return parts.map((part, i) => {
    if (part.link) {
      return (
        <a
          key={`${idx}-${i}`}
          href={part.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-700 hover:text-emerald-800 underline decoration-emerald-300 hover:decoration-emerald-500 inline-flex items-center gap-0.5"
        >
          {part.text}
          <ExternalLink className="w-3 h-3 inline" aria-hidden="true" />
        </a>
      );
    }
    return <span key={`${idx}-${i}`}>{part.text}</span>;
  });
}

interface CountyNarrativePanelProps {
  county: string;
  summary?: CountySummary;
  narrative: CountyNarrative;
}

export default function CountyNarrativePanel({ county, summary, narrative }: CountyNarrativePanelProps) {
  const level = summary ? getRiskLevel(summary.predicted_cases) : 'low';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-6 py-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-2xl font-bold">{county} County</h2>
          {summary && (
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
              <span className={`w-2 h-2 rounded-full ${getRiskDot(level)}`} />
              {level} risk · {summary.predicted_cases.toLocaleString()} predicted cases
            </span>
          )}
        </div>
        {summary && (
          <div className="flex gap-6 mt-3 text-sm">
            <span><strong>{summary.acute_malnutrition_cases.toLocaleString()}</strong> actual cases</span>
            <span><strong>{summary.mae}</strong> MAE</span>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Drivers — with visual anchor icon */}
        <section>
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-3">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50">
              <Users className="w-4 h-4 text-blue-600" aria-hidden="true" />
            </span>
            Why is malnutrition prevalent here?
          </h3>
          <ul className="space-y-2">
            {narrative.drivers.map((d, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-700">
                <span className="text-brand-500 mt-0.5 shrink-0">▸</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Testimony — with visual anchor icon */}
        <section className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4">
          <h3 className="flex items-center gap-2 text-base font-bold text-amber-900 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-100">
              <HeartPulse className="w-4 h-4 text-amber-600" aria-hidden="true" />
            </span>
            A Family&apos;s Story
          </h3>
          <p className="text-sm text-amber-900 italic leading-relaxed">{narrative.testimony}</p>
        </section>

        {/* Initiatives — with linkable org names + visual anchor */}
        <section>
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-3">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-50">
              <Sprout className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            </span>
            Local Initiatives & Programs
          </h3>
          <ul className="space-y-2">
            {narrative.initiatives.map((init, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-700">
                <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                <span>{renderInitiative(init, i)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-slate-400">
            Click organization names to visit their Kenya programs →
          </p>
        </section>

        {/* Success story — with visual anchor */}
        <section className="bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg p-4">
          <h3 className="flex items-center gap-2 text-base font-bold text-emerald-900 mb-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100">
              <TrendingUp className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            </span>
            Progress & Success
          </h3>
          <p className="text-sm text-emerald-900 leading-relaxed">{narrative.success_story}</p>
        </section>
      </div>
    </div>
  );
}
