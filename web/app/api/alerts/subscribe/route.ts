/**
 * POST /api/alerts/subscribe
 *
 * Subscribe to malnutrition alerts. Stores the subscription in-memory
 * (production would use Neon Postgres / Vercel KV / Upstash Redis).
 *
 * When an alert fires (county risk crosses a threshold), the system:
 *   1. Sends an in-app push notification (via the /api/alerts/notify endpoint)
 *   2. Sends an email alert to all subscribers for that county
 *
 * Request body:
 *   { email: string, counties: string[], push_enabled: boolean }
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const SubscribeSchema = z.object({
  email: z.string().email('A valid email address is required'),
  counties: z.array(z.string()).default([]),
  push_enabled: z.boolean().default(false),
});

// In-memory store (production: Neon Postgres `alert_subscriptions` table)
const subscriptions: Array<{
  email: string;
  counties: string[];
  push_enabled: boolean;
  created_at: string;
}> = [];

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parse = SubscribeSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json(
      {
        error: 'Validation failed.',
        details: parse.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
      },
      { status: 400 },
    );
  }

  const { email, counties, push_enabled } = parse.data;

  // Check for existing subscription
  const existing = subscriptions.find((s) => s.email === email);
  if (existing) {
    existing.counties = counties;
    existing.push_enabled = push_enabled;
    return NextResponse.json({
      message: 'Subscription updated.',
      email,
      counties,
      push_enabled,
    });
  }

  subscriptions.push({
    email,
    counties,
    push_enabled,
    created_at: new Date().toISOString(),
  });

  // In production, this is where we'd send a confirmation email via
  // Resend / SendGrid / Vercel Email. For now we log.
  console.log(`[alerts] New subscription: ${email} for ${counties.length || 'all'} counties (push: ${push_enabled})`);

  return NextResponse.json(
    {
      message: 'Subscription confirmed. You will receive alerts when county risk levels change.',
      email,
      counties,
      push_enabled,
    },
    { status: 201 },
  );
}

// GET — list subscription count (for admin dashboard)
export async function GET() {
  return NextResponse.json({
    total_subscriptions: subscriptions.length,
    push_enabled_count: subscriptions.filter((s) => s.push_enabled).length,
    counties_monitored: [...new Set(subscriptions.flatMap((s) => s.counties))],
  });
}
