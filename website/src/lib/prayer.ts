import { MOSQUE } from "@/data/mosque";

export type PrayerKey = "Fajr" | "Sunrise" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";

export type Timing = { key: PrayerKey; label: string; time: string; congregation: boolean };

export const PRAYER_ORDER: { key: PrayerKey; label: string; congregation: boolean }[] = [
  { key: "Fajr", label: "Fajr", congregation: true },
  { key: "Sunrise", label: "Sunrise", congregation: false },
  { key: "Dhuhr", label: "Dhuhr", congregation: true },
  { key: "Asr", label: "Asr", congregation: true },
  { key: "Maghrib", label: "Maghrib", congregation: true },
  { key: "Isha", label: "Isha", congregation: true },
];

/** Reasonable fallback so the UI always renders if the API is unreachable. */
export const FALLBACK_TIMES: Record<PrayerKey, string> = {
  Fajr: "05:10",
  Sunrise: "06:20",
  Dhuhr: "12:15",
  Asr: "15:35",
  Maghrib: "18:05",
  Isha: "19:20",
};

export const JUMMAH_TIME = "13:30";

export function toTimings(raw: Record<PrayerKey, string>): Timing[] {
  return PRAYER_ORDER.map((p) => ({
    key: p.key,
    label: p.label,
    time: raw[p.key],
    congregation: p.congregation,
  }));
}

/** "HH:MM" (24h) -> "h:MM AM/PM" */
export function format12(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function minutesOf(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export type NextPrayer = {
  key: PrayerKey;
  label: string;
  time: string;
  /** seconds until it begins */
  inSeconds: number;
};

export function nextPrayer(times: Record<PrayerKey, string>, now = new Date()): NextPrayer {
  const nowMin = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  const congregational = PRAYER_ORDER.filter((p) => p.congregation);
  for (const p of congregational) {
    const diff = minutesOf(times[p.key]) - nowMin;
    if (diff > 0) {
      return { key: p.key, label: p.label, time: times[p.key], inSeconds: Math.round(diff * 60) };
    }
  }
  // After Isha — next is tomorrow's Fajr.
  const diff = 24 * 60 - nowMin + minutesOf(times.Fajr);
  return { key: "Fajr", label: "Fajr", time: times.Fajr, inSeconds: Math.round(diff * 60) };
}

/** Fetch today's timings from the Aladhan API (client-side). */
export async function fetchTimings(
  date = new Date(),
  signal?: AbortSignal,
): Promise<Record<PrayerKey, string>> {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const { lat, lng } = MOSQUE.coords;
  const url = `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${lat}&longitude=${lng}&method=1&school=1`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("prayer api");
  const json = await res.json();
  const t = json?.data?.timings ?? {};
  const pick = (k: string): string => String(t[k] ?? "").slice(0, 5);
  const out: Record<PrayerKey, string> = {
    Fajr: pick("Fajr") || FALLBACK_TIMES.Fajr,
    Sunrise: pick("Sunrise") || FALLBACK_TIMES.Sunrise,
    Dhuhr: pick("Dhuhr") || FALLBACK_TIMES.Dhuhr,
    Asr: pick("Asr") || FALLBACK_TIMES.Asr,
    Maghrib: pick("Maghrib") || FALLBACK_TIMES.Maghrib,
    Isha: pick("Isha") || FALLBACK_TIMES.Isha,
  };
  return out;
}

export function formatCountdown(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
