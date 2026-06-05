"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/api-client";

interface Profile { id: string; name: string; email: string; orders_assigned: number; is_writer: boolean; }

export default function WriterProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    apiGet<Profile>("/writer/profile").then((r) => { if (r.ok) setProfile(r.data); });
  }, []);

  if (!profile) return <div style={{ padding: 32, textAlign: "center", color: "#8a96a8" }}>Loading…</div>;

  const initials = profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <div style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 14, padding: 24, textAlign: "center", marginBottom: 16 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 auto 12px" }}>{initials}</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#0d1117" }}>{profile.name}</div>
        <div style={{ fontSize: 13, color: "#8a96a8", marginTop: 3 }}>{profile.email}</div>
        <div style={{ display: "inline-block", marginTop: 10, background: "#eff6ff", color: "#1d4ed8", fontSize: 11, fontWeight: 700, borderRadius: 999, padding: "3px 12px" }}>✍️ Verified Writer</div>
      </div>
      <div style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 14, padding: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#8a96a8", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 12 }}>Performance Stats</div>
        {[
          { label: "Total Orders Assigned", value: profile.orders_assigned },
          { label: "Writer Status", value: "Active" },
          { label: "Account Type", value: "Writer" },
        ].map((r) => (
          <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f0f2f5", fontSize: 13 }}>
            <span style={{ color: "#4a5568" }}>{r.label}</span>
            <strong style={{ color: "#0d1117" }}>{r.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
