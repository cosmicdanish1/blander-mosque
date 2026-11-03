import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHead } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { Icon } from "@/components/ui/Icon";
import { MOSQUE, MOSQUE_LONG_ABOUT } from "@/data/mosque";
import ui from "@/components/ui/ui.module.css";

export const metadata: Metadata = {
  title: "About & Architecture",
  description:
    "The story and architecture of the Sector 6 Jama Masjid in Bhilai — courtyard, arcade, prayer hall, jali screens, dome, and minaret.",
};

const ARCHITECTURE = [
  { icon: "mosque", title: "Courtyard & Boundary", body: "A walled forecourt sets the mosque apart from the street and gathers the community before prayer." },
  { icon: "book", title: "The Front Arcade", body: "A rhythm of pointed arches forms a sheltered threshold between the open courtyard and the prayer hall." },
  { icon: "users", title: "The Prayer Hall", body: "The main interior aligns worshippers in rows toward Makkah for congregational prayer." },
  { icon: "star", title: "The Jali Screens", body: "Geometric lattice screens filter light and air and give the upper facade its identity." },
  { icon: "moon", title: "The Ribbed Dome", body: "Set above the hall, the fluted dome crowns the composition and marks the skyline." },
  { icon: "compass", title: "The Minaret", body: "A marble-clad tower carries the visual presence associated with the call to prayer." },
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About the Masjid"
        title="A living place, built from prayer and craft"
        lede={MOSQUE.tagline}
        image="/images/render-front.png"
        actions={
          <>
            <Link href="/" className="btn btn-primary">
              Watch the 3D story <Icon name="arrow" size={16} />
            </Link>
            <Link href="/visit" className="btn btn-ghost">
              Plan a visit
            </Link>
          </>
        }
      />

      <section className="section">
        <div className="container">
          <div className="grid" style={{ gridTemplateColumns: "1fr", maxWidth: 760 }}>
            {MOSQUE_LONG_ABOUT.map((p, i) => (
              <Reveal key={i} delay={i * 80}>
                <p className="lede" style={{ fontSize: "clamp(17px, 2.4vw, 21px)", maxWidth: "unset" }}>
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <div
              className="glass"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: 24,
                padding: "clamp(28px, 4vw, 44px)",
              }}
            >
              {MOSQUE.stats.map((s) => (
                <div key={s.label}>
                  <p className={ui.statValue}>
                    <CountUp to={s.value} />
                    {s.suffix}
                  </p>
                  <p className={ui.statLabel}>{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead
            eyebrow="Architecture"
            title="Reading the building"
            lede="The mosque follows a familiar architectural grammar. Each part has a purpose — spiritual, practical, and communal."
          />
          <div
            className="grid"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
          >
            {ARCHITECTURE.map((a, i) => (
              <Reveal key={a.title} delay={(i % 3) * 90}>
                <article className={`glass ${ui.card} ${ui.cardHover}`}>
                  <span className={ui.cardIcon}>
                    <Icon name={a.icon} />
                  </span>
                  <h3 className={ui.cardTitle}>{a.title}</h3>
                  <p className={ui.cardBody}>{a.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
