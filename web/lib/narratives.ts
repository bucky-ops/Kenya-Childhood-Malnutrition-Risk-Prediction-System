/**
 * Types for the per-county human narratives dataset
 * (`web/data/county_narratives.json`).
 */

export interface CountyNarrative {
  /** Structural drivers of malnutrition in this county (e.g. drought, poverty). */
  drivers: string[];
  /** Representative composite testimony from a caregiver in the county. */
  testimony: string;
  /**
   * Active nutrition/food-security initiatives, written as free text.
   * Known organisation names are auto-linked by `CountyNarrativePanel`.
   */
  initiatives: string[];
  /** Documented progress / success story for the county. */
  success_story: string;
}

/** Map of county name -> narrative. Keys match `CountySummary.county`. */
export type CountyNarratives = Record<string, CountyNarrative>;
