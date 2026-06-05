"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet } from "@/api-client";
import Link from "next/link";

interface Order {
  id: string;
  order_number: string;
  title: string;
  status: string;
  due_date: string | null;
  total_price: number;
}

type KanbanStatus = "todo" | "inprog" | "done";

interface Task {
  id: string;
  name: string;
  orderNumber: string;
  orderId: string;
  due: string | null;
  status: KanbanStatus;
  priority: "high" | "medium" | "low";
  price: number;
}

const PRIORITY_COLOR = { high: "#ef4444", medium: "#f59e0b", low: "#22c55e" };
const STATUS_LABELS: Record<KanbanStatus, string> = { todo: "Pending / New", inprog: "In Progress", done: "Completed" };
const STATUS_COLOR: Record<KanbanStatus, string> = { todo: "#f59e0b", inprog: "#3b82f6", done: "#22c55e" };

function orderToKanban(status: string): KanbanStatus {
  const s = status.toLowerCase();
  if (["completed", "completed_pending_review"].includes(s)) return "done";
  if (["active", "revision", "overdue"].includes(s)) return "inprog";
  return "todo";
}

function orderToPriority(order: Order): "high" | "medium" | "low" {
  if (!order.due_date) return "low";
  const hours = (new Date(order.due_date).getTime() - Date.now()) / 3600000;
  if (hours < 24) return "high";
  if (hours < 72) return "medium";
  return "low";
}

export default function PlannerPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"board" | "list">("board");

  useEffect(() => {
    apiGet<{ orders: Order[]; total: number }>("/client/orders?per_page=100").then((r) => {
      if (r.ok && r.data.orders) {
        setTasks(r.data.orders.map((o) => ({
          id: o.id,
          name: o.title,
          orderNumber: o.order_number,
          orderId: o.id,
          due: o.due_date,
          status: orderToKanban(o.status),
          priority: orderToPriority(o),
          price: o.total_price,
        })));
      }
      setLoading(false);
    });
  }, []);

  const filtered = tasks.filter((t) =>
    !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.orderNumber.toLowerCase().includes(search.toLowerCase())
  );

  const TaskCard = ({ t }: { t: Task }) => (
    <div onClick={() => router.push(`/client/orders/${t.orderId}` as never)}
      style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 10, padding: 12, marginBottom: 8, cursor: "pointer", borderLeft: `3px solid ${PRIORITY_COLOR[t.priority]}` }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,.07)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0d1117", marginBottom: 4, lineHeight: 1.4 }}>{t.name}</div>
      <div style={{ fontSize: 11, color: "#8a96a8", marginBottom: 4 }}>#{t.orderNumber}</div>
      {t.due && (
        <div style={{ fontSize: 11, color: new Date(t.due) < new Date() ? "#ef4444" : "#8a96a8", marginBottom: 6 }}>
          📅 {new Date(t.due).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          {new Date(t.due) < new Date() && " ⚠️ overdue"}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 9.5, fontWeight: 700, padding: "2px 7px", borderRadius: 999, background: PRIORITY_COLOR[t.priority] + "18", color: PRIORITY_COLOR[t.priority] }}>{t.priority.toUpperCase()}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#059669" }}>${t.price.toFixed(2)}</span>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "0 0 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0d1117", margin: 0 }}>Order Planner</h1>
          <p style={{ fontSize: 12.5, color: "#6b7280", marginTop: 3 }}>All your orders, visualized by progress</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…"
            style={{ height: 33, border: "1px solid #e4e8ee", borderRadius: 999, padding: "0 12px", fontSize: 12.5, outline: "none", width: 160 }} />
          <div style={{ display: "flex", background: "#f0f2f5", borderRadius: 8, padding: 2 }}>
            {(["board", "list"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                style={{ height: 28, padding: "0 12px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", background: view === v ? "#fff" : "transparent", color: view === v ? "#0d1117" : "#8a96a8", boxShadow: view === v ? "0 1px 3px rgba(0,0,0,.08)" : "none" }}>
                {v === "board" ? "⊞ Board" : "≡ List"}
              </button>
            ))}
          </div>
          <Link href={"/client/orders/new" as never}
            style={{ background: "linear-gradient(135deg,#059669,#047857)", color: "#fff", borderRadius: 8, height: 33, padding: "0 14px", fontSize: 12.5, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center" }}>
            + New Order
          </Link>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#8a96a8" }}>Loading your orders…</div>
      ) : tasks.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#0d1117", marginBottom: 6 }}>No orders yet</div>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>Orders you place will appear here automatically.</div>
          <Link href={"/client/orders/new" as never}
            style={{ background: "linear-gradient(135deg,#059669,#047857)", color: "#fff", borderRadius: 10, padding: "10px 24px", fontSize: 13, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>
            Place First Order →
          </Link>
        </div>
      ) : view === "board" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
          {(["todo", "inprog", "done"] as KanbanStatus[]).map((key) => {
            const cols = filtered.filter((t) => t.status === key);
            return (
              <div key={key}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLOR[key] }} />
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{STATUS_LABELS[key]}</span>
                  <span style={{ marginLeft: "auto", background: "#f0f2f5", borderRadius: 999, fontSize: 11, fontWeight: 700, padding: "1px 7px", color: "#8a96a8" }}>{cols.length}</span>
                </div>
                <div style={{ background: "#f8fafc", borderRadius: 12, padding: "10px 10px 4px", minHeight: 80 }}>
                  {cols.length === 0
                    ? <div style={{ textAlign: "center", padding: "16px 0", color: "#c1cad6", fontSize: 12 }}>No orders</div>
                    : cols.map((t) => <TaskCard key={t.id} t={t} />)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#f8fafc" }}>
              {["Order", "Status", "Due Date", "Price", "Priority"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "9px 14px", fontSize: 10.5, fontWeight: 700, color: "#8a96a8", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} style={{ borderTop: "1px solid #e4e8ee", cursor: "pointer" }}
                  onClick={() => router.push(`/client/orders/${t.orderId}` as never)}>
                  <td style={{ padding: "11px 14px" }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "#0d1117", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "#8a96a8" }}>#{t.orderNumber}</div>
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: STATUS_COLOR[t.status] + "18", color: STATUS_COLOR[t.status] }}>{STATUS_LABELS[t.status]}</span>
                  </td>
                  <td style={{ padding: "11px 14px", fontSize: 12, color: t.due && new Date(t.due) < new Date() ? "#ef4444" : "#4b5563" }}>
                    {t.due ? new Date(t.due).toLocaleDateString() : "—"}
                  </td>
                  <td style={{ padding: "11px 14px", fontSize: 12, fontWeight: 700, color: "#059669" }}>${t.price.toFixed(2)}</td>
                  <td style={{ padding: "11px 14px" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 999, background: PRIORITY_COLOR[t.priority] + "18", color: PRIORITY_COLOR[t.priority] }}>{t.priority.toUpperCase()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
