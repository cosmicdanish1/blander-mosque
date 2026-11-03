import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { QiblaCompass } from "@/components/pages/QiblaCompass";

export const metadata: Metadata = {
  title: "Qibla Finder",
  description: "Find the direction of the Kaaba from the Sector 6 Jama Masjid in Bhilai, with a live compass.",
};

export default function QiblaPage() {
  return (
    <>
      <PageHero
        eyebrow="Find the Direction"
        title="Qibla Finder"
        lede="The qibla is the direction of the Kaaba in Makkah, which Muslims face in prayer. Here it is, calculated for the mosque's location."
        image="/images/render-three-quarter.png"
      />
      <section className="section">
        <div className="container">
          <Reveal>
            <QiblaCompass />
          </Reveal>
        </div>
      </section>
    </>
  );
}
