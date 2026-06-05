"use client";

import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { section: "Main", items: [
    { href: "/admin", label: "Dashboard", icon: "⊞", exact: true },
    { href: "/admin/orders", label: "Orders", icon: "✅" },
    { href: "/admin/users", label: "Users", icon: "👥" },
    { href: "/admin/writers", label: "Writers", icon: "✍️" },
  ]},
  { section: "Finance", items: [
    { href: "/admin/payments", label: "Payments", icon: "💳" },
    { href: "/admin/analytics", label: "Analytics", icon: "📊" },
  ]},
  { section: "Content", items: [
    { href: "/admin/services", label: "Services", icon: "📦" },
    { href: "/admin/blog", label: "Blog", icon: "📚" },
    { href: "/admin/testimonials", label: "Testimonials", icon: "⭐" },
    { href: "/admin/samples", label: "Samples", icon: "📄" },
    { href: "/admin/resources", label: "Resources", icon: "🗂️" },
  ]},
  { section: "Operations", items: [
    { href: "/admin/chat", label: "Live Chat", icon: "💬" },
    { href: "/admin/marketing", label: "Marketing", icon: "📈" },
    { href: "/admin/system", label: "System", icon: "⚙️" },
    { href: "/admin/settings", label: "Settings", icon: "🔧" },
  ]},
];

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href) && (href !== "/admin" || pathname === "/admin");

  const navigate = (href: string) => {
    router.push(href as never);
    onClose?.();
  };

  return (
    <aside
      className={`admin-sidebar${isOpen ? " open" : ""}`}
      style={{
        width: 220, minWidth: 220, background: "#0c111d",
        display: "flex", flexDirection: "column",
        padding: "10px 8px", gap: 1, overflowY: "auto",
        borderRight: "1px solid rgba(255,255,255,.06)",
      }}
    >
      {/* Back to website */}
      <a
        href="/"
        style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 9px", borderRadius: 8, textDecoration: "none", color: "rgba(255,255,255,.35)", marginBottom: 4, transition: "all .13s" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,.055)"; (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,.7)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,.35)"; }}
      >
        <span style={{ fontSize: 13, width: 15, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>←</span>
        <span style={{ fontSize: 12, fontWeight: 500 }}>Back to Website</span>
      </a>
      <div style={{ height: 1, background: "rgba(255,255,255,.06)", margin: "2px 3px 6px" }} />

      {NAV.map((group) => (
        <div key={group.section}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.18)", letterSpacing: ".1em", textTransform: "uppercase", padding: "5px 9px 2px" }}>
            {group.section}
          </div>
          {group.items.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <div
                key={item.href}
                onClick={() => navigate(item.href)}
                style={{
                  display: "flex", alignItems: "center", gap: 9, padding: "8px 9px",
                  borderRadius: 8, cursor: "pointer", transition: "all .13s",
                  color: active ? "#10b981" : "rgba(255,255,255,.38)",
                  background: active ? "rgba(16,185,129,.13)" : "transparent",
                  userSelect: "none",
                }}
                onMouseEnter={(e) => { if (!active) { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,.055)"; (e.currentTarget as HTMLDivElement).style.color = "rgba(255,255,255,.7)"; } }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = active ? "rgba(16,185,129,.13)" : "transparent"; (e.currentTarget as HTMLDivElement).style.color = active ? "#10b981" : "rgba(255,255,255,.38)"; }}
              >
                <span style={{ fontSize: 14, width: 15, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.icon}</span>
                <span style={{ fontSize: 12.5, fontWeight: 500, flex: 1, letterSpacing: "-.1px" }}>{item.label}</span>
              </div>
            );
          })}
          <div style={{ height: 1, background: "rgba(255,255,255,.06)", margin: "6px 3px" }} />
        </div>
      ))}

      {/* System status */}
      <div style={{ marginTop: "auto", paddingTop: 10 }}>
        <a href="/admin/system" style={{ display: "block", textDecoration: "none", background: "rgba(16,185,129,.08)", border: "1px solid rgba(16,185,129,.15)", borderRadius: 10, padding: "9px 11px" }}>
          <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#10b981", marginRight: 5, boxShadow: "0 0 5px rgba(16,185,129,.5)" }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,.5)", fontWeight: 500 }}>System Health</span>
        </a>
      </div>
    </aside>
  );
}
