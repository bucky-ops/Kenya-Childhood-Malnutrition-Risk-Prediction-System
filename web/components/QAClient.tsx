'use client';

import { useState } from 'react';
import { ChevronDown, MessageCircle, Send } from 'lucide-react';

interface FAQ { q: string; a: string; }

export default function QAClient({ faqs }: { faqs: FAQ[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [search, setSearch] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [question, setQuestion] = useState('');

  const filtered = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-cyan-50/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <header className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg">
            <MessageCircle className="w-7 h-7 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Questions & Answers</h1>
          <p className="text-slate-600 mt-2">
            Everything you wanted to know about childhood malnutrition in Kenya and our prediction system.
          </p>
        </header>

        {/* Search */}
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions…"
          aria-label="Search frequently asked questions"
          className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />

        {/* FAQ accordion */}
        <div className="space-y-3">
          {filtered.map((faq, i) => {
            const open = openIdx === i;
            return (
              <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenIdx(open ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-inset"
                  aria-expanded={open}
                >
                  <span className="font-semibold text-slate-900">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
                {open && (
                  <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-center text-slate-500 py-8">No questions match your search.</p>
          )}
        </div>

        {/* Ask a question */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Have a different question?</h2>
          <p className="text-sm text-slate-600 mb-4">
            Submit it below and our team will get back to you. We may add it to this FAQ.
          </p>
          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-emerald-800 text-sm">
              ✓ Thank you! Your question has been received. We&apos;ll respond within 3 working days.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (question.trim()) setSubmitted(true);
              }}
              className="space-y-3"
            >
              <label htmlFor="q-input" className="sr-only">Your question</label>
              <textarea
                id="q-input"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
                placeholder="e.g. How can I access the raw predictions data for my county?"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                Submit Question
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
