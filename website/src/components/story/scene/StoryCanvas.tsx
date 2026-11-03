"use client";

import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ComponentRef, Suspense, useRef } from "react";
import {
  ACESFilmicToneMapping,
  Color,
  Fog,
  SRGBColorSpace,
  Vector3,
} from "three";
import { THEME_SCENE, ThemeId } from "@/lib/themes";
import { AllahParticles } from "./AllahParticles";
import { AssemblyDust } from "./AssemblyDust";
import { MosqueModel } from "./MosqueModel";
import { ParticleField } from "./ParticleField";
import { SceneDirector } from "./SceneDirector";
import { SceneMotionProps, StoryProgressRef } from "./types";

// Progress past which the scripted camera hands control to the viewer so they
// can orbit the finished mosque freely.
export const ORBIT_START = 0.985;
const ORBIT_TARGET = new Vector3(0, 8, 0);
// Easing rate of the smoothed progress — higher tracks scroll more tightly,
// lower glides more. ~7 gives an Apple-like scroll-linked feel.
const SMOOTH_RATE = 7;

/**
 * Eases a single shared progress value toward the raw scroll position every
 * frame. Every scene animation reads this smoothed value, so quick scrolls and
 * trackpad momentum become fluid motion instead of snapping.
 */
function MotionSmoother({
  rawRef,
  smoothRef,
  reducedMotion,
}: {
  rawRef: StoryProgressRef;
  smoothRef: StoryProgressRef;
  reducedMotion: boolean;
}) {
  useFrame((_, delta) => {
    const target = rawRef.current;
    if (reducedMotion) {
      smoothRef.current = target;
      return;
    }
    const k = 1 - Math.exp(-delta * SMOOTH_RATE);
    smoothRef.current += (target - smoothRef.current) * k;
  });
  return null;
}

/**
 * Free 360° orbit at the very end of the story. Enabled once the build
 * completes; the scroll-driven SceneDirector yields the camera to it.
 */
function EndOrbit({ progressRef, reducedMotion }: SceneMotionProps) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const active = useRef(false);

  useFrame(() => {
    const instance = controls.current;
    if (!instance) return;
    const shouldOrbit = !reducedMotion && progressRef.current > ORBIT_START;
    if (shouldOrbit !== active.current) {
      active.current = shouldOrbit;
      instance.enabled = shouldOrbit;
      if (shouldOrbit) {
        instance.target.copy(ORBIT_TARGET);
        instance.update();
      }
    }
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enabled={false}
      enablePan={false}
      enableZoom={false}
      enableDamping
      dampingFactor={0.075}
      rotateSpeed={0.6}
      minPolarAngle={0.15}
      maxPolarAngle={Math.PI / 2.04}
    />
  );
}

/**
 * Tints the landing scene's background + fog to match the active theme, read
 * from the <html data-theme> attribute each frame so switching themes never
 * reloads the 3D scene. Materials and particles stay constant.
 */
function SceneTint() {
  const { scene } = useThree();
  const current = useRef("");
  useFrame(() => {
    const t = (document.documentElement.dataset.theme || "sapphire") as ThemeId;
    if (t === current.current) return;
    current.current = t;
    const col = new Color(THEME_SCENE[t] ?? THEME_SCENE.sapphire);
    scene.background = col;
    if (scene.fog instanceof Fog) scene.fog.color = col;
  });
  return null;
}

export function StoryCanvas({ progressRef, reducedMotion }: SceneMotionProps) {
  const smoothRef = useRef(0);
  const smooth: SceneMotionProps = { progressRef: smoothRef, reducedMotion };

  return (
    <Canvas
      camera={{ position: [29, 17, 48], fov: 39, near: 0.1, far: 220 }}
      dpr={[1, 1.7]}
      shadows
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        outputColorSpace: SRGBColorSpace,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.08,
      }}
      onCreated={({ scene }) => {
        scene.background = new Color("#08101f");
      }}
    >
      <MotionSmoother
        rawRef={progressRef}
        smoothRef={smoothRef}
        reducedMotion={reducedMotion}
      />
      <SceneTint />
      <fog attach="fog" args={["#08101f", 62, 128]} />
      <ambientLight intensity={0.72} color="#9bbce8" />
      <hemisphereLight args={["#9ac7ff", "#08101f", 1.45]} />
      <directionalLight
        castShadow
        position={[-18, 34, 26]}
        intensity={3.1}
        color="#d6e6ff"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={90}
        shadow-camera-left={-34}
        shadow-camera-right={34}
        shadow-camera-top={34}
        shadow-camera-bottom={-34}
      />
      <spotLight
        position={[22, 28, 18]}
        angle={0.5}
        penumbra={0.85}
        intensity={950}
        distance={90}
        color="#d5a94c"
      />
      <pointLight position={[-24, 9, 20]} intensity={165} color="#438fe0" distance={70} />

      <Suspense fallback={null}>
        <MosqueModel {...smooth} />
        <AllahParticles {...smooth} />
        <AssemblyDust {...smooth} />
        <ParticleField {...smooth} />
        <ContactShadows
          position={[0, -0.34, 0]}
          scale={72}
          opacity={0.42}
          blur={2.7}
          far={42}
          color="#030914"
          frames={reducedMotion ? 1 : 40}
        />
      </Suspense>
      <SceneDirector {...smooth} />
      <EndOrbit {...smooth} />
    </Canvas>
  );
}
