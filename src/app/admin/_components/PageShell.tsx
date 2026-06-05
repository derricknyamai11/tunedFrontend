"use client";
import React from "react";

interface Props {
  title: string;
  sub?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function PageShell({ title, sub, actions, children }: Props) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 19, fontWeight: 800, color: "#0d1117", letterSpacing: "-.5px" }}>{title}</div>
          {sub && <div style={{ fontSize: 12.5, color: "#8a96a8", marginTop: 3 }}>{sub}</div>}
        </div>
        {actions && <div style={{ display: "flex", gap: 8, alignItems: "center" }}>{actions}</div>}
      </div>
      {children}
    </div>
  );
}

export const Btn = ({ label, onClick, color = "green", size = "md" }: { label: string; onClick?: () => void; color?: "green" | "outline" | "red" | "purple" | "yellow"; size?: "sm" | "md" }) => {
  const h = size === "sm" ? 27 : 33;
  const px = size === "sm" ? "0 10px" : "0 15px";
  const fs = size === "sm" ? 11.5 : 12.5;
  const bgMap: Record<string, string> = { green: "linear-gradient(135deg,#059669,#047857)", outline: "#fff", red: "linear-gradient(135deg,#ef4444,#dc2626)", purple: "linear-gradient(135deg,#8b5cf6,#7c3aed)", yellow: "linear-gradient(135deg,#f59e0b,#d97706)" };
  const bg = bgMap[color] ?? bgMap.green;
  const clr = color === "outline" ? "#1c2536" : "#fff";
  const border = color === "outline" ? "1px solid #e4e8ee" : "none";
  return <button onClick={onClick} style={{ background: bg, color: clr, border, borderRadius: 999, height: h, padding: px, fontSize: fs, fontWeight: 600, cursor: "pointer" }}>{label}</button>;
};

export const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 14, padding: 16, boxShadow: "0 1px 2px rgba(13,17,23,.05)", ...style }}>{children}</div>
);

export const Badge = ({ text, color }: { text: string; color: "green" | "yellow" | "red" | "blue" | "purple" | "gray" }) => {
  const styles = {
    green: { bg: "#f0fdf4", text: "#166534", dot: "#22c55e" },
    yellow: { bg: "#fffbeb", text: "#92400e", dot: "#f59e0b" },
    red: { bg: "#fff1f2", text: "#9f1239", dot: "#f43f5e" },
    blue: { bg: "#eff6ff", text: "#1d4ed8", dot: "#3b82f6" },
    purple: { bg: "#f5f3ff", text: "#5b21b6", dot: "#8b5cf6" },
    gray: { bg: "#f8fafc", text: "#4a5568", dot: "#8a96a8" },
  }[color];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, borderRadius: 999, padding: "2px 8px", fontSize: 10.5, fontWeight: 700, background: styles.bg, color: styles.text }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: styles.dot }} />
      {text}
    </span>
  );
};

export const StatCard = ({ icon, label, value, sub, subColor = "#059669" }: { icon: string; label: string; value: string | number; sub?: string; subColor?: string }) => (
  <Card>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 11.5, color: "#8a96a8", marginBottom: 6 }}>{label}</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: "#0d1117", letterSpacing: -1 }}>{value}</div>
        {sub && <div style={{ fontSize: 11, fontWeight: 600, color: subColor, marginTop: 4 }}>{sub}</div>}
      </div>
      <div style={{ fontSize: 22 }}>{icon}</div>
    </div>
  </Card>
);

export function Table({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 2px rgba(13,17,23,.05)", border: "1px solid #e4e8ee" }}>
        <thead>
          <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e4e8ee" }}>
            {headers.map((h) => <th key={h} style={{ textAlign: "left", padding: "9px 13px", fontSize: 10.5, fontWeight: 700, color: "#8a96a8", letterSpacing: ".05em", textTransform: "uppercase" }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length - 1 ? "1px solid #e4e8ee" : "none" }}>
              {row.map((cell, j) => <td key={j} style={{ padding: "11px 13px", fontSize: 12.5, color: "#1c2536" }}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Modal({ title, sub, open, onClose, children, footer }: { title: string; sub?: string; open: boolean; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode }) {
  if (!open) return null;
  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{ position: "fixed", inset: 0, background: "rgba(13,17,23,.55)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(3px)" }}>
      <div style={{ background: "#fff", borderRadius: 18, padding: 24, width: 500, maxWidth: "90vw", maxHeight: "85vh", overflowY: "auto", border: "1px solid #e4e8ee", boxShadow: "0 24px 64px rgba(13,17,23,.18)", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, width: 28, height: 28, borderRadius: "50%", border: "1px solid #e4e8ee", background: "#f8fafc", cursor: "pointer", color: "#8a96a8", fontSize: 14 }}>✕</button>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#0d1117", marginBottom: 4 }}>{title}</div>
        {sub && <div style={{ fontSize: 12.5, color: "#8a96a8", marginBottom: 18 }}>{sub}</div>}
        {children}
        {footer && <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20, paddingTop: 16, borderTop: "1px solid #e4e8ee" }}>{footer}</div>}
      </div>
    </div>
  );
}

export const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 13 }}>
    <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#1c2536", marginBottom: 5 }}>{label}</label>
    {children}
  </div>
);

export const Inp = ({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} style={{ width: "100%", height: 35, border: "1px solid #e4e8ee", borderRadius: 9, padding: "0 11px", fontSize: 13, color: "#0d1117", outline: "none", background: "#f8fafc", ...props.style }} />
);

export const Sel = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} style={{ width: "100%", height: 35, border: "1px solid #e4e8ee", borderRadius: 9, padding: "0 11px", fontSize: 13, color: "#0d1117", outline: "none", background: "#f8fafc", cursor: "pointer" }}>{children}</select>
);

export const Textarea = ({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} style={{ width: "100%", border: "1px solid #e4e8ee", borderRadius: 9, padding: "9px 11px", fontSize: 13, color: "#0d1117", outline: "none", background: "#f8fafc", resize: "vertical", minHeight: 80, ...props.style }} />
);

export function Toast({ msg, show }: { msg: string; show: boolean }) {
  return (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: `translateX(-50%) translateY(${show ? 0 : 8}px)`, background: "#0d1117", color: "#fff", fontSize: 12.5, fontWeight: 600, borderRadius: 999, padding: "8px 18px", zIndex: 999, opacity: show ? 1 : 0, transition: "all .28s", pointerEvents: "none", boxShadow: "0 8px 24px rgba(0,0,0,.2)", whiteSpace: "nowrap" }}>{msg}</div>
  );
}
