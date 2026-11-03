import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { AdditiveBlending, ShaderMaterial } from "three";
import { seededRandom, smoothstep } from "./math";
import { SceneMotionProps } from "./types";

const vertexShader = `
  uniform float uBuild;
  uniform float uTime;
  attribute float aSize;
  varying float vAlpha;
  void main() {
    float buildHeight = uBuild * 28.0;
    float band = 1.0 - smoothstep(1.0, 4.5, abs(position.y - buildHeight));
    vec3 p = position;
    p.y += sin(uTime * 1.2 + position.x) * 0.12;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * (80.0 / max(1.0, -mv.z));
    vAlpha = band;
  }
`;

const fragmentShader = `
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float alpha = smoothstep(0.5, 0.08, d) * vAlpha * uOpacity;
    gl_FragColor = vec4(0.92, 0.70, 0.31, alpha);
  }
`;

export function AssemblyDust({ progressRef, reducedMotion }: SceneMotionProps) {
  const count = reducedMotion ? 1 : 900;
  const attributes = useMemo(() => {
    const random = seededRandom(606);
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let index = 0; index < count; index += 1) {
      positions[index * 3] = -22 + random() * 44;
      positions[index * 3 + 1] = random() * 28;
      positions[index * 3 + 2] = -11 + random() * 24;
      sizes[index] = 0.5 + random() * 1.4;
    }
    return { positions, sizes };
  }, [count]);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uBuild: { value: 0 },
          uTime: { value: 0 },
          uOpacity: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    [],
  );

  useFrame((state) => {
    const p = progressRef.current;
    const build = smoothstep(0.14, 0.86, p);
    material.uniforms.uBuild.value = build;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uOpacity.value = reducedMotion
      ? 0
      : smoothstep(0.15, 0.19, p) * (1 - smoothstep(0.82, 0.87, p));
  });

  return (
    <points material={material} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[attributes.positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[attributes.sizes, 1]} />
      </bufferGeometry>
    </points>
  );
}
