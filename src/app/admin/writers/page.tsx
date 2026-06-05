"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/api-client";
import { PageShell, Btn, Card, Badge, Table, Modal, FormField, Inp, Toast } from "../_components/PageShell";

interface Writer { id: string; name: string; email: string; username: string; is_active: boolean; is_writer: boolean; orders_count: number; last_login_at: string | null; created_at: string; }

export default function AdminWriters() {
  const [writers, setWriters] = useState<Writer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [toast, setToast] = useState({ msg: "", show: false });
  const [search, setSearch] = useState("");

  const showToast = (msg: string) => { setToast({ msg, show: true }); setTimeout(() => setToast({ msg, show: false }), 2800); };

  const load = () => {
    setLoading(true);
    apiGet<{ writers: Writer[]; total: number }>("/admin/writers").then((r) => {
      if (r.ok) setWriters(r.data.writers);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const invite = async () => {
    if (!inviteEmail.trim()) return;
    const r = await apiPost("/admin/writers/invite", { email: inviteEmail });
    if (r.ok) { showToast("✓ Writer access granted"); setShowInvite(false); setInviteEmail(""); load(); }
    else showToast("✗ " + (r.ok ? "" : (r as any).error?.message || "Error"));
  };

  const toggle = async (id: string, name: string) => {
    const r = await apiPost(`/admin/writers/${id}/toggle`, {});
    if (r.ok) { showToast(`✓ Writer status toggled for ${name}`); load(); }
  };

  const filtered = writers.filter((w) => !search || w.name.toLowerCase().includes(search.toLowerCase()) || w.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <PageShell title="Writer Management" sub="Manage writer accounts, performance and order assignments"
      actions={<><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search writers…" style={{ height: 33, border: "1px solid #e4e8ee", borderRadius: 999, padding: "0 12px", fontSize: 12.5, outline: "none", width: 200 }} /><Btn label="+ Invite Writer" onClick={() => setShowInvite(true)} /></>}>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }}>
        {[
          { icon: "✍️", label: "Active Writers", value: writers.filter((w) => w.is_active && w.is_writer).length },
          { icon: "📝", label: "Total Assigned Orders", value: writers.reduce((s, w) => s + w.orders_count, 0) },
          { icon: "👥", label: "Total Registered", value: writers.length },
          { icon: "🔒", label: "Inactive / Revoked", value: writers.filter((w) => !w.is_writer || !w.is_active).length },
        ].map((s) => (
          <Card key={s.label}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div><div style={{ fontSize: 11.5, color: "#8a96a8", marginBottom: 4 }}>{s.label}</div><div style={{ fontSize: 24, fontWeight: 800, color: "#0d1117", letterSpacing: -1 }}>{s.value}</div></div>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        {loading ? <div style={{ padding: 32, textAlign: "center", color: "#8a96a8" }}>Loading writers…</div> :
          filtered.length === 0 ? <div style={{ padding: 32, textAlign: "center", color: "#8a96a8" }}>No writers found. Invite someone to get started.</div> :
          <Table
            headers={["Writer", "Email", "Orders", "Status", "Last Login", "Actions"]}
            rows={filtered.map((w) => [
              <div key={w.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff" }}>
                  {w.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div><div style={{ fontSize: 12.5, fontWeight: 600 }}>{w.name}</div><div style={{ fontSize: 11, color: "#8a96a8" }}>@{w.username}</div></div>
              </div>,
              <span key="e" style={{ fontSize: 12, color: "#4a5568" }}>{w.email}</span>,
              <strong key="o">{w.orders_count}</strong>,
              <Badge key="s" text={w.is_active ? "Active" : "Inactive"} color={w.is_active ? "green" : "gray"} />,
              <span key="l" style={{ fontSize: 11, color: "#8a96a8" }}>{w.last_login_at ? new Date(w.last_login_at).toLocaleDateString() : "Never"}</span>,
              <div key="a" style={{ display: "flex", gap: 6 }}>
                <Btn label={w.is_writer ? "Revoke" : "Enable"} onClick={() => toggle(w.id, w.name)} color={w.is_writer ? "red" : "green"} size="sm" />
              </div>,
            ])}
          />
        }
      </Card>

      {/* Invite Modal */}
      <Modal title="Invite Writer" sub="Grant writer access to an existing user account" open={showInvite} onClose={() => setShowInvite(false)}
        footer={<><Btn label="Cancel" onClick={() => setShowInvite(false)} color="outline" /><Btn label="Grant Access" onClick={invite} /></>}>
        <FormField label="User Email Address"><Inp value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="writer@example.com" /></FormField>
        <div style={{ fontSize: 12, color: "#8a96a8", lineHeight: 1.5 }}>The user must already have a registered account. Once granted writer access, they can log in and see assigned orders at /writer/dashboard.</div>
      </Modal>

      <Toast msg={toast.msg} show={toast.show} />
    </PageShell>
  );
}
