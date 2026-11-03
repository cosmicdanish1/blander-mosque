import type { RefObject } from "react";

export type StoryProgressRef = RefObject<number>;

export type SceneMotionProps = {
  progressRef: StoryProgressRef;
  reducedMotion: boolean;
};
