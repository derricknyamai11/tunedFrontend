"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete } from "@/api-client";
import { PageShell, Card, Badge, Table, Modal, FormField, Inp, Sel, Btn, Toast } from "../_components/PageShell";

interface Sample { id: string; title: string; slug: string; excerpt: string; featured: boolean; word_count: number; service: string | null; created_at: string; }
interface Service { id: string; name: string; }

export default function AdminSamples() {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", word_count: 500, featured: false, service_id: "" });
  const [toast, setToast] = useState({ msg: "", show: false });

  const showToast = (msg: string) => { setToast({ msg, show: true }); setTimeout(() => setToast({ msg, show: false }), 2800); };

  const load = () => {
    setLoading(true);
    apiGet<Sample[]>("/admin/samples").then((r) => { if (r.ok) setSamples(Array.isArray(r.data) ? r.data : []); setLoading(false); });
    apiGet<Service[]>("/services").then((r) => { if (r.ok) setServices(Array.isArray(r.data) ? r.data : []); });
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.title.trim()) return showToast("Title is required");
    const r = await apiPost("/admin/samples", { ...form, word_count: Number(form.word_count) });
    if ((r as any).ok !== false) { showToast("✓ Sample created"); setShowCreate(false); setForm({ title: "", content: "", word_count: 500, featured: false, service_id: "" }); load(); }
  };

  const deleteSample = async (id: string) => {
    if (!confirm("Delete this sample? This cannot be undone.")) return;
    const r = await apiDelete(`/admin/samples/${id}`);
    if (r.ok) { showToast("Sample deleted"); load(); }
    else showToast("✗ Failed to delete");
  };

  return (
    <PageShell title="Sample Essays" sub="Manage sample essays visible to potential clients"
      actions={<Btn label="+ Upload Sample" onClick={() => setShowCreate(true)} />}>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 18 }}>
        <Card><div style={{ fontSize: 11.5, color: "#8a96a8" }}>Total Samples</div><div style={{ fontSize: 22, fontWeight: 800 }}>{samples.length}</div></Card>
        <Card><div style={{ fontSize: 11.5, color: "#8a96a8" }}>Featured</div><div style={{ fontSize: 22, fontWeight: 800, color: "#f59e0b" }}>{samples.filter((s) => s.featured).length}</div></Card>
        <Card><div style={{ fontSize: 11.5, color: "#8a96a8" }}>Avg Word Count</div><div style={{ fontSize: 22, fontWeight: 800 }}>{samples.length ? Math.round(samples.reduce((s, x) => s + x.word_count, 0) / samples.length) : 0}</div></Card>
      </div>

      <Card>
        {loading ? <div style={{ padding: 32, textAlign: "center", color: "#8a96a8" }}>Loading…</div> :
          samples.length === 0 ? <div style={{ padding: 32, textAlign: "center", color: "#8a96a8" }}>No samples yet. Upload your first sample essay!</div> :
          <Table
            headers={["Title", "Service", "Words", "Featured", "Date", "Actions"]}
            rows={samples.map((s) => [
              <div key="t"><div style={{ fontWeight: 600, fontSize: 12.5 }}>{s.title}</div><div style={{ fontSize: 11, color: "#8a96a8" }}>/{s.slug}</div></div>,
              <span key="svc" style={{ fontSize: 12 }}>{s.service || "General"}</span>,
              <span key="w" style={{ fontSize: 12 }}>{s.word_count.toLocaleString()}</span>,
              <Badge key="f" text={s.featured ? "Featured" : "Standard"} color={s.featured ? "yellow" : "gray"} />,
              <span key="d" style={{ fontSize: 11, color: "#8a96a8" }}>{new Date(s.created_at).toLocaleDateString()}</span>,
              <Btn key="del" label="Delete" onClick={() => deleteSample(s.id)} color="red" size="sm" />,
            ])}
          />
        }
      </Card>

      <Modal title="Upload Sample Essay" open={showCreate} onClose={() => setShowCreate(false)}
        footer={<><Btn label="Cancel" onClick={() => setShowCreate(false)} color="outline" /><Btn label="Create Sample" onClick={create} /></>}>
        <FormField label="Title *"><Inp value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Sample essay title…" /></FormField>
        <FormField label="Service Category">
          <Sel value={form.service_id} onChange={(e) => setForm({ ...form, service_id: e.target.value })}>
            <option value="">General</option>
            {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Sel>
        </FormField>
        <FormField label="Word Count"><Inp type="number" value={form.word_count} onChange={(e) => setForm({ ...form, word_count: Number(e.target.value) })} /></FormField>
        <FormField label="Content (paste essay text)">
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Paste the sample essay content here…" style={{ width: "100%", border: "1px solid #e4e8ee", borderRadius: 9, padding: "9px 11px", fontSize: 12.5, outline: "none", background: "#f8fafc", resize: "vertical", minHeight: 120 }} />
        </FormField>
        <FormField label="Featured">
          <Sel value={form.featured ? "yes" : "no"} onChange={(e) => setForm({ ...form, featured: e.target.value === "yes" })}>
            <option value="no">Standard</option><option value="yes">Featured on Homepage</option>
          </Sel>
        </FormField>
      </Modal>

      <Toast msg={toast.msg} show={toast.show} />
    </PageShell>
  );
}
