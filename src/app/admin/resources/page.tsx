"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete } from "@/api-client";
import { PageShell, Card, Badge, Table, Modal, FormField, Inp, Sel, Textarea, Btn, Toast } from "../_components/PageShell";

interface Resource { id: string; name: string; description: string | null; file_type: string | null; category: string | null; access_level: string; download_count: number; created_at: string; }

export default function AdminResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", category: "General", access_level: "all" });
  const [toast, setToast] = useState({ msg: "", show: false });

  const showToast = (msg: string) => { setToast({ msg, show: true }); setTimeout(() => setToast({ msg, show: false }), 2800); };

  const load = () => {
    setLoading(true);
    apiGet<Resource[]>("/admin/resources").then((r) => { if (r.ok) setResources(Array.isArray(r.data) ? r.data : []); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.name.trim()) return showToast("Name is required");
    const r = await apiPost("/admin/resources", form);
    if ((r as any).ok !== false) { showToast("✓ Resource created"); setShowCreate(false); setForm({ name: "", description: "", category: "General", access_level: "all" }); load(); }
  };

  const deleteResource = async (id: string) => {
    if (!confirm("Delete this resource? This cannot be undone.")) return;
    const r = await apiDelete(`/admin/resources/${id}`);
    if (r.ok) { showToast("Resource deleted"); load(); }
    else showToast("✗ Failed to delete");
  };

  return (
    <PageShell title="Resource Library" sub="Manage shared resources, guides and templates"
      actions={<Btn label="+ Add Resource" onClick={() => setShowCreate(true)} />}>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }}>
        <Card><div style={{ fontSize: 11.5, color: "#8a96a8" }}>Total Resources</div><div style={{ fontSize: 22, fontWeight: 800 }}>{resources.length}</div></Card>
        <Card><div style={{ fontSize: 11.5, color: "#8a96a8" }}>Public</div><div style={{ fontSize: 22, fontWeight: 800, color: "#059669" }}>{resources.filter((r) => r.access_level === "all").length}</div></Card>
        <Card><div style={{ fontSize: 11.5, color: "#8a96a8" }}>Writers Only</div><div style={{ fontSize: 22, fontWeight: 800, color: "#8b5cf6" }}>{resources.filter((r) => r.access_level === "writers").length}</div></Card>
        <Card><div style={{ fontSize: 11.5, color: "#8a96a8" }}>Total Downloads</div><div style={{ fontSize: 22, fontWeight: 800 }}>{resources.reduce((s, r) => s + r.download_count, 0).toLocaleString()}</div></Card>
      </div>

      <Card>
        {loading ? <div style={{ padding: 32, textAlign: "center", color: "#8a96a8" }}>Loading…</div> :
          resources.length === 0 ? <div style={{ padding: 32, textAlign: "center", color: "#8a96a8" }}>No resources yet. Add your first resource!</div> :
          <Table
            headers={["Resource", "Category", "Access", "Downloads", "Date", "Actions"]}
            rows={resources.map((r) => [
              <div key="n"><div style={{ fontWeight: 600, fontSize: 12.5 }}>{r.name}</div>{r.description && <div style={{ fontSize: 11, color: "#8a96a8" }}>{r.description.slice(0, 50)}…</div>}</div>,
              <span key="c" style={{ fontSize: 12 }}>{r.category || "General"}</span>,
              <Badge key="a" text={r.access_level === "all" ? "Public" : r.access_level === "writers" ? "Writers" : "Admins"} color={r.access_level === "all" ? "green" : r.access_level === "writers" ? "blue" : "purple"} />,
              <span key="d" style={{ fontSize: 12, fontWeight: 600 }}>⬇️ {r.download_count}</span>,
              <span key="dt" style={{ fontSize: 11, color: "#8a96a8" }}>{new Date(r.created_at).toLocaleDateString()}</span>,
              <Btn key="del" label="Delete" onClick={() => deleteResource(r.id)} color="red" size="sm" />,
            ])}
          />
        }
      </Card>

      <Modal title="Add Resource" open={showCreate} onClose={() => setShowCreate(false)}
        footer={<><Btn label="Cancel" onClick={() => setShowCreate(false)} color="outline" /><Btn label="Add Resource" onClick={create} /></>}>
        <FormField label="Name *"><Inp value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. APA 7th Edition Guide" /></FormField>
        <FormField label="Description"><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description…" style={{ minHeight: 60 }} /></FormField>
        <FormField label="Category">
          <Sel value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {["General", "Templates", "Guides", "Samples", "Tools", "Writing Tips"].map((c) => <option key={c} value={c}>{c}</option>)}
          </Sel>
        </FormField>
        <FormField label="Access Level">
          <Sel value={form.access_level} onChange={(e) => setForm({ ...form, access_level: e.target.value })}>
            <option value="all">All Users (Public)</option>
            <option value="writers">Writers Only</option>
            <option value="admins">Admins Only</option>
          </Sel>
        </FormField>
      </Modal>

      <Toast msg={toast.msg} show={toast.show} />
    </PageShell>
  );
}
