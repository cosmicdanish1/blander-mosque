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
  { at: 0, position: [29, 17, 48], target: [0, 8.5, 0] },
  { at: 0.1, position: [21, 14, 44], target: [0, 9, 0] },
  { at: 0.22, position: [0, 12, 48], target: [0, 10, 0] },
  { at: 0.39, position: [0, 10, 45], target: [0, 8, 0] },
  { at: 0.5, position: [-17, 6, 25], target: [-5, 4, 0] },
  { at: 0.61, position: [1, 6.8, 17], target: [0, 5.5, -2] },
  { at: 0.72, position: [-9, 11.5, 20], target: [0, 10.5, 0] },
  { at: 0.83, position: [-11, 18, 25], target: [0, 15, 0] },
  { at: 0.94, position: [20, 19, 28], target: [9, 17, 0] },
  { at: 1, position: [32, 19, 51], target: [0, 9, 0] },
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
