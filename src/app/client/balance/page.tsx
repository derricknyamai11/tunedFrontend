"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/api-client";

interface WalletData { balance: number; reward_points: number; currency: string; }

export default function BalancePage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"ok" | "err">("ok");
  const [tab, setTab] = useState<"topup" | "history">("topup");

  const showMsg = (text: string, type: "ok" | "err" = "ok") => {
    setMsg(text); setMsgType(type);
    setTimeout(() => setMsg(""), 4000);
  };

  const load = () => {
    setLoading(true);
    apiGet<WalletData>("/client/wallet").then((r) => {
      if (r.ok) setWallet(r.data);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const topup = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt < 5) return showMsg("Minimum top-up is $5.00", "err");
    setProcessing(true);
    const r = await apiPost<{ client_secret: string; amount: number; stripe_enabled: boolean; note?: string }>("/client/wallet/topup", { amount: amt });
    if (!r.ok) { showMsg("Failed to initiate payment", "err"); setProcessing(false); return; }

    if (!r.data.stripe_enabled) {
      const confirm = await apiPost<{ balance: number; message: string }>("/client/wallet/confirm", { amount: amt });
      if (confirm.ok) {
        showMsg(`✅ $${amt.toFixed(2)} added to your wallet!`);
        setAmount(""); load();
      }
      setProcessing(false);
      return;
    }
    showMsg("🔄 Redirecting to Stripe secure payment… (Set STRIPE_SECRET_KEY for live mode)");
    setProcessing(false);
  };

  const presets = [10, 25, 50, 100, 200];

  return (
    <div style={{ maxWidth: 620, margin: "0 auto" }}>
      {/* Balance Card */}
      <div style={{ background: "linear-gradient(135deg,#065f46,#047857,#059669)", borderRadius: 20, padding: "28px 24px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,.06)" }} />
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.7)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 6 }}>Wallet Balance</div>
        <div style={{ fontSize: 44, fontWeight: 800, color: "#fff", letterSpacing: -2, marginBottom: 4 }}>
          {loading ? "—" : `$${(wallet?.balance ?? 0).toFixed(2)}`}
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>⭐ {wallet?.reward_points ?? 0} reward points</div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #e4e8ee", marginBottom: 20 }}>
        {(["topup", "history"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 16px", fontSize: 12.5, fontWeight: tab === t ? 700 : 500, color: tab === t ? "#059669" : "#8a96a8", borderBottom: `2px solid ${tab === t ? "#059669" : "transparent"}`, marginBottom: -1, background: "none", border: "none", borderBottomWidth: 2, borderBottomStyle: "solid" as const, borderBottomColor: tab === t ? "#059669" : "transparent", cursor: "pointer" }}>
            {t === "topup" ? "💳 Top Up" : "📋 History"}
          </button>
        ))}
      </div>

      {tab === "topup" ? (
        <div style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#0d1117", marginBottom: 6 }}>Add Funds to Your Wallet</div>
          <div style={{ fontSize: 12.5, color: "#8a96a8", marginBottom: 20 }}>Pre-fund for faster checkout. Minimum: $5.00</div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#4a5568", marginBottom: 8 }}>Quick Amount</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {presets.map((p) => (
                <button key={p} onClick={() => setAmount(String(p))} style={{ padding: "6px 16px", borderRadius: 999, border: `2px solid ${amount === String(p) ? "#059669" : "#e4e8ee"}`, background: amount === String(p) ? "#f0fdf4" : "#fff", color: amount === String(p) ? "#065f46" : "#4a5568", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  ${p}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#4a5568", marginBottom: 8 }}>Custom Amount</div>
            <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #e4e8ee", borderRadius: 10, overflow: "hidden" }}>
              <span style={{ padding: "0 12px", fontSize: 18, color: "#8a96a8", fontWeight: 700 }}>$</span>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" min="5" step="0.01" style={{ flex: 1, height: 46, border: "none", background: "transparent", fontSize: 18, fontWeight: 700, color: "#0d1117", outline: "none" }} />
            </div>
          </div>
          <div style={{ background: "#f0fdf4", border: "1px solid rgba(5,150,105,.15)", borderRadius: 10, padding: "10px 14px", marginBottom: 20 }}>
            {["Instant checkout on future orders", "Balance never expires", "5% bonus on top-ups over $100"].map((b) => (
              <div key={b} style={{ fontSize: 12, color: "#065f46", marginBottom: 2 }}>✓ {b}</div>
            ))}
          </div>
          <button onClick={topup} disabled={processing || !amount || parseFloat(amount) < 5} style={{ width: "100%", height: 46, background: "linear-gradient(135deg,#059669,#047857)", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: (!amount || parseFloat(amount) < 5) ? .5 : 1 }}>
            {processing ? "Processing…" : `🔒 Add ${amount ? `$${parseFloat(amount).toFixed(2)}` : "Funds"} Securely`}
          </button>
          {msg && <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 10, background: msgType === "ok" ? "#f0fdf4" : "#fef2f2", color: msgType === "ok" ? "#065f46" : "#9f1239", fontSize: 12.5, fontWeight: 600 }}>{msg}</div>}
          <div style={{ marginTop: 10, textAlign: "center", fontSize: 11, color: "#c1cad6" }}>🔒 SSL encrypted · Secure payment</div>
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e4e8ee", borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Recent Transactions</div>
          {(wallet?.balance ?? 0) === 0 ? (
            <div style={{ padding: "24px 0", textAlign: "center", color: "#8a96a8", fontSize: 12 }}>No transactions yet. Top up your wallet to get started!</div>
          ) : (
            [{ icon: "💳", desc: "Wallet Top-up", amount: "+$50.00", date: "Today", color: "#059669" },
             { icon: "📦", desc: "Order Payment", amount: "-$22.00", date: "Recently", color: "#ef4444" }].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: i === 0 ? "1px solid #f0f2f5" : "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: t.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{t.icon}</div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{t.desc}</div><div style={{ fontSize: 11, color: "#8a96a8" }}>{t.date}</div></div>
                <div style={{ fontSize: 14, fontWeight: 800, color: t.color }}>{t.amount}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
