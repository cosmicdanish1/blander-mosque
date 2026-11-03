"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { GALLERY, GalleryItem } from "@/data/content";

const TAGS = ["All", "Render", "Detail", "Exterior"] as const;

export function GalleryGrid() {
  const [tag, setTag] = useState<(typeof TAGS)[number]>("All");
  const [active, setActive] = useState<GalleryItem | null>(null);
  const shown = GALLERY.filter((g) => tag === "All" || g.tag === tag);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 26 }}>
        {TAGS.map((t) => (
          <button
            key={t}
            type="button"
            className="pill"
            onClick={() => setTag(t)}
            style={t === tag ? { color: "var(--text)", borderColor: "var(--accent)", background: "color-mix(in oklch, var(--accent) 16%, transparent)" } : undefined}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={{ columnWidth: 320, columnGap: 18 }}>
        {shown.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setActive(g)}
            className="glass"
            style={{ display: "block", width: "100%", marginBottom: 18, padding: 8, overflow: "hidden", breakInside: "avoid", cursor: "zoom-in" }}
          >
            <span style={{ position: "relative", display: "block", width: "100%", aspectRatio: g.wide ? "16/10" : "4/3", borderRadius: 12, overflow: "hidden" }}>
              <Image src={g.src} alt={g.caption} fill sizes="(max-width: 700px) 100vw, 360px" style={{ objectFit: "cover" }} />
            </span>
            <span style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "12px 8px 6px", fontSize: 13, color: "var(--muted)", textAlign: "left" }}>
              {g.caption}
              <b style={{ color: "var(--accent)", flex: "none" }}>{g.tag}</b>
            </span>
          </button>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
          style={{ position: "fixed", inset: 0, zIndex: 80, display: "grid", placeItems: "center", padding: 24, background: "oklch(0.08 0.02 258 / 78%)", backdropFilter: "blur(10px)" }}
        >
          <figure style={{ maxWidth: 1100, width: "100%" }} onClick={(e) => e.stopPropagation()}>
            <span style={{ position: "relative", display: "block", width: "100%", aspectRatio: "16/10", borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow)" }}>
              <Image src={active.src} alt={active.caption} fill sizes="100vw" style={{ objectFit: "cover" }} />
            </span>
            <figcaption style={{ marginTop: 14, textAlign: "center", color: "var(--pearl)" }}>{active.caption}</figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}
