"use client";

import { ContactShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { ACESFilmicToneMapping, Color, SRGBColorSpace } from "three";
import { AllahParticles } from "./AllahParticles";
import { AssemblyDust } from "./AssemblyDust";
import { MosqueModel } from "./MosqueModel";
import { ParticleField } from "./ParticleField";
import { SceneDirector } from "./SceneDirector";
import { SceneMotionProps } from "./types";

export function StoryCanvas(props: SceneMotionProps) {
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
        <MosqueModel {...props} />
        <AllahParticles {...props} />
        <AssemblyDust {...props} />
        <ParticleField {...props} />
        <ContactShadows
          position={[0, -0.34, 0]}
          scale={72}
          opacity={0.42}
          blur={2.7}
          far={42}
          color="#030914"
          frames={props.reducedMotion ? 1 : 40}
        />
      </Suspense>
      <SceneDirector {...props} />
    </Canvas>
  );
}
