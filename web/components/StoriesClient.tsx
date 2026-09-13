'use client';

import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

const COUNTIES = [
  'Eldoret', 'Garissa', 'Kakamega', 'Kisumu', 'Kitale',
  'Malindi', 'Mombasa', 'Nairobi', 'Nakuru', 'Thika',
  'Other / Prefer not to say',
];

export default function StoriesClient() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    county: '',
    role: '',
    title: '',
    story: '',
    consent: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent || !form.story.trim() || !form.title.trim()) return;
    // In production this would POST to /api/stories. For now, we acknowledge.
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-7 h-7 text-emerald-600" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Thank you for sharing</h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Your story has been received. Our team will review it within 5 working days.
          If selected for publication, we&apos;ll notify you before it goes live.
          Names and identifying details will always be protected.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ name: '', county: '', role: '', title: '', story: '', consent: false }); }}
          className="mt-6 text-sm text-emerald-700 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
        >
          Share another story
        </button>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-4">Submit your story</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
            Your name (or pseudonym) <span className="text-slate-400">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Akinyi or Mother of three"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="county" className="block text-sm font-medium text-slate-700 mb-1">
              County <span className="text-slate-400">*</span>
            </label>
            <select
              id="county"
              required
              value={form.county}
              onChange={(e) => setForm({ ...form, county: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Select a county…</option>
              {COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1">
              Your role
            </label>
            <input
              id="role"
              type="text"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="e.g. Mother, CHV, health officer"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
            Story title <span className="text-slate-400">*</span>
          </label>
          <input
            id="title"
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. How a kitchen garden helped my son recover"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="story" className="block text-sm font-medium text-slate-700 mb-1">
            Your story <span className="text-slate-400">*</span>
          </label>
          <textarea
            id="story"
            required
            rows={6}
            value={form.story}
            onChange={(e) => setForm({ ...form, story: e.target.value })}
            placeholder="Share your experience in 2-6 paragraphs. Please do NOT include real names of children or identifiable medical details."
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex items-start gap-3">
          <input
            id="consent"
            type="checkbox"
            required
            checked={form.consent}
            onChange={(e) => setForm({ ...form, consent: e.target.checked })}
            className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <label htmlFor="consent" className="text-sm text-slate-600">
            I confirm this story is my own, does not contain identifiable details of real
            children, and I consent to it being reviewed and potentially published on this
            site (edited for clarity, with my name/county attributed as submitted).
          </label>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
          Submit Story
        </button>
      </form>
    </section>
  );
}
