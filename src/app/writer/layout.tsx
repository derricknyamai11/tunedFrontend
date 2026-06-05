"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiGet } from "@/api-client";
import type { AuthUser } from "@/lib/types/auth.type";

export default function WriterLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<AuthUser & { is_writer?: boolean }>("/auth/me").then((r) => {
      if (!r.ok) { router.replace("/auth/login"); return; }
      // Allow admin or writer
      if (!r.data?.is_admin && !(r.data as any)?.is_writer) {
        router.replace("/client/dashboard");
        return;
      }
      setUser(r.data);
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <html lang="en">
        <body style={{ margin: 0, background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
          <div style={{ textAlign: "center", color: "#8a96a8" }}>Loading writer portal…</div>
        </body>
      </html>
    );
  }

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "W";

  const nav = [
    { href: "/writer", label: "📊 Dashboard", exact: true },
    { href: "/writer/orders", label: "📦 My Orders" },
    { href: "/writer/profile", label: "👤 Profile" },
  ];

  const isActive = (href: string, exact?: boolean) => exact ? pathname === href : pathname.startsWith(href) && (href !== "/writer" || pathname === "/writer");

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", background: "#f0f2f5", height: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Topbar */}
        <header style={{ height: 56, background: "#fff", borderBottom: "1px solid #e4e8ee", display: "flex", alignItems: "center", padding: "0 20px", gap: 0, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 16, color: "#0d1117", fontStyle: "italic" }}>
            <div style={{ width: 26, height: 26, background: "linear-gradient(135deg,#059669,#065f46)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M4 20C6 14 12 8 21 4C19 12 14 19 4 20Z" fill="white" /></svg>
            </div>
            TunedEssays
            <span style={{ background: "#eff6ff", color: "#1d4ed8", fontSize: 9, fontWeight: 800, borderRadius: 999, padding: "2px 7px", letterSpacing: ".05em", textTransform: "uppercase" }}>Writer</span>
          </div>
          <nav style={{ display: "flex", gap: 2, marginLeft: 24 }}>
            {nav.map((n) => (
              <a key={n.href} href={n.href} style={{ padding: "5px 10px", borderRadius: 8, fontSize: 13, fontWeight: isActive(n.href, n.exact) ? 700 : 500, color: isActive(n.href, n.exact) ? "#059669" : "#8a96a8", background: isActive(n.href, n.exact) ? "#f0fdf4" : "transparent", textDecoration: "none" }}>{n.label}</a>
            ))}
          </nav>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 12.5, color: "#4a5568" }}>{user?.name}</div>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff" }}>{initials}</div>
          </div>
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {children}
        </main>
      </body>
    </html>
  );
}
