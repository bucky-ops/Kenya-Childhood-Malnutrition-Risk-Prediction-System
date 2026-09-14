/**
 * Input & output validation for the prediction API (`/api/predict`).
 *
 * Every request body is parsed against `PredictionRequestSchema` before it
 * reaches the heuristic predictor, closing the audit finding:
 *   "Insufficient input validation against malformed parameters".
 *
 * Field semantics (mirrors the predictor math in the route handler):
 *   - Prevalence rates are PROPORTIONS in [0, 1]  (0.26 = 26% stunting)
 *   - WASH coverage inputs are PERCENTAGES in [0, 100]
 *   - `population_under_5` is a non-negative whole number
 */
import { z } from 'zod';

export const PredictionRequestSchema = z.object({
  /** County name (any of Kenya's 47 counties). */
  county: z
    .string()
    .trim()
    .min(1, 'County name is required.')
    .max(80, 'County name is too long.'),
  /** Children under 5 years in the county. */
  population_under_5: z
    .number()
    .int('population_under_5 must be a whole number.')
    .min(0, 'population_under_5 cannot be negative.')
    .max(5_000_000, 'population_under_5 exceeds any plausible county value.'),
  /** Prevalence proportions in [0, 1]. */
  stunting_rate: z
    .number()
    .min(0, 'stunting_rate must be a proportion between 0 and 1.')
    .max(1, 'stunting_rate must be a proportion between 0 and 1.'),
  wasting_rate: z
    .number()
    .min(0, 'wasting_rate must be a proportion between 0 and 1.')
    .max(1, 'wasting_rate must be a proportion between 0 and 1.'),
  underweight_rate: z
    .number()
    .min(0, 'underweight_rate must be a proportion between 0 and 1.')
    .max(1, 'underweight_rate must be a proportion between 0 and 1.'),
  /** Proportion of infants exclusively breastfed, in [0, 1]. */
  exclusive_breastfeeding_rate: z
    .number()
    .min(0, 'exclusive_breastfeeding_rate must be a proportion between 0 and 1.')
    .max(1, 'exclusive_breastfeeding_rate must be a proportion between 0 and 1.'),
  /** Household water access coverage, in percent [0, 100]. */
  water_access_pct: z
    .number()
    .min(0, 'water_access_pct must be a percentage between 0 and 100.')
    .max(100, 'water_access_pct must be a percentage between 0 and 100.'),
  /** Improved sanitation coverage, in percent [0, 100]. */
  sanitation_access_pct: z
    .number()
    .min(0, 'sanitation_access_pct must be a percentage between 0 and 100.')
    .max(100, 'sanitation_access_pct must be a percentage between 0 and 100.'),
});

export type PredictionRequest = z.infer<typeof PredictionRequestSchema>;

/** Severity buckets returned by the prediction API. */
export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

/** Response contract for `/api/predict`. */
export interface PredictionResponse {
  county: string;
  predicted_cases: number;
  risk_level: RiskLevel;
  confidence_lower: number;
  confidence_upper: number;
  model_version: string;
  generated_at: string;
}

/**
 * Validate an unknown request body.
 * Throws a ZodError (with `.issues`) when the payload is malformed —
 * the route handler converts issues into structured field-level errors.
 */
export function validatePredictionRequest(body: unknown): PredictionRequest {
  return PredictionRequestSchema.parse(body);
}
