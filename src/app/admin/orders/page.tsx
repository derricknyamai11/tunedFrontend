"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/api-client";
import { PageShell, Card, Badge, Table, Modal, FormField, Sel, Btn, Toast } from "../_components/PageShell";

interface AdminOrder { id: string; order_number: string; client_email: string | null; client_name: string | null; title: string; status: string; paid: boolean; total_price: number; currency: string; due_date: string | null; created_at: string; }
interface Writer { id: string; name: string; email: string; }

const statusColor = (s: string): "blue" | "yellow" | "green" | "red" | "purple" | "gray" => (
  { active: "blue", pending: "yellow", completed: "green", "completed pending review": "yellow", overdue: "red", canceled: "gray", revision: "purple" }[s] as "blue" | "yellow" | "green" | "red" | "purple" | "gray" || "gray"
);

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [writers, setWriters] = useState<Writer[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [assignModal, setAssignModal] = useState<string | null>(null);
  const [writerId, setWriterId] = useState("");
  const [toast, setToast] = useState({ msg: "", show: false });

  const showToast = (msg: string) => { setToast({ msg, show: true }); setTimeout(() => setToast({ msg, show: false }), 2800); };

  const load = () => {
    setLoading(true);
    const url = `/admin/orders${statusFilter ? `?status=${statusFilter}` : ""}`;
    apiGet<{ orders: AdminOrder[]; total: number }>(url).then((r) => {
      if (r.ok) { setOrders(r.data.orders); setTotal(r.data.total); }
      setLoading(false);
    });
    apiGet<{ writers: Writer[] }>("/admin/writers").then((r) => { if (r.ok) setWriters(r.data.writers); });
  };

  useEffect(() => { load(); }, [statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    const r = await apiPost(`/admin/orders/${id}/status`, { status });
    if ((r as any).ok !== false) { showToast(`✓ Status updated to ${status}`); load(); }
  };

  const assignWriter = async () => {
    if (!assignModal) return;
    const r = await apiPost(`/admin/orders/${assignModal}/assign-writer`, { writer_id: writerId || null });
    if ((r as any).ok !== false) { showToast("✓ Writer assigned"); setAssignModal(null); load(); }
  };

  return (
    <PageShell title="Orders Intelligence" sub="Full order management with assignment and status control"
      actions={
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ height: 33, border: "1px solid #e4e8ee", borderRadius: 999, padding: "0 12px", fontSize: 12.5, outline: "none", cursor: "pointer" }}>
          <option value="">All Statuses</option>
          {["pending", "active", "completed pending review", "completed", "overdue", "canceled", "revision"].map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      }>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10, marginBottom: 18 }}>
        {[
          { label: "All", value: total, color: "#0d1117" },
          { label: "Pending", value: orders.filter((o) => o.status === "pending").length, color: "#d97706" },
          { label: "Active", value: orders.filter((o) => o.status === "active").length, color: "#3b82f6" },
          { label: "Revision", value: orders.filter((o) => o.status === "revision").length, color: "#8b5cf6" },
          { label: "Completed", value: orders.filter((o) => o.status === "completed").length, color: "#22c55e" },
          { label: "Overdue ⚠️", value: orders.filter((o) => o.status === "overdue").length, color: "#ef4444" },
        ].map((s) => (
          <Card key={s.label} style={{ textAlign: "center", padding: "10px 8px", cursor: "pointer" }} >
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#8a96a8", marginTop: 2 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <Card>
        {loading ? <div style={{ padding: 32, textAlign: "center", color: "#8a96a8" }}>Loading orders…</div> :
          orders.length === 0 ? <div style={{ padding: 32, textAlign: "center", color: "#8a96a8" }}>No orders found.</div> :
          <Table
            headers={["Order #", "Client", "Title", "Status", "Paid", "Amount", "Due", "Actions"]}
            rows={orders.map((o) => [
              <span key="n" style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "#059669" }}>#{o.order_number}</span>,
              <div key="c"><div style={{ fontSize: 12 }}>{o.client_name || "—"}</div><div style={{ fontSize: 11, color: "#8a96a8" }}>{o.client_email || "—"}</div></div>,
              <div key="t" style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12.5 }}>{o.title}</div>,
              <Badge key="s" text={o.status} color={statusColor(o.status)} />,
              <span key="p" style={{ fontSize: 12, color: o.paid ? "#059669" : "#f59e0b", fontWeight: 600 }}>{o.paid ? "✓ Paid" : "Pending"}</span>,
              <strong key="a">{o.currency} {o.total_price.toFixed(2)}</strong>,
              <span key="d" style={{ fontSize: 11, color: o.status === "overdue" ? "#ef4444" : "#8a96a8", fontWeight: o.status === "overdue" ? 700 : 400 }}>
                {o.due_date ? new Date(o.due_date).toLocaleDateString() : "—"}
              </span>,
              <div key="ac" style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                <Btn label="Assign" onClick={() => { setAssignModal(o.id); setWriterId(""); }} color="outline" size="sm" />
                {o.status === "pending" && <Btn label="Activate" onClick={() => updateStatus(o.id, "active")} size="sm" />}
                {o.status === "active" && <Btn label="Complete" onClick={() => updateStatus(o.id, "completed pending review")} size="sm" />}
              </div>,
            ])}
          />
        }
      </Card>

      {/* Assign Writer Modal */}
      <Modal title="Assign Writer" sub="Assign or change the writer for this order" open={!!assignModal} onClose={() => setAssignModal(null)}
        footer={<><Btn label="Cancel" onClick={() => setAssignModal(null)} color="outline" /><Btn label="Assign Writer" onClick={assignWriter} /></>}>
        <FormField label="Select Writer">
          <Sel value={writerId} onChange={(e) => setWriterId(e.target.value)}>
            <option value="">— Unassign writer —</option>
            {writers.map((w) => <option key={w.id} value={w.id}>{w.name} ({w.email})</option>)}
          </Sel>
        </FormField>
        {writers.length === 0 && <div style={{ fontSize: 12, color: "#f59e0b", padding: "8px 0" }}>⚠️ No writers available. Go to Writers page to invite one.</div>}
      </Modal>

      <Toast msg={toast.msg} show={toast.show} />
    </PageShell>
  );
}
