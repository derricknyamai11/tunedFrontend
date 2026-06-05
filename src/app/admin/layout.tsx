"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet } from "@/api-client";
import type { AuthUser } from "@/lib/types/auth.type";
import { AdminSidebar } from "./_components/AdminSidebar";
import { AdminTopbar } from "./_components/AdminTopbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    apiGet<AuthUser>("/auth/me").then((r) => {
      if (!r.ok || !r.data) {
        routerRef.current.replace("/auth/login");
        return;
      }
      if (!r.data.is_admin) {
        // Not admin — go to login, not client dashboard
        // (could be a writer or client who navigated here directly)
        routerRef.current.replace("/auth/login");
        return;
      }
      setUser(r.data);
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <html lang="en">
        <body style={{ margin: 0, background: "#0c111d", display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 40, height: 40, border: "3px solid #059669", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: "system-ui" }}>Loading admin portal…</p>
          </div>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", background: "#f0f2f5", height: "100vh", overflow: "hidden" }}>
        <style>{`
          *{box-sizing:border-box}
          ::-webkit-scrollbar{width:4px;height:4px}
          ::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.15);border-radius:4px}
          ::-webkit-scrollbar-track{background:transparent}
          @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
          .page-anim{animation:fadeUp .2s ease}
          input,select,textarea,button{font-family:inherit}
          .admin-sidebar-overlay{display:none}
          @media(max-width:768px){
            .admin-sidebar{transform:translateX(-100%);transition:transform .25s ease;position:fixed!important;top:0;left:0;height:100vh;z-index:200}
            .admin-sidebar.open{transform:translateX(0)}
            .admin-sidebar-overlay{display:block;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:199}
            .admin-main-content{margin-left:0!important}
          }
        `}</style>
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
          <AdminTopbar user={user!} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
            {/* Mobile overlay */}
            {sidebarOpen && (
              <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
            )}
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="admin-main-content" style={{ flex: 1, overflowY: "auto", background: "#f0f2f5", padding: "20px" }}>
              <div className="page-anim">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
