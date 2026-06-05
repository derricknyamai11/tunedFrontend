"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/api-client";

interface Props { modal: string | null; onClose: () => void; }
interface User  { id: string; name: string; email: string; }
interface Writer{ id: string; name: string; email: string; orders_count: number; is_active: boolean; }
interface Svc   { id: string; name: string; }
interface Lvl   { id: string; name: string; }
interface Dl    { id: string; name: string; hours: number; }

/* ── Shared UI atoms ── */
const inp: React.CSSProperties = { width: "100%", height: 35, border: "1px solid #e4e8ee", borderRadius: 9, padding: "0 11px", fontSize: 13, color: "#0d1117", outline: "none", background: "#f8fafc", boxSizing: "border-box" };
const sel: React.CSSProperties = { ...inp, cursor: "pointer" };
const ta:  React.CSSProperties = { width: "100%", border: "1px solid #e4e8ee", borderRadius: 9, padding: "9px 11px", fontSize: 13, color: "#0d1117", outline: "none", background: "#f8fafc", resize: "vertical" as const, minHeight: 80, boxSizing: "border-box" };
const lbl: React.CSSProperties = { display: "block", fontSize: 11.5, fontWeight: 700, color: "#1c2536", marginBottom: 5 };
const row: React.CSSProperties = { marginBottom: 13 };
const g2:  React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 };

const Modal = ({ title, sub, children, onClose, footer }: { title: string; sub: string; children: React.ReactNode; onClose: () => void; footer: React.ReactNode }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(13,17,23,.55)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(3px)" }}
    onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 24px 64px rgba(13,17,23,.16)", padding: 24, width: 500, maxWidth: "94vw", maxHeight: "90vh", overflowY: "auto", border: "1px solid #e4e8ee", position: "relative" }}>
      <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, width: 28, height: 28, borderRadius: "50%", border: "1px solid #e4e8ee", background: "#f8fafc", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#8a96a8", fontSize: 14 }}>✕</button>
      <div style={{ fontSize: 16, fontWeight: 800, color: "#0d1117", letterSpacing: "-.3px", marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 12.5, color: "#8a96a8", marginBottom: 20 }}>{sub}</div>
      {children}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20, paddingTop: 16, borderTop: "1px solid #e4e8ee" }}>{footer}</div>
    </div>
  </div>
);

const BtnOut = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button onClick={onClick} style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 999, height: 33, padding: "0 13px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", color: "#1c2536" }}>{label}</button>
);
const BtnGreen = ({ onClick, label, disabled }: { onClick: () => void; label: string; disabled?: boolean }) => (
  <button onClick={onClick} disabled={disabled} style={{ background: disabled ? "#9ca3af" : "linear-gradient(135deg,#059669,#047857)", border: "none", borderRadius: 999, height: 33, padding: "0 15px", fontSize: 12.5, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", color: "#fff" }}>{label}</button>
);
const BtnRed = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button onClick={onClick} style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)", border: "none", borderRadius: 999, height: 33, padding: "0 15px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", color: "#fff" }}>{label}</button>
);

/* ── Create Order Modal ── */
function CreateOrderModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [users, setUsers]     = useState<User[]>([]);
  const [services, setServices] = useState<Svc[]>([]);
  const [levels, setLevels]   = useState<Lvl[]>([]);
  const [deadlines, setDeadlines] = useState<Dl[]>([]);
  const [form, setForm] = useState({ user_id: "", service_id: "", academic_level_id: "", deadline_id: "", title: "", description: "", word_count: "275" });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    apiGet<{ users: User[] }>("/admin/users?per_page=100").then((r) => { if (r.ok) setUsers(r.data.users || []); });
    apiGet<{ services: Svc[]; levels: Lvl[]; deadlines: Dl[] }>("/quote/options").then((r) => {
      if (r.ok) { setServices(r.data.services || []); setLevels(r.data.levels || []); setDeadlines(r.data.deadlines || []); }
    });
  }, []);

  const submit = async () => {
    if (!form.user_id || !form.service_id || !form.title) { setErr("Please fill all required fields"); return; }
    setSubmitting(true);
    const r = await apiPost<{ id: string }>("/client/orders", {
      service_id: form.service_id,
      academic_level_id: form.academic_level_id,
      deadline_id: form.deadline_id,
      title: form.title,
      description: form.description,
      word_count: parseInt(form.word_count) || 275,
    });
    if (r.ok) { onClose(); router.push("/admin/orders" as never); }
    else setErr((r as { error?: { message?: string } }).error?.message || "Failed to create order");
    setSubmitting(false);
  };

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <Modal title="Create Order" sub="Create a new order on behalf of a client" onClose={onClose}
      footer={<><BtnOut onClick={onClose} label="Cancel" /><BtnGreen onClick={submit} label={submitting ? "Creating…" : "Create Order"} disabled={submitting} /></>}>
      {err && <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#dc2626", marginBottom: 12 }}>{err}</div>}
      <div style={row}><label style={lbl}>Client *</label>
        <select style={sel} value={form.user_id} onChange={f("user_id")}>
          <option value="">Select client…</option>
          {users.filter(u => !("is_admin" in u)).map((u) => <option key={u.id} value={u.id}>{u.name} — {u.email}</option>)}
        </select>
      </div>
      <div style={row}><label style={lbl}>Service *</label>
        <select style={sel} value={form.service_id} onChange={f("service_id")}>
          <option value="">Select service…</option>
          {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div style={g2}>
        <div style={row}><label style={lbl}>Academic Level</label>
          <select style={sel} value={form.academic_level_id} onChange={f("academic_level_id")}>
            <option value="">Select level…</option>
            {levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>
        <div style={row}><label style={lbl}>Deadline</label>
          <select style={sel} value={form.deadline_id} onChange={f("deadline_id")}>
            <option value="">Select deadline…</option>
            {deadlines.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
      </div>
      <div style={row}><label style={lbl}>Title / Topic *</label><input style={inp} value={form.title} onChange={f("title")} placeholder="e.g. Research Paper on Climate Change" /></div>
      <div style={row}><label style={lbl}>Instructions</label><textarea style={ta} value={form.description} onChange={f("description")} placeholder="Detailed instructions…" /></div>
      <div style={row}><label style={lbl}>Word Count</label><input style={inp} type="number" value={form.word_count} onChange={f("word_count")} min={1} /></div>
    </Modal>
  );
}

/* ── Message Client Modal ── */
function MessageClientModal({ onClose }: { onClose: () => void }) {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ user_id: "", message: "", type: "direct" });
  const [done, setDone] = useState(false);

  useEffect(() => {
    apiGet<{ users: User[] }>("/admin/users?per_page=100").then((r) => { if (r.ok) setUsers(r.data.users || []); });
  }, []);

  const send = async () => {
    if (!form.user_id || !form.message) return;
    await apiPost("/admin/chat", { user_id: form.user_id, message: form.message });
    setDone(true);
  };

  return (
    <Modal title="Message Client" sub="Send a direct message to a client" onClose={onClose}
      footer={<><BtnOut onClick={onClose} label="Cancel" /><BtnGreen onClick={done ? onClose : send} label={done ? "Close" : "Send Message"} /></>}>
      {done ? (
        <div style={{ textAlign: "center", padding: "20px 0", color: "#059669" }}>✓ Message sent successfully</div>
      ) : (
        <>
          <div style={row}><label style={lbl}>Client *</label>
            <select style={sel} value={form.user_id} onChange={(e) => setForm((p) => ({ ...p, user_id: e.target.value }))}>
              <option value="">Select client…</option>
              {users.map((u) => <option key={u.id} value={u.id}>{u.name} — {u.email}</option>)}
            </select>
          </div>
          <div style={row}><label style={lbl}>Message Type</label>
            <select style={sel} value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
              <option value="direct">Direct Message</option>
              <option value="update">Order Update</option>
              <option value="promo">Promo / Offer</option>
            </select>
          </div>
          <div style={row}><label style={lbl}>Message *</label><textarea style={ta} value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} placeholder="Type your message…" /></div>
        </>
      )}
    </Modal>
  );
}

/* ── Assign Writer Modal (quick action from dashboard) ── */
function AssignWriterModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  return (
    <Modal title="Assign Writer" sub="Go to Orders to assign a writer to a specific order" onClose={onClose}
      footer={<><BtnOut onClick={onClose} label="Close" /><BtnGreen onClick={() => { onClose(); router.push("/admin/orders" as never); }} label="Go to Orders →" /></>}>
      <div style={{ textAlign: "center", padding: "20px 0", color: "#8a96a8", fontSize: 13 }}>
        To assign a writer, open an order and click the &ldquo;Assign Writer&rdquo; button on that order&apos;s row.
      </div>
    </Modal>
  );
}

/* ── Add Resource Modal ── */
function AddResourceModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", category: "General", access_level: "all", description: "" });
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!form.name) return;
    const r = await apiPost("/admin/resources", form);
    if (r.ok) setDone(true);
  };

  return (
    <Modal title="Add Resource" sub="Add a resource to the library" onClose={onClose}
      footer={<><BtnOut onClick={onClose} label="Cancel" /><BtnGreen onClick={done ? onClose : submit} label={done ? "Close" : "Add Resource"} /></>}>
      {done ? (
        <div style={{ textAlign: "center", padding: "20px 0", color: "#059669" }}>✓ Resource added successfully</div>
      ) : (
        <>
          <div style={row}><label style={lbl}>Resource Name *</label><input style={inp} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. APA 7th Edition Guide" /></div>
          <div style={row}><label style={lbl}>Description</label><input style={inp} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Brief description…" /></div>
          <div style={g2}>
            <div style={row}><label style={lbl}>Category</label>
              <select style={sel} value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
                {["General", "Templates", "Guides", "Samples", "Tools", "Writing Tips"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={row}><label style={lbl}>Access</label>
              <select style={sel} value={form.access_level} onChange={(e) => setForm((p) => ({ ...p, access_level: e.target.value }))}>
                <option value="all">All Users</option>
                <option value="writers">Writers Only</option>
                <option value="admins">Admins Only</option>
              </select>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}

/* ── Generate Report Modal (triggers real CSV download) ── */
function ReportModal({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState("payments");

  const download = () => {
    window.open(`/api/admin/export/${type}`, "_blank");
    onClose();
  };

  return (
    <Modal title="Export Report" sub="Download real data as CSV" onClose={onClose}
      footer={<><BtnOut onClick={onClose} label="Cancel" /><BtnGreen onClick={download} label="⬇ Download CSV" /></>}>
      <div style={row}><label style={lbl}>Report Type</label>
        <select style={sel} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="payments">Payments Report</option>
          <option value="orders">Orders Report</option>
          <option value="users">Users Report</option>
        </select>
      </div>
      <div style={{ fontSize: 12, color: "#8a96a8", marginTop: 8 }}>
        Downloads all data in CSV format. Open in Excel or Google Sheets.
      </div>
    </Modal>
  );
}

/* ── Refund Modal ── */
function RefundModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  return (
    <Modal title="Issue Refund" sub="Go to Payments to issue a refund for a specific payment" onClose={onClose}
      footer={<><BtnOut onClick={onClose} label="Close" /><BtnRed onClick={() => { onClose(); router.push("/admin/payments" as never); }} label="Go to Payments →" /></>}>
      <div style={{ textAlign: "center", padding: "20px 0", color: "#8a96a8", fontSize: 13 }}>
        To issue a refund, find the completed payment in the Payments page and click &ldquo;↩ Refund&rdquo;.
      </div>
    </Modal>
  );
}

/* ── Main export ── */
export function AdminModals({ modal, onClose }: Props) {
  if (!modal) return null;
  if (modal === "order")    return <CreateOrderModal onClose={onClose} />;
  if (modal === "writer")   return <AssignWriterModal onClose={onClose} />;
  if (modal === "msg")      return <MessageClientModal onClose={onClose} />;
  if (modal === "refund")   return <RefundModal onClose={onClose} />;
  if (modal === "resource") return <AddResourceModal onClose={onClose} />;
  if (modal === "report")   return <ReportModal onClose={onClose} />;
  return null;
}
