"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PRIMARY_NAV, NAV_GROUPS } from "@/data/nav";
import { MOSQUE } from "@/data/mosque";
import { Icon } from "@/components/ui/Icon";
import { PrayerChip } from "./PrayerChip";
import { ThemeSwitcher } from "./ThemeSwitcher";
import styles from "./site.module.css";

export function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <nav className={`${styles.nav} ${scrolled || open ? "glass-strong" : ""}`}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.brand} aria-label={MOSQUE.name}>
            <span className={styles.brandMark}>
              <Icon name="mosque" size={20} />
            </span>
            <span>
              {MOSQUE.shortName}
              <span className={styles.brandSub} style={{ display: "block" }}>
                {MOSQUE.city}, {MOSQUE.region}
              </span>
            </span>
          </Link>

          <div className={styles.navLinks}>
            {PRIMARY_NAV.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`${styles.navLink} ${isActive(l.href) ? styles.navLinkActive : ""}`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className={styles.navRight}>
            <PrayerChip />
            <ThemeSwitcher />
            <Link href="/donate" className={`btn btn-primary ${styles.navDonate}`}>
              Donate
            </Link>
            <button
              type="button"
              className={`${styles.menuToggle} ${open ? styles.menuOpen : ""}`}
              aria-label="Menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className={styles.sheet}>
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className={styles.sheetGroup}>
              <p className={styles.sheetGroupLabel}>{group.label}</p>
              {group.links.map((l) => (
                <Link key={l.href} href={l.href} className={styles.sheetLink}>
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
          <Link href="/donate" className="btn btn-primary" style={{ marginTop: 8 }}>
            Donate to the Masjid
          </Link>
        </div>
      )}
    </>
  );
}
