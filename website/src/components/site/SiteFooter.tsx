import Link from "next/link";
import { MOSQUE } from "@/data/mosque";
import { NAV_GROUPS } from "@/data/nav";
import { Icon } from "@/components/ui/Icon";
import { Year } from "./Year";
import styles from "./site.module.css";

export function SiteFooter() {
  const cols = NAV_GROUPS.slice(0, 3);
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <Link href="/" className={styles.brand}>
              <span className={styles.brandMark}>
                <Icon name="mosque" size={20} />
              </span>
              {MOSQUE.name}
            </Link>
            <p>{MOSQUE.tagline}</p>
            <p>
              {MOSQUE.address.line1}
              <br />
              {MOSQUE.address.line2}
            </p>
          </div>
          {cols.map((group) => (
            <div key={group.label} className={styles.footerCol}>
              <h4>{group.label}</h4>
              {group.links.map((l) => (
                <Link key={l.href} href={l.href}>
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className={styles.footerBar}>
          <span>
            © <Year /> {MOSQUE.name}. Frontend demo · sample data.
          </span>
          <div className={styles.footerSocials}>
            {MOSQUE.socials.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label}>
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
