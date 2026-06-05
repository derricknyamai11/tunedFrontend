"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/api-client";
import { PageShell, Card, Btn, Toast } from "../_components/PageShell";

interface Testimonial { id: string; content: string; rating: number; is_approved: boolean; user: { name: string; email: string }; created_at: string; }

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [tab, setTab] = useState<"pending" | "approved">("pending");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ msg: "", show: false });

  const showToast = (msg: string) => { setToast({ msg, show: true }); setTimeout(() => setToast({ msg, show: false }), 2800); };

  const load = () => {
    setLoading(true);
    apiGet<Testimonial[]>(`/admin/testimonials?status=${tab}`).then((r) => {
      if (r.ok) setItems(Array.isArray(r.data) ? r.data : []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, [tab]);

  const action = async (id: string, act: "approve" | "reject") => {
    const r = await apiPost(`/admin/testimonials/${id}/action`, { action: act });
    if ((r as any).ok !== false) { showToast(act === "approve" ? "✓ Testimonial approved!" : "Testimonial rejected"); load(); }
  };

  const stars = (n: number) => "⭐".repeat(Math.min(n, 5));

  return (
    <PageShell title="Testimonials" sub="Review and approve client testimonials before they appear on the site">
      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #e4e8ee", marginBottom: 18 }}>
        {(["pending", "approved"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 16px", fontSize: 12.5, fontWeight: tab === t ? 700 : 500, color: tab === t ? "#059669" : "#8a96a8", borderTop: "none", borderLeft: "none", borderRight: "none", borderBottom: `2px solid ${tab === t ? "#059669" : "transparent"}`, marginBottom: -1, background: "none", cursor: "pointer", textTransform: "capitalize" as const }}>
            {t === "pending" ? `⏳ Pending (${items.length && tab === "pending" ? items.length : "?"})` : "✅ Approved"}
          </button>
        ))}
      </div>

      {loading ? <div style={{ padding: 32, textAlign: "center", color: "#8a96a8" }}>Loading…</div> :
        items.length === 0 ? <div style={{ padding: 32, textAlign: "center", color: "#8a96a8" }}>No {tab} testimonials.</div> :
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((t) => (
            <Card key={t.id}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                  {t.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{t.user.name}</div>
                  <div style={{ fontSize: 11, color: "#8a96a8", marginBottom: 6 }}>{t.user.email} · {stars(t.rating)} · {new Date(t.created_at).toLocaleDateString()}</div>
                  <div style={{ fontSize: 13, color: "#1c2536", lineHeight: 1.6, fontStyle: "italic" }}>&#34;{t.content}&#34;</div>
                </div>
              </div>
              {tab === "pending" && (
                <div style={{ display: "flex", gap: 8, marginTop: 12, paddingTop: 10, borderTop: "1px solid #f0f2f5" }}>
                  <Btn label="✅ Approve" onClick={() => action(t.id, "approve")} />
                  <Btn label="❌ Reject" onClick={() => action(t.id, "reject")} color="red" />
                </div>
              )}
            </Card>
          ))}
        </div>
      }

      <Toast msg={toast.msg} show={toast.show} />
    </PageShell>
  );
}
