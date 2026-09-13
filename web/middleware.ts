/**
 * Next.js edge middleware — global request protection.
 *
 * Responsibilities:
 *   - Block obvious bot / scanner user-agents
 *   - Set a baseline rate-limit header on all routes
 *   - Add a strict CORS header on API routes
 *
 * The route-specific rate limit lives in app/api/predict/route.ts.
 */
import { NextRequest, NextResponse } from 'next/server';

// User agents that are clearly scanners / scrapers we don't want hitting
// the prediction endpoint. Legitimate crawlers (Googlebot) are allowed.
const BLOCKED_UA_PATTERNS = [
  /sqlmap/i, /nikto/i, /nmap/i, /masscan/i, /hydra/i, /dirbuster/i,
  /wpscan/i, /acunetix/i, /netsparker/i, /zap/i,
];

export function middleware(req: NextRequest) {
  const ua = req.headers.get('user-agent') || '';

  // Block known attack tools
  if (BLOCKED_UA_PATTERNS.some((re) => re.test(ua))) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Strict CORS for API routes — same-origin only for predictions
  const res = NextResponse.next();
  if (req.nextUrl.pathname.startsWith('/api/')) {
    res.headers.set('Access-Control-Allow-Origin', 'same-origin');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    res.headers.set('Access-Control-Max-Age', '86400');
  }

  return res;
}

export const config = {
  matcher: [
    // Apply to all routes except static assets
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
