"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet } from "@/api-client";

interface OrderDetail { id: string; order_number: string; title: string; description: string; status: string; due_date: string | null; word_count: number; page_count: number; format_style: string | null; additional_materials: string | null; }

export default function WriterOrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<OrderDetail>(`/writer/orders/${orderId}`).then((r) => {
      if (r.ok) setOrder(r.data);
      setLoading(false);
    });
  }, [orderId]);

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#8a96a8" }}>Loading order…</div>;
  if (!order) return <div style={{ padding: 40, textAlign: "center", color: "#ef4444" }}>Order not found or not assigned to you.</div>;

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <button onClick={() => router.back()} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#8a96a8", background: "none", border: "none", cursor: "pointer", marginBottom: 14, padding: "5px 0" }}>
        ← Back to Orders
      </button>

      {/* Header */}
      <div style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 14, padding: "16px 20px", marginBottom: 14, boxShadow: "0 1px 2px rgba(0,0,0,.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#0d1117", marginBottom: 6 }}>{order.title}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{ background: "#f8fafc", border: "1px solid #e4e8ee", borderRadius: 999, padding: "2px 10px", fontSize: 11.5, color: "#4a5568" }}>#{order.order_number}</span>
              <span style={{ background: "#eff6ff", color: "#1d4ed8", borderRadius: 999, padding: "2px 10px", fontSize: 11.5, fontWeight: 600 }}>{order.word_count.toLocaleString()} words</span>
              {order.format_style && <span style={{ background: "#f5f3ff", color: "#5b21b6", borderRadius: 999, padding: "2px 10px", fontSize: 11.5 }}>{order.format_style}</span>}
              {order.due_date && <span style={{ background: "#fffbeb", color: "#92400e", borderRadius: 999, padding: "2px 10px", fontSize: 11.5, fontWeight: 600 }}>Due: {new Date(order.due_date).toLocaleDateString()}</span>}
            </div>
          </div>
          <span style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: order.status === "active" ? "#eff6ff" : "#f0fdf4", color: order.status === "active" ? "#1d4ed8" : "#166534", textTransform: "capitalize" as const }}>{order.status}</span>
        </div>
      </div>

      {/* Instructions */}
      <div style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 14, padding: "16px 20px", marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#8a96a8", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>Client Instructions</div>
        <div style={{ fontSize: 13, color: "#1c2536", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{order.description || "No specific instructions provided."}</div>
        {order.additional_materials && (
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #f0f2f5" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#8a96a8", marginBottom: 6 }}>ADDITIONAL NOTES</div>
            <div style={{ fontSize: 12.5, color: "#4a5568" }}>{order.additional_materials}</div>
          </div>
        )}
      </div>

      {/* Order Info */}
      <div style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 14, padding: "16px 20px", marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#8a96a8", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>Order Details</div>
        {[
          { label: "Word Count", value: `${order.word_count.toLocaleString()} words` },
          { label: "Page Count", value: `${order.page_count} pages` },
          { label: "Format Style", value: order.format_style || "Not specified" },
          { label: "Deadline", value: order.due_date ? new Date(order.due_date).toLocaleString() : "No deadline" },
          { label: "Status", value: order.status },
        ].map((r) => (
          <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0f2f5", fontSize: 12.5 }}>
            <span style={{ color: "#8a96a8" }}>{r.label}</span>
            <span style={{ fontWeight: 600, color: "#0d1117", textTransform: "capitalize" as const }}>{r.value}</span>
          </div>
        ))}
      </div>

      {/* Writer Actions */}
      <div style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#8a96a8", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 12 }}>Actions</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => alert("Submission form — connect to order delivery endpoint")} style={{ flex: 1, height: 40, background: "linear-gradient(135deg,#059669,#047857)", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            📤 Submit Work
          </button>
          <a href="/writer" style={{ flex: 1, height: 40, background: "#fff", border: "1px solid #e4e8ee", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#1c2536", textDecoration: "none" }}>
            ← Back to Dashboard
          </a>
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: "#8a96a8" }}>
          Need help? Contact support through the admin team or email info@tunedessays.com
        </div>
      </div>
    </div>
  );
}
