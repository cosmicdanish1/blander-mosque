import type { Metadata } from "next";
import { PageHero, SectionHead } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Accordion } from "@/components/ui/Accordion";
import { Icon } from "@/components/ui/Icon";
import { MOSQUE } from "@/data/mosque";
import { FAQ } from "@/data/content";
import ui from "@/components/ui/ui.module.css";

export const metadata: Metadata = {
  title: "Visit & Location",
  description: `How to find and visit the ${MOSQUE.name} in Bhilai — address, map, hours, directions, and etiquette for visitors of all backgrounds.`,
};

const ETIQUETTE = [
  { icon: "star", title: "Everyone is welcome", body: "Visitors of every faith and background are warmly welcomed." },
  { icon: "users", title: "Dress modestly", body: "Clothing that covers shoulders and knees; a head covering is appreciated inside the hall." },
  { icon: "heart", title: "Shoes off", body: "Please remove footwear at the racks before stepping onto the prayer carpet." },
  { icon: "moon", title: "Quiet during prayer", body: "Observe silence and avoid walking in front of those who are praying." },
] as const;

const HOURS = [
  { day: "Daily", time: "Open for all five prayers" },
  { day: "Friday (Jummah)", time: "Busiest — arrive by 1:15 PM" },
  { day: "Office & enquiries", time: "Mon–Sat, 10:00 AM – 6:00 PM" },
  { day: "Visitor tours", time: "By arrangement — see Contact" },
];

export default function VisitPage() {
  const { lat, lng } = MOSQUE.coords;
  const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <>
      <PageHero
        eyebrow="Visit Us"
        title="Find your way to the masjid"
        lede="In the heart of Sector 6, Bhilai. Whether you are coming to pray or simply to see the architecture, you are welcome here."
        image="/images/render-rear.png"
        actions={
          <a className="btn btn-primary" href={directions} target="_blank" rel="noreferrer">
            Get directions <Icon name="arrow" size={16} />
          </a>
        }
      />

      <section className="section">
        <div className="container">
          <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr", alignItems: "stretch" }}>
            <Reveal>
              <div className="glass" style={{ overflow: "hidden", height: "100%", minHeight: 360 }}>
                <iframe
                  title="Map to the mosque"
                  src={mapSrc}
                  style={{ border: 0, width: "100%", height: "100%", minHeight: 360, display: "block", filter: "saturate(0.9)" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className={`glass ${ui.card}`} style={{ display: "grid", gap: 20 }}>
                <div>
                  <span className={ui.cardIcon}><Icon name="pin" /></span>
                  <h3 className={ui.cardTitle}>Address</h3>
                  <p className={ui.cardBody}>
                    {MOSQUE.address.line1}<br />
                    {MOSQUE.address.line2}<br />
                    {MOSQUE.address.country}
                  </p>
                </div>
                <div>
                  <h4 className={ui.cardTitle} style={{ fontSize: 16 }}>Hours</h4>
                  <div style={{ marginTop: 10 }}>
                    {HOURS.map((h) => (
                      <div key={h.day} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "9px 0", borderTop: "1px solid var(--border)", fontSize: 14 }}>
                        <span style={{ color: "var(--muted)" }}>{h.day}</span>
                        <span style={{ color: "var(--text)", textAlign: "right" }}>{h.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead eyebrow="Before you come" title="Visitor etiquette" />
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {ETIQUETTE.map((e, i) => (
              <Reveal key={e.title} delay={(i % 4) * 80}>
                <article className={`glass ${ui.card}`}>
                  <span className={ui.cardIcon}><Icon name={e.icon} /></span>
                  <h3 className={ui.cardTitle} style={{ fontSize: 18 }}>{e.title}</h3>
                  <p className={ui.cardBody}>{e.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <SectionHead eyebrow="Good to know" title="Visiting questions" />
          <Reveal>
            <Accordion items={FAQ.slice(0, 4)} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
