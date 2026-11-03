import type { Metadata } from "next";
import { PageHero, SectionHead } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { SERMONS } from "@/data/content";
import ui from "@/components/ui/ui.module.css";

export const metadata: Metadata = {
  title: "Live Stream",
  description: "Watch Jummah and special programmes live from the Sector 6 Jama Masjid.",
};

export default function LivePage() {
  return (
    <>
      <PageHero
        eyebrow="Watch"
        title="Live from the masjid"
        lede="Join Friday prayer and special programmes wherever you are. The stream goes live shortly before Jummah each week."
        image="/images/render-three-quarter.png"
      />
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="glass-strong" style={{ overflow: "hidden" }}>
              <div style={{ position: "relative", aspectRatio: "16/9", display: "grid", placeItems: "center", background: "linear-gradient(135deg, var(--bg-2), var(--surface-solid))" }}>
                <div style={{ textAlign: "center" }}>
                  <span style={{ display: "grid", placeItems: "center", width: 74, height: 74, margin: "0 auto 16px", borderRadius: "50%", background: "color-mix(in oklch, var(--accent) 20%, transparent)", color: "var(--accent)" }}>
                    <Icon name="play" size={34} />
                  </span>
                  <p style={{ color: "var(--text)", fontFamily: "var(--font-display-family)", fontSize: 22 }}>Stream is offline</p>
                  <p style={{ color: "var(--muted)", marginTop: 6, fontSize: 14 }}>Next live · Friday, 1:30 PM (Jummah)</p>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", alignItems: "center", padding: "18px 22px" }}>
                <span className="pill"><span className={ui.statLabel} style={{ margin: 0 }}>Placeholder player — connect YouTube/Facebook live later</span></span>
                <a className="btn btn-ghost" href="#" >Set a reminder</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead eyebrow="Catch up" title="Recent streams" />
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            {SERMONS.slice(0, 3).map((s, i) => (
              <Reveal key={s.id} delay={i * 90}>
                <article className={`glass ${ui.card} ${ui.cardHover}`}>
                  <span className={ui.cardIcon}><Icon name="play" /></span>
                  <h3 className={ui.cardTitle} style={{ fontSize: 19 }}>{s.title}</h3>
                  <p className={ui.cardBody}>{s.series} · {s.speaker}</p>
                  <p style={{ marginTop: 14, color: "var(--muted)", fontSize: 13 }}>{s.date} · {s.length}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
