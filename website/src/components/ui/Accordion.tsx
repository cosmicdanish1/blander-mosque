"use client";

import { useState } from "react";
import styles from "./ui.module.css";

export type QA = { q: string; a: string };

export function Accordion({ items }: { items: QA[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="glass" style={{ padding: "6px 22px" }}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={`${styles.accItem} ${isOpen ? styles.accOpen : ""}`}>
            <button
              type="button"
              className={styles.accButton}
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              {item.q}
              <span className={styles.accSign} aria-hidden="true">
                <svg viewBox="0 0 22 22" fill="none" width="22" height="22">
                  <path d="M11 5v12M5 11h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <div className={`${styles.accPanel} ${isOpen ? styles.accPanelOpen : ""}`}>
              <div>
                <p className={styles.accBody}>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
