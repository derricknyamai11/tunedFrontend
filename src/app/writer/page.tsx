"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/api-client";
import Link from "next/link";

interface Order { id: string; order_number: string; title: string; status: string; due_date: string | null; total_price: number; word_count: number; }
interface Profile { id: string; name: string; email: string; orders_assigned: number; }

const STATUS_COLOR: Record<string, string> = { pending: "#f59e0b", active: "#3b82f6", completed: "#22c55e", overdue: "#ef4444" };

export default function WriterDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGet<Order[]>("/writer/orders"),
      apiGet<Profile>("/writer/profile"),
    ]).then(([ordersRes, profileRes]) => {
      if (ordersRes.ok) setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
      if (profileRes.ok) setProfile(profileRes.data);
      setLoading(false);
    });
  }, []);

  const active = orders.filter((o) => o.status === "active").length;
  const overdue = orders.filter((o) => o.status === "overdue").length;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 19, fontWeight: 800, color: "#0d1117" }}>Writer Dashboard</div>
        <div style={{ fontSize: 12.5, color: "#8a96a8" }}>Welcome back, {profile?.name || "Writer"}</div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total Assigned", value: profile?.orders_assigned ?? 0, icon: "📦", color: "#0d1117" },
          { label: "Active Now", value: active, icon: "🔵", color: "#3b82f6" },
          { label: "Overdue ⚠️", value: overdue, icon: "⚠️", color: "#ef4444" },
          { label: "Completed", value: orders.filter((o) => o.status === "completed" || o.status === "completed pending review").length, icon: "✅", color: "#22c55e" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 14, padding: 16, boxShadow: "0 1px 2px rgba(0,0,0,.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div><div style={{ fontSize: 11.5, color: "#8a96a8", marginBottom: 4 }}>{s.label}</div><div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div></div>
              <span style={{ fontSize: 24 }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Orders */}
      <div style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #e4e8ee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>Assigned Orders</div>
          <Link href="/writer/orders" style={{ fontSize: 12, color: "#059669", textDecoration: "none", fontWeight: 600 }}>View all →</Link>
        </div>
        {loading ? <div style={{ padding: 32, textAlign: "center", color: "#8a96a8" }}>Loading…</div> :
          orders.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "#8a96a8" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>No orders assigned yet</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Contact admin to get assigned to orders.</div>
            </div>
          ) :
          orders.slice(0, 5).map((o) => (
            <Link key={o.id} href={`/writer/orders/${o.id}`} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderBottom: "1px solid #f0f2f5", textDecoration: "none", color: "inherit" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLOR[o.status] || "#8a96a8", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0d1117", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.title}</div>
                <div style={{ fontSize: 11, color: "#8a96a8" }}>#{o.order_number} · {o.word_count.toLocaleString()} words</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: STATUS_COLOR[o.status] || "#8a96a8", textTransform: "capitalize" }}>{o.status}</div>
                <div style={{ fontSize: 11, color: o.status === "overdue" ? "#ef4444" : "#8a96a8", fontWeight: o.status === "overdue" ? 700 : 400 }}>
                  {o.due_date ? `Due: ${new Date(o.due_date).toLocaleDateString()}` : "No deadline"}
                </div>
              </div>
            </Link>
          ))
        }
      </div>

      {/* Help Note */}
      <div style={{ marginTop: 16, background: "#f0fdf4", border: "1px solid rgba(5,150,105,.2)", borderRadius: 12, padding: "14px 16px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#065f46", marginBottom: 4 }}>📌 Writer Guidelines</div>
        <div style={{ fontSize: 12.5, color: "#4a5568", lineHeight: 1.6 }}>
          • All orders are due by the specified deadline — meet all deadlines<br />
          • Submit work through the order detail page<br />
          • Contact support via Messages if you need clarification<br />
          • Revisions may be requested by clients — respond promptly
        </div>
      </div>
    </div>
  );
}
