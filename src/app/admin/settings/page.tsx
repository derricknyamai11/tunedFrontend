"use client";
import { PageShell, Card } from "../_components/PageShell";

export default function AdminSettings() {
  return (
    <PageShell title="Settings" sub="Admin configuration and platform settings">
      {[
        { title: "Email Configuration", desc: "SMTP settings in .env: EMAIL_HOST, EMAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD", icon: "📧" },
        { title: "Payment Methods", desc: "Add STRIPE_SECRET_KEY to .env for Stripe payments. Current: Manual verification mode.", icon: "💳" },
        { title: "Security Settings", desc: "JWT tokens expire in 1 hour. Rate limiting active. CORS restricted to configured origins.", icon: "🔒" },
        { title: "Platform Config", desc: "Session cookie: HttpOnly + SameSite=Lax. Security headers: Full OWASP suite active.", icon: "⚙️" },
        { title: "Production Checklist", desc: "Set SECRET_KEY, JWT_SECRET_KEY, CORS_ORIGINS, DATABASE_URL, REDIS_URL before deploying.", icon: "🚀" },
      ].map((s) => (
        <Card key={s.title} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 24 }}>{s.icon}</span>
            <div><div style={{ fontSize: 13, fontWeight: 700, color: "#0d1117", marginBottom: 4 }}>{s.title}</div><div style={{ fontSize: 12.5, color: "#4a5568", lineHeight: 1.5 }}>{s.desc}</div></div>
          </div>
        </Card>
      ))}
    </PageShell>
  );
}
