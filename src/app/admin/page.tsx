"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/api-client";
import { AdminModals } from "./_components/AdminModals";
import { useRouter } from "next/navigation";

interface Stats { total_users: number; total_orders: number; total_revenue: number; pending_payments: number; }
interface Analytics { monthly_revenue: { month: string; revenue: number }[]; avg_order_value: number; paid_orders: number; conversion_rate?: number; }
interface Order { id: string; order_number: string; title: string; status: string; due_date: string | null; client_email: string | null; total_price: number; }
interface Insight { type: "warning" | "info" | "success"; icon: string; title: string; desc: string; action: string; }
interface InsightsData { insights: Insight[]; ai_enabled: boolean; ai_note: string | null; stats: Record<string, number>; }

const S_COLOR: Record<string, string> = { pending: "#f59e0b", active: "#3b82f6", completed: "#22c55e", overdue: "#ef4444", revision: "#a855f7", canceled: "#8a96a8" };
const INSIGHT_BG: Record<string, string> = { warning: "#fff7ed", info: "#eff6ff", success: "#f0fdf4" };
const INSIGHT_BORDER: Record<string, string> = { warning: "rgba(251,146,60,.3)", info: "rgba(59,130,246,.2)", success: "rgba(34,197,94,.2)" };
const INSIGHT_ICON_BG: Record<string, string> = { warning: "#fed7aa", info: "#bfdbfe", success: "#bbf7d0" };

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [modal, setModal] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGet<Stats>("/admin/dashboard"),
      apiGet<Analytics>("/admin/analytics"),
      apiGet<{ orders: Order[] }>("/admin/orders?per_page=5"),
    ]).then(([s, a, o]) => {
      if (s.ok) setStats(s.data);
      if (a.ok) setAnalytics(a.data);
      if (o.ok) setRecentOrders(o.data.orders?.slice(0, 5) || []);
      setLoading(false);
    });

    apiGet<InsightsData>("/admin/insights").then((r) => {
      if (r.ok) setInsights(r.data);
      setInsightsLoading(false);
    });
  }, []);

  const totalUsers = stats?.total_users ?? 0;
  const totalOrders = stats?.total_orders ?? 0;
  const totalRevenue = stats?.total_revenue ?? 0;
  const pendingPayments = stats?.pending_payments ?? 0;
  const monthlyData = analytics?.monthly_revenue || [];
  const maxRev = monthlyData.length ? Math.max(...monthlyData.map((m) => m.revenue), 1) : 1;

  const exportDashboard = () => window.open("/api/admin/export/orders", "_blank");

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 19, fontWeight: 800, color: "#0d1117", letterSpacing: "-.5px" }}>Dashboard Overview</div>
          <div style={{ fontSize: 12.5, color: "#8a96a8", marginTop: 3 }}>Live data from your platform</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={exportDashboard} style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 999, height: 33, padding: "0 13px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", color: "#1c2536" }}>⬇ Export</button>
          <button onClick={() => setModal("report")} style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 999, height: 33, padding: "0 13px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", color: "#1c2536" }}>📄 Report</button>
          <button onClick={() => setModal("order")} style={{ background: "linear-gradient(135deg,#059669,#047857)", border: "none", borderRadius: 999, height: 33, padding: "0 15px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", color: "#fff" }}>+ New Order</button>
        </div>
      </div>

      {/* Live Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 18 }}>
        {[
          { label: "Total Users", value: loading ? "—" : totalUsers.toLocaleString(), icon: "👥", color: "#0d1117", sub: "Registered accounts" },
          { label: "Total Orders", value: loading ? "—" : totalOrders.toLocaleString(), icon: "📦", color: "#3b82f6", sub: `${pendingPayments} pending payment${pendingPayments !== 1 ? "s" : ""}` },
          { label: "Total Revenue", value: loading ? "—" : `$${totalRevenue.toLocaleString()}`, icon: "💰", color: "#059669", sub: "All paid orders" },
          { label: "Pending Payments", value: loading ? "—" : pendingPayments.toLocaleString(), icon: "⏳", color: pendingPayments > 0 ? "#f59e0b" : "#22c55e", sub: pendingPayments > 0 ? "Awaiting verification" : "All clear ✓" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 14, padding: 16, boxShadow: "0 1px 2px rgba(13,17,23,.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 11.5, color: "#8a96a8", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.color, letterSpacing: -1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#8a96a8", marginTop: 4 }}>{s.sub}</div>
              </div>
              <span style={{ fontSize: 24 }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Insights Row */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 14, marginBottom: 18 }}>
        {/* Revenue Chart */}
        <div style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 14, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1c2536" }}>📈 Revenue Trend</div>
            <button onClick={() => router.push("/admin/analytics" as never)} style={{ fontSize: 11, color: "#059669", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>View Analytics →</button>
          </div>
          {loading ? (
            <div style={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center", color: "#c1cad6" }}>Loading…</div>
          ) : monthlyData.length === 0 ? (
            <div style={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center", color: "#c1cad6", fontSize: 12, textAlign: "center" }}>
              No revenue data yet.<br />Data populates as payments are verified.
            </div>
          ) : (
            <>
              {/* Bar chart with labels */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 100, paddingBottom: 0 }}>
                {monthlyData.map((m, i) => {
                  const pct = (m.revenue / maxRev) * 100;
                  return (
                    <div key={i} title={`${m.month}: $${m.revenue.toLocaleString()}`}
                      style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end", gap: 2 }}>
                      {m.revenue > 0 && <div style={{ fontSize: 8, color: "#8a96a8", textAlign: "center" }}>${(m.revenue / 1000).toFixed(1)}k</div>}
                      <div style={{ width: "80%", height: `${Math.max(pct, 4)}%`, background: m.revenue > 0 ? "linear-gradient(180deg,#10b981,#059669)" : "#e4e8ee", borderRadius: "3px 3px 0 0", transition: "height .4s ease", boxShadow: m.revenue > 0 ? "0 2px 8px rgba(16,185,129,.25)" : "none" }} />
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 4, marginTop: 4, paddingTop: 6, borderTop: "1px solid #f0f2f5" }}>
                {monthlyData.map((m) => <div key={m.month} style={{ flex: 1, textAlign: "center", fontSize: 9, color: "#c1cad6", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.month.split(" ")[0]}</div>)}
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                <div><div style={{ fontSize: 10.5, color: "#8a96a8" }}>Total</div><div style={{ fontSize: 14, fontWeight: 800 }}>${totalRevenue.toLocaleString()}</div></div>
                <div><div style={{ fontSize: 10.5, color: "#8a96a8" }}>Paid Orders</div><div style={{ fontSize: 14, fontWeight: 800 }}>{analytics?.paid_orders ?? 0}</div></div>
                <div style={{ marginLeft: "auto" }}><div style={{ fontSize: 10.5, color: "#8a96a8" }}>Avg Order</div><div style={{ fontSize: 14, fontWeight: 800, color: "#059669" }}>${(analytics?.avg_order_value ?? 0).toFixed(2)}</div></div>
              </div>
            </>
          )}
        </div>

        {/* AI Smart Insights */}
        <div style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 14, padding: 16, overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1c2536" }}>🤖 Smart Insights</div>
            {insights?.ai_enabled && <span style={{ fontSize: 9.5, fontWeight: 700, color: "#8b5cf6", background: "#f5f3ff", borderRadius: 999, padding: "2px 7px", border: "1px solid rgba(139,92,246,.2)" }}>AI Enhanced</span>}
          </div>

          {insightsLoading ? (
            <div style={{ color: "#c1cad6", fontSize: 12, textAlign: "center", padding: "20px 0" }}>Analyzing…</div>
          ) : !insights || insights.insights.length === 0 ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>✅</div>
              <div style={{ fontSize: 12, color: "#059669", fontWeight: 600 }}>All looks good!</div>
              <div style={{ fontSize: 11, color: "#8a96a8", marginTop: 3 }}>No critical issues detected.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {insights.insights.slice(0, 4).map((ins, i) => (
                <div key={i}
                  onClick={() => router.push(ins.action as never)}
                  style={{ display: "flex", gap: 9, padding: "9px 10px", background: INSIGHT_BG[ins.type] || "#f8fafc", border: `1px solid ${INSIGHT_BORDER[ins.type] || "#e4e8ee"}`, borderRadius: 10, cursor: "pointer", transition: "opacity .15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = ".85")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: INSIGHT_ICON_BG[ins.type] || "#e4e8ee", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>{ins.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#0d1117", marginBottom: 2 }}>{ins.title}</div>
                    <div style={{ fontSize: 11, color: "#4a5568", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ins.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {insights?.ai_note && !insights.ai_enabled && (
            <div style={{ marginTop: 10, padding: "8px 10px", background: "#f5f3ff", borderRadius: 8, border: "1px solid rgba(139,92,246,.15)" }}>
              <div style={{ fontSize: 10.5, color: "#7c3aed", lineHeight: 1.5 }}>💡 {insights.ai_note}</div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders + Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
        {/* Recent Orders */}
        <div style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #e4e8ee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>Recent Orders</div>
            <a href="/admin/orders" style={{ fontSize: 12, color: "#059669", textDecoration: "none", fontWeight: 600 }}>View all →</a>
          </div>
          {loading ? <div style={{ padding: 24, textAlign: "center", color: "#c1cad6" }}>Loading…</div> :
            recentOrders.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: "#8a96a8" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📭</div>
                <div style={{ fontSize: 13 }}>No orders yet</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Orders appear here once clients place them.</div>
              </div>
            ) :
            recentOrders.map((o) => (
              <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", borderBottom: "1px solid #f0f2f5", cursor: "pointer" }}
                onClick={() => router.push("/admin/orders" as never)}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: S_COLOR[o.status] || "#8a96a8", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "#0d1117", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.title}</div>
                  <div style={{ fontSize: 11, color: "#8a96a8" }}>#{o.order_number} · {o.client_email || "Client"}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#059669" }}>${o.total_price.toFixed(2)}</div>
                  <div style={{ fontSize: 10.5, color: S_COLOR[o.status] || "#8a96a8", textTransform: "capitalize", fontWeight: 600 }}>{o.status}</div>
                </div>
              </div>
            ))
          }
        </div>

        {/* Quick Actions */}
        <div style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 14, padding: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 14 }}>⚡ Quick Actions</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { icon: "📝", label: "Create Order", key: "order" },
              { icon: "✍️", label: "Assign Writer", key: "writer" },
              { icon: "💬", label: "Message Client", key: "msg" },
              { icon: "💸", label: "Issue Refund", onClick: () => router.push("/admin/payments" as never) },
              { icon: "📁", label: "Add Resource", key: "resource" },
              { icon: "⬇", label: "Export Data", onClick: exportDashboard },
            ].map((qa) => (
              <button key={qa.label}
                onClick={qa.onClick || (() => setModal(qa.key || null))}
                style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 10, padding: "10px 8px", cursor: "pointer", textAlign: "center" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#059669"; (e.currentTarget as HTMLButtonElement).style.background = "#f0fdf4"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#e4e8ee"; (e.currentTarget as HTMLButtonElement).style.background = "#fff"; }}>
                <div style={{ fontSize: 20, marginBottom: 5 }}>{qa.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#1c2536" }}>{qa.label}</div>
              </button>
            ))}
          </div>

          {/* Getting started note */}
          {!loading && totalOrders === 0 && (
            <div style={{ marginTop: 14, padding: "10px 12px", background: "#f0fdf4", borderRadius: 10, border: "1px solid rgba(5,150,105,.15)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#065f46", marginBottom: 4 }}>📌 Getting Started</div>
              <div style={{ fontSize: 11, color: "#4a5568", lineHeight: 1.6 }}>
                {totalUsers === 0 && "• Share signup link to attract clients\n"}
                {totalOrders === 0 && "• Create first order manually or wait for clients\n"}
                {pendingPayments > 0 && `• ${pendingPayments} payment${pendingPayments > 1 ? "s" : ""} need verification`}
              </div>
            </div>
          )}
        </div>
      </div>

      <AdminModals modal={modal} onClose={() => setModal(null)} />
    </div>
  );
}
