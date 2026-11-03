"use client";

import { RefObject, useEffect, useRef, useState } from "react";

export function useStoryProgress(
  rootRef: RefObject<HTMLElement | null>,
  chapterCount: number,
) {
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    let frame = 0;
    let displayed = -1;
    let active = -1;

    const update = () => {
      frame = 0;
      const root = rootRef.current;
      if (!root) return;
      const top = root.getBoundingClientRect().top + window.scrollY;
      const distance = Math.max(1, root.offsetHeight - window.innerHeight);
      const next = Math.min(1, Math.max(0, (window.scrollY - top) / distance));
      progressRef.current = next;
      const percent = Math.round(next * 1000);
      if (percent !== displayed) {
        displayed = percent;
        setProgress(percent / 1000);
      }
      const viewportCenter = window.innerHeight * 0.5;
      const chapters = Array.from(root.querySelectorAll<HTMLElement>("section[id]"));
      const chapter = chapters.reduce(
        (best, element, index) => {
          const bounds = element.getBoundingClientRect();
          const distanceToCenter = Math.abs(bounds.top + bounds.height * 0.5 - viewportCenter);
          return distanceToCenter < best.distance
            ? { index, distance: distanceToCenter }
            : best;
        },
        { index: 0, distance: Number.POSITIVE_INFINITY },
      ).index;
      if (chapter !== active) {
        active = chapter;
        setActiveChapter(chapter);
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [chapterCount, rootRef]);

  return { progressRef, progress, activeChapter };
}
