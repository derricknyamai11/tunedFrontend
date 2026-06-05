"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/api-client";
import { PageShell, Card, Badge, Btn, Modal, FormField, Inp, Sel, Toast } from "../_components/PageShell";

interface Analytics {
  monthly_revenue: { month: string; revenue: number }[];
  total_revenue: number;
  conversion_rate: number;
  refund_rate: number;
  traffic?: { google?: number; social?: number; referral?: number; email?: number };
}

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: "percentage" | "fixed";
  amount: number;
  min_order_value: number;
  usage_limit: number | null;
  times_used: number;
  valid_to: string | null;
  is_active: boolean;
  created_at: string;
}

const EMPTY_FORM = {
  code: "",
  description: "",
  discount_type: "percentage" as "percentage" | "fixed",
  amount: 10,
  min_order_value: 0,
  usage_limit: "",
  valid_to: "",
};

export default function AdminMarketing() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [toast, setToast] = useState({ msg: "", show: false });

  const showToast = (msg: string) => { setToast({ msg, show: true }); setTimeout(() => setToast({ msg, show: false }), 2800); };

  const loadAnalytics = () => {
    apiGet<Analytics>("/admin/analytics").then((r) => {
      if (r.ok) setAnalytics(r.data);
      setLoadingAnalytics(false);
    });
  };

  const loadCoupons = () => {
    setLoadingCoupons(true);
    apiGet<Coupon[]>("/admin/coupons").then((r) => {
      if (r.ok) setCoupons(Array.isArray(r.data) ? r.data : []);
      setLoadingCoupons(false);
    });
  };

  useEffect(() => { loadAnalytics(); loadCoupons(); }, []);

  const createCoupon = async () => {
    if (!form.code.trim()) return showToast("Coupon code is required");
    if (!form.amount || form.amount <= 0) return showToast("Discount amount must be > 0");
    const payload: Record<string, unknown> = {
      code: form.code.trim().toUpperCase(),
      description: form.description,
      discount_type: form.discount_type,
      amount: Number(form.amount),
      min_order_value: Number(form.min_order_value) || 0,
      usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
      valid_to: form.valid_to || null,
      is_active: true,
    };
    const r = await apiPost("/admin/coupons", payload);
    if (r.ok) {
      showToast("✓ Coupon created");
      setShowCreate(false);
      setForm(EMPTY_FORM);
      loadCoupons();
    } else {
      showToast(`✗ ${(r as { error?: { message?: string } }).error?.message || "Failed to create coupon"}`);
    }
  };

  const toggleCoupon = async (id: string, current: boolean) => {
    const r = await apiPatch(`/admin/coupons/${id}`, { is_active: !current });
    if (r.ok) { showToast(current ? "Coupon deactivated" : "✓ Coupon activated"); loadCoupons(); }
    else showToast("✗ Failed");
  };

  const deleteCoupon = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"? This cannot be undone.`)) return;
    const r = await apiDelete(`/admin/coupons/${id}`);
    if (r.ok) { showToast("Coupon deleted"); loadCoupons(); }
    else showToast("✗ Failed to delete");
  };

  const traffic = analytics?.traffic || {};
  const trafficEntries = Object.entries(traffic).filter(([, v]) => v && v > 0);
  const maxRev = analytics?.monthly_revenue?.length ? Math.max(...analytics.monthly_revenue.map((m) => m.revenue), 1) : 1;

  return (
    <PageShell title="Marketing & Conversion" sub="Track traffic, conversions, campaigns and coupon performance">
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 18 }}>
        <Card>
          <div style={{ fontSize: 11.5, color: "#8a96a8", marginBottom: 4 }}>Total Revenue</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#059669" }}>${(analytics?.total_revenue ?? 0).toLocaleString()}</div>
        </Card>
        <Card>
          <div style={{ fontSize: 11.5, color: "#8a96a8", marginBottom: 4 }}>Conversion Rate</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{analytics?.conversion_rate ?? 0}%</div>
          <div style={{ fontSize: 11, color: "#8a96a8" }}>Visitors → Orders</div>
        </Card>
        <Card>
          <div style={{ fontSize: 11.5, color: "#8a96a8", marginBottom: 4 }}>Active Coupons</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#8b5cf6" }}>{coupons.filter((c) => c.is_active).length}</div>
        </Card>
        <Card>
          <div style={{ fontSize: 11.5, color: "#8a96a8", marginBottom: 4 }}>Coupon Uses</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{coupons.reduce((s, c) => s + c.times_used, 0)}</div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
        {/* Revenue Chart */}
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1c2536", marginBottom: 14 }}>📈 Monthly Revenue</div>
          {loadingAnalytics ? (
            <div style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "center", color: "#c1cad6" }}>Loading…</div>
          ) : !analytics?.monthly_revenue?.length ? (
            <div style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "center", color: "#c1cad6", fontSize: 12 }}>No revenue data yet</div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
                {analytics.monthly_revenue.map((m, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, height: "100%" }}>
                    <div style={{ width: "100%", height: `${(m.revenue / maxRev) * 90}%`, background: m.revenue > 0 ? "linear-gradient(180deg,#059669,#047857)" : "#e4e8ee", borderRadius: "4px 4px 0 0", minHeight: 4 }} title={`${m.month}: $${m.revenue.toLocaleString()}`} />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                {analytics.monthly_revenue.map((m) => <div key={m.month} style={{ flex: 1, textAlign: "center", fontSize: 9, color: "#c1cad6", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.month.split(" ")[0]}</div>)}
              </div>
            </>
          )}
        </Card>

        {/* Traffic Sources */}
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1c2536", marginBottom: 14 }}>🌐 Traffic Sources</div>
          {trafficEntries.length === 0 ? (
            <div style={{ color: "#c1cad6", fontSize: 12, padding: "20px 0" }}>Traffic data not yet available. Configure analytics integration to see source breakdown.</div>
          ) : trafficEntries.map(([k, v]) => (
            <div key={k} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span>{k === "google" ? "🔍 Google Search" : k === "social" ? "📱 Social Media" : k === "referral" ? "🔗 Referrals" : "📧 Email"}</span>
                <strong>{v}%</strong>
              </div>
              <div style={{ height: 6, background: "#e4e8ee", borderRadius: 999 }}>
                <div style={{ height: "100%", width: `${v}%`, background: k === "google" ? "#4285f4" : k === "social" ? "#ec4899" : k === "referral" ? "#f59e0b" : "#059669", borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Coupons */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1c2536" }}>🏷️ Coupon Management</div>
          <Btn label="+ Create Coupon" onClick={() => setShowCreate(true)} />
        </div>

        {loadingCoupons ? (
          <div style={{ padding: 24, textAlign: "center", color: "#8a96a8" }}>Loading coupons…</div>
        ) : coupons.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "#8a96a8" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🏷️</div>
            <div style={{ fontSize: 13 }}>No coupons yet</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Create coupons to offer discounts to clients.</div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ background: "#f8fafc" }}>
                {["Code", "Discount", "Min Order", "Uses / Limit", "Expires", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 10.5, fontWeight: 700, color: "#8a96a8", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {coupons.map((c) => {
                  const expired = c.valid_to ? new Date(c.valid_to) < new Date() : false;
                  return (
                    <tr key={c.id} style={{ borderTop: "1px solid #e4e8ee" }}>
                      <td style={{ padding: "10px 12px" }}>
                        <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 13, color: c.is_active && !expired ? "#059669" : "#c1cad6" }}>{c.code}</div>
                        {c.description && <div style={{ fontSize: 11, color: "#8a96a8" }}>{c.description}</div>}
                      </td>
                      <td style={{ padding: "10px 12px", fontSize: 12.5, whiteSpace: "nowrap" }}>
                        {c.discount_type === "percentage" ? `${c.amount}% off` : `$${c.amount} off`}
                      </td>
                      <td style={{ padding: "10px 12px", fontSize: 12.5 }}>{c.min_order_value > 0 ? `$${c.min_order_value}` : "—"}</td>
                      <td style={{ padding: "10px 12px", fontSize: 12.5 }}>
                        {c.times_used} / {c.usage_limit ?? "∞"}
                      </td>
                      <td style={{ padding: "10px 12px", fontSize: 12 }}>
                        {c.valid_to ? <span style={{ color: expired ? "#dc2626" : "#4a5568" }}>{new Date(c.valid_to).toLocaleDateString()}{expired ? " ⚠️" : ""}</span> : "No expiry"}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <Badge text={expired ? "Expired" : c.is_active ? "Active" : "Inactive"} color={expired ? "red" : c.is_active ? "green" : "gray"} />
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          {!expired && <Btn label={c.is_active ? "Deactivate" : "Activate"} onClick={() => toggleCoupon(c.id, c.is_active)} color={c.is_active ? "yellow" : "green"} size="sm" />}
                          <Btn label="Delete" onClick={() => deleteCoupon(c.id, c.code)} color="red" size="sm" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create Coupon Modal */}
      <Modal title="Create Coupon" sub="Create a discount coupon for clients" open={showCreate} onClose={() => { setShowCreate(false); setForm(EMPTY_FORM); }}
        footer={<><Btn label="Cancel" onClick={() => setShowCreate(false)} color="outline" /><Btn label="Create Coupon" onClick={createCoupon} /></>}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <FormField label="Coupon Code *">
            <Inp value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="e.g. WELCOME20" style={{ textTransform: "uppercase" }} />
          </FormField>
          <FormField label="Discount Type">
            <Sel value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value as "percentage" | "fixed" })}>
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount ($)</option>
            </Sel>
          </FormField>
          <FormField label={form.discount_type === "percentage" ? "Discount % *" : "Discount $ *"}>
            <Inp type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} min={0} />
          </FormField>
          <FormField label="Min Order Value ($)">
            <Inp type="number" value={form.min_order_value} onChange={(e) => setForm({ ...form, min_order_value: Number(e.target.value) })} min={0} />
          </FormField>
          <FormField label="Usage Limit (blank = unlimited)">
            <Inp type="number" value={form.usage_limit} onChange={(e) => setForm({ ...form, usage_limit: e.target.value })} placeholder="Leave blank for unlimited" />
          </FormField>
          <FormField label="Expiry Date (optional)">
            <Inp type="date" value={form.valid_to} onChange={(e) => setForm({ ...form, valid_to: e.target.value })} />
          </FormField>
        </div>
        <FormField label="Description (optional)">
          <Inp value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description for internal use…" />
        </FormField>
      </Modal>

      <Toast msg={toast.msg} show={toast.show} />
    </PageShell>
  );
}
