import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, Points, ShaderMaterial } from "three";
import { seededRandom } from "./math";
import { SceneMotionProps } from "./types";

const vertexShader = `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSize;
  attribute float aGold;
  varying float vGold;
  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.22 + position.y * 0.18) * 0.34;
    p.y += cos(uTime * 0.18 + position.x * 0.12) * 0.22;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (90.0 / max(1.0, -mv.z));
    vGold = aGold;
  }
`;

const fragmentShader = `
  varying float vGold;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float alpha = smoothstep(0.5, 0.05, d) * 0.5;
    vec3 blue = vec3(0.22, 0.55, 0.92);
    vec3 gold = vec3(0.87, 0.67, 0.28);
    gl_FragColor = vec4(mix(blue, gold, vGold), alpha);
  }
`;

export function ParticleField({ reducedMotion }: SceneMotionProps) {
  const points = useRef<Points>(null);
  const count = reducedMotion ? 420 : 1150;
  const geometry = useMemo(() => {
    const random = seededRandom(62);
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const gold = new Float32Array(count);
    for (let index = 0; index < count; index += 1) {
      const radius = 28 + random() * 34;
      const angle = random() * Math.PI * 2;
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = -5 + random() * 39;
      positions[index * 3 + 2] = -25 + Math.sin(angle) * radius;
      sizes[index] = 0.55 + random() * 1.7;
      gold[index] = random() > 0.82 ? 1 : 0;
    }
    return { positions, sizes, gold };
  }, [count]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: Math.min(2, typeof window === "undefined" ? 1 : window.devicePixelRatio) },
        },
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    [],
  );

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    if (points.current && !reducedMotion) points.current.rotation.y += 0.00008;
  });

  return (
    <points ref={points} material={material}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[geometry.positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[geometry.sizes, 1]} />
        <bufferAttribute attach="attributes-aGold" args={[geometry.gold, 1]} />
      </bufferGeometry>
    </points>
  );
}
