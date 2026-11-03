"use client";

import { useEffect, useRef, useState } from "react";
import {
  FALLBACK_TIMES,
  NextPrayer,
  PrayerKey,
  fetchTimings,
  nextPrayer,
} from "@/lib/prayer";

export type PrayerState = {
  times: Record<PrayerKey, string>;
  next: NextPrayer;
  live: boolean;
};

export function usePrayerTimes(): PrayerState {
  const [times, setTimes] = useState<Record<PrayerKey, string>>(FALLBACK_TIMES);
  const [live, setLive] = useState(false);
  // Static initial value (no Date) so prerender stays deterministic; the real
  // next prayer is computed on the client in the effect below.
  const [next, setNext] = useState<NextPrayer>({
    key: "Fajr",
    label: "Fajr",
    time: FALLBACK_TIMES.Fajr,
    inSeconds: 0,
  });
  const timesRef = useRef(times);
  timesRef.current = times;

  useEffect(() => {
    const controller = new AbortController();
    fetchTimings(new Date(), controller.signal)
      .then((t) => {
        setTimes(t);
        setLive(true);
      })
      .catch(() => setLive(false));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const update = () => setNext(nextPrayer(timesRef.current));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [times]);

  return { times, next, live };
}
