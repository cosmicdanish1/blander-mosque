import type { Metadata } from "next";
import { PageHero, SectionHead } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Accordion } from "@/components/ui/Accordion";
import { Icon } from "@/components/ui/Icon";
import { RESOURCES, FAQ } from "@/data/content";
import ui from "@/components/ui/ui.module.css";

export const metadata: Metadata = {
  title: "Resources & FAQ",
  description: "Learning resources, guides, and frequently asked questions for the Sector 6 Jama Masjid community.",
};

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Learn"
        title="Resources & FAQ"
        lede="Guides for prayer and practice, downloads, and answers to the questions visitors ask most."
        image="/images/render-detail.png"
      />

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Guides & downloads" title="Start here" />
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {RESOURCES.map((r, i) => (
              <Reveal key={r.title} delay={(i % 3) * 80}>
                <a href={r.href} className={`glass ${ui.card} ${ui.cardHover}`} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span className={ui.cardIcon} style={{ marginBottom: 0, flex: "none" }}>
                    <Icon name={r.kind === "Download" ? "arrow" : r.kind === "Links" ? "compass" : "book"} />
                  </span>
                  <div>
                    <h3 className={ui.cardTitle} style={{ fontSize: 17 }}>{r.title}</h3>
                    <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 3 }}>{r.kind}</p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <SectionHead eyebrow="Questions" title="Frequently asked" />
          <Reveal>
            <Accordion items={FAQ} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
