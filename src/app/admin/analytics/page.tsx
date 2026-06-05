"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/api-client";
import { PageShell, Card, Btn } from "../_components/PageShell";

interface AnalyticsData {
  monthly_revenue: { month: string; revenue: number }[];
  total_revenue: number;
  avg_order_value: number;
  paid_orders: number;
  conversion_rate: number;
  refund_rate: number;
  traffic: { google: number; social: number; referral: number; email: number };
  top_services: { name: string; revenue: number }[];
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<AnalyticsData>("/admin/analytics").then((r) => {
      if (r.ok) setData(r.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#8a96a8" }}>Loading analytics…</div>;

  const maxRev = data ? Math.max(...data.monthly_revenue.map((m) => m.revenue)) : 1;

  return (
    <PageShell title="Revenue & Analytics" sub="Deep financial and performance analytics to drive strategy"
      actions={<Btn label="📄 Export Report" color="outline" />}>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }}>
        {[
          { icon: "💰", label: "Total Revenue", value: `$${(data?.total_revenue || 0).toLocaleString()}`, sub: "All time" },
          { icon: "📦", label: "Paid Orders", value: data?.paid_orders || 0, sub: "Completed" },
          { icon: "💵", label: "Avg Order Value", value: `$${(data?.avg_order_value || 0).toFixed(2)}`, sub: "Per order" },
          { icon: "🎯", label: "Conversion Rate", value: `${data?.conversion_rate || 0}%`, sub: "Visitors to orders" },
        ].map((s) => (
          <Card key={s.label}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 11.5, color: "#8a96a8", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#0d1117", letterSpacing: -1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#059669", marginTop: 3 }}>{s.sub}</div>
              </div>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 14, marginBottom: 18 }}>
        {/* Monthly Chart */}
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1c2536", marginBottom: 14 }}>📈 Monthly Revenue Trend</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
            {data?.monthly_revenue.map((m, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ fontSize: 9, color: "#8a96a8" }}>${(m.revenue / 1000).toFixed(1)}k</div>
                <div style={{ width: "100%", height: `${(m.revenue / maxRev) * 90}%`, background: "linear-gradient(180deg,#059669,#047857)", borderRadius: "4px 4px 0 0", minHeight: 4 }} />
                <div style={{ fontSize: 9, color: "#c1cad6", whiteSpace: "nowrap", overflow: "hidden", maxWidth: 40, textOverflow: "ellipsis" }}>{m.month.split(" ")[0]}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Services */}
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1c2536", marginBottom: 14 }}>🏆 Top Services by Revenue</div>
          {data?.top_services.map((s, i) => {
            const maxS = Math.max(...(data.top_services.map((x) => x.revenue)));
            return (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span>{s.name}</span><strong style={{ color: "#059669" }}>${s.revenue.toLocaleString()}</strong>
                </div>
                <div style={{ height: 6, background: "#e4e8ee", borderRadius: 999 }}>
                  <div style={{ height: "100%", width: `${(s.revenue / maxS) * 100}%`, background: "#059669", borderRadius: 999 }} />
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Traffic + Funnel */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1c2536", marginBottom: 14 }}>🌐 Traffic Sources</div>
          {data && Object.entries(data.traffic).map(([k, v]) => (
            <div key={k} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ textTransform: "capitalize" }}>{k === "google" ? "🔍 Google Search" : k === "social" ? "📱 Social Media" : k === "referral" ? "🔗 Referrals" : "📧 Email"}</span>
                <strong>{v}%</strong>
              </div>
              <div style={{ height: 6, background: "#e4e8ee", borderRadius: 999 }}>
                <div style={{ height: "100%", width: `${v}%`, background: k === "google" ? "#4285f4" : k === "social" ? "#ec4899" : k === "referral" ? "#f59e0b" : "#059669", borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1c2536", marginBottom: 14 }}>💰 Financial Summary</div>
          {[
            { label: "Total Revenue", value: `$${(data?.total_revenue || 0).toLocaleString()}`, color: "#059669" },
            { label: "Avg Order Value", value: `$${(data?.avg_order_value || 0).toFixed(2)}`, color: "#0d1117" },
            { label: "Conversion Rate", value: `${data?.conversion_rate || 0}%`, color: "#3b82f6" },
            { label: "Refund Rate", value: `${data?.refund_rate || 0}%`, color: "#ef4444" },
            { label: "Total Paid Orders", value: data?.paid_orders || 0, color: "#0d1117" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0f2f5" }}>
              <span style={{ fontSize: 12.5, color: "#4a5568" }}>{item.label}</span>
              <strong style={{ fontSize: 13, color: item.color }}>{item.value}</strong>
            </div>
          ))}
        </Card>
      </div>
    </PageShell>
  );
}
