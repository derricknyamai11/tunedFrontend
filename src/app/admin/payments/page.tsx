"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/api-client";
import { PageShell, Card, Badge, Table, Btn, Modal, FormField, Toast } from "../_components/PageShell";

interface AdminPayment { id: string; payment_id: string; amount: number; currency: string; status: string; method: string | null; order_number: string | null; user_email: string | null; client_marked_paid_at: string | null; admin_verified_at: string | null; created_at: string; }

const statusColor = (s: string): "yellow" | "green" | "red" | "gray" => (
  { pending: "yellow", pending_verification: "yellow", completed: "green", failed: "red", refunded: "gray" }[s] as "yellow" | "green" | "red" | "gray" || "gray"
);

export default function AdminPayments() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [toast, setToast] = useState({ msg: "", show: false });
  const [processing, setProcessing] = useState<string | null>(null);
  const [refundTarget, setRefundTarget] = useState<AdminPayment | null>(null);
  const [refundNote, setRefundNote] = useState("");

  const showToast = (msg: string) => { setToast({ msg, show: true }); setTimeout(() => setToast({ msg, show: false }), 2800); };

  const load = () => {
    setLoading(true);
    const url = `/admin/payments?per_page=50${statusFilter ? `&status=${statusFilter}` : ""}`;
    apiGet<{ payments: AdminPayment[]; total: number }>(url).then((r) => {
      if (r.ok) { setPayments(r.data.payments || []); setTotal(r.data.total || 0); }
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, [statusFilter]);

  const verify = async (id: string) => {
    setProcessing(id);
    const r = await apiPost(`/admin/payments/${id}/verify`, {});
    if (r.ok) { showToast("✓ Payment verified!"); load(); }
    else showToast("✗ Failed to verify");
    setProcessing(null);
  };

  const reject = async (id: string) => {
    if (!confirm("Reject this payment? The client will need to resubmit.")) return;
    setProcessing(id);
    const r = await apiPost(`/admin/payments/${id}/reject`, {});
    if (r.ok) { showToast("Payment rejected"); load(); }
    else showToast("✗ Failed");
    setProcessing(null);
  };

  const issueRefund = async () => {
    if (!refundTarget) return;
    setProcessing(refundTarget.id);
    const r = await apiPost(`/admin/payments/${refundTarget.id}/refund`, { note: refundNote });
    if (r.ok) { showToast(`✓ Refund issued for ${refundTarget.currency} ${refundTarget.amount.toFixed(2)}`); setRefundTarget(null); setRefundNote(""); load(); }
    else showToast(`✗ ${(r as { error?: { message?: string } }).error?.message || "Failed to issue refund"}`);
    setProcessing(null);
  };

  // Export CSV — opens backend URL directly (triggers browser download with auth cookie)
  const exportCSV = (type: "payments" | "orders" | "users") => {
    const qs = type === "payments" && statusFilter ? `?status=${statusFilter}` : "";
    window.open(`/api/admin/export/${type}${qs}`, "_blank");
  };

  const totalRevenue = payments.filter((p) => p.status === "completed").reduce((s, p) => s + p.amount, 0);

  return (
    <PageShell title="Payments & Finance" sub="Verify payments, manage transactions and refunds"
      actions={
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ height: 33, border: "1px solid #e4e8ee", borderRadius: 999, padding: "0 12px", fontSize: 12.5, outline: "none", cursor: "pointer", background: "#fff" }}>
            <option value="">All Payments</option>
            <option value="pending">Pending</option>
            <option value="pending_verification">Pending Verification</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <Btn label="⬇ Export CSV" onClick={() => exportCSV("payments")} color="outline" size="sm" />
        </div>
      }>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 18 }}>
        <Card><div style={{ fontSize: 11.5, color: "#8a96a8" }}>Showing</div><div style={{ fontSize: 22, fontWeight: 800 }}>{total}</div></Card>
        <Card><div style={{ fontSize: 11.5, color: "#8a96a8" }}>Pending Verification</div><div style={{ fontSize: 22, fontWeight: 800, color: "#f59e0b" }}>{payments.filter((p) => p.status === "pending" || p.status === "pending_verification").length}</div></Card>
        <Card><div style={{ fontSize: 11.5, color: "#8a96a8" }}>Verified Revenue</div><div style={{ fontSize: 22, fontWeight: 800, color: "#059669" }}>${totalRevenue.toFixed(2)}</div></Card>
        <Card><div style={{ fontSize: 11.5, color: "#8a96a8" }}>Refunded</div><div style={{ fontSize: 22, fontWeight: 800, color: "#8b5cf6" }}>{payments.filter((p) => p.status === "refunded").length}</div></Card>
      </div>

      <Card>
        {loading ? <div style={{ padding: 32, textAlign: "center", color: "#8a96a8" }}>Loading…</div> :
          payments.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "#8a96a8" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>💳</div>
              <div>No payments found for this filter.</div>
            </div>
          ) :
          <div style={{ overflowX: "auto" }}>
            <Table
              headers={["Payment ID", "Amount", "Method", "User", "Order", "Status", "Date", "Actions"]}
              rows={payments.map((p) => [
                <span key="id" style={{ fontFamily: "monospace", fontSize: 11, color: "#059669" }}>{p.payment_id.slice(0, 8)}…</span>,
                <strong key="a" style={{ color: "#059669" }}>{p.currency} {p.amount.toFixed(2)}</strong>,
                <span key="m" style={{ fontSize: 12 }}>{p.method || "Manual"}</span>,
                <span key="u" style={{ fontSize: 12, maxWidth: 120, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.user_email || "—"}</span>,
                <span key="o" style={{ fontFamily: "monospace", fontSize: 11 }}>{p.order_number ? `#${p.order_number}` : "—"}</span>,
                <Badge key="s" text={p.status.replace(/_/g, " ")} color={statusColor(p.status)} />,
                <span key="d" style={{ fontSize: 11, color: "#8a96a8", whiteSpace: "nowrap" }}>{new Date(p.client_marked_paid_at || p.created_at).toLocaleDateString()}</span>,
                <div key="ac" style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {(p.status === "pending" || p.status === "pending_verification") && <>
                    <Btn label={processing === p.id ? "…" : "✅ Verify"} onClick={() => verify(p.id)} size="sm" />
                    <Btn label="❌ Reject" onClick={() => reject(p.id)} color="red" size="sm" />
                  </>}
                  {p.status === "completed" && (
                    <Btn label="↩ Refund" onClick={() => { setRefundTarget(p); setRefundNote(""); }} color="yellow" size="sm" />
                  )}
                </div>,
              ])}
            />
          </div>
        }
      </Card>

      {/* Export section */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 14 }}>
        {[
          { label: "📊 Export Orders CSV", type: "orders" as const, desc: "All orders with status, client, price" },
          { label: "👥 Export Users CSV", type: "users" as const, desc: "All users with role and join date" },
          { label: "💳 Export Payments CSV", type: "payments" as const, desc: "All payments with verification status" },
        ].map((e) => (
          <div key={e.type} style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 12, padding: 14, cursor: "pointer" }}
            onClick={() => exportCSV(e.type)}
            onMouseEnter={(el) => { (el.currentTarget as HTMLDivElement).style.borderColor = "#059669"; (el.currentTarget as HTMLDivElement).style.background = "#f0fdf4"; }}
            onMouseLeave={(el) => { (el.currentTarget as HTMLDivElement).style.borderColor = "#e4e8ee"; (el.currentTarget as HTMLDivElement).style.background = "#fff"; }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{e.label}</div>
            <div style={{ fontSize: 11.5, color: "#8a96a8" }}>{e.desc}</div>
          </div>
        ))}
      </div>

      {/* Refund Modal */}
      <Modal title="Issue Refund" sub="This will mark the payment as refunded. Contact your payment processor to process the actual transfer." open={!!refundTarget} onClose={() => setRefundTarget(null)}
        footer={<>
          <Btn label="Cancel" onClick={() => setRefundTarget(null)} color="outline" />
          <Btn label={processing === refundTarget?.id ? "Processing…" : "Confirm Refund"} onClick={issueRefund} color="red" />
        </>}>
        {refundTarget && (
          <>
            <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#c2410c" }}>⚠️ Refund: {refundTarget.currency} {refundTarget.amount.toFixed(2)}</div>
              <div style={{ fontSize: 12, color: "#9a3412", marginTop: 4 }}>Order #{refundTarget.order_number} · {refundTarget.user_email}</div>
              <div style={{ fontSize: 11.5, color: "#9a3412", marginTop: 4 }}>Note: This only marks the payment as refunded in the system. You must also process the actual refund via your payment provider.</div>
            </div>
            <FormField label="Reason / Note (optional)">
              <textarea value={refundNote} onChange={(e) => setRefundNote(e.target.value)} placeholder="Reason for refund…" style={{ width: "100%", border: "1px solid #e4e8ee", borderRadius: 9, padding: "9px 11px", fontSize: 12.5, outline: "none", background: "#f8fafc", resize: "vertical", minHeight: 80, boxSizing: "border-box" }} />
            </FormField>
          </>
        )}
      </Modal>

      <Toast msg={toast.msg} show={toast.show} />
    </PageShell>
  );
}
