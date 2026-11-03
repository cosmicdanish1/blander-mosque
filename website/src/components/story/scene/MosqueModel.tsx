import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import {
  Box3,
  Material,
  Mesh,
  MeshStandardMaterial,
  Object3D,
} from "three";
import { clamp01, smoothstep } from "./math";
import { SceneMotionProps } from "./types";

const MODEL_URL = "/models/sector-6-mosque.glb";

/**
 * Build choreography.
 *
 * Not every element should be laid "brick by brick" — that reads wrong for a
 * dome or a slender finial. Each section is assigned a construction STYLE that
 * matches what it physically is:
 *
 *   brick     — masonry that is laid course by course, bottom to top
 *               (foundation, walls, boundary, terrace slabs).
 *   blueprint — ornamental / screen-like work that materialises as an
 *               architectural visualisation: a scan line sweeps up the element
 *               with a drawn, holographic "linework" preview above it
 *               (arcades, pavilions, jali screens, carved facade, gates).
 *   extrude   — singular solid forms that emerge in one piece, rising up out of
 *               their own base (minaret shaft, dome, finials and rods).
 *
 * `order` sequences the assembly from the ground up. Everything is driven by
 * scroll progress; no animation is baked into the glTF.
 */
type BuildStyle = "brick" | "blueprint" | "extrude" | "ground";

const STYLE_CODE: Record<BuildStyle, number> = {
  brick: 0,
  blueprint: 1,
  extrude: 2,
  ground: 3,
};

const ACCENT: Record<BuildStyle, [number, number, number]> = {
  brick: [0.98, 0.74, 0.36], // warm stone-dust gold
  blueprint: [0.44, 0.72, 1.0], // cool celestial line-work
  extrude: [0.99, 0.81, 0.46], // warm emergence highlight
  ground: [0.5, 0.62, 0.8],
};

type SectionSpec = { style: BuildStyle; order: number };

const SECTIONS: Record<string, SectionSpec> = {
  site: { style: "ground", order: 0 },
  foundation: { style: "brick", order: 5 },
  boundary_rear: { style: "brick", order: 7 },
  boundary_left: { style: "brick", order: 8 },
  boundary_right: { style: "brick", order: 8 },
  boundary_front: { style: "brick", order: 9 },
  prayer_hall: { style: "brick", order: 16 },
  left_pavilion: { style: "blueprint", order: 22 },
  right_pavilion: { style: "blueprint", order: 23 },
  front_arcade: { style: "blueprint", order: 26 },
  left_arcade: { style: "blueprint", order: 27 },
  right_arcade: { style: "blueprint", order: 28 },
  terrace: { style: "brick", order: 36 },
  minaret_base: { style: "brick", order: 39 },
  upper_hall: { style: "brick", order: 43 },
  upper_front: { style: "blueprint", order: 47 },
  jali_left: { style: "blueprint", order: 52 },
  jali_right: { style: "blueprint", order: 54 },
  minaret_shaft: { style: "extrude", order: 60 },
  main_dome: { style: "extrude", order: 68 },
  main_finial: { style: "extrude", order: 74 },
  minaret_crown: { style: "extrude", order: 78 },
  entrance_gate_left: { style: "blueprint", order: 84 },
  entrance_gate_right: { style: "blueprint", order: 86 },
};

const MAX_ORDER = 86;

// Scroll windows (global progress 0..1).
const HERO_END = 0.045; // complete mosque is shown, then dissolves
const DISSOLVE_END = 0.085;
const BUILD_START = 0.14; // assembly begins after the "Allah" light beat
const BUILD_END = 0.86; // the growth is the journey — it spans most of the scroll
const SECTION_WINDOW = 0.26; // how long one section takes, in normalised order-time

type RevealShader = {
  uniforms: Record<string, { value: unknown }> & {
    uReveal: { value: number };
    uFade: { value: number };
    uStyle: { value: number };
    uSecMinY: { value: number };
    uSecMaxY: { value: number };
    uEmerge: { value: number };
    uAccent: { value: [number, number, number] };
  };
  vertexShader: string;
  fragmentShader: string;
};

type ControlledMaterial = {
  material: Material;
  orderNorm: number;
  style: BuildStyle;
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

const VERTEX_COMMON = `#include <common>
varying vec3 vMosqueWorld;
uniform float uReveal;
uniform float uEmerge;`;

const VERTEX_BEGIN = `#include <begin_vertex>
transformed.y -= (1.0 - uReveal) * uEmerge;
vMosqueWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;`;

const FRAGMENT_COMMON = `#include <common>
varying vec3 vMosqueWorld;
uniform float uReveal;
uniform float uFade;
uniform float uStyle;
uniform float uSecMinY;
uniform float uSecMaxY;
uniform float uEmerge;
uniform vec3 uAccent;
float mosqueHash(vec3 p){
  return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
}`;

const FRAGMENT_BUILD = `#include <clipping_planes_fragment>
  vec3 mosqueGlow = vec3(0.0);
  float mosqueAlpha = 1.0;
  float wy = vMosqueWorld.y;
  float secH = max(uSecMaxY - uSecMinY, 0.001);
  float localH = clamp((wy - uSecMinY) / secH, 0.0, 1.0);

  if (uStyle < 0.5) {
    // ---- masonry: laid course by course, bottom to top ----
    float brickH = 0.5;
    float brickW = 0.92;
    float row = floor((wy - uSecMinY) / brickH);
    float stagger = mod(row, 2.0) * 0.5;
    vec3 cell = floor(vec3(vMosqueWorld.x / brickW + stagger, row, vMosqueWorld.z / brickW));
    float n = mosqueHash(cell);
    float threshold = localH * 0.82 + n * 0.16;
    if (uReveal < threshold) discard;
    float age = clamp((uReveal - threshold) / 0.14, 0.0, 1.0);
    mosqueGlow += uAccent * (1.0 - age) * (1.0 - age) * 1.1;
  } else if (uStyle < 1.5) {
    // ---- architectural visualisation: a scan line draws the form ----
    // Nothing shows before this section's window opens, so high elements never
    // float as preview linework above walls that do not yet exist.
    if (uReveal < 0.004) discard;
    float cut = uReveal;
    float preview = 0.1;
    if (localH > cut + preview) discard;
    if (localH > cut) {
      float lineA = smoothstep(0.86, 0.995, fract(wy * 1.7));
      float lineB = smoothstep(0.86, 0.995, fract((vMosqueWorld.x + vMosqueWorld.z) * 1.05));
      float grid = max(lineA, lineB);
      if (grid < 0.5) discard;
      mosqueGlow += uAccent * 1.7;
      mosqueAlpha = 0.85;
    } else {
      float edge = smoothstep(cut - 0.05, cut, localH);
      mosqueGlow += uAccent * edge * 1.9;
    }
  } else if (uStyle < 2.5) {
    // ---- extrude: the whole form rises out of its base in one piece ----
    if (wy < uSecMinY - 0.02) discard;
    float front = smoothstep(uSecMinY + 1.1, uSecMinY, wy);
    mosqueGlow += uAccent * front * (1.0 - uReveal) * 1.3;
  } else {
    // ---- ground plot ----
    if (uReveal < 0.015) discard;
  }`;

const FRAGMENT_OUTPUT = `#include <opaque_fragment>
  gl_FragColor.rgb += mosqueGlow;
  gl_FragColor.a *= uFade * mosqueAlpha;`;

function prepareMaterial(
  source: Material,
  spec: SectionSpec,
  secMinY: number,
  secMaxY: number,
  controlled: ControlledMaterial[],
) {
  const material = source.clone();
  material.transparent = true;
  material.depthWrite = true;
  if (material instanceof MeshStandardMaterial) {
    material.envMapIntensity = 0.74;
    material.emissive.set("#071528");
    material.emissiveIntensity = spec.style === "extrude" ? 0.08 : 0.045;
  }
  const secHeight = Math.max(secMaxY - secMinY, 0.001);
  const emerge = spec.style === "extrude" ? secHeight : 0;
  const record: ControlledMaterial = {
    material,
    orderNorm: spec.order / MAX_ORDER,
    style: spec.style,
  };
  material.onBeforeCompile = (shader) => {
    const revealShader = shader as unknown as RevealShader;
    revealShader.uniforms.uReveal = { value: 1 };
    revealShader.uniforms.uFade = { value: 1 };
    revealShader.uniforms.uStyle = { value: STYLE_CODE[spec.style] };
    revealShader.uniforms.uSecMinY = { value: secMinY };
    revealShader.uniforms.uSecMaxY = { value: secMaxY };
    revealShader.uniforms.uEmerge = { value: emerge };
    revealShader.uniforms.uAccent = { value: ACCENT[spec.style] };
    revealShader.vertexShader = revealShader.vertexShader
      .replace("#include <common>", VERTEX_COMMON)
      .replace("#include <begin_vertex>", VERTEX_BEGIN);
    revealShader.fragmentShader = revealShader.fragmentShader
      .replace("#include <common>", FRAGMENT_COMMON)
      .replace("#include <clipping_planes_fragment>", FRAGMENT_BUILD)
      .replace("#include <opaque_fragment>", FRAGMENT_OUTPUT);
    record.shader = revealShader;
  };
  material.customProgramCacheKey = () => "mosque-build-choreography-v3";
  controlled.push(record);
  return material;
}

/** Local reveal for one section, from the global scroll progress. */
function sectionReveal(progress: number, orderNorm: number) {
  if (progress < BUILD_START) return 0;
  if (progress >= BUILD_END) return 1;
  const t = (progress - BUILD_START) / (BUILD_END - BUILD_START);
  const start = orderNorm * (1 - SECTION_WINDOW);
  return smoothstep(start, start + SECTION_WINDOW, t);
}

export function MosqueModel({ progressRef, reducedMotion }: SceneMotionProps) {
  const gltf = useGLTF(MODEL_URL, "/draco/");
  const prepared = useMemo(() => {
    const root = gltf.scene.clone(true);
    root.updateMatrixWorld(true);
    const controlled: ControlledMaterial[] = [];
    const box = new Box3();
    root.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      const section = sectionFor(object);
      const spec = SECTIONS[section] ?? { style: "brick", order: 20 };
      object.geometry.computeBoundingBox();
      box.copy(object.geometry.boundingBox!).applyMatrix4(object.matrixWorld);
      const secMinY = box.min.y;
      const secMaxY = box.max.y;
      object.castShadow = true;
      object.receiveShadow = true;
      object.material = Array.isArray(object.material)
        ? object.material.map((material) =>
            prepareMaterial(material, spec, secMinY, secMaxY, controlled),
          )
        : prepareMaterial(object.material, spec, secMinY, secMaxY, controlled);
    });
    return { root, controlled };
  }, [gltf.scene]);

  useEffect(
    () => () => prepared.controlled.forEach(({ material }) => material.dispose()),
    [prepared],
  );

  useFrame(() => {
    const p = progressRef.current;

    // Whole-model opacity for the hero -> "Allah" light -> build transition.
    let fade = 1;
    let heroReveal = 1;
    let building = false;
    if (reducedMotion) {
      fade = 1;
      heroReveal = 1;
    } else if (p < HERO_END) {
      fade = 1;
      heroReveal = 1;
    } else if (p < DISSOLVE_END) {
      fade = 1 - smoothstep(HERO_END, DISSOLVE_END, p);
      heroReveal = 1;
    } else if (p < BUILD_START) {
      fade = 0;
      heroReveal = 1;
    } else {
      fade = 1;
      building = true;
    }

    for (const item of prepared.controlled) {
      if (!item.shader) continue;
      const reveal =
        reducedMotion || !building
          ? heroReveal
          : clamp01(sectionReveal(p, item.orderNorm));
      item.shader.uniforms.uReveal.value = reveal;
      item.shader.uniforms.uFade.value = fade;
    }
  });

  return <primitive object={prepared.root} dispose={null} />;
}

useGLTF.preload(MODEL_URL, "/draco/");
