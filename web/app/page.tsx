import Link from 'next/link';
import {
  Heart, HandHeart, Users, FlaskConical, Baby, ClipboardCheck,
  Ambulance, BookOpen, Scale, MapPin, ArrowRight, ExternalLink,
  Shield, FileText, Facebook, Twitter, Linkedin, Youtube, Phone,
} from 'lucide-react';
import NewsletterClient from '@/components/NewsletterClient';
import countyDataLayers from '@/data/county_data_layers.json';

interface CountyDataLayer {
  predicted_cases: number;
  population_under_5: number;
  stunting: number;
  gam_risk: string;
}

const countyData = countyDataLayers as Record<string, CountyDataLayer>;

// Aggregate stats from the county data
const totalPredicted = Object.values(countyData).reduce((s, d) => s + d.predicted_cases, 0);
const totalUnder5 = Object.values(countyData).reduce((s, d) => s + d.population_under_5, 0);
const criticalCounties = Object.values(countyData).filter((d) => d.gam_risk === 'critical').length;
const avgStunting = Object.values(countyData).reduce((s, d) => s + d.stunting, 0) / Object.keys(countyData).length;

export default function HomePage() {
  return (
    <main id="main-content">
      {/* ════════════════════════════════════════════════════════════════════
          SECTION 1: HERO (Above the Fold)
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative" aria-labelledby="hero-heading">
        {/* Background image with gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-community-health.png"
            alt="A community health worker measures a child's upper arm with a MUAC tape at a rural Kenya health clinic"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-emerald-900/70 to-cyan-900/70" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-2xl">
            <span className="inline-block bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 text-emerald-100 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-5">
              An Open-Source Digital Public Good
            </span>
            <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              End Child Malnutrition
              <span className="block bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                Across All 47 Counties of Kenya
              </span>
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-slate-200 leading-relaxed max-w-xl">
              We use machine learning and WHO data-quality standards to predict malnutrition risk
              before children reach a clinic — so help arrives in time.
            </p>

            {/* Two contrasting CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/assess"
                className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-7 py-3.5 rounded-xl text-base shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300/50"
              >
                <ClipboardCheck className="w-5 h-5" aria-hidden="true" />
                Get Involved
              </Link>
              <Link
                href="/map"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-xl text-base transition-all hover:border-white/50 focus:outline-none focus:ring-4 focus:ring-white/20"
              >
                <MapPin className="w-5 h-5" aria-hidden="true" />
                Learn the Facts
              </Link>
            </div>

            {/* Trust signal */}
            <p className="mt-6 text-sm text-slate-300 flex items-center gap-2">
              <Shield className="w-4 h-4" aria-hidden="true" />
              Aligned with WHO DQR standards · Powered by DHIS2 data
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 2: Core Statistics & Impact
      ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-16 sm:py-20" aria-labelledby="stats-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="stats-heading" className="text-center text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            The Scale of the Challenge
          </h2>
          <p className="text-center text-slate-500 mb-12 max-w-2xl mx-auto">
            These numbers represent real children. Behind every statistic is a family that deserves
            access to nutritious food, clean water, and healthcare.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-2xl bg-red-50 border border-red-100">
              <p className="text-4xl sm:text-5xl font-extrabold text-red-600">
                {(totalPredicted / 1000).toFixed(0)}K+
              </p>
              <p className="mt-2 text-sm font-medium text-slate-700">Predicted acute malnutrition cases</p>
              <p className="text-xs text-slate-400 mt-1">Across 47 counties · ML model output</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-orange-50 border border-orange-100">
              <p className="text-4xl sm:text-5xl font-extrabold text-orange-600">{criticalCounties}</p>
              <p className="mt-2 text-sm font-medium text-slate-700">Counties at critical risk</p>
              <p className="text-xs text-slate-400 mt-1">GAM above emergency thresholds</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-amber-50 border border-amber-100">
              <p className="text-4xl sm:text-5xl font-extrabold text-amber-600">{avgStunting.toFixed(0)}%</p>
              <p className="mt-2 text-sm font-medium text-slate-700">Average stunting rate</p>
              <p className="text-xs text-slate-400 mt-1">Height-for-age &lt; -2 SD · WHO standard</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-cyan-50 border border-cyan-100">
              <p className="text-4xl sm:text-5xl font-extrabold text-cyan-600">
                {(totalUnder5 / 1_000_000).toFixed(1)}M
              </p>
              <p className="mt-2 text-sm font-medium text-slate-700">Children under 5 at risk</p>
              <p className="text-xs text-slate-400 mt-1">Kenya population data · KNBS</p>
            </div>
          </div>

          {/* Credibility references */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-500">
            <span className="font-medium">Data sourced from:</span>
            {['WHO', 'UNICEF', 'DHIS2 / KHIS', 'Kenya MoH', 'KDHS 2022'].map((src) => (
              <span key={src} className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                {src}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 3: Mission & Who We Are
      ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-slate-50 to-emerald-50/40 py-16 sm:py-20" aria-labelledby="mission-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="mission-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              Who We Are
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
              We exist to ensure that no child in Kenya suffers from malnutrition that could have been
              predicted and prevented. We serve county health teams, NGOs, and families by turning
              raw health data into early-warning predictions that save lives.
            </p>
          </div>

          {/* Audience navigation cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Heart, title: 'For Donors', desc: 'See exactly where your support goes — track impact by county.', href: '/about', color: 'text-rose-600 bg-rose-50' },
              { icon: HandHeart, title: 'For Volunteers', desc: 'Join community health programs in your county.', href: '/stories', color: 'text-emerald-600 bg-emerald-50' },
              { icon: FlaskConical, title: 'For Researchers', desc: 'Access open data, ML models, and WHO DQR methodology.', href: '/qa', color: 'text-blue-600 bg-blue-50' },
              { icon: Baby, title: 'For Families', desc: 'Assess your child\'s risk and find local help — in 60 seconds.', href: '/assess', color: 'text-amber-600 bg-amber-50' },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all"
                >
                  <div className={`inline-flex p-2.5 rounded-xl ${card.color} mb-3`}>
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">{card.title}</h3>
                  <p className="text-sm text-slate-500">{card.desc}</p>
                  <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-emerald-600 group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 4: Programs and Solutions
      ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-16 sm:py-20" aria-labelledby="programs-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="programs-heading" className="text-center text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            How We Work
          </h2>
          <p className="text-center text-slate-500 mb-12 max-w-2xl mx-auto">
            Three core pillars — from data-driven prediction to community-level action.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Ambulance,
                title: 'Emergency Prediction & Response',
                desc: 'Our Random Forest ML model forecasts acute malnutrition surges weeks before they appear in clinic data — enabling pre-positioning of therapeutic food (RUTF) and mobile outreach teams.',
                color: 'bg-red-50 text-red-600 border-red-100',
                link: '/map',
                linkText: 'View the risk map',
              },
              {
                icon: BookOpen,
                title: 'Education & Community Training',
                desc: 'We train community health volunteers (CHVs) in MUAC screening, IYCF counselling, and kitchen-garden nutrition — building local capacity that lasts beyond any single project cycle.',
                color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                link: '/assess',
                linkText: 'Try the assessment tool',
              },
              {
                icon: Scale,
                title: 'Policy Advocacy & Open Data',
                desc: 'We publish all data, code, and models under an MIT license as a Digital Public Good — empowering county governments and NGOs to replicate our approach and strengthen national KHIS systems.',
                color: 'bg-blue-50 text-blue-600 border-blue-100',
                link: '/about',
                linkText: 'Read our mission',
              },
            ].map((program) => {
              const Icon = program.icon;
              return (
                <div key={program.title} className={`rounded-2xl border p-6 ${program.color}`}>
                  <div className="inline-flex p-3 rounded-xl bg-white/60 mb-4">
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{program.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{program.desc}</p>
                  <Link href={program.link} className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:gap-2 transition-all">
                    {program.linkText} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 5: Stories of Hope
      ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-emerald-50/50 to-cyan-50/50 py-16 sm:py-20" aria-labelledby="stories-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="stories-heading" className="text-center text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Stories of Hope
          </h2>
          <p className="text-center text-slate-500 mb-12 max-w-2xl mx-auto">
            Behind every data point is a child, a mother, a community. These are their stories.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Image / video placeholder */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src="/images/story-garden.png"
                alt="A community kitchen garden in rural Kenya with mothers and children tending vegetables"
                className="w-full h-72 sm:h-80 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                <div className="text-white">
                  <p className="text-sm font-semibold">Kakamega County · Kitchen Garden Program</p>
                  <p className="text-xs opacity-80">Stunting reduced from 28% to 12% (2014–2022)</p>
                </div>
              </div>
            </div>

            {/* Testimonial cards */}
            <div className="space-y-4">
              <blockquote className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <p className="text-slate-700 italic leading-relaxed">
                  &ldquo;When my youngest was diagnosed as stunted at 22 months, the community health
                  volunteer helped me start a kitchen garden. Six months later, my son&apos;s
                  weight-for-age is normal and we eat eggs and vegetables every day.&rdquo;
                </p>
                <footer className="mt-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">N</div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Nerima</p>
                    <p className="text-xs text-slate-400">Mother of four · Kakamega County</p>
                  </div>
                </footer>
              </blockquote>

              <blockquote className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <p className="text-slate-700 italic leading-relaxed">
                  &ldquo;After the drought killed our goats, my two-year-old was admitted to the IMAM
                  program with severe acute malnutrition. Six weeks of therapeutic food brought him back.
                  I am grateful — but we still need the rains to return.&rdquo;
                </p>
                <footer className="mt-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700">A</div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Amina</p>
                    <p className="text-xs text-slate-400">Mother of four · Garissa County</p>
                  </div>
                </footer>
              </blockquote>

              <Link href="/stories" className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:gap-3 transition-all">
                Read more stories <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 6: Transparency and Trust
      ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-slate-900 text-white py-16 sm:py-20" aria-labelledby="trust-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="trust-heading" className="text-center text-2xl sm:text-3xl font-bold mb-3">
            Transparency & Trust
          </h2>
          <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
            We believe open data and open code build the strongest foundations for humanitarian work.
          </p>

          {/* Partner references */}
          <div className="mb-12">
            <p className="text-center text-sm text-slate-400 uppercase tracking-wider mb-6">Data Partners</p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {['WHO', 'UNICEF', 'DHIS2', 'Kenya MoH', 'World Bank', 'KNBS', 'FEWS NET'].map((partner) => (
                <span key={partner} className="text-lg font-bold text-slate-300 hover:text-white transition-colors">
                  {partner}
                </span>
              ))}
            </div>
          </div>

          {/* Financial accountability */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <FileText className="w-6 h-6 text-emerald-400 mb-3" aria-hidden="true" />
              <h3 className="font-bold mb-1">Open Source</h3>
              <p className="text-sm text-slate-400">All code published under MIT license on GitHub. Anyone can audit, fork, or replicate.</p>
              <a href="https://github.com/bucky-ops/Kenya-Childhood-Malnutrition-Risk-Prediction-System" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-3 text-sm text-emerald-400 hover:text-emerald-300">
                View repository <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </div>
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <Shield className="w-6 h-6 text-cyan-400 mb-3" aria-hidden="true" />
              <h3 className="font-bold mb-1">WHO DQR Compliant</h3>
              <p className="text-sm text-slate-400">Every prediction ships with a WHO Data Quality Review score — so you know how much to trust the data.</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <Users className="w-6 h-6 text-amber-400 mb-3" aria-hidden="true" />
              <h3 className="font-bold mb-1">Community-Owned</h3>
              <p className="text-sm text-slate-400">Built on Kenya&apos;s KHIS / DHIS2 infrastructure. We strengthen national systems, we don&apos;t replace them.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 7: Footer + Newsletter + Secondary CTA
      ════════════════════════════════════════════════════════════════════ */}
      <footer className="bg-slate-950 text-slate-400">
        {/* Newsletter CTA */}
        <div className="border-b border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Stay Informed. Take Action.</h2>
            <p className="text-sm text-slate-400 mb-6 max-w-xl mx-auto">
              Subscribe to receive monthly impact updates, field stories from Kenya, and urgent action alerts.
              No spam — just meaningful ways to help.
            </p>
            <div className="max-w-md mx-auto">
              <NewsletterClient />
            </div>
          </div>
        </div>

        {/* Essential links */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold text-sm mb-3">Explore</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/map" className="hover:text-white transition-colors">Interactive Map</Link></li>
                <li><Link href="/assess" className="hover:text-white transition-colors">Assess a Child</Link></li>
                <li><Link href="/alerts" className="hover:text-white transition-colors">Alerts</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">News & Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm mb-3">About</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">Our Mission</Link></li>
                <li><Link href="/qa" className="hover:text-white transition-colors">Questions & Answers</Link></li>
                <li><Link href="/stories" className="hover:text-white transition-colors">Share Your Story</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm mb-3">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="https://github.com/bucky-ops/Kenya-Childhood-Malnutrition-Risk-Prediction-System" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub Repository</a></li>
                <li><a href="https://github.com/bucky-ops/Kenya-Childhood-Malnutrition-Risk-Prediction-System/releases" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Releases & Changelog</a></li>
                <li><Link href="/robots.txt" className="hover:text-white transition-colors">robots.txt</Link></li>
                <li><Link href="/sitemap.xml" className="hover:text-white transition-colors">sitemap.xml</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm mb-3">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" aria-hidden="true" /> Kenya crisis helpline: 1190</li>
                <li><a href="mailto:team@malnutrition-project.org" className="hover:text-white transition-colors">team@malnutrition-project.org</a></li>
              </ul>
              {/* Social icons */}
              <div className="flex gap-3 mt-4">
                {[Facebook, Twitter, Linkedin, Youtube].map((Icon, i) => (
                  <a key={i} href="#" aria-label="Social media link" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-600 flex items-center justify-center transition-colors">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>© 2026 Kenya Childhood Malnutrition Risk Prediction System · MIT License · An open-source Digital Public Good</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
