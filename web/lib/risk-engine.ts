/**
 * Transparent heuristic risk engine for the child nutrition assessment tool.
 *
 * This is a SCREENING heuristic, not a clinical diagnosis. Z-scores are
 * approximated from the WHO 2006 Child Growth Standards using simplified
 * median/SD interpolation tables — accurate to roughly ±0.25 SD, which is
 * sufficient for the tool's purpose: flagging children who need follow-up
 * at a clinic. The Random-Forest model behind the map predictions lives in
 * the Python `src/` pipeline and is a separate concern.
 *
 * Contract (used by `components/AssessClient.tsx`):
 *   assessRisk(input: AssessmentInput): AssessmentResult
 */

// ─── Public types ──────────────────────────────────────────────────────────

export interface AssessmentInput {
  age_months: number;
  sex: 'male' | 'female';
  weight_kg: number;
  height_cm: number;
  /** Mid-upper arm circumference in millimetres (optional but valuable). */
  muac_mm?: number;
  /** Number of distinct food groups eaten yesterday, 0–7 (WHO minimum diet = 5). */
  dietary_diversity?: number;
  meals_per_day?: number;
  recent_illness?: boolean;
  /** Still exclusively/partially breastfed at time of assessment. */
  breastfeeding?: boolean;
  caregiver_education: 'none' | 'primary' | 'secondary' | 'tertiary';
  improved_water?: boolean;
}

export type NutritionalRisk = 'normal' | 'watch' | 'moderate' | 'severe';

export interface AssessmentResult {
  risk: NutritionalRisk;
  risk_label: string;
  risk_color: string;
  /** True when SAM criteria are met — the UI shows an urgent referral banner. */
  immediate_action: boolean;
  /** Weight-for-height z-score (wasting). Null when inputs are invalid. */
  whz: number | null;
  /** Height-for-age z-score (stunting). Null when inputs are invalid. */
  haz: number | null;
  /** Weight-for-age z-score (underweight). Null when inputs are invalid. */
  waz: number | null;
  findings: string[];
  recommendations: string[];
}

// ─── WHO 2006 growth-standard reference tables (simplified) ────────────────
// Median height-for-age (cm) by completed months.
const HEIGHT_MEDIAN: Record<'male' | 'female', Array<[number, number]>> = {
  male: [[0, 49.9], [6, 67.6], [12, 75.7], [18, 82.3], [24, 87.1], [36, 96.1], [48, 103.3], [60, 110.0]],
  female: [[0, 49.1], [6, 65.7], [12, 74.0], [18, 80.7], [24, 85.7], [36, 95.1], [48, 102.7], [60, 109.4]],
};
// Median weight-for-age (kg) by completed months.
const WEIGHT_MEDIAN: Record<'male' | 'female', Array<[number, number]>> = {
  male: [[0, 3.3], [6, 7.9], [12, 9.6], [18, 11.2], [24, 12.2], [36, 14.3], [48, 16.3], [60, 18.3]],
  female: [[0, 3.2], [6, 7.3], [12, 8.9], [18, 10.2], [24, 11.5], [36, 13.9], [48, 16.1], [60, 18.2]],
};
// Standard deviations (constant simplification of WHO's age-varying SDs).
const HEIGHT_SD = 3.5;
const WEIGHT_SD = 1.3;
// Median BMI-for-age (kg/m²) and SD across 12–60 months (slight decline).
const BMI_MEDIAN: Array<[number, number]> = [[12, 16.4], [24, 15.9], [36, 15.5], [60, 15.0]];
const BMI_SD = 1.0;

function interp(table: Array<[number, number]>, x: number): number {
  if (x <= table[0][0]) return table[0][1];
  for (let i = 1; i < table.length; i++) {
    const [x1, y1] = table[i];
    const [x0, y0] = table[i - 1];
    if (x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  const [xLast, yLast] = table[table.length - 1];
  return yLast;
}

function z(value: number, median: number, sd: number): number {
  return Math.round(((value - median) / sd) * 100) / 100;
}

// ─── Engine ────────────────────────────────────────────────────────────────

export function assessRisk(input: AssessmentInput): AssessmentResult {
  const findings: string[] = [];
  const recommendations: string[] = [];

  const validInputs = input.age_months > 0 && input.height_cm > 30 && input.weight_kg > 1;

  // Z-scores
  const haz = validInputs
    ? z(input.height_cm, interp(HEIGHT_MEDIAN[input.sex], input.age_months), HEIGHT_SD)
    : null;
  const waz = validInputs
    ? z(input.weight_kg, interp(WEIGHT_MEDIAN[input.sex], input.age_months), WEIGHT_SD)
    : null;
  const whz = validInputs
    ? z(
        input.weight_kg / Math.pow(input.height_cm / 100, 2),
        interp(BMI_MEDIAN, input.age_months),
        BMI_SD,
      )
    : null;

  // Classify wasting (WHZ + MUAC — the SAM criteria)
  const muacSevere = input.muac_mm !== undefined && input.muac_mm < 115;
  const muacModerate = input.muac_mm !== undefined && input.muac_mm >= 115 && input.muac_mm < 125;
  const wastingSevere = whz !== null && whz < -3;
  const wastingModerate = whz !== null && whz >= -3 && whz < -2;

  const immediateAction = Boolean(wastingSevere || muacSevere);

  // Classify stunting (HAZ)
  const stuntingSevere = haz !== null && haz < -3;
  const stuntingModerate = haz !== null && haz >= -3 && haz < -2;

  // Overall risk: worst of wasting / stunting / weight signals
  let risk: NutritionalRisk = 'normal';
  if (immediateAction || wastingSevere || stuntingSevere || (waz !== null && waz < -3)) {
    risk = 'severe';
  } else if (wastingModerate || muacModerate || stuntingModerate || (waz !== null && waz < -2)) {
    risk = 'moderate';
  } else if (
    (whz !== null && whz < -1) ||
    (haz !== null && haz < -1) ||
    input.recent_illness ||
    (input.dietary_diversity !== undefined && input.dietary_diversity < 4) ||
    input.improved_water === false
  ) {
    risk = 'watch';
  }

  // Findings
  if (whz !== null) {
    findings.push(
      wastingSevere
        ? `Weight-for-height z-score ${whz.toFixed(2)} indicates SEVERE wasting.`
        : wastingModerate
          ? `Weight-for-height z-score ${whz.toFixed(2)} indicates moderate wasting.`
          : `Weight-for-height z-score ${whz.toFixed(2)} is within the normal range.`,
    );
  }
  if (haz !== null) {
    findings.push(
      stuntingSevere
        ? `Height-for-age z-score ${haz.toFixed(2)} indicates SEVERE stunting (chronic malnutrition).`
        : stuntingModerate
          ? `Height-for-age z-score ${haz.toFixed(2)} indicates moderate stunting.`
          : `Height-for-age z-score ${haz.toFixed(2)} is within the normal range.`,
    );
  }
  if (waz !== null && waz < -2) {
    findings.push(`Weight-for-age z-score ${waz.toFixed(2)} indicates underweight.`);
  }
  if (input.muac_mm !== undefined) {
    if (muacSevere) findings.push(`MUAC ${input.muac_mm} mm is below the 115 mm severe threshold.`);
    else if (muacModerate) findings.push(`MUAC ${input.muac_mm} mm falls in the 115–125 mm moderate band.`);
    else findings.push(`MUAC ${input.muac_mm} mm is acceptable (≥ 125 mm).`);
  }
  if (input.dietary_diversity !== undefined && input.dietary_diversity < 5) {
    findings.push(
      `Dietary diversity of ${input.dietary_diversity}/7 food groups is below the WHO minimum of 5.`,
    );
  }
  if (input.recent_illness) {
    findings.push('Recent illness reported — illness raises energy needs and appetite loss risk.');
  }
  if (input.improved_water === false) {
    findings.push('No improved water source — elevated infection/diarrhoea risk.');
  }
  if (input.breastfeeding && input.age_months < 24) {
    findings.push('Continued breastfeeding at this age is protective.');
  }
  if (input.caregiver_education === 'none') {
    findings.push('Caregiver has no formal education — targeted nutrition counselling may help.');
  }

  // Recommendations
  if (immediateAction) {
    recommendations.push('Seek medical attention immediately — this meets severe acute malnutrition (SAM) criteria.');
    recommendations.push('Request assessment for ready-to-use therapeutic food (RUTF) at the nearest health facility.');
  } else if (risk === 'moderate') {
    recommendations.push('Visit the nearest clinic for supplementary feeding programme (SFP) enrolment.');
    recommendations.push('Return to the clinic every 2 weeks for growth monitoring.');
  } else if (risk === 'watch') {
    recommendations.push('Increase meal frequency and dietary diversity (aim for 5 of 7 food groups daily).');
    recommendations.push('Schedule a follow-up weigh-in within one month.');
  } else {
    recommendations.push('Continue current feeding practices — growth is on track.');
    recommendations.push('Keep routine growth-monitoring visits every 3 months.');
  }
  if (input.recent_illness) {
    recommendations.push('During and after illness, offer one extra meal per day and oral rehydration as needed.');
  }
  if (input.improved_water === false) {
    recommendations.push('Treat drinking water (boil, chlorinate, or filter) before use.');
  }
  if (input.breastfeeding === false && input.age_months < 24) {
    recommendations.push('Discuss re-lactation / continued breastfeeding options with a community health worker.');
  }

  const riskLabel: Record<NutritionalRisk, string> = {
    severe: 'Severe Acute Malnutrition — Immediate Action Needed',
    moderate: 'Moderate Malnutrition — Follow-Up Required',
    watch: 'At Risk — Monitor Closely',
    normal: 'Normal Nutritional Status',
  };
  const riskColor: Record<NutritionalRisk, string> = {
    severe: '#dc2626',
    moderate: '#ea580c',
    watch: '#d97706',
    normal: '#16a34a',
  };

  return {
    risk,
    risk_label: riskLabel[risk],
    risk_color: riskColor[risk],
    immediate_action: immediateAction,
    whz,
    haz,
    waz,
    findings,
    recommendations,
  };
}
