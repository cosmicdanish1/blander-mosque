import type { Metadata } from "next";
import { PageHero, SectionHead } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { RamadanHub } from "@/components/pages/RamadanHub";
import ui from "@/components/ui/ui.module.css";

export const metadata: Metadata = {
  title: "Ramadan & Eid",
  description: "Sehri and iftar times, Taraweeh, community iftars, and Eid salah at the Sector 6 Jama Masjid.",
};

const PROGRAMMES = [
  { icon: "moon", title: "Taraweeh Prayer", body: "Nightly Taraweeh after Isha throughout the month, led by the imam and visiting huffaz." },
  { icon: "users", title: "Community Iftars", body: "Shared iftar at the mosque on weekends — all are welcome to break the fast together." },
  { icon: "book", title: "I'tikaf", body: "Spaces for spiritual retreat during the last ten nights. Register in advance." },
  { icon: "hands", title: "Zakat al-Fitr", body: "Collected and distributed before Eid so every family can celebrate." },
] as const;

export default function RamadanPage() {
  return (
    <>
      <PageHero
        eyebrow="The Holy Month"
        title="Ramadan & Eid"
        lede="Sehri and iftar times, nightly Taraweeh, community iftars, and Eid prayer — everything for a blessed month at the masjid."
        image="/images/render-front.png"
      />

      <section className="section">
        <div className="container">
          <Reveal>
            <RamadanHub />
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead eyebrow="During Ramadan" title="Programmes & worship" />
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {PROGRAMMES.map((p, i) => (
              <Reveal key={p.title} delay={(i % 4) * 80}>
                <article className={`glass ${ui.card}`}>
                  <span className={ui.cardIcon}><Icon name={p.icon} /></span>
                  <h3 className={ui.cardTitle} style={{ fontSize: 18 }}>{p.title}</h3>
                  <p className={ui.cardBody}>{p.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <div className="glass-strong" style={{ padding: "clamp(28px, 4vw, 48px)", display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p className="eyebrow">Eid</p>
                <h3 style={{ fontSize: "clamp(24px, 3vw, 34px)", color: "var(--text)", marginTop: 10 }}>Eid Salah & Festival</h3>
                <p className="lede" style={{ marginTop: 10 }}>Festival prayer on Eid morning at 7:00 AM, followed by breakfast and celebration for families. Moon-sighting announcements are posted here and on our socials.</p>
              </div>
              <span className={ui.cardIcon} style={{ width: 64, height: 64 }}><Icon name="moon" size={30} /></span>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
