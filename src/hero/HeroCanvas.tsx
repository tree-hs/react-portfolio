// ─────────────────────────────────────────────────────────────────────────────
//  HeroCanvas — 첫 화면 배경의 은은한 WebGL 파티클 필드 (R3F)
//  · 무겁다(three). App 에서 React.lazy 로 별도 chunk 분리 → 텍스트 먼저 그려지고
//    캔버스는 뒤이어 스트리밍(progressive enhancement).
//  · 디자인 의도: 텍스트와 싸우지 않는 "배경 질감". 느린 드리프트 + 마우스 패럴럭스.
//  · /lab 의 R3F 학습과 같은 스택 — 포트폴리오 차별화 축과 연결.
// ─────────────────────────────────────────────────────────────────────────────
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleFieldProps {
  count: number;
}

function ParticleField({ count }: ParticleFieldProps) {
  const points = useRef<THREE.Points>(null);

  // 꼭짓점 위치를 박스 형태로 무작위 분포 (한 번만 계산해 GPU로)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16; // x
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10; // y
      arr[i * 3 + 2] = (Math.random() - 0.5) * 7; // z
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    const p = points.current;
    if (!p) return;
    // 아주 느린 자전
    p.rotation.y += delta * 0.025;
    // 마우스 패럴럭스 (pointer: -1..1) — lerp 로 부드럽게
    const { x, y } = state.pointer;
    p.rotation.x = THREE.MathUtils.lerp(p.rotation.x, y * 0.12, 0.04);
    p.position.x = THREE.MathUtils.lerp(p.position.x, x * 0.6, 0.04);
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#5b8cff"
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}

export default function HeroCanvas() {
  // 모바일/작은 화면은 입자 수를 줄여 부하 절감
  const count =
    typeof window !== "undefined" && window.innerWidth < 768 ? 1800 : 4500;

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ParticleField count={count} />
    </Canvas>
  );
}
