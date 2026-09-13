import type { Metadata } from 'next';
import { Newspaper, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'News & Blog',
  description: 'Updates on the Kenya Childhood Malnutrition Risk Prediction System, related research, and field stories.',
};

interface Post {
  title: string;
  date: string;
  category: 'Project Update' | 'Research' | 'Field Story' | 'Partnership';
  excerpt: string;
  body: string;
  source?: string;
  sourceUrl?: string;
}

const POSTS: Post[] = [
  {
    title: 'v2.0.0 launched: interactive county map + narrative storytelling',
    date: '2026-09-13',
    category: 'Project Update',
    excerpt: 'The dashboard now includes an interactive GIS map of Kenya, with per-county narratives answering the "why" behind malnutrition — drivers, family stories, local initiatives, and success milestones.',
    body: 'Today we shipped v2.0.0 — the biggest release yet. The new /map page renders an interactive SVG map of Kenya with all 10 counties colour-coded by risk level. Click any county to see a two-column view: the monthly prediction chart on the left, and a narrative panel on the right that answers four questions — Why is malnutrition prevalent here? What does a family\'s experience look like? What local initiatives are operating? What progress has been made? The narrative content was researched from UNICEF, WHO, KDHS 2022, and county-specific sources. Every testimony is clearly marked as a "representative composite" — not a real individual — to protect privacy while keeping the data relatable.',
  },
  {
    title: 'Kakamega County cut stunting from 28% to 12% in 8 years',
    date: '2026-09-10',
    category: 'Field Story',
    excerpt: 'A documented success story from western Kenya: coordinated multi-sectoral nutrition programming reduced stunting by more than half between 2014 and 2022.',
    body: 'Kakamega County is one of Kenya\'s most encouraging malnutrition success stories. According to county nutrition scorecard data (KHIS) and Save the Children\'s sector-wide advocacy work, stunting among under-fives dropped from 28% (KDHS 2014) to 12% (2022), while wasting fell from 11.7% to 2%. The decline is attributed to a coordinated multi-sectoral effort — the County Nutrition Action Plan, Save the Children\'s advocacy, kitchen-garden programs, and improved IYCF (infant and young child feeding) counselling by community health volunteers. We\'ve integrated this success story into the county narrative panel on our /map page.',
    source: 'Kakamega County Nutrition Scorecard, KHIS',
  },
  {
    title: 'AI-based early warning tool piloted in Garissa for drought-driven spikes',
    date: '2026-09-05',
    category: 'Partnership',
    excerpt: 'The Jameel Observatory and partners are integrating an AI early-warning tool into Garissa\'s IMAM programme to anticipate drought-driven malnutrition surges.',
    body: 'Garissa County, with support from the Jameel Observatory, Save the Children, and UNICEF, is piloting an AI-based malnutrition early-warning tool that fuses satellite-derived climate indicators (NDVI, rainfall) with DHIS2 clinical data to anticipate drought-driven spikes in acute malnutrition. The pilot builds on the existing IMAM (Integrated Management of Acute Malnutrition) outpatient therapeutic feeding network. Our prediction system aligns with this direction — the audit report recommends ingesting CHIRPS rainfall and FEWS NET covariates to lift forecast AUC from 0.73 to 0.86.',
    source: 'Jameel Observatory / Save the Children',
    sourceUrl: 'https://www.jameelobservatory.org',
  },
  {
    title: 'WHO publishes 2025 Joint Child Malnutrition Estimates (JME) with sex disaggregation',
    date: '2026-08-28',
    category: 'Research',
    excerpt: 'For the first time, the UNICEF/WHO/World Bank JME report includes sex-disaggregated stunting and overweight estimates — a milestone for equity-focused programming.',
    body: 'The 2025 edition of the Joint Child Malnutrition Estimates (JME) — the authoritative global database published jointly by UNICEF, WHO, and the World Bank — added sex-disaggregated stunting and overweight estimates for the first time. This is a watershed moment for the "leave no one behind" principle: it means programmes can now target boys vs girls differently where the data warrants. Our system\'s roadmap includes adding sex/age/wealth-quintile disaggregation to match the UN mandate.',
    source: 'UNICEF / WHO / World Bank JME 2025',
    sourceUrl: 'https://data.unicef.org/resources/jme-report-2024',
  },
  {
    title: 'Trans Nzoia launches first County Nutrition Action Plan (2023–2027)',
    date: '2026-08-20',
    category: 'Partnership',
    excerpt: 'Trans Nzoia County (Kitale) committed over KSh 14 million to a multi-sectoral nutrition strategy, anchored by AMPATH and USAID.',
    body: 'Trans Nzoia County — where Kitale town sits — launched its first-generation County Nutrition Action Plan (2023–2027), committing over KSh 14 million to a multi-sectoral nutrition strategy. The plan is anchored by AMPATH Kenya (the Moi University / Moi Teaching & Referral Hospital / Indiana University partnership) and USAID AMPATH Uzima. This matters because Trans Nzoia is one of Kenya\'s "food basket" counties — yet 21.3% of its under-fives are stunted. The paradox (high food production, high malnutrition) is driven by poverty and market dynamics that keep nutrient-rich foods out of reach for poor households.',
    source: 'AMPATH Kenya / Trans Nzoia County Govt',
  },
  {
    title: 'Security audit: 18 improvements implemented and deployed',
    date: '2026-09-01',
    category: 'Project Update',
    excerpt: 'A comprehensive audit led to 18 security, accessibility, performance, and code-quality improvements — all deployed to production.',
    body: 'Following a full audit of the codebase and the live Vercel deployment, we implemented 18 prioritised recommendations: 6 security headers (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS), 6 accessibility fixes (aria-hidden on 25 icons, skip link, keyboard-accessible table rows, label associations, contrast fixes), Zod input validation + rate limiting on the /api/predict endpoint, lazy-loaded chart components (bundle dropped 49% from 215 kB to 109 kB), Vercel Analytics + Speed Insights, and Husky pre-commit hooks with Prettier + ESLint. Full details in the AUDIT_REPORT.md.',
  },
];

const CATEGORY_COLORS: Record<Post['category'], string> = {
  'Project Update': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Research': 'bg-blue-100 text-blue-700 border-blue-200',
  'Field Story': 'bg-amber-100 text-amber-700 border-amber-200',
  'Partnership': 'bg-purple-100 text-purple-700 border-purple-200',
};

export default function BlogPage() {
  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-cyan-50/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <header className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg">
            <Newspaper className="w-7 h-7 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">News & Blog</h1>
          <p className="text-slate-600 mt-2">
            Project updates, related research, and stories from the field.
          </p>
        </header>

        <div className="space-y-6">
          {POSTS.map((post, i) => (
            <article key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${CATEGORY_COLORS[post.category]}`}>
                  {post.category}
                </span>
                <time className="text-xs text-slate-500" dateTime={post.date}>{post.date}</time>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">{post.title}</h2>
              <p className="text-sm text-slate-600 mb-3 leading-relaxed">{post.excerpt}</p>
              <details className="group">
                <summary className="text-sm font-medium text-emerald-700 cursor-pointer hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded">
                  Read more
                </summary>
                <p className="mt-3 text-sm text-slate-700 leading-relaxed">{post.body}</p>
                {post.source && (
                  <p className="mt-3 text-xs text-slate-500">
                    Source: {post.sourceUrl ? (
                      <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline inline-flex items-center gap-1">
                        {post.source} <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                    ) : post.source}
                  </p>
                )}
              </details>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
