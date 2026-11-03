import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { useMemo } from "react";
import { SceneMotionProps } from "./types";
import { clamp01, smoothstep } from "./math";

type CameraFrame = {
  at: number;
  position: [number, number, number];
  target: [number, number, number];
};

const desktopFrames: CameraFrame[] = [
  // Hero: the completed place, a wide three-quarter establishing shot.
  { at: 0, position: [29, 17, 48], target: [0, 8.5, 0] },
  { at: 0.05, position: [24, 16, 46], target: [0, 9, 0] },
  // "Allah" light beat: centred and raised while the mosque has dissolved.
  { at: 0.1, position: [0, 12, 46], target: [0, 10, 0] },
  // Build begins — drop low to watch the ground and first stone courses.
  { at: 0.17, position: [19, 5.5, 33], target: [0, 2.5, 0] },
  { at: 0.26, position: [-18, 7, 31], target: [-2, 4.5, -1] },
  // Arcades draw in; move closer along the threshold.
  { at: 0.36, position: [12, 7.5, 22], target: [0, 5, -1] },
  // Upper hall and pavilions; rise with the structure.
  { at: 0.46, position: [-14, 11, 26], target: [0, 8, -2] },
  // Jali screens trace into place.
  { at: 0.56, position: [4, 10, 18], target: [0, 8, -5] },
  // The dome lifts out of its drum.
  { at: 0.66, position: [-9, 13, 22], target: [0, 11, -2] },
  // The minaret extends; its finial rod comes out last.
  { at: 0.76, position: [12, 17, 24], target: [9, 15, -2] },
  // Settle on the near-complete mosque, then pull back to the whole.
  { at: 0.84, position: [6, 13, 26], target: [2, 10, -2] },
  { at: 0.92, position: [24, 17, 44], target: [1, 9, -1] },
  { at: 1, position: [33, 18, 54], target: [0, 8.5, 0] },
];

const mobileFrames: CameraFrame[] = desktopFrames.map((frame) => ({
  ...frame,
  position: [frame.position[0] * 0.62, frame.position[1] + 2, frame.position[2] * 1.2],
}));

export function SceneDirector({ progressRef, reducedMotion }: SceneMotionProps) {
  const { camera, size } = useThree();
  const position = useMemo(() => new Vector3(), []);
  const target = useMemo(() => new Vector3(), []);
  const look = useMemo(() => new Vector3(), []);

  useFrame((_, delta) => {
    // At the very end the viewer takes over with free orbit; stop scripting the
    // camera so the two don't fight. (Mirrors ORBIT_START in StoryCanvas.)
    if (!reducedMotion && progressRef.current > 0.985) return;

    const frames = size.width < 760 ? mobileFrames : desktopFrames;
    let progress = progressRef.current;
    if (reducedMotion) {
      const snap = frames.reduce((selected, frame) =>
        frame.at <= progress ? frame : selected,
      );
      progress = snap.at;
    }

    let from = frames[0];
    let to = frames[frames.length - 1];
    for (let index = 0; index < frames.length - 1; index += 1) {
      if (progress >= frames[index].at && progress <= frames[index + 1].at) {
        from = frames[index];
        to = frames[index + 1];
        break;
      }
    }

    const raw = clamp01((progress - from.at) / Math.max(0.001, to.at - from.at));
    const mix = reducedMotion ? 0 : smoothstep(0, 1, raw);
    position.set(...from.position).lerp(new Vector3(...to.position), mix);
    target.set(...from.target).lerp(new Vector3(...to.target), mix);
    const damping = 1 - Math.exp(-delta * (reducedMotion ? 10 : 3.6));
    camera.position.lerp(position, damping);
    look.lerp(target, damping);
    camera.lookAt(look);
  });

  return null;
}
