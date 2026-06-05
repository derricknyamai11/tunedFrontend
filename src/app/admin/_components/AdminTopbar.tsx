"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/api-client";
import type { AuthUser } from "@/lib/types/auth.type";

interface Notification {
  id: string;
  icon: string;
  bg: string;
  text: string;
  time: string;
  unread: boolean;
}

interface RecentOrder { id: string; order_number: string; title: string; status: string; created_at: string; }
interface ChatThread { id: string; client_name: string; last_message: string; unread_count: number; updated_at: string; }

export function AdminTopbar({ user, onMenuClick }: { user: AuthUser; onMenuClick?: () => void }) {
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "AD";

  // Load live notifications from recent orders + chat
  useEffect(() => {
    Promise.all([
      apiGet<{ orders: RecentOrder[] }>("/admin/orders?per_page=3"),
      apiGet<{ chats: ChatThread[] }>("/admin/chat"),
    ]).then(([ordersRes, chatRes]) => {
      const notifs: Notification[] = [];

      if (ordersRes.ok && ordersRes.data.orders) {
        ordersRes.data.orders.slice(0, 3).forEach((o) => {
          const STATUS_ICONS: Record<string, { icon: string; bg: string }> = {
            pending: { icon: "🛒", bg: "#ecfdf5" },
            active: { icon: "📝", bg: "#eff6ff" },
            revision: { icon: "🔄", bg: "#fdf4ff" },
            overdue: { icon: "⚠️", bg: "#fff7ed" },
            completed: { icon: "✅", bg: "#f0fdf4" },
          };
          const si = STATUS_ICONS[o.status] || { icon: "📦", bg: "#f8fafc" };
          notifs.push({
            id: o.id,
            icon: si.icon,
            bg: si.bg,
            text: `Order #${o.order_number} — ${o.title.slice(0, 45)}${o.title.length > 45 ? "…" : ""}`,
            time: formatAgo(o.created_at),
            unread: o.status === "pending",
          });
        });
      }

      if (chatRes.ok && chatRes.data.chats) {
        chatRes.data.chats.slice(0, 2).forEach((c) => {
          if (c.unread_count > 0) {
            notifs.push({
              id: `chat_${c.id}`,
              icon: "💬",
              bg: "#ecfdf5",
              text: `New message from ${c.client_name}: ${c.last_message?.slice(0, 40) || "…"}`,
              time: formatAgo(c.updated_at),
              unread: true,
            });
          }
        });
      }

      setNotifications(notifs);
      setUnreadCount(notifs.filter((n) => n.unread).length);
    });
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await apiPost("/auth/logout", {});
    window.location.href = "/auth/login";
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const s: Record<string, React.CSSProperties> = {
    bar: { height: 58, background: "rgba(255,255,255,.97)", backdropFilter: "blur(16px)", borderBottom: "1px solid #e4e8ee", display: "flex", alignItems: "center", padding: "0 18px", gap: 0, flexShrink: 0, zIndex: 60, position: "relative" },
    brand: { display: "flex", alignItems: "center", gap: 9, fontSize: 16.5, fontWeight: 800, color: "#0d1117", letterSpacing: "-.4px", marginRight: 22, cursor: "pointer", fontStyle: "italic", textDecoration: "none" },
    brandIcon: { width: 29, height: 29, background: "linear-gradient(135deg,#059669,#065f46)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(5,150,105,.32)" },
    badge: { background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", fontSize: 9, fontWeight: 800, borderRadius: 999, padding: "2px 7px", letterSpacing: ".05em", textTransform: "uppercase" as const, marginLeft: 6 },
    searchWrap: { position: "relative" as const, flex: 1, maxWidth: 280 },
    searchInp: { height: 33, border: "1px solid #e4e8ee", borderRadius: 999, padding: "0 12px 0 34px", fontSize: 12.5, color: "#0d1117", outline: "none", background: "#f8fafc", width: "100%" },
    right: { display: "flex", alignItems: "center", gap: 6, marginLeft: 12 },
    tbBtn: { width: 32, height: 32, borderRadius: 8, border: "1px solid #e4e8ee", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#8a96a8", position: "relative" as const, flexShrink: 0 },
    av: { width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 11, fontWeight: 800, color: "#fff", border: "2px solid transparent", boxShadow: "0 2px 8px rgba(124,58,237,.28)", flexShrink: 0 },
    dot: { position: "absolute" as const, top: 4, right: 4, width: 7, height: 7, borderRadius: "50%", background: "#ef4444", border: "2px solid #fff" },
    dotGreen: { position: "absolute" as const, top: 4, right: 4, width: 7, height: 7, borderRadius: "50%", background: "#059669", border: "2px solid #fff" },
    menu: { position: "absolute" as const, top: "calc(100% + 9px)", right: 0, background: "#fff", border: "1px solid #e4e8ee", borderRadius: 14, boxShadow: "0 24px 64px rgba(13,17,23,.16)", zIndex: 300, overflow: "hidden" },
  };

  return (
    <header style={s.bar}>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent 0%,rgba(5,150,105,.25) 50%,transparent 100%)" }} />

      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        style={{ ...s.tbBtn, display: "none", marginRight: 8 }}
        className="admin-hamburger"
        aria-label="Menu"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>

      {/* Brand */}
      <a href="/admin" style={s.brand}>
        <div style={s.brandIcon}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M4 20C6 14 12 8 21 4C19 12 14 19 4 20Z" fill="white" opacity=".95" />
            <path d="M4 20C6 16 9 12 13 10" stroke="rgba(255,255,255,.5)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <span className="admin-brand-text">TunedEssays</span>
        <span style={s.badge} className="admin-brand-badge">Admin</span>
      </a>

      {/* Search — hidden on small screens */}
      <div style={{ ...s.searchWrap, marginLeft: 8 }} className="admin-search">
        <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#c1cad6", pointerEvents: "none" }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
        <input style={s.searchInp} placeholder="Search orders, clients…" />
      </div>

      {/* Right actions */}
      <div style={s.right}>
        {/* Back to website */}
        <a href="/" style={{ ...s.tbBtn, textDecoration: "none", color: "#8a96a8" }} title="Back to website" className="admin-home-btn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </a>

        {/* Notifications */}
        <div style={{ position: "relative" }} ref={notifRef}>
          <button style={s.tbBtn} onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }} aria-label="Notifications">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
            {unreadCount > 0 && <span style={s.dot} />}
          </button>
          {notifOpen && (
            <div style={{ ...s.menu, width: 310 }}>
              <div style={{ padding: "11px 14px", borderBottom: "1px solid #e4e8ee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>Notifications {unreadCount > 0 && `(${unreadCount})`}</span>
                <span style={{ fontSize: 11, color: "#059669", fontWeight: 600, cursor: "pointer" }} onClick={clearNotifications}>Clear all</span>
              </div>
              {notifications.length === 0 ? (
                <div style={{ padding: 20, textAlign: "center", color: "#8a96a8", fontSize: 12 }}>No new notifications</div>
              ) : notifications.map((n) => (
                <div key={n.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "11px 14px", borderBottom: "1px solid #e4e8ee", background: n.unread ? "#f0fdf4" : "#fff", cursor: "pointer" }}
                  onClick={() => { router.push("/admin/orders"); setNotifOpen(false); }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: n.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{n.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: "#1c2536", fontWeight: 500, lineHeight: 1.4 }}>{n.text}</div>
                    <div style={{ fontSize: 10.5, color: "#c1cad6", marginTop: 2 }}>{n.time}</div>
                  </div>
                  {n.unread && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#059669", flexShrink: 0, marginTop: 4 }} />}
                </div>
              ))}
              <div style={{ padding: "9px 14px", textAlign: "center" }}>
                <span style={{ fontSize: 11.5, color: "#059669", fontWeight: 600, cursor: "pointer" }} onClick={() => { router.push("/admin/orders"); setNotifOpen(false); }}>View all orders →</span>
              </div>
            </div>
          )}
        </div>

        {/* Chat */}
        <button style={s.tbBtn} onClick={() => router.push("/admin/chat")} title="Live Chat">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          <span style={s.dotGreen} />
        </button>

        {/* Avatar + Profile Menu */}
        <div style={{ position: "relative" }} ref={profileRef}>
          <div style={s.av} onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}>
            {initials}
          </div>
          {profileOpen && (
            <div style={{ ...s.menu, minWidth: 196 }}>
              <div style={{ padding: "11px 13px", background: "linear-gradient(135deg,#f5f3ff,#ede9fe)", borderBottom: "1px solid #e4e8ee" }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{user?.name}</div>
                <div style={{ fontSize: 11, color: "#8a96a8", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 170 }}>{user?.email}</div>
                <div style={{ fontSize: 9.5, fontWeight: 800, color: "#7c3aed", background: "#f5f3ff", borderRadius: 999, padding: "1px 6px", display: "inline-block", marginTop: 3, textTransform: "uppercase" }}>Super Admin</div>
              </div>
              {[
                { icon: "⚙️", label: "Settings", href: "/admin/settings" },
                { icon: "📊", label: "Analytics", href: "/admin/analytics" },
                { icon: "💳", label: "Payments", href: "/admin/payments" },
                { icon: "⚡", label: "System Health", href: "/admin/system" },
              ].map((item) => (
                <div key={item.label}
                  onClick={() => { router.push(item.href as never); setProfileOpen(false); }}
                  style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 13px", fontSize: 12.5, color: "#1c2536", cursor: "pointer", transition: "background .15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <span>{item.icon}</span>{item.label}
                </div>
              ))}
              <div style={{ height: 1, background: "#e4e8ee" }} />
              <div
                onClick={handleLogout}
                style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 13px", fontSize: 12.5, color: "#dc2626", cursor: "pointer", transition: "background .15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fff1f2")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <span>🚪</span>Sign Out
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          .admin-hamburger{display:flex!important}
          .admin-search{display:none!important}
          .admin-brand-badge{display:none}
          .admin-home-btn{display:none!important}
        }
      `}</style>
    </header>
  );
}

function formatAgo(iso: string): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
