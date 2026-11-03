import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { ContactForm } from "@/components/pages/ContactForm";
import { MOSQUE } from "@/data/mosque";
import ui from "@/components/ui/ui.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with the ${MOSQUE.name} — enquiries, services, volunteering, and visits.`,
};

export default function ContactPage() {
  const details = [
    { icon: "pin" as const, title: "Address", lines: [MOSQUE.address.line1, MOSQUE.address.line2] },
    { icon: "phone" as const, title: "Phone", lines: [MOSQUE.contact.phone] },
    { icon: "mail" as const, title: "Email", lines: [MOSQUE.contact.email] },
  ];
  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="Contact the masjid"
        lede="Questions, services, or a visit — send a message and a volunteer will get back to you."
        image="/images/render-three-quarter.png"
      />
      <section className="section">
        <div className="container">
          <div className="grid" style={{ gridTemplateColumns: "1fr 1.2fr", alignItems: "start" }}>
            <Reveal>
              <div style={{ display: "grid", gap: 14 }}>
                {details.map((d) => (
                  <div key={d.title} className={`glass ${ui.card}`} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <span className={ui.cardIcon} style={{ marginBottom: 0, flex: "none" }}><Icon name={d.icon} /></span>
                    <div>
                      <h3 className={ui.cardTitle} style={{ fontSize: 16 }}>{d.title}</h3>
                      {d.lines.map((l) => <p key={l} className={ui.cardBody} style={{ marginTop: 4 }}>{l}</p>)}
                    </div>
                  </div>
                ))}
                <div className={`glass ${ui.card}`}>
                  <h3 className={ui.cardTitle} style={{ fontSize: 16 }}>Follow</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                    {MOSQUE.socials.map((s) => (
                      <a key={s.label} href={s.href} className="pill" style={{ color: "var(--text)" }}>{s.label}</a>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
