"use client";

import { useEffect, useState, useRef } from "react";
import { apiGet, apiPost } from "@/api-client";
import { PageShell } from "../_components/PageShell";

interface Chat { id: string; user: { name: string; email: string }; status: string; unread_count: number; last_message: string | null; updated_at: string; }
interface Msg { id: string; message: string; user_id: string | null; is_admin: boolean; created_at: string; }

export default function AdminChat() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selected, setSelected] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const bodyRef = useRef<HTMLDivElement>(null);

  const loadChats = () => {
    apiGet<Chat[]>("/admin/chat").then((r) => { if (r.ok) setChats(Array.isArray(r.data) ? r.data : []); setLoading(false); });
  };

  const loadMessages = (chat: Chat) => {
    setSelected(chat);
    apiGet<{ chat: object; messages: Msg[] }>(`/admin/chat/${chat.id}/messages`).then((r) => {
      if (r.ok) { setMessages(r.data.messages); setTimeout(() => bodyRef.current && (bodyRef.current.scrollTop = 9999), 50); }
    });
  };

  useEffect(() => { loadChats(); const t = setInterval(loadChats, 15000); return () => clearInterval(t); }, []);

  const send = async () => {
    if (!input.trim() || !selected) return;
    const msg = input.trim(); setInput("");
    await apiPost(`/admin/chat/${selected.id}/messages`, { message: msg });
    loadMessages(selected); loadChats();
  };

  const initials = (name: string) => name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <PageShell title="Live Chat" sub="Manage real-time conversations with clients">
      <div style={{ display: "flex", gap: 14, height: 520 }}>
        {/* Chat list */}
        <div style={{ width: 260, background: "#fff", border: "1px solid #e4e8ee", borderRadius: 14, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #e4e8ee", fontWeight: 700, fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Conversations <span style={{ fontSize: 11, color: "#8a96a8" }}>{chats.filter((c) => c.unread_count > 0).length} unread</span>
          </div>
          <div style={{ overflowY: "auto", flex: 1, padding: 8 }}>
            {loading ? <div style={{ padding: 20, textAlign: "center", color: "#8a96a8", fontSize: 12 }}>Loading…</div> :
              chats.length === 0 ? <div style={{ padding: 20, textAlign: "center", color: "#8a96a8", fontSize: 12 }}>No conversations yet</div> :
              chats.map((c) => (
                <div key={c.id} onClick={() => loadMessages(c)} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 10px", borderRadius: 10, cursor: "pointer", background: selected?.id === c.id ? "#f0fdf4" : "transparent", border: selected?.id === c.id ? "1px solid rgba(5,150,105,.15)" : "1px solid transparent", marginBottom: 2, position: "relative", transition: "all .13s" }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{initials(c.user.name)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: "#0d1117" }}>{c.user.name}</div>
                    <div style={{ fontSize: 11.5, color: "#8a96a8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.last_message || "No messages yet"}</div>
                  </div>
                  <div style={{ position: "absolute", top: 10, right: 10, fontSize: 10, color: "#c1cad6" }}>{new Date(c.updated_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                  {c.unread_count > 0 && <div style={{ position: "absolute", bottom: 10, right: 10, background: "#059669", color: "#fff", fontSize: 9, fontWeight: 800, borderRadius: 999, padding: "1px 5px" }}>{c.unread_count}</div>}
                </div>
              ))
            }
          </div>
        </div>

        {/* Chat window */}
        <div style={{ flex: 1, background: "#fff", border: "1px solid #e4e8ee", borderRadius: 14, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {!selected ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#8a96a8", fontSize: 13 }}>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>Select a conversation to start chatting</div>
            </div>
          ) : (<>
            <div style={{ padding: "12px 14px", borderBottom: "1px solid #e4e8ee", background: "linear-gradient(135deg,#065f46,#047857)", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff" }}>{initials(selected.user.name)}</div>
              <div><div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{selected.user.name}</div><div style={{ fontSize: 11, color: "rgba(255,255,255,.6)" }}>{selected.user.email}</div></div>
            </div>
            <div ref={bodyRef} style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10, background: "#f8fafc" }}>
              {messages.length === 0 ? <div style={{ textAlign: "center", color: "#c1cad6", fontSize: 12, marginTop: 20 }}>No messages yet</div> :
                messages.map((m) => (
                  <div key={m.id} style={{ display: "flex", justifyContent: m.is_admin ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: "70%", padding: "9px 12px", borderRadius: 12, fontSize: 12.5, lineHeight: 1.5, background: m.is_admin ? "linear-gradient(135deg,#059669,#047857)" : "#fff", color: m.is_admin ? "#fff" : "#1c2536", border: m.is_admin ? "none" : "1px solid #e4e8ee", boxShadow: "0 1px 3px rgba(0,0,0,.06)", borderTopRightRadius: m.is_admin ? 3 : 12, borderTopLeftRadius: m.is_admin ? 12 : 3 }}>
                      {m.message}
                      <div style={{ fontSize: 9.5, color: m.is_admin ? "rgba(255,255,255,.6)" : "#c1cad6", marginTop: 3, textAlign: m.is_admin ? "right" : "left" }}>{new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                    </div>
                  </div>
                ))
              }
            </div>
            <div style={{ padding: "10px 12px", borderTop: "1px solid #e4e8ee", display: "flex", gap: 8, background: "#fff" }}>
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type a message…" style={{ flex: 1, height: 34, border: "1px solid #e4e8ee", borderRadius: 999, padding: "0 12px", fontSize: 12.5, outline: "none" }} />
              <button onClick={send} style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#059669,#047857)", border: "none", cursor: "pointer", color: "#fff", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>➤</button>
            </div>
          </>)}
        </div>
      </div>
    </PageShell>
  );
}
