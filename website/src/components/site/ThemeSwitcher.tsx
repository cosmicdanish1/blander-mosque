"use client";

import { useEffect, useRef, useState } from "react";
import { THEMES } from "@/lib/themes";
import { useTheme } from "./ThemeProvider";
import styles from "./site.module.css";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
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
    <div className={styles.themeWrap} ref={ref}>
      <button
        type="button"
        className={styles.themeButton}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Theme: ${active.name}. Change theme`}
        onClick={() => setOpen((v) => !v)}
      >
        <span
          className={styles.themeDot}
          style={{
            background: `conic-gradient(${active.swatch[0]}, ${active.swatch[1]}, ${active.swatch[2]}, ${active.swatch[0]})`,
          }}
        />
      </button>
      {open && (
        <div className={`${styles.themeMenu} glass-strong`} role="menu">
          <p className={styles.themeMenuLabel}>Theme</p>
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              role="menuitemradio"
              aria-checked={t.id === theme}
              className={`${styles.themeItem} ${t.id === theme ? styles.themeItemActive : ""}`}
              onClick={() => {
                setTheme(t.id);
                setOpen(false);
              }}
            >
              <span className={styles.themeSwatches}>
                {t.swatch.map((c, i) => (
                  <span key={i} style={{ background: c }} />
                ))}
              </span>
              {t.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
