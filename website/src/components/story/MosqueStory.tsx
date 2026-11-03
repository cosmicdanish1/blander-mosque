"use client";

import dynamic from "next/dynamic";
import { useProgress } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { StoryChapter } from "./StoryChapter";
import { StoryProgress } from "./StoryProgress";
import { WebGLFallback } from "./WebGLFallback";
import { storyChapters } from "./story-data";
import { useReducedMotion } from "./useReducedMotion";
import { useStoryProgress } from "./useStoryProgress";
import styles from "./story.module.css";

const StoryCanvas = dynamic(
  () => import("./scene/StoryCanvas").then((module) => module.StoryCanvas),
  { ssr: false },
);

function canUseWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGL2RenderingContext && canvas.getContext("webgl2"),
    );
  } catch {
    return false;
  }
}

function SceneLoadingOverlay() {
  const { active, progress } = useProgress();
  return (
    <div
      className={`${styles.loadingOverlay} ${active ? styles.loadingActive : ""}`}
      aria-live="polite"
    >
      <span>{Math.round(progress)}%</span>
      <p>Preparing the architecture</p>
    </div>
  );
}

export function MosqueStory() {
  const rootRef = useRef<HTMLElement>(null);
  const { progressRef, progress, activeChapter } = useStoryProgress(
    rootRef,
    storyChapters.length,
  );
  const reducedMotion = useReducedMotion();
  const [webGL, setWebGL] = useState<boolean | null>(null);
  const interactive = !reducedMotion && webGL === true && progress > 0.985;

  useEffect(() => setWebGL(canUseWebGL()), []);

  // The 3D scene animates from refs via useFrame, so it never needs to re-render
  // on scroll. Memoising the element keeps the whole Three.js tree from
  // reconciling on every progress tick — key to a smooth, jank-free scroll.
  const canvas = useMemo(
    () => <StoryCanvas progressRef={progressRef} reducedMotion={reducedMotion} />,
    [progressRef, reducedMotion],
  );

  return (
    <main ref={rootRef} className={`${styles.story} s6-landing`}>
      <a className={styles.skipLink} href="#making">
        Skip particle introduction
      </a>

      <div
        className={`${styles.canvasLayer} ${interactive ? styles.canvasInteractive : ""}`}
        aria-hidden="true"
      >
        {webGL === false ? (
          <WebGLFallback />
        ) : webGL === true ? (
          <>
            {canvas}
            <SceneLoadingOverlay />
          </>
        ) : (
          <div className={styles.firstPaint} />
        )}
      </div>

      <div className={styles.atmosphere} aria-hidden="true" />
      <p className={styles.storyLabel}>Architectural story</p>
      <StoryProgress progress={progress} activeChapter={activeChapter} />

      {interactive && (
        <div className={styles.orbitHint} aria-hidden="true">
          <span className={styles.orbitDot} />
          Drag to look around · scroll up to replay
        </div>
      )}

      <div className={styles.chapters}>
        {storyChapters.map((chapter, index) => (
          <StoryChapter
            key={chapter.id}
            chapter={chapter}
            index={index}
            active={activeChapter === index}
          />
        ))}
      </div>

      <footer className={styles.handoff}>
        <p>End of architectural story</p>
        <span>Continue into the mosque website</span>
      </footer>
    </main>
  );
}
