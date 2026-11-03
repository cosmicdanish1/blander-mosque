"use client";

import { usePrayerTimes } from "@/components/prayer/usePrayerTimes";
import { formatCountdown } from "@/lib/prayer";
import styles from "./site.module.css";

export function PrayerChip() {
  const { next } = usePrayerTimes();
  return (
    <div className={styles.prayerChip} title="Time until the next congregational prayer">
      <span className={styles.prayerPulse} aria-hidden="true" />
      <span className={styles.prayerChipLabel}>{next.label} in</span>
      <b>{formatCountdown(next.inSeconds)}</b>
    </div>
  );
}
