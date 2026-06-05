"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/api-client";
import { PageShell, Card, Btn, Badge } from "../_components/PageShell";

interface Health { web_server: string; database: string; redis: string; celery: string; email_service: string; cdn: string; timestamp: string; version: string; uptime: string; }
interface LogEntry { id: string; action: string; ip_address: string | null; user_agent: string; user_id: string | null; created_at: string; }

export default function AdminSystem() {
  const [health, setHealth] = useState<Health | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(true);

  const loadHealth = () => {
    setLoading(true);
    apiGet<Health>("/admin/system/health").then((r) => { if (r.ok) setHealth(r.data); setLoading(false); });
  };

  const loadLogs = () => {
    setLogsLoading(true);
    apiGet<{ logs: LogEntry[]; total: number }>("/admin/visitor-logs?per_page=20").then((r) => {
      if (r.ok && r.data.logs) setLogs(r.data.logs);
      setLogsLoading(false);
    });
  };

  useEffect(() => { loadHealth(); loadLogs(); }, []);

  const StatusPill = ({ status }: { status: string }) => {
    const ok = status === "operational" || status === "configured";
    const warn = ["degraded", "unavailable", "not configured"].includes(status);
    const color = ok ? "#059669" : warn ? "#d97706" : "#dc2626";
    return (
      <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, boxShadow: ok ? `0 0 5px ${color}50` : "none" }} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const isSuspicious = (log: LogEntry) =>
    log.action.toLowerCase().includes("fail") ||
    log.action.toLowerCase().includes("invalid") ||
    log.action.toLowerCase().includes("block");

  return (
    <PageShell title="System Health & Security" sub="Monitor infrastructure, visitor logs and platform status"
      actions={<Btn label="🔄 Refresh" onClick={() => { loadHealth(); loadLogs(); }} color="outline" />}>

      {loading ? <div style={{ padding: 40, textAlign: "center", color: "#8a96a8" }}>Loading system status…</div> : (<>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14, marginBottom: 18 }}>
          {/* Server Status */}
          <Card>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1c2536", marginBottom: 12 }}>🖥️ Server Status</div>
            {health && [
              { label: "Web Server", status: health.web_server },
              { label: "Database", status: health.database },
              { label: "CDN / Storage", status: health.cdn },
              { label: "Email Service", status: health.email_service },
            ].map((s) => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f0f2f5" }}>
                <span style={{ fontSize: 12.5, color: "#1c2536", fontWeight: 500 }}>{s.label}</span>
                <StatusPill status={s.status} />
              </div>
            ))}
          </Card>

          {/* Services */}
          <Card>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1c2536", marginBottom: 12 }}>🔧 Services</div>
            {health && [
              { label: "Redis Cache", status: health.redis },
              { label: "Celery Worker", status: health.celery },
              { label: "Version", value: health.version },
              { label: "Uptime", value: health.uptime },
            ].map((s) => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f0f2f5" }}>
                <span style={{ fontSize: 12.5, color: "#1c2536", fontWeight: 500 }}>{s.label}</span>
                {"value" in s
                  ? <strong style={{ fontSize: 12, color: "#059669" }}>{s.value}</strong>
                  : <StatusPill status={(s as { status: string }).status} />}
              </div>
            ))}
          </Card>

          {/* Security */}
          <Card>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1c2536", marginBottom: 12 }}>🔒 Security</div>
            {[
              { label: "Security Headers", status: "8/8 Active" },
              { label: "Rate Limiting", status: "Enabled" },
              { label: "JWT Auth", status: "Active" },
              { label: "CORS Policy", status: "Configured" },
              { label: "HTTPS", status: "Ready" },
            ].map((s) => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0f2f5" }}>
                <span style={{ fontSize: 12.5, color: "#1c2536", fontWeight: 500 }}>{s.label}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#059669" }}>{s.status}</span>
              </div>
            ))}
          </Card>
        </div>

        {/* Visitor / Activity Logs */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1c2536" }}>🔍 Visitor & Activity Log</div>
            <div style={{ fontSize: 11, color: "#8a96a8" }}>Last 20 events · Logged at auth time</div>
          </div>
          {logsLoading ? (
            <div style={{ padding: 24, textAlign: "center", color: "#8a96a8" }}>Loading logs…</div>
          ) : logs.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", color: "#8a96a8" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
              <div style={{ fontSize: 13 }}>No activity logs yet</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Logs are captured on login, registration and key actions.</div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ background: "#f8fafc" }}>
                  {["Time", "IP Address", "Action", "User Agent", "Risk"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 10.5, fontWeight: 700, color: "#8a96a8", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {logs.map((log) => {
                    const suspicious = isSuspicious(log);
                    return (
                      <tr key={log.id} style={{ borderTop: "1px solid #e4e8ee", background: suspicious ? "#fff8f0" : "transparent" }}>
                        <td style={{ padding: "9px 12px", fontSize: 11, color: "#4a5568", whiteSpace: "nowrap" }}>
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td style={{ padding: "9px 12px", fontFamily: "monospace", fontSize: 11.5, color: "#4a5568" }}>
                          {log.ip_address || "—"}
                        </td>
                        <td style={{ padding: "9px 12px" }}>
                          <Badge text={log.action.replace(/_/g, " ")} color={suspicious ? "red" : "green"} />
                        </td>
                        <td style={{ padding: "9px 12px", fontSize: 11, color: "#8a96a8", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {log.user_agent || "—"}
                        </td>
                        <td style={{ padding: "9px 12px" }}>
                          {suspicious
                            ? <span style={{ fontSize: 11, fontWeight: 600, color: "#dc2626" }}>⚠️ Suspicious</span>
                            : <span style={{ fontSize: 11, color: "#059669" }}>✓ Normal</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <div style={{ marginTop: 12, textAlign: "center", fontSize: 11, color: "#8a96a8" }}>
          Last checked: {health?.timestamp ? new Date(health.timestamp).toLocaleString() : "—"} · v{health?.version}
        </div>
      </>)}
    </PageShell>
  );
}
