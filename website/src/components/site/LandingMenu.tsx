"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { NAV_GROUPS } from "@/data/nav";
import { ThemeSwitcher } from "./ThemeSwitcher";
import styles from "./landingMenu.module.css";

/**
 * Navigation entry point for the cinematic landing page, which has no site
 * shell. A small glass control, top-right, that opens the full menu and the
 * theme switcher so visitors can reach any page from the story.
 */
export function LandingMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={styles.wrap} ref={ref}>
      <ThemeSwitcher />
      <button
        type="button"
        className={`${styles.button} glass`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open site menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`${styles.bars} ${open ? styles.barsOpen : ""}`}><span /></span>
        <span className={styles.label}>Menu</span>
      </button>

      {open && (
        <div className={`${styles.menu} glass-strong`} role="menu">
          <Link href="/prayer-times" className={styles.cta} onClick={() => setOpen(false)}>
            Enter the mosque website →
          </Link>
          <div className={styles.groups}>
            {NAV_GROUPS.map((g) => (
              <div key={g.label} className={styles.group}>
                <p className={styles.groupLabel}>{g.label}</p>
                {g.links.map((l) => (
                  <Link key={l.href + l.label} href={l.href} className={styles.link} onClick={() => setOpen(false)}>
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
