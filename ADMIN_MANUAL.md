# Administrator Manual

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Running Locally](#running-locally)
3. [Environment Variables](#environment-variables)
4. [Deployment](#deployment)
5. [Database Setup (Neon Postgres)](#database-setup-neon-postgres)
6. [The Risk Assessment Engine](#the-risk-assessment-engine)
7. [The Alerts System](#the-alerts-system)
8. [Managing County Data](#managing-county-data)
9. [Monitoring & Analytics](#monitoring--analytics)
10. [Security Checklist](#security-checklist)
11. [Backup & Recovery](#backup--recovery)
12. [Troubleshooting](#troubleshooting)

---

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Vercel (Edge CDN)                  │
│  ┌───────────────────────────────────────────────┐  │
│  │  Next.js 15 App (App Router + React 19)       │  │
│  │  ┌─────────────┐  ┌──────────────┐           │  │
│  │  │  /map       │  │  /assess     │           │  │
│  │  │  (Leaflet)  │  │  (Risk Calc) │           │  │
│  │  └─────────────┘  └──────────────┘           │  │
│  │  ┌─────────────┐  ┌──────────────┐           │  │
│  │  │  /alerts    │  │  /api/predict │           │  │
│  │  │  (Notifs)   │  │  (Zod + Rate) │           │  │
│  │  └─────────────┘  └──────────────┘           │  │
│  │  ┌─────────────┐  ┌──────────────┐           │  │
│  │  │  / (home)   │  │ /api/alerts  │           │  │
│  │  │  (GIS map)  │  │ /subscribe   │           │  │
│  │  └─────────────┘  └──────────────┘           │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │  Static Data (bundled JSON + GeoJSON)         │  │
│  │  - county_data_layers.json (47 counties)      │  │
│  │  - county_narratives.json (47 counties)       │  │
│  │  - kenya-counties.geojson (47 polygons)       │  │
│  │  - malnutrition_data.json (predictions)       │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
         │                              │
         ▼                              ▼
┌─────────────────┐          ┌───────────────────┐
│  Neon Postgres  │          │  Vercel Analytics │
│  (optional)     │          │  + Speed Insights │
│  DATABASE_URL   │          │  (auto-enabled)   │
└─────────────────┘          └───────────────────┘
```

### Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript (strict) |
| Styling | Tailwind CSS 4 |
| Charts | Recharts (lazy-loaded) |
| GIS Map | Leaflet + react-leaflet |
| Icons | lucide-react |
| Validation | Zod |
| Database (optional) | Neon Postgres |
| Deployment | Vercel (Hobby plan, fra1 region) |
| Monitoring | Vercel Analytics + Speed Insights |

---

## Running Locally

### Prerequisites
- Node.js 18+ (recommended: 20 LTS)
- npm 10+
- Git

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/bucky-ops/Kenya-Childhood-Malnutrition-Risk-Prediction-System.git
cd Kenya-Childhood-Malnutrition-Risk-Prediction-System

# 2. Install web app dependencies
cd web
npm install

# 3. (Optional) Set up environment variables
cp .env.example .env.local
# Edit .env.local if you want Neon Postgres integration

# 4. Run the development server
npm run dev
# → Open http://localhost:3000

# 5. Build for production
npm run build
npm run start
# → Production server on http://localhost:3000
```

### Available npm scripts
| Script | Purpose |
|---|---|
| `npm run dev` | Start dev server with hot reload (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting without writing |
| `npm run typecheck` | TypeScript type checking only |

### Pre-commit hooks (Husky + lint-staged)
The repo includes a Husky pre-commit hook that runs Prettier + ESLint on staged files. To install hooks after a fresh clone:
```bash
cd web
npx husky install
```

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | No | (bundled JSON) | Neon Postgres connection string. When set, the app reads live data from Postgres instead of static JSON |

Copy `.env.example` to `.env.local` and fill in values:
```bash
cp web/.env.example web/.env.local
```

### Setting env vars on Vercel
1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add `DATABASE_URL` with your Neon connection string
3. Redeploy

---

## Deployment

### Automatic (Vercel CLI)
The project is already deployed. To deploy a new version:

```bash
cd web
npx vercel --prod --token $VERCEL_TOKEN
```

### Manual (Vercel Dashboard)
1. Go to https://vercel.com/new
2. Import the GitHub repo `bucky-ops/Kenya-Childhood-Malnutrition-Risk-Prediction-System`
3. Vercel auto-detects Next.js (root directory: `web/`)
4. Click **Deploy**

### Production URLs
| URL | Purpose |
|---|---|
| https://kmal.vercel.app | Short canonical URL |
| https://malnutrition-kenya.vercel.app | Descriptive URL |
| https://web-amber-xi-94.vercel.app | Original URL |

---

## Database Setup (Neon Postgres)

The app works **without a database** (uses bundled JSON). To enable live Postgres:

1. Create a Neon project at https://console.neon.tech
2. Copy the connection string
3. Run the seed SQL:
   ```bash
   psql "$DATABASE_URL" -f web/scripts/seed_neon.sql
   ```
4. Set `DATABASE_URL` in Vercel env vars
5. Redeploy

The Neon data layer (`web/lib/data.ts`) automatically uses Postgres when `DATABASE_URL` is set, otherwise falls back to static JSON with a 5-minute cache.

---

## The Risk Assessment Engine

### Location
`web/lib/risk-engine.ts`

### How it works
The engine computes WHO Child Growth Standards z-scores:
1. **Weight-for-Age (WAZ)**: underweight indicator
2. **Height-for-Age (HAZ)**: stunting indicator (chronic)
3. **Weight-for-Height (WHZ)**: wasting indicator (acute)
4. **MUAC**: independent acute malnutrition indicator

Each z-score is calculated as: `(measured_value - reference_median) / reference_SD`

The reference values are simplified WHO 2006 standards for ages 6-60 months, interpolated linearly between known reference points.

### Risk classification
| Z-score | Classification | Action |
|---|---|---|
| > -2 | Normal | Maintain feeding practices |
| -3 to -2 | Moderate (MAM) | Supplementary feeding |
| < -3 | Severe (SAM) | Immediate referral + therapeutic feeding |

### Customizing reference values
To use the full WHO LMS tables (more accurate), replace the `WFA_REF`, `HFA_REF`, and `WFH_REF` objects in `risk-engine.ts` with values from the WHO Child Growth Standards database.

---

## The Alerts System

### Architecture
- **Subscription endpoint**: `POST /api/alerts/subscribe` — stores email + county preferences
- **Push notifications**: browser `Notification` API (requires user permission)
- **Email alerts**: in production, integrate Resend or SendGrid (currently logs to console)

### Alert thresholds
Alerts fire when:
- A county's GAM rate exceeds 15% (high) or 30% (critical)
- Predicted cases exceed 2,000 (high) or 5,000 (critical)
- Wasting rate exceeds 5% (high) or 7% (critical)
- Water access drops below 50% (moderate)

### Customizing thresholds
Edit `web/components/AlertsClient.tsx` — the `MOCK_ALERTS` array defines current active alerts. In production, these would come from a scheduled job that checks the latest KHIS/DHIS2 data.

### Setting up email delivery (production)
1. Sign up for Resend (https://resend.com) — free tier: 3,000 emails/month
2. Get your API key
3. Set `RESEND_API_KEY` in Vercel env vars
4. Add email-sending logic to `/api/alerts/subscribe/route.ts`:
   ```typescript
   import { Resend } from 'resend';
   const resend = new Resend(process.env.RESEND_API_KEY);
   await resend.emails.send({
     from: 'alerts@malnutrition-project.org',
     to: email,
     subject: 'Malnutrition Alert: County Risk Changed',
     html: '...',
   });
   ```

---

## Managing County Data

### Data files
| File | Purpose |
|---|---|
| `web/data/county_data_layers.json` | Multi-layer data for all 47 counties (stunting, wasting, water, poverty, etc.) |
| `web/data/county_narratives.json` | Narrative content (drivers, testimonies, initiatives, success stories) |
| `web/data/malnutrition_data.json` | ML prediction outputs from the Python pipeline |
| `web/public/geo/kenya-counties.geojson` | 47-county boundaries (1.3 MB) |

### Updating data
1. **ML predictions**: run the Python pipeline (`python system_launcher.py --pipeline`) → regenerates `data/processed/predictions.csv` → run `python web/scripts/generate_data_json.py` to update the bundled JSON
2. **County narratives**: edit `web/data/county_narratives.json` directly (JSON format)
3. **County data layers**: edit `web/data/county_data_layers.json` directly
4. **GeoJSON**: replace `web/public/geo/kenya-counties.geojson` if boundaries change

### Adding a new county
All 47 Kenya counties are already included. If you need to add a new sub-county or ward:
1. Add the polygon to the GeoJSON file
2. Add a narrative entry to `county_narratives.json`
3. Add data values to `county_data_layers.json`

---

## Monitoring & Analytics

### Vercel Analytics (auto-enabled)
- Go to your Vercel project → **Analytics** tab
- Shows: page views, unique visitors, top pages, countries, browsers, OS
- Privacy-friendly (no cookies, GDPR-compliant)

### Vercel Speed Insights (auto-enabled)
- Go to your Vercel project → **Speed Insights** tab
- Shows real-user Core Web Vitals: LCP, FID, CLS, TTFB
- Filter by route, country, device

### Checking deployment health
```bash
# Check all routes return 200
for route in "/" "/map" "/assess" "/alerts" "/about" "/qa" "/blog" "/stories"; do
  curl -sL -o /dev/null -w "$route -> %{http_code}\n" "https://kmal.vercel.app$route"
done
```

---

## Security Checklist

### ✅ Implemented
- [x] HTTPS enforced (Vercel automatic)
- [x] Content-Security-Policy header
- [x] X-Frame-Options: DENY (clickjacking protection)
- [x] X-Content-Type-Options: nosniff
- [x] Referrer-Policy: strict-origin-when-cross-origin
- [x] Permissions-Policy: camera/mic/geo/payment locked down
- [x] Strict-Transport-Security: 2 years + preload
- [x] Zod input validation on `/api/predict`
- [x] Rate limiting: 30 req/min per IP on API routes
- [x] Bot blocking middleware (sqlmap, nikto, nmap, etc.)
- [x] No PII stored (assessment runs client-side only)
- [x] Husky pre-commit hooks (Prettier + ESLint)
- [x] Next.js 15.5.25 (CVE-patched)

### 🔲 Recommended for production
- [ ] Enable Resend / SendGrid for real email alerts
- [ ] Set up Vercel Cron Jobs to check DHIS2 data every hour
- [ ] Add CSRF protection on form submissions
- [ ] Enable Vercel Web Application Firewall (WAF)
- [ ] Set up Sentry for error tracking
- [ ] Run regular `npm audit` + `pip-audit`

---

## Backup & Recovery

### What to back up
| Artifact | Location | Frequency |
|---|---|---|
| Source code | GitHub (automatic via git push) | Per commit |
| County data | `web/data/*.json` | When updated |
| GeoJSON | `web/public/geo/kenya-counties.geojson` | Rarely changes |
| Python models | `models/*.pkl` | When retrained |
| Neon database | Neon dashboard → Backups | Daily (Neon auto-backs-up) |

### Recovery procedure
1. **Code**: `git clone` from GitHub
2. **Data**: copy from the latest release assets on GitHub
3. **Database**: Neon point-in-time restore (up to 7 days on free tier)
4. **Deploy**: `npx vercel --prod`

---

## Troubleshooting

### Build fails locally
```bash
cd web
rm -rf node_modules .next package-lock.json
npm install
npm run build
```

### Map doesn't render
- Check browser console for errors (F12)
- Verify `/geo/kenya-counties.geojson` loads: `curl https://kmal.vercel.app/geo/kenya-counties.geojson`
- Leaflet CSS is loaded dynamically — check network tab for `leaflet.css`

### Prediction API returns 429
- Rate limit is 30 requests/minute per IP
- Wait 60 seconds and retry
- Check the `X-RateLimit-Reset` header for the reset time

### Push notifications not working
- Verify the browser supports the `Notification` API
- Check that the user granted permission
- Notifications require HTTPS (Vercel provides this automatically)

### Deployment fails on Vercel
1. Check build logs: `vercel inspect <deployment-url> --logs`
2. Common causes:
   - Missing `rootDirectory: web` in project settings
   - Outdated Next.js version (must be ≥ 15.5.x to pass Vercel's CVE check)
   - TypeScript errors (`npm run typecheck` locally to verify)

---

*For end-user documentation, see [USER_MANUAL.md](./USER_MANUAL.md).*
