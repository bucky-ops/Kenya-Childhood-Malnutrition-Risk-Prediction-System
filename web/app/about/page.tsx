import { Target, Eye, Users, HeartHandshake, Stethoscope, Database, Scale, Globe2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Our mission, vision, and the team behind the Kenya Childhood Malnutrition Risk Prediction System — an open-source Digital Public Good.',
};

const VALUES = [
  {
    icon: Scale,
    title: 'Equity First',
    desc: 'We disaggregate every prediction by sex, age, and wealth quintile so no child is left invisible in the averages.',
  },
  {
    icon: Globe2,
    title: 'Open by Design',
    desc: 'Every line of code, every model, and every dataset is published under an MIT license as a Digital Public Good.',
  },
  {
    icon: Stethoscope,
    title: 'Evidence-Based',
    desc: 'Our predictions follow WHO Data Quality Review (DQR) standards so decisions rest on validated, complete data.',
  },
  {
    icon: HeartHandshake,
    title: 'Community-Owned',
    desc: 'We build on Kenya\'s KHIS / DHIS2 infrastructure and strengthen county health teams — we don\'t replace them.',
  },
];

const TEAM = [
  {
    name: 'Bucky Ops',
    role: 'Project Lead & ML Engineer',
    bio: 'Leads the Random Forest pipeline and WHO DQR validation layer. Background in humanitarian data science and DHIS2 integrations across East Africa.',
  },
  {
    name: 'The Analytics Team',
    role: 'Data Engineers & Public-Health Researchers',
    bio: 'Designs the feature engineering (lagged indicators, seasonal components, WASH covariates) and validates outputs against KDHS and SMART survey ground truth.',
  },
  {
    name: 'The Frontend Team',
    role: 'Web Developers & UX Designers',
    bio: 'Builds the Next.js dashboard and interactive county map with a focus on accessibility (WCAG 2.1 AA) and mobile-first design for field officers on low-bandwidth connections.',
  },
  {
    name: 'County Health Partners',
    role: 'Public Health Officers & CHVs',
    bio: 'Frontline county health officers and community health volunteers who ground-truth predictions and feed back on data quality from the field.',
  },
];

export default function AboutPage() {
  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-cyan-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Hero */}
        <header className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg">
            <HeartHandshake className="w-8 h-8 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900">About Us</h1>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
            We build open-source tools that help Kenyan health workers anticipate
            childhood malnutrition — before children reach a clinic.
          </p>
        </header>

        {/* Mission */}
        <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-emerald-100 p-2">
              <Target className="w-6 h-6 text-emerald-700" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
          </div>
          <p className="text-slate-700 leading-relaxed">
            To reduce childhood acute malnutrition in Kenya by giving county health
            teams, NGOs, and policymakers a free, transparent, and locally-owned
            decision-support tool that forecasts malnutrition risk weeks ahead of
            clinic caseloads — grounded in WHO Data Quality Review standards and
            built on open data from WHO, UNICEF, DHIS2, and the Kenya MoH.
          </p>
        </section>

        {/* Vision */}
        <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-cyan-100 p-2">
              <Eye className="w-6 h-6 text-cyan-700" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Our Vision</h2>
          </div>
          <p className="text-slate-700 leading-relaxed">
            A Kenya where every county health team can foresee malnutrition surges
            in time to pre-position therapeutic food, mobilise community health
            volunteers, and protect every child under five — backed by data they
            trust and tools they own.
          </p>
        </section>

        {/* Why it matters */}
        <section className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-2xl border border-emerald-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Childhood Malnutrition in Kenya?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="text-center">
              <p className="text-4xl font-extrabold text-emerald-700">~26%</p>
              <p className="text-sm text-slate-600 mt-1">of Kenyan under-fives are stunted (KDHS 2022)</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-extrabold text-cyan-700">1 in 19</p>
              <p className="text-sm text-slate-600 mt-1">children die before age 5, often malnutrition-linked</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-extrabold text-brand-700">KSh 37B</p>
              <p className="text-sm text-slate-600 mt-1">annual GDP loss from child undernutrition (World Bank)</p>
            </div>
          </div>
          <p className="mt-6 text-slate-700 leading-relaxed">
            Malnutrition is preventable when detected early. Yet most counties react
            to last month&apos;s reported cases — by the time a spike is visible in
            DHIS2, children are already severely malnourished. We close that gap
            with forward-looking predictions.
          </p>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="rounded-lg bg-emerald-100 p-1.5">
                      <Icon className="w-5 h-5 text-emerald-700" aria-hidden="true" />
                    </div>
                    <h3 className="font-bold text-slate-900">{v.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Team */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-slate-100 p-2">
              <Users className="w-6 h-6 text-slate-700" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">The Team</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TEAM.map((member) => (
              <div key={member.name} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <h3 className="font-bold text-slate-900">{member.name}</h3>
                <p className="text-sm text-emerald-700 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech */}
        <section className="bg-slate-900 text-white rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-emerald-400" aria-hidden="true" />
            <h2 className="text-2xl font-bold">How We Build</h2>
          </div>
          <p className="text-slate-300 leading-relaxed mb-4">
            Our stack is deliberately open, reproducible, and aligned with the
            UN reference architecture for health information systems:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-300">
            <li className="flex items-center gap-2"><span className="text-emerald-400">▸</span> Python · scikit-learn (Random Forest + Isolation Forest)</li>
            <li className="flex items-center gap-2"><span className="text-emerald-400">▸</span> Next.js 15 · React 19 · TypeScript</li>
            <li className="flex items-center gap-2"><span className="text-emerald-400">▸</span> Neon Postgres (DHIS2-compatible)</li>
            <li className="flex items-center gap-2"><span className="text-emerald-400">▸</span> WHO DQR 6-dimension validation</li>
            <li className="flex items-center gap-2"><span className="text-emerald-400">▸</span> Deployed on Vercel (edge CDN, Frankfurt region)</li>
            <li className="flex items-center gap-2"><span className="text-emerald-400">▸</span> MIT licensed — a Digital Public Good</li>
          </ul>
        </section>

        {/* Footer CTA */}
        <section className="text-center">
          <p className="text-slate-600 mb-4">
            Want to partner, contribute data, or deploy in your county?
          </p>
          <a
            href="mailto:team@malnutrition-project.org"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Get in touch
          </a>
        </section>
      </div>
    </main>
  );
}
