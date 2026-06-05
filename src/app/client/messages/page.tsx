"use client";

import { useEffect, useState, useRef } from "react";
import { apiGet, apiPost } from "@/api-client";

interface Chat { id: string; subject: string; status: string; unread_count: number; last_message: string | null; updated_at: string; }
interface Msg { id: string; message: string; is_admin: boolean; created_at: string; }

export default function MessagesPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selected, setSelected] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [subject, setSubject] = useState("");
  const [firstMsg, setFirstMsg] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const bodyRef = useRef<HTMLDivElement>(null);

  const loadChats = () => {
    apiGet<Chat[]>("/client/chat").then((r) => {
      if (r.ok) setChats(Array.isArray(r.data) ? r.data : []);
      setLoading(false);
    });
  };

  const loadMsgs = (chat: Chat) => {
    setSelected(chat);
    apiGet<{ chat: object; messages: Msg[] }>(`/client/chat/${chat.id}/messages`).then((r) => {
      if (r.ok) { setMessages(r.data.messages); setTimeout(() => bodyRef.current && (bodyRef.current.scrollTop = 9999), 50); }
    });
  };

  useEffect(() => { loadChats(); const t = setInterval(loadChats, 20000); return () => clearInterval(t); }, []);

  const send = async () => {
    if (!input.trim() || !selected) return;
    const msg = input.trim(); setInput("");
    const r = await apiPost(`/client/chat/${selected.id}/messages`, { message: msg });
    if (r.ok) loadMsgs(selected);
    loadChats();
  };

  const createChat = async () => {
    if (!subject.trim()) return;
    const r = await apiPost<{ chat_id: string }>("/client/chat", { subject, message: firstMsg });
    if (r.ok) { loadChats(); setShowNew(false); setSubject(""); setFirstMsg(""); }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div><div style={{ fontSize: 19, fontWeight: 800, color: "#0d1117" }}>Messages</div><div style={{ fontSize: 12.5, color: "#8a96a8" }}>Chat with TunedEssays support team</div></div>
        <button onClick={() => setShowNew(true)} style={{ background: "linear-gradient(135deg,#059669,#047857)", color: "#fff", border: "none", borderRadius: 999, height: 33, padding: "0 16px", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>+ New Conversation</button>
      </div>

      <div style={{ display: "flex", gap: 14, height: 500 }}>
        {/* Chats list */}
        <div style={{ width: 250, background: "#fff", border: "1px solid #e4e8ee", borderRadius: 14, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #e4e8ee", fontWeight: 700, fontSize: 13 }}>Conversations</div>
          <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
            {loading ? <div style={{ padding: 16, textAlign: "center", color: "#8a96a8", fontSize: 12 }}>Loading…</div> :
              chats.length === 0 ? (
                <div style={{ padding: 20, textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>💬</div>
                  <div style={{ fontSize: 12, color: "#8a96a8", marginBottom: 12 }}>No conversations yet</div>
                  <button onClick={() => setShowNew(true)} style={{ fontSize: 11.5, fontWeight: 600, color: "#059669", background: "#f0fdf4", border: "1px solid rgba(5,150,105,.2)", borderRadius: 999, padding: "5px 12px", cursor: "pointer" }}>Start a conversation</button>
                </div>
              ) :
              chats.map((c) => (
                <div key={c.id} onClick={() => loadMsgs(c)} style={{ padding: "10px 10px", borderRadius: 10, cursor: "pointer", background: selected?.id === c.id ? "#f0fdf4" : "transparent", border: `1px solid ${selected?.id === c.id ? "rgba(5,150,105,.15)" : "transparent"}`, marginBottom: 2, position: "relative" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#059669,#047857)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff", flexShrink: 0 }}>TE</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: "#0d1117", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.subject}</div>
                      <div style={{ fontSize: 11, color: "#8a96a8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.last_message || "No messages yet"}</div>
                    </div>
                  </div>
                  {c.unread_count > 0 && <div style={{ position: "absolute", top: 8, right: 8, background: "#059669", color: "#fff", fontSize: 9, fontWeight: 800, borderRadius: 999, padding: "1px 5px" }}>{c.unread_count}</div>}
                </div>
              ))
            }
          </div>
        </div>

        {/* Chat window */}
        <div style={{ flex: 1, background: "#fff", border: "1px solid #e4e8ee", borderRadius: 14, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {!selected ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center", color: "#8a96a8" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>💬</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Select a conversation</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>or start a new one</div>
              </div>
            </div>
          ) : (<>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #e4e8ee", background: "linear-gradient(135deg,#065f46,#047857)", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff" }}>TE</div>
              <div><div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>TunedEssays Support</div><div style={{ fontSize: 11, color: "rgba(255,255,255,.6)" }}>{selected.subject}</div></div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "rgba(255,255,255,.6)" }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }} />Online</div>
            </div>
            <div ref={bodyRef} style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 8, background: "#f8fafc" }}>
              {messages.length === 0 ? <div style={{ textAlign: "center", color: "#c1cad6", fontSize: 12, marginTop: 20 }}>No messages yet. Start the conversation!</div> :
                messages.map((m) => (
                  <div key={m.id} style={{ display: "flex", justifyContent: m.is_admin ? "flex-start" : "flex-end" }}>
                    <div style={{ maxWidth: "72%", padding: "9px 12px", borderRadius: 12, fontSize: 12.5, lineHeight: 1.5, background: m.is_admin ? "#fff" : "linear-gradient(135deg,#059669,#047857)", color: m.is_admin ? "#1c2536" : "#fff", border: m.is_admin ? "1px solid #e4e8ee" : "none", boxShadow: "0 1px 3px rgba(0,0,0,.06)", borderTopLeftRadius: m.is_admin ? 3 : 12, borderTopRightRadius: m.is_admin ? 12 : 3 }}>
                      {m.message}
                      <div style={{ fontSize: 9.5, color: m.is_admin ? "#c1cad6" : "rgba(255,255,255,.6)", marginTop: 3, textAlign: m.is_admin ? "left" : "right" }}>{new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                    </div>
                  </div>
                ))
              }
            </div>
            <div style={{ padding: "10px 12px", borderTop: "1px solid #e4e8ee", display: "flex", gap: 8 }}>
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type your message…" style={{ flex: 1, height: 36, border: "1px solid #e4e8ee", borderRadius: 999, padding: "0 12px", fontSize: 12.5, outline: "none" }} />
              <button onClick={send} style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#059669,#047857)", border: "none", cursor: "pointer", color: "#fff", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>➤</button>
            </div>
          </>)}
        </div>
      </div>

      {/* New Conversation Modal */}
      {showNew && (
        <div onClick={(e) => e.target === e.currentTarget && setShowNew(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(3px)" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, width: 440, border: "1px solid #e4e8ee", boxShadow: "0 24px 64px rgba(0,0,0,.15)" }}>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Start New Conversation</div>
            <div style={{ fontSize: 12.5, color: "#8a96a8", marginBottom: 18 }}>Our team typically replies within 19 minutes.</div>
            <div style={{ marginBottom: 12 }}><label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#1c2536", marginBottom: 5 }}>Subject *</label><input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Question about my order" style={{ width: "100%", height: 35, border: "1px solid #e4e8ee", borderRadius: 9, padding: "0 11px", fontSize: 13, outline: "none" }} /></div>
            <div style={{ marginBottom: 18 }}><label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#1c2536", marginBottom: 5 }}>First Message</label><textarea value={firstMsg} onChange={(e) => setFirstMsg(e.target.value)} placeholder="Describe your question or concern…" style={{ width: "100%", border: "1px solid #e4e8ee", borderRadius: 9, padding: "9px 11px", fontSize: 13, outline: "none", resize: "vertical", minHeight: 80 }} /></div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setShowNew(false)} style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 999, height: 33, padding: "0 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={createChat} style={{ background: "linear-gradient(135deg,#059669,#047857)", color: "#fff", border: "none", borderRadius: 999, height: 33, padding: "0 16px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>Start Chat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
