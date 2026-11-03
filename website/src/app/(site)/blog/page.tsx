import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { POSTS } from "@/data/content";
import ui from "@/components/ui/ui.module.css";

export const metadata: Metadata = {
  title: "Articles & Announcements",
  description: "News, announcements, and reflections from the Sector 6 Jama Masjid.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="News & Reflections"
        title="Articles & Announcements"
        lede="Timetable changes, community news, and short reflections from the mosque."
        image="/images/render-rear.png"
      />
      <section className="section">
        <div className="container">
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            {POSTS.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 90}>
                <Link href={`/blog/${p.slug}`} className={`glass ${ui.card} ${ui.cardHover}`} style={{ display: "block" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span className="pill" style={{ color: "var(--accent)" }}>{p.category}</span>
                    <span style={{ color: "var(--muted)", fontSize: 12 }}>{p.date}</span>
                  </div>
                  <h3 className={ui.cardTitle}>{p.title}</h3>
                  <p className={ui.cardBody}>{p.excerpt}</p>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 18, color: "var(--accent)", fontSize: 14, fontWeight: 600 }}>
                    Read more <Icon name="arrow" size={15} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
