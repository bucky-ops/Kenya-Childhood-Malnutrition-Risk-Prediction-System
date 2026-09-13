/**
 * POST /api/predict
 *
 * County-level malnutrition case prediction endpoint.
 *
 * Flow:
 *   1. Rate-limit check (in-memory token bucket per IP)
 *   2. Parse JSON body
 *   3. Validate against `PredictionRequestSchema` (Zod)
 *   4. Compute a transparent heuristic prediction (proxy for the Python
 *      Random Forest model — the real model lives in `src/models/`)
 *   5. Return a validated `PredictionResponse`
 *
 * The validation + rate-limiting here close two audit findings:
 *   - "Insufficient input validation against malformed parameters"
 *   - "Missing rate limiting on prediction endpoints"
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  validatePredictionRequest,
  type PredictionResponse,
} from '@/lib/validation';

// ─── Rate limiter (in-memory token bucket per IP) ─────────────────────────
// Simple edge-safe rate limiter. For production scale, swap for
// @upstash/ratelimit + Upstash Redis. This implementation caps each IP at
// 30 requests / minute, well within Vercel Hobby plan memory limits.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    const resetAt = now + RATE_LIMIT_WINDOW_MS;
    rateLimitMap.set(ip, { count: 1, resetAt });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetAt };
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }
  entry.count += 1;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count, resetAt: entry.resetAt };
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

// ─── Heuristic predictor (transparent proxy for the ML model) ────────────
// Until a Python inference microservice is wired in, we compute a
// transparent, explainable estimate from the validated inputs. This keeps
// the API contract stable while the ML backend is being built.
function predictCases(input: {
  county: string;
  population_under_5: number;
  stunting_rate: number;
  wasting_rate: number;
  underweight_rate: number;
  exclusive_breastfeeding_rate: number;
  water_access_pct: number;
  sanitation_access_pct: number;
}): { predicted: number; lower: number; upper: number; risk: PredictionResponse['risk_level'] } {
  // Prevalence-weighted estimate: combine stunting/wasting/underweight into
  // a composite vulnerability score, then multiply by the under-5 population
  // and adjust for protective factors (breastfeeding, WASH access).
  const vulnerability =
    (input.stunting_rate * 0.4 +
      input.wasting_rate * 0.4 +
      input.underweight_rate * 0.2);

  const protectionFactor =
    input.exclusive_breastfeeding_rate * 0.5 +
    (input.water_access_pct / 100) * 0.25 +
    (input.sanitation_access_pct / 100) * 0.25;

  const effectiveRate = Math.max(0, vulnerability - protectionFactor * 0.3);
  const predicted = Math.round(input.population_under_5 * effectiveRate);

  // Uncertainty band: ±20% of predicted (would come from the model's
  // confidence interval in production).
  const lower = Math.max(0, Math.round(predicted * 0.8));
  const upper = Math.round(predicted * 1.2);

  const risk: PredictionResponse['risk_level'] =
    predicted > 5000 ? 'critical' :
    predicted > 2000 ? 'high' :
    predicted > 500 ? 'moderate' : 'low';

  return { predicted, lower, upper, risk };
}

// ─── Route handler ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Rate limit
  const ip = getClientIp(req);
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
          'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(rl.resetAt),
        },
      },
    );
  }

  // 2. Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400, headers: { 'X-RateLimit-Remaining': String(rl.remaining) } },
    );
  }

  // 3. Validate with Zod
  let validated;
  try {
    validated = validatePredictionRequest(body);
  } catch (err) {
    // ZodError — return structured field-level errors
    const zodErr = err as { issues?: Array<{ path: (string | number)[]; message: string }> };
    return NextResponse.json(
      {
        error: 'Validation failed.',
        details: (zodErr.issues || []).map((i) => ({
          field: i.path.join('.'),
          message: i.message,
        })),
      },
      { status: 400, headers: { 'X-RateLimit-Remaining': String(rl.remaining) } },
    );
  }

  // 4. Predict
  const result = predictCases(validated);

  // 5. Build + validate response
  const response: PredictionResponse = {
    county: validated.county,
    predicted_cases: result.predicted,
    risk_level: result.risk,
    confidence_lower: result.lower,
    confidence_upper: result.upper,
    model_version: 'heuristic-v1.0.0',
    generated_at: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    status: 200,
    headers: {
      'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
      'X-RateLimit-Remaining': String(rl.remaining),
      'X-RateLimit-Reset': String(rl.resetAt),
      'Cache-Control': 'no-store', // predictions are not cacheable
    },
  });
}

// GET endpoint documents the API contract (for discoverability)
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/predict',
    method: 'POST',
    description: 'Predict county-level acute malnutrition cases from demographic inputs.',
    rate_limit: `${RATE_LIMIT_MAX} requests per minute per IP`,
    schema: {
      county: `one of: Eldoret, Garissa, Kakamega, Kisumu, Kitale, Malindi, Mombasa, Nairobi, Nakuru, Thika`,
      population_under_5: 'positive integer, max 5,000,000',
      stunting_rate: 'float 0–1',
      wasting_rate: 'float 0–1',
      underweight_rate: 'float 0–1',
      exclusive_breastfeeding_rate: 'float 0–1',
      water_access_pct: 'float 0–100',
      sanitation_access_pct: 'float 0–100',
    },
    example_request: {
      county: 'Garissa',
      population_under_5: 50000,
      stunting_rate: 0.28,
      wasting_rate: 0.15,
      underweight_rate: 0.20,
      exclusive_breastfeeding_rate: 0.61,
      water_access_pct: 62,
      sanitation_access_pct: 28,
    },
  });
}
