import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { DonatePanel } from "@/components/pages/DonatePanel";

export const metadata: Metadata = {
  title: "Donate & Support",
  description:
    "Support the Sector 6 Jama Masjid — keep the doors open, support the madrasa, and contribute to the zakat and welfare fund.",
};

export default function DonatePage() {
  return (
    <>
      <PageHero
        eyebrow="Sadaqah & Zakat"
        title="Support the masjid"
        lede="Your giving keeps the lights on, the teachers teaching, and the welfare fund flowing to neighbours in need. Every amount is an act of worship."
        image="/images/render-front.png"
      />
      <section className="section">
        <div className="container">
          <Reveal>
            <DonatePanel />
          </Reveal>
        </div>
      </section>
    </>
  );
}
