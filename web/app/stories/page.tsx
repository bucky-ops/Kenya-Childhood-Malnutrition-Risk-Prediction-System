import type { Metadata } from 'next';
import { Share2, Heart } from 'lucide-react';
import StoriesClient from '@/components/StoriesClient';

export const metadata: Metadata = {
  title: 'Share a Story',
  description: 'Share your experience with childhood malnutrition in Kenya. Stories are reviewed and published to build awareness.',
};

const FEATURED_STORIES = [
  {
    title: 'A kitchen garden that changed everything',
    county: 'Kakamega',
    author: 'Nerima, mother of four',
    excerpt: 'When my youngest was diagnosed as stunted at 22 months, the community health volunteer helped me start a small kitchen garden. Six months later, my son\'s weight-for-age is normal and we eat eggs and vegetables every day.',
    date: '2026-08-15',
  },
  {
    title: 'Recovering from SAM in Garissa',
    county: 'Garissa',
    author: 'Amina, mother of four',
    excerpt: 'After the drought killed our goats, my two-year-old was admitted to the IMAM program with severe acute malnutrition. Six weeks of Ready-to-Use Therapeutic Food brought him back. I am grateful — but we still need the rains to return.',
    date: '2026-08-02',
  },
  {
    title: 'Working mothers in Thika',
    county: 'Thika',
    author: 'Njeri, garment-factory worker',
    excerpt: 'Long factory shifts meant my one-year-old was fed mostly maize porridge by a neighbour. When he was found underweight, I joined a county nutrition support group and learned affordable, diverse recipes. He\'s gaining weight again.',
    date: '2026-07-20',
  },
];

export default function StoriesPage() {
  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-cyan-50/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg">
            <Share2 className="w-7 h-7 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Share Your Story</h1>
          <p className="text-slate-600 mt-2 max-w-xl mx-auto">
            Have you or your family been affected by childhood malnutrition? Are you a
            health worker, community volunteer, or researcher with a story to share?
            Your experience can help others understand and act.
          </p>
        </header>

        {/* Privacy notice */}
        <section className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4">
          <p className="text-sm text-amber-900">
            <strong>Privacy first:</strong> Please do NOT share real names of children
            or identifiable medical details. Use first names or pseudonyms only.
            Stories are reviewed by our team before publishing and may be edited for clarity.
          </p>
        </section>

        {/* Submission form */}
        <StoriesClient />

        {/* Featured stories */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-brand-500" aria-hidden="true" />
            Featured Stories
          </h2>
          {FEATURED_STORIES.map((story, i) => (
            <article key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                  {story.county}
                </span>
                <time className="text-xs text-slate-500" dateTime={story.date}>{story.date}</time>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{story.title}</h3>
              <p className="text-xs text-emerald-700 font-medium mb-3">By {story.author}</p>
              <p className="text-sm text-slate-700 italic leading-relaxed">&ldquo;{story.excerpt}&rdquo;</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
