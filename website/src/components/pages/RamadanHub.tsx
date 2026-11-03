"use client";

import { useEffect, useState } from "react";
import { usePrayerTimes } from "@/components/prayer/usePrayerTimes";
import { format12, formatCountdown } from "@/lib/prayer";
import { Icon } from "@/components/ui/Icon";
import ui from "@/components/ui/ui.module.css";

function secondsUntil(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(h, m, 0, 0);
  let diff = (target.getTime() - now.getTime()) / 1000;
  if (diff < 0) diff += 86400;
  return Math.round(diff);
}

export function RamadanHub() {
  const { times, live } = usePrayerTimes();
  const [mounted, setMounted] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    setMounted(true);
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Date is only read after mount so prerender stays deterministic.
  const toSehri = mounted ? secondsUntil(times.Fajr) : 0;
  const toIftar = mounted ? secondsUntil(times.Maghrib) : 0;
  const next = toIftar <= toSehri
    ? { label: "Iftar", seconds: toIftar, time: times.Maghrib }
    : { label: "Sehri ends", seconds: toSehri, time: times.Fajr };

  return (
    <div>
      <div className="grid" style={{ gridTemplateColumns: "1.2fr 1fr 1fr" }}>
        <div className="glass-strong" style={{ padding: "clamp(24px, 3vw, 38px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p className="eyebrow">Next · {next.label}</p>
          <p style={{ fontFamily: "var(--font-display-family)", fontSize: "clamp(40px, 7vw, 68px)", color: "var(--accent)", margin: "10px 0 4px", fontVariantNumeric: "tabular-nums" }}>
            {formatCountdown(next.seconds)}
          </p>
          <p style={{ color: "var(--muted)" }}>
            at {format12(next.time)} · {live ? "live times" : "estimated"}
          </p>
        </div>
        <div className={`glass ${ui.card}`} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <span className={ui.cardIcon}><Icon name="moon" /></span>
          <h3 className={ui.cardTitle} style={{ fontSize: 18 }}>Sehri ends</h3>
          <p style={{ fontSize: 26, color: "var(--text)", fontFamily: "var(--font-display-family)", marginTop: 6 }}>{format12(times.Fajr)}</p>
          <p className={ui.cardBody}>Fajr begins — stop eating and drinking.</p>
        </div>
        <div className={`glass ${ui.card}`} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <span className={ui.cardIcon}><Icon name="star" /></span>
          <h3 className={ui.cardTitle} style={{ fontSize: 18 }}>Iftar</h3>
          <p style={{ fontSize: 26, color: "var(--text)", fontFamily: "var(--font-display-family)", marginTop: 6 }}>{format12(times.Maghrib)}</p>
          <p className={ui.cardBody}>Maghrib — break your fast.</p>
        </div>
      </div>
    </div>
  );
}
