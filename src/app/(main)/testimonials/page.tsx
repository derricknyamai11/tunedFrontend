"use client";

import { useEffect, useState } from "react";
import { Navbar } from "../_components/Navbar";
import { Footer } from "../_components/Footer";
import Link from "next/link";

interface Testimonial {
  id: string;
  content: string;
  rating: number;
  user?: { name?: string; email?: string } | null;
  created_at: string;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-4 h-4 ${s <= rating ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((d) => {
        const items = d.data || d || [];
        setTestimonials(Array.isArray(items) ? items.filter((t: Testimonial) => t.content) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const stats = [
    { value: "98%", label: "Client Satisfaction" },
    { value: "4.9★", label: "Average Rating" },
    { value: "10K+", label: "Orders Completed" },
    { value: "500+", label: "Expert Writers" },
  ];

  return (
    <>
      <Navbar activeRoute="/testimonials" />
      <main id="main-content">
        {/* Hero */}
        <section className="bg-slate-900 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400 ring-1 ring-inset ring-emerald-500/20 uppercase tracking-widest mb-6">
              What Clients Say
            </span>
            <h1 className="text-4xl font-black text-white tracking-tight sm:text-5xl mb-4">
              Trusted by <span className="text-emerald-500">Thousands</span> of Students
            </h1>
            <p className="mx-auto max-w-xl text-lg text-slate-400">
              Real reviews from real students who trusted us with their academic work.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-emerald-600 py-10">
          <div className="mx-auto max-w-4xl px-4">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 text-center">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-black text-white">{s.value}</div>
                  <div className="text-sm text-emerald-100 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-20 text-slate-400">
                <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                Loading reviews…
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-20 text-slate-500">
                <div className="text-5xl mb-4">⭐</div>
                <p className="text-lg font-semibold mb-2">No reviews yet</p>
                <p className="text-sm">Be the first to share your experience!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((t) => (
                  <div key={t.id} className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <Stars rating={t.rating} />
                    <p className="mt-4 text-slate-700 leading-relaxed text-sm">
                      &ldquo;{t.content}&rdquo;
                    </p>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-700">
                        {(t.user?.name || "A")[0]?.toUpperCase() ?? "A"}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {t.user?.name || "Verified Client"}
                        </div>
                        <div className="text-xs text-slate-400">
                          {new Date(t.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-black text-slate-900 mb-3">Ready to get started?</h2>
              <p className="text-slate-500 mb-6">Join thousands of students who trust TunedEssays for their academic work.</p>
              <Link href={"/order" as never}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-3 text-sm font-bold text-slate-900 hover:bg-emerald-400 transition-colors">
                Place an Order Today →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
