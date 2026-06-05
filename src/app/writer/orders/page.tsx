"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/api-client";
import Link from "next/link";

interface Order { id: string; order_number: string; title: string; status: string; due_date: string | null; total_price: number; currency: string; word_count: number; description: string; client: { name: string }; }

const S_COLOR: Record<string, string> = { pending: "#f59e0b", active: "#3b82f6", completed: "#22c55e", "completed pending review": "#8b5cf6", overdue: "#ef4444", canceled: "#8a96a8", revision: "#a855f7" };

export default function WriterOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const url = `/writer/orders${filter ? `?status=${filter}` : ""}`;
    apiGet<Order[]>(url).then((r) => { if (r.ok) setOrders(Array.isArray(r.data) ? r.data : []); setLoading(false); });
  }, [filter]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div><div style={{ fontSize: 19, fontWeight: 800, color: "#0d1117" }}>My Orders</div><div style={{ fontSize: 12.5, color: "#8a96a8" }}>All orders assigned to you</div></div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ height: 33, border: "1px solid #e4e8ee", borderRadius: 999, padding: "0 12px", fontSize: 12.5, outline: "none" }}>
          <option value="">All Statuses</option>
          {["pending", "active", "completed pending review", "completed", "overdue", "revision"].map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {loading ? <div style={{ padding: 32, textAlign: "center", color: "#8a96a8" }}>Loading orders…</div> :
        orders.length === 0 ? <div style={{ padding: 40, textAlign: "center", color: "#8a96a8" }}><div style={{ fontSize: 28, marginBottom: 8 }}>📭</div>No orders found.</div> :
        orders.map((o) => (
          <Link key={o.id} href={`/writer/orders/${o.id}`} style={{ display: "block", textDecoration: "none", marginBottom: 10 }}>
            <div style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 14, padding: "14px 16px", boxShadow: "0 1px 2px rgba(0,0,0,.05)", borderLeft: `4px solid ${S_COLOR[o.status] || "#e4e8ee"}`, transition: "box-shadow .15s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0d1117", marginBottom: 3 }}>{o.title}</div>
                  <div style={{ fontSize: 11, color: "#8a96a8" }}>#{o.order_number} · Client: {o.client.name}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: S_COLOR[o.status] + "20", color: S_COLOR[o.status] || "#8a96a8", textTransform: "capitalize" }}>{o.status}</span>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#059669", marginTop: 4 }}>{o.currency} {o.total_price.toFixed(2)}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 14, fontSize: 11.5, color: "#8a96a8" }}>
                <span>📝 {o.word_count.toLocaleString()} words</span>
                <span>📅 {o.due_date ? `Due: ${new Date(o.due_date).toLocaleDateString()}` : "No deadline"}</span>
              </div>
            </div>
          </Link>
        ))
      }
    </div>
  );
}
