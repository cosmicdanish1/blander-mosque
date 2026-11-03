"use client";

import { useState } from "react";
import { CAUSES, DONATION_AMOUNTS } from "@/data/content";
import { Icon } from "@/components/ui/Icon";
import ui from "@/components/ui/ui.module.css";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export function DonatePanel() {
  const [cause, setCause] = useState(CAUSES[0].id);
  const [freq, setFreq] = useState<"once" | "monthly">("once");
  const [amount, setAmount] = useState(501);
  const [custom, setCustom] = useState("");
  const [done, setDone] = useState(false);

  const active = CAUSES.find((c) => c.id === cause) ?? CAUSES[0];
  const value = custom ? Math.max(0, parseInt(custom, 10) || 0) : amount;

  return (
    <div className="grid" style={{ gridTemplateColumns: "1.3fr 1fr", alignItems: "start" }}>
      <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 16 }}>
        {CAUSES.map((c) => {
          const pct = Math.min(100, Math.round((c.raised / c.goal) * 100));
          const selected = c.id === cause;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCause(c.id)}
              className={`glass ${ui.card}`}
              style={{
                textAlign: "left",
                borderColor: selected ? "color-mix(in oklch, var(--accent) 55%, var(--glass-border))" : undefined,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <h3 className={ui.cardTitle} style={{ fontSize: 18 }}>{c.title}</h3>
                <span className="pill" style={{ color: selected ? "var(--accent)" : "var(--muted)" }}>
                  {selected ? "Selected" : "Choose"}
                </span>
              </div>
              <p className={ui.cardBody}>{c.summary}</p>
              <div style={{ marginTop: 16, height: 7, borderRadius: 999, background: "var(--border)", overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg, var(--primary), var(--accent))", transition: "width 600ms ease" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 13, color: "var(--muted)" }}>
                <span><b style={{ color: "var(--text)" }}>{inr(c.raised)}</b> raised</span>
                <span>of {inr(c.goal)} · {pct}%</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="glass-strong" style={{ padding: "clamp(22px, 2.6vw, 32px)", position: "sticky", top: "calc(var(--nav-h) + 24px)" }}>
        {done ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <span className={ui.cardIcon} style={{ margin: "0 auto 16px", width: 56, height: 56 }}>
              <Icon name="heart" size={26} />
            </span>
            <h3 className={ui.cardTitle}>Jazak Allahu Khairan</h3>
            <p className={ui.cardBody} style={{ marginInline: "auto", maxWidth: 280 }}>
              Thank you. This is a demo — no payment was taken. A live checkout
              will be connected when the backend is ready.
            </p>
            <button type="button" className="btn btn-ghost" style={{ marginTop: 20 }} onClick={() => setDone(false)}>
              Make another
            </button>
          </div>
        ) : (
          <>
            <p className="eyebrow">Give to</p>
            <h3 className={ui.cardTitle} style={{ marginTop: 10 }}>{active.title}</h3>

            <div style={{ display: "flex", gap: 6, marginTop: 20, padding: 5, borderRadius: 999, background: "var(--glass)", border: "1px solid var(--glass-border)" }}>
              {(["once", "monthly"] as const).map((f) => (
                <button key={f} type="button" onClick={() => setFreq(f)} style={{ flex: 1, padding: "10px", borderRadius: 999, fontSize: 13, fontWeight: 600, color: freq === f ? "oklch(0.16 0.03 70)" : "var(--muted)", background: freq === f ? "linear-gradient(135deg, var(--accent), var(--accent-strong))" : "transparent" }}>
                  {f === "once" ? "One-time" : "Monthly"}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 14 }}>
              {DONATION_AMOUNTS.map((a) => (
                <button key={a} type="button" onClick={() => { setAmount(a); setCustom(""); }} className="pill" style={{ justifyContent: "center", padding: "12px 0", color: !custom && amount === a ? "var(--text)" : "var(--muted)", borderColor: !custom && amount === a ? "var(--accent)" : "var(--glass-border)", background: !custom && amount === a ? "color-mix(in oklch, var(--accent) 14%, transparent)" : "var(--glass)" }}>
                  {inr(a)}
                </button>
              ))}
            </div>

            <input
              inputMode="numeric"
              placeholder="Custom amount (₹)"
              value={custom}
              onChange={(e) => setCustom(e.target.value.replace(/[^0-9]/g, ""))}
              style={{ width: "100%", marginTop: 12, padding: "13px 16px", borderRadius: 12, border: "1px solid var(--glass-border)", background: "var(--glass)", color: "var(--text)", fontSize: 15 }}
            />

            <button type="button" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 16 }} onClick={() => value > 0 && setDone(true)}>
              Donate {inr(value)}{freq === "monthly" ? "/mo" : ""}
            </button>
            <p style={{ marginTop: 12, fontSize: 12, color: "var(--muted)", textAlign: "center" }}>
              Demo only — no real payment is processed.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
