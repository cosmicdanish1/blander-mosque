import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import {
  Material,
  Mesh,
  MeshStandardMaterial,
  Object3D,
} from "three";
import { smoothstep } from "./math";
import { SceneMotionProps } from "./types";

const MODEL_URL = "/models/sector-6-mosque.glb";

type RevealShader = {
  uniforms: Record<string, { value: unknown }> & {
    uReveal: { value: number };
    uFade: { value: number };
    uSectionDelay: { value: number };
  };
  vertexShader: string;
  fragmentShader: string;
};

type ControlledMaterial = {
  material: Material;
  section: string;
  shader?: RevealShader;
};

function sectionFor(object: Object3D) {
  let current: Object3D | null = object;
  while (current) {
    const value = current.userData.section as string | undefined;
    if (value) return value;
    current = current.parent;
  }
  return object.name.replace(/^mesh__/, "");
}

function buildOrderFor(object: Object3D) {
  let current: Object3D | null = object;
  while (current) {
    const value = current.userData.build_order as number | undefined;
    if (typeof value === "number") return value;
    current = current.parent;
  }
  return 0;
}

function prepareMaterial(
  source: Material,
  sectionDelay: number,
  section: string,
  controlled: ControlledMaterial[],
) {
  const material = source.clone();
  material.transparent = true;
  material.depthWrite = true;
  if (material instanceof MeshStandardMaterial) {
    material.envMapIntensity = 0.72;
    material.emissive.set("#071528");
    material.emissiveIntensity = section.startsWith("minaret") ? 0.09 : 0.045;
  }
  const record: ControlledMaterial = { material, section };
  material.onBeforeCompile = (shader) => {
    const revealShader = shader as unknown as RevealShader;
    revealShader.uniforms.uReveal = { value: 1 };
    revealShader.uniforms.uFade = { value: 1 };
    revealShader.uniforms.uSectionDelay = { value: sectionDelay };
    revealShader.vertexShader = revealShader.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vMosqueWorldPosition;",
      )
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvMosqueWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;",
      );
    revealShader.fragmentShader = revealShader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vMosqueWorldPosition;\nuniform float uReveal;\nuniform float uFade;\nuniform float uSectionDelay;",
      )
      .replace(
        "#include <clipping_planes_fragment>",
        `#include <clipping_planes_fragment>
        float mosqueRow = floor((vMosqueWorldPosition.y + 0.5) / 0.42);
        float mosqueStagger = mod(mosqueRow, 2.0) * 0.43;
        vec3 mosqueBrick = floor(vec3(
          (vMosqueWorldPosition.x + mosqueStagger) / 0.86,
          mosqueRow,
          vMosqueWorldPosition.z / 0.86
        ));
        float mosqueNoise = fract(sin(dot(mosqueBrick, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
        float mosqueHeight = clamp((vMosqueWorldPosition.y + 0.5) / 27.5, 0.0, 1.0);
        float mosqueThreshold = clamp(uSectionDelay + mosqueHeight * 0.68 + mosqueNoise * 0.13, 0.0, 0.985);
        if (uReveal < mosqueThreshold) discard;
        diffuseColor.a *= uFade;`,
      );
    record.shader = revealShader;
  };
  material.customProgramCacheKey = () => "mosque-brick-reveal-v2";
  controlled.push(record);
  return material;
}

function focusedSections(progress: number) {
  if (progress >= 0.39 && progress < 0.5) {
    return new Set(["front_arcade", "left_pavilion", "right_pavilion"]);
  }
  if (progress >= 0.5 && progress < 0.61) {
    return new Set(["prayer_hall", "left_arcade", "right_arcade"]);
  }
  if (progress >= 0.61 && progress < 0.72) {
    return new Set(["jali_left", "jali_right", "upper_front"]);
  }
  if (progress >= 0.72 && progress < 0.83) {
    return new Set(["main_dome", "main_finial", "upper_hall"]);
  }
  if (progress >= 0.83 && progress < 0.95) {
    return new Set(["minaret_base", "minaret_shaft", "minaret_crown"]);
  }
  return null;
}

export function MosqueModel({ progressRef, reducedMotion }: SceneMotionProps) {
  const gltf = useGLTF(MODEL_URL, "/draco/");
  const prepared = useMemo(() => {
    const root = gltf.scene.clone(true);
    const controlled: ControlledMaterial[] = [];
    root.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      const section = sectionFor(object);
      const order = buildOrderFor(object);
      const delay = Math.min(0.2, order / 420);
      object.castShadow = true;
      object.receiveShadow = true;
      object.material = Array.isArray(object.material)
        ? object.material.map((material) =>
            prepareMaterial(material, delay, section, controlled),
          )
        : prepareMaterial(object.material, delay, section, controlled);
    });
    return { root, controlled };
  }, [gltf.scene]);

  useEffect(
    () => () => prepared.controlled.forEach(({ material }) => material.dispose()),
    [prepared],
  );

  useFrame(() => {
    const p = progressRef.current;
    let reveal = 1;
    let fade = 1;
    if (!reducedMotion) {
      if (p >= 0.1 && p < 0.155) fade = 1 - smoothstep(0.1, 0.155, p);
      else if (p >= 0.155 && p < 0.225) fade = 0;
      else if (p >= 0.225 && p < 0.395) reveal = smoothstep(0.225, 0.385, p);
    }
    const focus = reducedMotion ? null : focusedSections(p);
    for (const item of prepared.controlled) {
      if (!item.shader) continue;
      item.shader.uniforms.uReveal.value = reveal;
      const focusFade = !focus || focus.has(item.section) ? 1 : 0.18;
      item.shader.uniforms.uFade.value = fade * focusFade;
    }
  });

  return <primitive object={prepared.root} dispose={null} />;
}

useGLTF.preload(MODEL_URL, "/draco/");
