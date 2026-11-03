"use client";

import { useState } from "react";
import { EVENTS, EventItem } from "@/data/content";
import { Icon } from "@/components/ui/Icon";
import ui from "@/components/ui/ui.module.css";

const CATS = ["All", "Weekly", "Class", "Community", "Special"] as const;
type Cat = (typeof CATS)[number];

export function EventsList() {
  const [cat, setCat] = useState<Cat>("All");
  const shown: EventItem[] = EVENTS.filter((e) => cat === "All" || e.category === cat);

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
        {CATS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className="pill"
            style={
              c === cat
                ? { color: "var(--text)", borderColor: "var(--accent)", background: "color-mix(in oklch, var(--accent) 16%, transparent)" }
                : undefined
            }
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {shown.map((e) => (
          <article key={e.id} className={`glass ${ui.card} ${ui.cardHover}`}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <span className="pill" style={{ color: "var(--accent)" }}>{e.category}</span>
              {e.recurring && (
                <span style={{ color: "var(--muted)", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Icon name="calendar" size={14} /> Recurring
                </span>
              )}
            </div>
            <h3 className={ui.cardTitle}>{e.title}</h3>
            <p className={ui.cardBody}>{e.summary}</p>
            <div style={{ display: "flex", gap: 18, marginTop: 18, color: "var(--muted)", fontSize: 13 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                <Icon name="calendar" size={15} /> {e.day}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                <Icon name="clock" size={15} /> {e.time}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
