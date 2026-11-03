"use client";

import { useMemo, useState } from "react";
import { SERMONS } from "@/data/content";
import { Icon } from "@/components/ui/Icon";
import ui from "@/components/ui/ui.module.css";

export function SermonsList() {
  const series = useMemo(() => ["All", ...Array.from(new Set(SERMONS.map((s) => s.series)))], []);
  const [active, setActive] = useState("All");
  const [q, setQ] = useState("");
  const shown = SERMONS.filter(
    (s) =>
      (active === "All" || s.series === active) &&
      (q === "" || `${s.title} ${s.speaker}`.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "space-between", marginBottom: 26 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {series.map((s) => (
            <button
              key={s}
              type="button"
              className="pill"
              onClick={() => setActive(s)}
              style={s === active ? { color: "var(--text)", borderColor: "var(--accent)", background: "color-mix(in oklch, var(--accent) 16%, transparent)" } : undefined}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          placeholder="Search sermons…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ padding: "9px 15px", borderRadius: 999, border: "1px solid var(--glass-border)", background: "var(--glass)", color: "var(--text)", fontSize: 14, minWidth: 200 }}
        />
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {shown.map((s) => (
          <article key={s.id} className={`glass ${ui.card}`} style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 22px" }}>
            <span className={ui.cardIcon} style={{ marginBottom: 0, flex: "none" }}><Icon name="play" /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 className={ui.cardTitle} style={{ fontSize: 18 }}>{s.title}</h3>
              <p className={ui.cardBody} style={{ marginTop: 4 }}>{s.series} · {s.speaker}</p>
            </div>
            <span style={{ color: "var(--muted)", fontSize: 13, flex: "none", textAlign: "right" }}>
              {s.date}<br />{s.length}
            </span>
          </article>
        ))}
        {shown.length === 0 && <p className="lede">No sermons match your search.</p>}
      </div>
    </div>
  );
}
