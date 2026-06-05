"use client";

import { useState } from "react";
import { Navbar } from "../_components/Navbar";
import { Footer } from "../_components/Footer";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    // In production this would POST to /api/contact or a mailing service
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setSending(false);
  };

  return (
    <>
      <Navbar activeRoute="/contact" />
      <main id="main-content">
        <section className="bg-slate-900 py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400 ring-1 ring-inset ring-emerald-500/20 uppercase tracking-widest mb-4">
                Contact Us
              </span>
              <h1 className="text-4xl font-black text-white tracking-tight mb-4">
                Get in <span className="text-emerald-500">Touch</span>
              </h1>
              <p className="text-slate-400 text-lg">
                Have a question or need help? Our support team responds within 30 minutes.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
              {/* Contact Info */}
              <div className="lg:col-span-2 space-y-6">
                {[
                  { icon: "💬", label: "Live Chat", desc: "Chat with us directly from your client dashboard" },
                  { icon: "📧", label: "Email", desc: "support@tunedessays.com" },
                  { icon: "⚡", label: "Response Time", desc: "Under 30 minutes, 24/7" },
                  { icon: "🔒", label: "Confidential", desc: "All communications are private and secure" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <span className="text-2xl mt-0.5">{item.icon}</span>
                    <div>
                      <div className="font-bold text-white text-sm">{item.label}</div>
                      <div className="text-slate-400 text-sm mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-3">
                {sent ? (
                  <div className="bg-slate-800/50 border border-emerald-500/30 rounded-2xl p-8 text-center">
                    <div className="text-4xl mb-4">✅</div>
                    <h3 className="text-xl font-black text-white mb-2">Message Sent!</h3>
                    <p className="text-slate-400 text-sm">We&apos;ll get back to you within 30 minutes.</p>
                    <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                      className="mt-6 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl text-sm transition-colors">
                      Send Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Name *</label>
                        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                          placeholder="Your full name" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email *</label>
                        <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                          placeholder="your@email.com" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject</label>
                      <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="How can we help?" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Message *</label>
                      <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                        rows={5}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                        placeholder="Describe your question or request in detail…" />
                    </div>
                    <button type="submit" disabled={sending}
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-900 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                      {sending ? "Sending…" : "Send Message →"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
