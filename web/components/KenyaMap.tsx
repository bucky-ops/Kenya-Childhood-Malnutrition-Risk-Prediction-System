'use client';

import { useMemo } from 'react';
import type { CountySummary } from '@/lib/types';
import { getRiskLevel } from '@/lib/types';

/**
 * Simplified geographic positions for the 10 counties on the SVG canvas.
 * These are approximations of the real geographic location of each town/county
 * on a 800x600 canvas representing Kenya's outline.
 *
 * Kenya spans roughly 34°E–42°E longitude and 5°S–5°N latitude.
 * The SVG viewBox is 0 0 800 600.
 */
const COUNTY_POSITIONS: Record<string, { x: number; y: number; r: number }> = {
  // Eastern Kenya (arid)
  Garissa:   { x: 580, y: 280, r: 38 },
  // Central / Nairobi region
  Nairobi:   { x: 460, y: 320, r: 30 },
  Thika:     { x: 450, y: 300, r: 22 }, // just north of Nairobi
  // Coast
  Mombasa:   { x: 680, y: 460, r: 28 },
  Malindi:   { x: 660, y: 420, r: 24 },
  // Western / Rift Valley
  Nakuru:    { x: 380, y: 290, r: 26 },
  Eldoret:   { x: 340, y: 240, r: 24 },
  Kitale:    { x: 290, y: 220, r: 22 },
  // Western
  Kakamega:  { x: 270, y: 270, r: 24 },
  Kisumu:    { x: 310, y: 320, r: 24 }, // on Lake Victoria
};

const RISK_COLORS: Record<string, string> = {
  critical: '#dc2626', // red-600
  high: '#ea580c',     // orange-600
  moderate: '#ca8a04', // yellow-600
  low: '#16a34a',      // green-600
};

const RISK_STROKE: Record<string, string> = {
  critical: '#991b1b',
  high: '#c2410c',
  moderate: '#a16207',
  low: '#15803d',
};

interface KenyaMapProps {
  summary: CountySummary[];
  selectedCounty: string;
  onSelect: (county: string) => void;
}

export default function KenyaMap({ summary, selectedCounty, onSelect }: KenyaMapProps) {
  const summaryMap = useMemo(() => {
    const m = new Map<string, CountySummary>();
    for (const s of summary) m.set(s.county, s);
    return m;
  }, [summary]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">Interactive Kenya Map</h2>
        <span className="text-xs text-slate-500">Click a county to explore →</span>
      </div>

      <div className="relative w-full" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <svg
          viewBox="0 0 800 600"
          className="w-full h-auto"
          role="img"
          aria-label="Map of Kenya showing malnutrition risk by county. Click a county circle to view details."
        >
          {/* Kenya outline (simplified) */}
          <path
            d="M 230 180
               L 290 150
               L 380 140
               L 480 150
               L 580 170
               L 660 200
               L 700 280
               L 720 380
               L 700 460
               L 680 500
               L 620 510
               L 540 490
               L 460 470
               L 380 440
               L 320 400
               L 270 360
               L 230 320
               L 210 260
               Z"
            fill="#f1f5f9"
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Lake Victoria (left edge) */}
          <ellipse cx="200" cy="280" rx="60" ry="80" fill="#bfdbfe" opacity="0.7" />
          <text x="160" y="380" fontSize="11" fill="#1e40af" fontStyle="italic">Lake Victoria</text>

          {/* Indian Ocean (bottom right) */}
          <path
            d="M 700 460 L 760 470 L 770 540 L 700 520 Z"
            fill="#bfdbfe"
            opacity="0.7"
          />
          <text x="720" y="560" fontSize="11" fill="#1e40af" fontStyle="italic">Indian Ocean</text>

          {/* County circles */}
          {Object.entries(COUNTY_POSITIONS).map(([county, pos]) => {
            const data = summaryMap.get(county);
            const level = data ? getRiskLevel(data.predicted_cases) : 'low';
            const color = RISK_COLORS[level];
            const stroke = RISK_STROKE[level];
            const isSelected = county === selectedCounty;
            const radius = pos.r;

            return (
              <g
                key={county}
                onClick={() => onSelect(county)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(county);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`${county} county: ${data?.predicted_cases.toLocaleString() ?? 'no'} predicted cases, risk level ${level}. Press Enter to inspect.`}
                style={{ cursor: 'pointer' }}
                className="focus:outline-none"
              >
                {/* Selection ring */}
                {isSelected && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={radius + 6}
                    fill="none"
                    stroke="#059669"
                    strokeWidth="3"
                    strokeDasharray="4 3"
                    className="animate-pulse"
                  />
                )}
                {/* County circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={radius}
                  fill={color}
                  fillOpacity={isSelected ? 0.95 : 0.7}
                  stroke={stroke}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  className="transition-all hover:fill-opacity-95"
                />
                {/* County label */}
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill="white"
                  className="pointer-events-none select-none"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  {county}
                </text>
                {/* Predicted cases count (below the circle) */}
                {data && (
                  <text
                    x={pos.x}
                    y={pos.y + radius + 14}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#475569"
                    className="pointer-events-none select-none"
                  >
                    {data.predicted_cases.toLocaleString()}
                  </text>
                )}
              </g>
            );
          })}

          {/* Legend */}
          <g transform="translate(40, 510)">
            <text x="0" y="0" fontSize="12" fontWeight="700" fill="#334155">Risk Level</text>
            {[
              { label: 'Critical (>5,000)', color: RISK_COLORS.critical },
              { label: 'High (2,000–5,000)', color: RISK_COLORS.high },
              { label: 'Moderate (500–2,000)', color: RISK_COLORS.moderate },
              { label: 'Low (<500)', color: RISK_COLORS.low },
            ].map((item, i) => (
              <g key={item.label} transform={`translate(0, ${20 + i * 18})`}>
                <circle cx="8" cy="0" r="6" fill={item.color} />
                <text x="22" y="4" fontSize="10" fill="#475569">{item.label}</text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
