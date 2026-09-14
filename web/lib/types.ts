/**
 * Shared domain types for the malnutrition dashboard + risk helpers.
 *
 * The shapes mirror the committed datasets in `web/data/`
 * (`malnutrition_data.json`, `county_narratives.json`) so JSON imports can
 * be typed directly with `as` casts without runtime transformation.
 */

// ─── Core data shapes ──────────────────────────────────────────────────────

/** One summary row per county in the prediction dataset. */
export interface CountySummary {
  county: string;
  acute_malnutrition_cases: number;
  predicted_cases: number;
  /** Mean absolute error of the model for this county. */
  mae: number;
}

/** Monthly actual-vs-predicted case counts. */
export interface TimeSeries {
  dates: string[];
  actual: number[];
  predicted: number[];
}

export type NationalTrend = TimeSeries;
export type CountySeries = TimeSeries;

/** One data-quality finding from the WHO DQR-style validation pass. */
export interface ValidationIssue {
  check: string;
  issue: string;
}

/** Full dataset contract for `web/data/malnutrition_data.json`. */
export interface MalnutritionData {
  summary: CountySummary[];
  national_trend: NationalTrend;
  county_series: Record<string, CountySeries>;
  counties: string[];
  validation_issues: ValidationIssue[];
  generated_at: string;
  total_records: number;
  date_range: { start: string; end: string };
}

// ─── Risk classification ───────────────────────────────────────────────────

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

/**
 * Classify a county's predicted case count.
 * Thresholds intentionally match the `/api/predict` route so the map,
 * tables and API always agree on severity.
 */
export function getRiskLevel(predictedCases: number): RiskLevel {
  if (predictedCases > 5000) return 'critical';
  if (predictedCases > 2000) return 'high';
  if (predictedCases > 500) return 'moderate';
  return 'low';
}

/** Tailwind classes for the risk badge (border + background + text). */
export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'critical':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'high':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'moderate':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    default:
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
}

/** Tailwind classes for the small status dot inside a risk badge. */
export function getRiskDot(level: RiskLevel): string {
  switch (level) {
    case 'critical':
      return 'bg-red-500';
    case 'high':
      return 'bg-orange-500';
    case 'moderate':
      return 'bg-amber-500';
    default:
      return 'bg-emerald-500';
  }
}
