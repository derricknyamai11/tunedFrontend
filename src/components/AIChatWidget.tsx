"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const QUICK_ACTIONS = [
  { label: "Place an order", reply: "To place a new order, click **Order Now** in the top navigation or visit [/order](/order). You'll choose a service, fill in your paper details, and review pricing before submitting.", href: "/order" },
  { label: "Check pricing", reply: "Our pricing depends on the service, academic level, word count, and deadline. Use the **instant price calculator** on any service page to see your estimate before ordering.", href: "/service/essay-writing" },
  { label: "Track my order", reply: "Log into your client dashboard at [/client/orders](/client/orders) to track all your orders in real time. You'll see status updates, deadlines, and writer progress.", href: "/client/orders" },
  { label: "Contact support", reply: "You can reach us via the **Messages** section in your client dashboard, or use our [contact page](/contact). We respond within 30 minutes, 24/7.", href: "/contact" },
];

const FAQ_RESPONSES: { patterns: string[]; reply: string; href?: string }[] = [
  { patterns: ["price", "cost", "how much", "pricing"], reply: "Pricing varies by service, level, word count, and deadline. Try our **instant price calculator** on any service page! For essays starting at $12/page.", href: "/service/essay-writing" },
  { patterns: ["order", "how do i order", "place order", "new order"], reply: "Click **Order Now** in the nav bar (or go to `/order`). You'll choose a service → fill paper details → review & checkout in 3 simple steps.", href: "/order" },
  { patterns: ["login", "sign in", "account"], reply: "Go to [Sign In](/auth/login) to access your account. If you don't have one yet, [Register here](/auth/register) — it's free!", href: "/auth/login" },
  { patterns: ["register", "sign up", "create account"], reply: "Registration is free! Go to [Create Account](/auth/register). Fill in your details and you're ready to place your first order.", href: "/auth/register" },
  { patterns: ["writer", "apply", "become a writer", "join as writer"], reply: "To join as a writer, register a regular account first, then contact our admin team via the contact page. After review, we'll grant you writer access.", href: "/contact" },
  { patterns: ["sample", "example", "view samples"], reply: "Browse our [sample essays](/samples) to see the quality of work our writers produce. You can filter by service type or topic.", href: "/samples" },
  { patterns: ["plagiarism", "original", "turnitin"], reply: "Every paper is written from scratch and includes a plagiarism report. We use industry-leading tools to ensure 100% original content." },
  { patterns: ["refund", "money back", "cancel"], reply: "We offer full refunds if work cannot be delivered or doesn't meet agreed standards. Contact support via Messages in your dashboard.", href: "/client/messages" },
  { patterns: ["deadline", "urgent", "fast", "hours"], reply: "We handle urgent orders as short as 3 hours! Select your deadline in the order form — pricing adjusts based on urgency." },
  { patterns: ["revision", "redo", "rewrite"], reply: "All orders include **unlimited revisions**. Once your order is delivered, simply request a revision from your order page." },
  { patterns: ["hello", "hi", "hey", "help"], reply: "Hi there! 👋 I'm TunedEssays AI Assistant. I can help you navigate the site, answer questions about orders, pricing, and more. What can I help you with?" },
];

function findResponse(input: string): { reply: string; href?: string } {
  const lower = input.toLowerCase();
  for (const faq of FAQ_RESPONSES) {
    if (faq.patterns.some((p) => lower.includes(p))) {
      return { reply: faq.reply, href: faq.href };
    }
  }
  return {
    reply: "I'm not sure about that yet! You can [contact our support team](/contact) directly or check our [FAQ section](/faqs) for detailed answers. Is there something else I can help with?",
    href: "/contact",
  };
}

function renderMarkdown(text: string) {
  // Very minimal markdown: **bold** and [link](href)
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color:#059669;font-weight:600;text-decoration:underline;" target="_self">$1</a>');
}

export function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hi! 👋 I'm your TunedEssays AI Assistant. I can help you find services, understand pricing, track orders, and more. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);

    setTimeout(() => {
      const { reply } = findResponse(text);
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
      setThinking(false);
    }, 600 + Math.random() * 400);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open AI chat"
        style={{
          position: "fixed", bottom: 24, right: 24, width: 54, height: 54,
          borderRadius: "50%", background: "linear-gradient(135deg,#059669,#047857)",
          border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(5,150,105,.4)", zIndex: 999, transition: "transform .2s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}>
        {open
          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: "fixed", bottom: 90, right: 24, width: 340, height: 480, borderRadius: 18,
          background: "#fff", boxShadow: "0 24px 64px rgba(0,0,0,.18)", zIndex: 999,
          display: "flex", flexDirection: "column", overflow: "hidden",
          border: "1px solid rgba(5,150,105,.15)",
        }}>
          {/* Header */}
          <div style={{ padding: "14px 16px", background: "linear-gradient(135deg,#059669,#047857)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>TunedEssays AI</div>
              <div style={{ fontSize: 10.5, color: "rgba(255,255,255,.7)" }}>Smart assistant · Online</div>
            </div>
            <Link href="/contact" style={{ marginLeft: "auto", fontSize: 11, color: "rgba(255,255,255,.8)", textDecoration: "none", fontWeight: 600 }}>Live agent →</Link>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                {m.role === "assistant" && (
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0, marginRight: 7, marginTop: 2 }}>🤖</div>
                )}
                <div style={{
                  maxWidth: "78%", padding: "9px 12px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  background: m.role === "user" ? "linear-gradient(135deg,#059669,#047857)" : "#f0f2f5",
                  color: m.role === "user" ? "#fff" : "#0d1117", fontSize: 12.5, lineHeight: 1.55,
                }}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(m.text) }} />
              </div>
            ))}
            {thinking && (
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>🤖</div>
                <div style={{ background: "#f0f2f5", borderRadius: "14px 14px 14px 4px", padding: "9px 14px" }}>
                  <span style={{ display: "inline-flex", gap: 3 }}>
                    {[0, 1, 2].map((i) => <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#8a96a8", animation: `bounce .9s ${i * .2}s infinite` }} />)}
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick actions */}
          <div style={{ padding: "8px 14px 4px", display: "flex", gap: 6, flexWrap: "wrap", borderTop: "1px solid #f0f2f5" }}>
            {QUICK_ACTIONS.slice(0, 3).map((qa) => (
              <button key={qa.label} onClick={() => sendMessage(qa.label)}
                style={{ fontSize: 11, fontWeight: 600, padding: "4px 9px", borderRadius: 999, border: "1px solid #e4e8ee", background: "#fff", cursor: "pointer", color: "#4b5563" }}>
                {qa.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: "8px 14px 14px", display: "flex", gap: 8, alignItems: "flex-end" }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
              placeholder="Ask me anything…"
              style={{ flex: 1, border: "1.5px solid #e4e8ee", borderRadius: 10, padding: "9px 12px", fontSize: 12.5, outline: "none", resize: "none", fontFamily: "inherit" }} />
            <button onClick={() => sendMessage(input)} disabled={!input.trim() || thinking}
              style={{ width: 36, height: 36, borderRadius: 10, background: input.trim() ? "linear-gradient(135deg,#059669,#047857)" : "#e4e8ee", border: "none", cursor: input.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={input.trim() ? "#fff" : "#c1cad6"} strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
        @media(max-width:480px){
          div[style*="position: fixed"][style*="bottom: 90px"]{ width: calc(100vw - 32px) !important; right: 16px !important; }
        }
      `}</style>
    </>
  );
}
