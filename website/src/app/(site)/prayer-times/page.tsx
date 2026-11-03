import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { PrayerBoard } from "@/components/prayer/PrayerBoard";
import { MOSQUE } from "@/data/mosque";

export const metadata: Metadata = {
  title: "Prayer Times",
  description: `Daily salah and Jummah times for ${MOSQUE.name}, Bhilai, with a live countdown to the next congregational prayer.`,
};

export default function PrayerTimesPage() {
  return (
    <>
      <PageHero
        eyebrow="Daily Salah"
        title="Prayer Times"
        lede="Live congregational times for the Sector 6 Jama Masjid, calculated for Bhilai and updated each day. Please arrive a few minutes early to make the rows."
        image="/images/render-three-quarter.png"
      />
      <section className="section">
        <div className="container">
          <Reveal>
            <PrayerBoard />
          </Reveal>
          <p className="lede" style={{ marginTop: 28, fontSize: 14 }}>
            Times are calculated with the University of Islamic Sciences (Karachi)
            method and shown in your device&rsquo;s local time. If live calculation
            is unavailable, an estimated timetable is shown — always confirm with
            the printed board at the entrance.
          </p>
        </div>
      </section>
    </>
  );
}
