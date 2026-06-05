"use client";

import { useState } from "react";
import Link from "next/link";

const FAQS = [
  {
    category: "Orders",
    icon: "📦",
    items: [
      { q: "How do I place a new order?", a: "Click '+ New Order' in the sidebar or Orders page. Follow the 3-step wizard: select a service, fill in paper details, then review and checkout. Your order is confirmed instantly." },
      { q: "Can I track my order progress?", a: "Yes. Go to My Orders → click your order. You'll see real-time status updates as your writer works on it. The Planner page also shows a Kanban board view of all orders." },
      { q: "What happens after I place an order?", a: "An admin reviews and assigns a writer. You'll get notified when a writer is assigned and again when the work is delivered. Payment is verified before work begins." },
      { q: "Can I request a revision?", a: "Yes. Once your order is delivered, you have unlimited revisions included. Open the order and click 'Request Revision' to send your feedback." },
    ],
  },
  {
    category: "Payments",
    icon: "💳",
    items: [
      { q: "How do I pay for my order?", a: "After placing your order, go to My Balance and top up your wallet. Once you submit payment proof, our team verifies it and your order becomes active." },
      { q: "What payment methods are accepted?", a: "We accept mobile money (M-Pesa, Airtel Money), bank transfers, and card payments via Stripe (when configured). All methods are shown during checkout." },
      { q: "Can I get a refund?", a: "Yes. If we cannot fulfill your order or if quality doesn't meet agreed standards, contact support via Messages. Refunds are processed within 48 hours." },
    ],
  },
  {
    category: "Account",
    icon: "👤",
    items: [
      { q: "How do I update my profile?", a: "Go to Profile in the sidebar. You can update your name, email, phone number, and upload a profile photo." },
      { q: "How do I change my password?", a: "Go to Profile → Security tab → Change Password. You'll need your current password to set a new one." },
      { q: "How does the referral program work?", a: "Share your unique referral link from the Referrals page. You earn reward points for every friend who places their first order. Points can be redeemed for discounts." },
    ],
  },
  {
    category: "Writers",
    icon: "✍️",
    items: [
      { q: "How are writers selected for my order?", a: "Admin assigns the most qualified writer based on your service type, academic level, and deadline. You can request a specific writer in additional notes." },
      { q: "Can I communicate with my writer?", a: "Yes. Open your order and use the Messages tab to communicate directly with your assigned writer." },
      { q: "What qualifications do writers have?", a: "All writers are verified by our team with proven academic backgrounds. They specialize in specific subjects and have completed quality assessments." },
    ],
  },
];

export default function HelpPage() {
  const [open, setOpen] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const allItems = FAQS.flatMap((c) => c.items.map((item) => ({ ...item, cat: c.category })));
  const filtered = search
    ? allItems.filter((i) => i.q.toLowerCase().includes(search.toLowerCase()) || i.a.toLowerCase().includes(search.toLowerCase()))
    : null;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 0 40px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>🆘</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0d1117", margin: "0 0 8px" }}>Help Center</h1>
        <p style={{ fontSize: 13.5, color: "#6b7280", margin: "0 0 20px" }}>Find answers to common questions or contact support directly.</p>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for answers…"
          style={{ width: "100%", maxWidth: 400, height: 42, border: "1.5px solid #d1d5db", borderRadius: 12, padding: "0 16px 0 40px", fontSize: 13.5, outline: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "12px center", display: "block", margin: "0 auto" }}
        />
      </div>

      {/* Quick links */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10, marginBottom: 28 }}>
        {[
          { icon: "📦", label: "New Order", href: "/client/orders/new" },
          { icon: "💬", label: "Messages", href: "/client/messages" },
          { icon: "💳", label: "My Balance", href: "/client/balance" },
          { icon: "🎁", label: "Referrals", href: "/client/referrals" },
        ].map((item) => (
          <Link key={item.label} href={item.href as never}
            style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 12, padding: "14px 12px", textAlign: "center", textDecoration: "none", display: "block", transition: "border-color .15s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#059669"; (e.currentTarget as HTMLAnchorElement).style.background = "#f0fdf4"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e4e8ee"; (e.currentTarget as HTMLAnchorElement).style.background = "#fff"; }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#1c2536" }}>{item.label}</div>
          </Link>
        ))}
      </div>

      {/* Search results */}
      {filtered && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: "#8a96a8", marginBottom: 12 }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;</div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 0", color: "#8a96a8" }}>
              No results found. Try a different term or contact support below.
            </div>
          ) : filtered.map((item, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 12, padding: 16, marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0d1117", marginBottom: 6 }}>{item.q}</div>
              <div style={{ fontSize: 12.5, color: "#4b5563", lineHeight: 1.6 }}>{item.a}</div>
              <div style={{ fontSize: 11, color: "#8a96a8", marginTop: 8 }}>Category: {item.cat}</div>
            </div>
          ))}
        </div>
      )}

      {/* FAQ sections */}
      {!filtered && FAQS.map((section) => (
        <div key={section.category} style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 18 }}>{section.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#0d1117" }}>{section.category}</span>
          </div>
          {section.items.map((item, i) => {
            const key = `${section.category}-${i}`;
            const isOpen = open === key;
            return (
              <div key={i} style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 12, marginBottom: 8, overflow: "hidden" }}>
                <button
                  onClick={() => setOpen(isOpen ? null : key)}
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#0d1117" }}>{item.q}</span>
                  <span style={{ fontSize: 16, color: "#8a96a8", marginLeft: 12, flexShrink: 0, transition: "transform .2s", transform: isOpen ? "rotate(180deg)" : "none" }}>⌄</span>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 16px 14px", fontSize: 12.5, color: "#4b5563", lineHeight: 1.7, borderTop: "1px solid #f0f2f5" }}>
                    <div style={{ paddingTop: 12 }}>{item.a}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* Contact support */}
      <div style={{ background: "linear-gradient(135deg,#f0fdf4,#ecfdf5)", border: "1px solid rgba(5,150,105,.15)", borderRadius: 14, padding: 20, textAlign: "center" }}>
        <div style={{ fontSize: 20, marginBottom: 8 }}>💬</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#065f46", marginBottom: 6 }}>Still need help?</div>
        <div style={{ fontSize: 12.5, color: "#047857", marginBottom: 16 }}>Our support team responds within 30 minutes.</div>
        <Link href={"/client/messages" as never}
          style={{ background: "linear-gradient(135deg,#059669,#047857)", color: "#fff", borderRadius: 10, padding: "10px 24px", fontSize: 13, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>
          Open Support Chat →
        </Link>
      </div>
    </div>
  );
}
