"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/api-client";
import { PageShell, Card, Badge, Table, Btn, Toast } from "../_components/PageShell";

interface AdminUser { id: string; email: string; name: string; username: string; is_admin: boolean; is_active: boolean; is_writer: boolean; email_verified: boolean; reward_points: number; created_at: string; last_login_at: string | null; }

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ msg: "", show: false });

  const showToast = (msg: string) => { setToast({ msg, show: true }); setTimeout(() => setToast({ msg, show: false }), 2800); };

  const load = (p = 1) => {
    setLoading(true);
    const url = `/admin/users?page=${p}&per_page=20${search ? `&search=${encodeURIComponent(search)}` : ""}`;
    apiGet<{ users: AdminUser[]; total: number; pages: number }>(url).then((r) => {
      if (r.ok) { setUsers(r.data.users); setTotal(r.data.total); }
      setLoading(false);
    });
  };

  useEffect(() => { load(page); }, [page]);

  const toggle = async (id: string, action: "activate" | "deactivate") => {
    const r = await apiPost(`/admin/users/${id}/${action}`, {});
    if ((r as any).ok !== false) { showToast(`✓ User ${action}d`); load(page); }
  };

  const makeWriter = async (id: string) => {
    const r = await apiPost(`/admin/writers/${id}/toggle`, {});
    if ((r as any).ok !== false) { showToast("✓ Writer status toggled"); load(page); }
  };

  const role = (u: AdminUser) => u.is_admin ? "Admin" : u.is_writer ? "Writer" : "Client";
  const roleColor = (u: AdminUser): "purple" | "blue" | "gray" => u.is_admin ? "purple" : u.is_writer ? "blue" : "gray";

  return (
    <PageShell title="Client Insights" sub="Manage all user accounts, roles and access"
      actions={<>
        <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load(1)} placeholder="Search users…" style={{ height: 33, border: "1px solid #e4e8ee", borderRadius: 999, padding: "0 12px 0 32px", fontSize: 12.5, outline: "none", width: 200 }} />
        <Btn label="Search" onClick={() => load(1)} color="outline" />
      </>}>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }}>
        <Card><div style={{ fontSize: 11.5, color: "#8a96a8" }}>Total Users</div><div style={{ fontSize: 22, fontWeight: 800 }}>{total}</div></Card>
        <Card><div style={{ fontSize: 11.5, color: "#8a96a8" }}>Active</div><div style={{ fontSize: 22, fontWeight: 800, color: "#059669" }}>{users.filter((u) => u.is_active).length}</div></Card>
        <Card><div style={{ fontSize: 11.5, color: "#8a96a8" }}>Writers</div><div style={{ fontSize: 22, fontWeight: 800, color: "#3b82f6" }}>{users.filter((u) => u.is_writer).length}</div></Card>
        <Card><div style={{ fontSize: 11.5, color: "#8a96a8" }}>Verified</div><div style={{ fontSize: 22, fontWeight: 800, color: "#8b5cf6" }}>{users.filter((u) => u.email_verified).length}</div></Card>
      </div>

      <Card>
        {loading ? <div style={{ padding: 32, textAlign: "center", color: "#8a96a8" }}>Loading users…</div> :
          <Table
            headers={["User", "Email", "Role", "Status", "Joined", "Actions"]}
            rows={users.map((u) => [
              <div key="n" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: u.is_admin ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : u.is_writer ? "linear-gradient(135deg,#3b82f6,#2563eb)" : "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff" }}>
                  {u.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div><div style={{ fontSize: 12.5, fontWeight: 600 }}>{u.name}</div><div style={{ fontSize: 11, color: "#8a96a8" }}>@{u.username}</div></div>
              </div>,
              <span key="e" style={{ fontSize: 12 }}>{u.email}</span>,
              <Badge key="r" text={role(u)} color={roleColor(u)} />,
              <Badge key="s" text={u.is_active ? "Active" : "Inactive"} color={u.is_active ? "green" : "red"} />,
              <span key="d" style={{ fontSize: 11, color: "#8a96a8" }}>{new Date(u.created_at).toLocaleDateString()}</span>,
              <div key="a" style={{ display: "flex", gap: 4 }}>
                {!u.is_admin && <Btn label={u.is_active ? "Deactivate" : "Activate"} onClick={() => toggle(u.id, u.is_active ? "deactivate" : "activate")} color={u.is_active ? "outline" : "green"} size="sm" />}
                {!u.is_admin && <Btn label={u.is_writer ? "Revoke Writer" : "Make Writer"} onClick={() => makeWriter(u.id)} color={u.is_writer ? "red" : "purple"} size="sm" />}
              </div>,
            ])}
          />
        }

        {/* Pagination */}
        {total > 20 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
            <Btn label="← Prev" onClick={() => setPage(Math.max(1, page - 1))} color="outline" size="sm" />
            <span style={{ fontSize: 12, color: "#8a96a8", alignSelf: "center" }}>Page {page}</span>
            <Btn label="Next →" onClick={() => setPage(page + 1)} color="outline" size="sm" />
          </div>
        )}
      </Card>

      <Toast msg={toast.msg} show={toast.show} />
    </PageShell>
  );
}
