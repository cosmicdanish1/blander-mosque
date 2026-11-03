"use client";

import { useEffect, useState } from "react";
import { usePrayerTimes } from "./usePrayerTimes";
import { JUMMAH_TIME, format12, formatCountdown, toTimings } from "@/lib/prayer";
import { hijriDate, gregorianDate } from "@/lib/hijri";
import { Icon } from "@/components/ui/Icon";
import styles from "./prayer.module.css";

const R = 90;
const C = 2 * Math.PI * R;

export function PrayerBoard() {
  const { times, next, live } = usePrayerTimes();
  const timings = toTimings(times);
  const [dates, setDates] = useState({ hijri: "", greg: "" });

  useEffect(() => {
    setDates({ hijri: hijriDate(), greg: gregorianDate() });
  }, []);

  // Ring fills as the next prayer approaches (capped at a 6h window).
  const progress = 1 - Math.min(next.inSeconds, 21600) / 21600;
  const offset = C * (1 - progress);

  return (
    <div>
      <div className={styles.board}>
        <div className={`glass-strong ${styles.next}`}>
          <div className={styles.nextTop}>
            <span>Next congregational prayer</span>
            <span className={styles.liveDot}>
              <i />
              {live ? "Live times" : "Estimated"}
            </span>
          </div>
          <div className={styles.ring}>
            <svg viewBox="0 0 200 200">
              <circle className={styles.ringTrack} cx="100" cy="100" r={R} />
              <circle
                className={styles.ringFill}
                cx="100"
                cy="100"
                r={R}
                strokeDasharray={C}
                strokeDashoffset={offset}
              />
            </svg>
            <div className={styles.ringInner}>
              <p className={styles.ringLabel}>Begins in</p>
              <p className={styles.ringName}>{next.label}</p>
              <p className={styles.ringCount}>{formatCountdown(next.inSeconds)}</p>
            </div>
          </div>
          <p className={styles.nextMeta}>
            at <b>{format12(next.time)}</b>
            <br />
            {dates.greg}
            {dates.hijri ? ` · ${dates.hijri}` : ""}
          </p>
        </div>

        <div className={`glass ${styles.list}`}>
          {timings.map((t) => {
            const active = t.key === next.key && t.congregation;
            return (
              <div key={t.key} className={`${styles.row} ${active ? styles.rowActive : ""}`}>
                <span className={styles.rowIcon}>
                  <Icon name={t.key === "Sunrise" ? "star" : "clock"} size={18} />
                </span>
                <span>
                  <span className={styles.rowName} style={{ display: "block" }}>
                    {t.label}
                  </span>
                  <span className={styles.rowSub}>
                    {t.congregation ? "Congregation" : "Fajr ends"}
                  </span>
                </span>
                <span className={styles.rowTime}>{format12(t.time)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`glass ${styles.jummah}`}>
        <Icon name="users" size={20} />
        <span>
          <b>Jummah</b> (Friday) prayer and khutbah at <b>{format12(JUMMAH_TIME)}</b>.
        </span>
      </div>
    </div>
  );
}
