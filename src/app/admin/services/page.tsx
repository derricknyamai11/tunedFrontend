"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPatch } from "@/api-client";
import { PageShell, Card, Badge, Table, Btn, Toast } from "../_components/PageShell";

interface RawService {
  id: string;
  name: string;
  slug: string;
  category?: string | { name?: string } | null;
  description?: string | null;
  is_active: boolean;
  pricing_category?: string | { name?: string } | null;
}

function getName(v: RawService["category"] | RawService["pricing_category"]): string {
  if (!v) return "—";
  if (typeof v === "string") return v;
  if (typeof v === "object" && v.name) return v.name;
  return "—";
}

export default function AdminServices() {
  const [services, setServices] = useState<RawService[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ msg: "", show: false });

  const showToast = (msg: string) => { setToast({ msg, show: true }); setTimeout(() => setToast({ msg, show: false }), 2800); };

  const load = () => {
    setLoading(true);
    apiGet<RawService[]>("/services").then((r) => {
      if (r.ok) setServices(Array.isArray(r.data) ? r.data : []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const toggle = async (svc: RawService) => {
    const r = await apiPatch(`/admin/services/${svc.id}`, { is_active: !svc.is_active });
    if (r.ok) { showToast(svc.is_active ? `"${svc.name}" paused` : `✓ "${svc.name}" activated`); load(); }
    else showToast("✗ Failed to update");
  };

  const uniqueCategories = new Set(services.map((s) => getName(s.category)));
  const uniquePricing    = new Set(services.map((s) => getName(s.pricing_category)));

  return (
    <PageShell title="Services" sub="Manage service offerings — activate or pause services">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 18 }}>
        <Card><div style={{ fontSize: 11.5, color: "#8a96a8", marginBottom: 4 }}>Total</div><div style={{ fontSize: 24, fontWeight: 800 }}>{services.length}</div></Card>
        <Card><div style={{ fontSize: 11.5, color: "#8a96a8", marginBottom: 4 }}>Active</div><div style={{ fontSize: 24, fontWeight: 800, color: "#059669" }}>{services.filter((s) => s.is_active).length}</div></Card>
        <Card><div style={{ fontSize: 11.5, color: "#8a96a8", marginBottom: 4 }}>Paused</div><div style={{ fontSize: 24, fontWeight: 800, color: "#f59e0b" }}>{services.filter((s) => !s.is_active).length}</div></Card>
        <Card><div style={{ fontSize: 11.5, color: "#8a96a8", marginBottom: 4 }}>Categories</div><div style={{ fontSize: 24, fontWeight: 800 }}>{uniqueCategories.size}</div></Card>
        <Card><div style={{ fontSize: 11.5, color: "#8a96a8", marginBottom: 4 }}>Pricing Tiers</div><div style={{ fontSize: 24, fontWeight: 800 }}>{uniquePricing.size}</div></Card>
      </div>

      <Card>
        {loading ? <div style={{ padding: 32, textAlign: "center", color: "#8a96a8" }}>Loading services…</div> :
          services.length === 0 ? <div style={{ padding: 32, textAlign: "center", color: "#8a96a8" }}>No services found.</div> :
          <div style={{ overflowX: "auto" }}>
            <Table
              headers={["Service", "Category", "Pricing Tier", "Status", "Actions"]}
              rows={services.map((s) => [
                <div key="n">
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: "#8a96a8" }}>/{s.slug}</div>
                </div>,
                <span key="c" style={{ fontSize: 12.5 }}>{getName(s.category)}</span>,
                <span key="p" style={{ fontSize: 12, color: "#7c3aed", fontWeight: 600, textTransform: "capitalize" }}>{getName(s.pricing_category)}</span>,
                <Badge key="s" text={s.is_active ? "Active" : "Paused"} color={s.is_active ? "green" : "yellow"} />,
                <Btn key="a" label={s.is_active ? "Pause" : "Activate"} onClick={() => toggle(s)} color={s.is_active ? "yellow" : "green"} size="sm" />,
              ])}
            />
          </div>
        }
      </Card>
      <Toast msg={toast.msg} show={toast.show} />
    </PageShell>
  );
}
