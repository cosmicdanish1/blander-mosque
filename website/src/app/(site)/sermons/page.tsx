import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SermonsList } from "@/components/pages/SermonsList";

export const metadata: Metadata = {
  title: "Sermons & Lectures",
  description: "An archive of Friday khutbahs and evening lectures from the Sector 6 Jama Masjid.",
};

export default function SermonsPage() {
  return (
    <>
      <PageHero
        eyebrow="Learn"
        title="Sermons & Lectures"
        lede="Revisit the Friday khutbah and special lectures — on patience, gratitude, good character, and the rights of neighbours."
        image="/images/render-front.png"
      />
      <section className="section">
        <div className="container">
          <Reveal>
            <SermonsList />
          </Reveal>
        </div>
      </section>
    </>
  );
}
