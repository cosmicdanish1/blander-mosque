import type { Metadata } from "next";
import { PageHero, SectionHead } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { ContactForm } from "@/components/pages/ContactForm";
import ui from "@/components/ui/ui.module.css";

export const metadata: Metadata = {
  title: "Volunteer & Membership",
  description: "Give your time, skills, or support to the Sector 6 Jama Masjid — volunteering roles and membership options.",
};

const ROLES = [
  { icon: "book", title: "Teach at the Madrasa", body: "Help children learn Qur'an, character, and the basics of faith on weekends." },
  { icon: "hands", title: "Welfare & Food Drives", body: "Pack and distribute food to neighbours in need throughout the year." },
  { icon: "users", title: "Events & Hospitality", body: "Welcome visitors, set up community dinners, and help run programmes." },
  { icon: "star", title: "Maintenance & Care", body: "Keep the mosque clean, cared for, and beautiful for worshippers." },
] as const;

const TIERS = [
  { name: "Supporter", amount: "₹500 / yr", perks: ["Newsletter & updates", "Member of the community register"] },
  { name: "Sustainer", amount: "₹2,000 / yr", perks: ["Everything in Supporter", "Priority event invitations", "Annual report"] },
  { name: "Patron", amount: "₹10,000 / yr", perks: ["Everything in Sustainer", "Named on the donor wall", "Invitation to patrons' gathering"] },
] as const;

export default function VolunteerPage() {
  return (
    <>
      <PageHero
        eyebrow="Get Involved"
        title="Volunteer & Membership"
        lede="A mosque is built by its community. Give your time, your skills, or your support — every contribution matters."
        image="/images/render-rear.png"
      />

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Volunteer" title="Where you can help" />
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {ROLES.map((r, i) => (
              <Reveal key={r.title} delay={(i % 4) * 80}>
                <article className={`glass ${ui.card}`}>
                  <span className={ui.cardIcon}><Icon name={r.icon} /></span>
                  <h3 className={ui.cardTitle} style={{ fontSize: 18 }}>{r.title}</h3>
                  <p className={ui.cardBody}>{r.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead eyebrow="Membership" title="Become a member" lede="Support the mosque's running costs year-round and stay connected to the community." />
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {TIERS.map((t, i) => (
              <Reveal key={t.name} delay={i * 90}>
                <article className={`glass ${ui.card}`} style={{ display: "flex", flexDirection: "column" }}>
                  <p className="eyebrow">{t.name}</p>
                  <p style={{ fontFamily: "var(--font-display-family)", fontSize: 30, color: "var(--accent)", margin: "10px 0 16px" }}>{t.amount}</p>
                  <ul style={{ listStyle: "none", display: "grid", gap: 10, flex: 1 }}>
                    {t.perks.map((p) => (
                      <li key={p} style={{ display: "flex", gap: 10, color: "var(--muted)", fontSize: 14 }}>
                        <span style={{ color: "var(--accent)", flex: "none" }}><Icon name="star" size={16} /></span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <SectionHead eyebrow="Sign up" title="Register your interest" />
          <Reveal>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
