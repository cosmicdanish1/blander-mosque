import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { EventsList } from "@/components/pages/EventsList";

export const metadata: Metadata = {
  title: "Events & Programs",
  description:
    "Weekly prayers, classes, youth circles, and community gatherings at the Sector 6 Jama Masjid, Bhilai.",
};

export default function EventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Community Life"
        title="Events & Programs"
        lede="From Friday prayer to children's classes and community dinners — the weekly rhythm that keeps the mosque a living place."
        image="/images/render-detail.png"
      />
      <section className="section">
        <div className="container">
          <Reveal>
            <EventsList />
          </Reveal>
        </div>
      </section>
    </>
  );
}
