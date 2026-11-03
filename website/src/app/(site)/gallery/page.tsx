import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { GalleryGrid } from "@/components/pages/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Renders and views of the Sector 6 Jama Masjid — dome, arcade, jali screens, and minaret.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Media"
        title="Gallery"
        lede="A closer look at the mosque — architectural renders and detail studies of the dome, screens, and minaret."
        image="/images/render-detail.png"
      />
      <section className="section">
        <div className="container">
          <Reveal>
            <GalleryGrid />
          </Reveal>
        </div>
      </section>
    </>
  );
}
