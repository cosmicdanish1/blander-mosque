import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Points,
  ShaderMaterial,
} from "three";
import { seededRandom, smoothstep } from "./math";
import { SceneMotionProps } from "./types";

const POINT_COUNT = 1900;

const vertexShader = `
  uniform float uTime;
  uniform float uMorph;
  uniform float uScatter;
  uniform float uPixelRatio;
  attribute vec3 aTarget;
  attribute float aSize;
  varying float vGlow;
  void main() {
    vec3 formed = mix(position, aTarget, uMorph);
    vec3 direction = normalize(position + vec3(0.001));
    formed += direction * uScatter * (2.0 + aSize * 1.4);
    formed.x += sin(uTime * 0.7 + position.y) * 0.04 * uMorph;
    vec4 mv = modelViewMatrix * vec4(formed, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (115.0 / max(1.0, -mv.z));
    vGlow = uMorph;
  }
`;

const fragmentShader = `
  uniform float uOpacity;
  varying float vGlow;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float halo = smoothstep(0.5, 0.0, d);
    vec3 blue = vec3(0.26, 0.59, 0.95);
    vec3 gold = vec3(0.96, 0.76, 0.35);
    gl_FragColor = vec4(mix(blue, gold, vGlow * 0.88), halo * uOpacity);
  }
`;

function sampleArabicWord(count: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 720;
  canvas.height = 360;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "white";
  context.font = '260px "Traditional Arabic", "Noto Naskh Arabic", serif';
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.direction = "rtl";
  context.fillText("الله", canvas.width / 2, canvas.height * 0.48);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const candidates: [number, number][] = [];
  for (let y = 4; y < canvas.height; y += 4) {
    for (let x = 4; x < canvas.width; x += 4) {
      if (pixels[(y * canvas.width + x) * 4 + 3] > 120) candidates.push([x, y]);
    }
  }
  if (!candidates.length) return null;
  const random = seededRandom(786);
  const targets = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const [x, y] = candidates[Math.floor(random() * candidates.length)];
    targets[index * 3] = ((x / canvas.width) - 0.5) * 19;
    targets[index * 3 + 1] = (0.5 - y / canvas.height) * 10 + 11;
    targets[index * 3 + 2] = 4 + (random() - 0.5) * 0.6;
  }
  return targets;
}

export function AllahParticles({ progressRef, reducedMotion }: SceneMotionProps) {
  const points = useRef<Points>(null);
  const geometryRef = useRef<BufferGeometry>(null);
  const count = reducedMotion ? 1 : POINT_COUNT;
  const attributes = useMemo(() => {
    const random = seededRandom(99);
    const positions = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let index = 0; index < count; index += 1) {
      const radius = 7 + random() * 17;
      const angle = random() * Math.PI * 2;
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = 5 + random() * 16;
      positions[index * 3 + 2] = 2 + Math.sin(angle) * radius * 0.35;
      targets.set(positions.subarray(index * 3, index * 3 + 3), index * 3);
      sizes[index] = 0.65 + random() * 1.35;
    }
    return { positions, targets, sizes };
  }, [count]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uMorph: { value: 0 },
          uScatter: { value: 0 },
          uOpacity: { value: 0 },
          uPixelRatio: { value: Math.min(2, typeof window === "undefined" ? 1 : window.devicePixelRatio) },
        },
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    [],
  );

  useEffect(() => {
    if (reducedMotion || !geometryRef.current) return;
    const target = sampleArabicWord(count);
    if (!target) return;
    geometryRef.current.setAttribute("aTarget", new BufferAttribute(target, 3));
  }, [count, reducedMotion]);

  useFrame((state) => {
    const p = progressRef.current;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uMorph.value = smoothstep(0.105, 0.15, p);
    material.uniforms.uScatter.value = smoothstep(0.19, 0.235, p);
    const fadeIn = smoothstep(0.09, 0.125, p);
    const fadeOut = 1 - smoothstep(0.195, 0.235, p);
    material.uniforms.uOpacity.value = reducedMotion ? 0 : fadeIn * fadeOut;
    if (points.current) points.current.visible = material.uniforms.uOpacity.value > 0.002;
  });

  return (
    <points ref={points} material={material} frustumCulled={false}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute attach="attributes-position" args={[attributes.positions, 3]} />
        <bufferAttribute attach="attributes-aTarget" args={[attributes.targets, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[attributes.sizes, 1]} />
      </bufferGeometry>
    </points>
  );
}
