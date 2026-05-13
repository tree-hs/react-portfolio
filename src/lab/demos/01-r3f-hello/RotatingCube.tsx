// ─────────────────────────────────────────────────────────────────────────────
//  Lab Demo 01 — Hello R3F: 회전하는 큐브
//  목표: <Canvas>(Scene/Camera/Renderer/루프) · <mesh>(Geometry+Material) ·
//        Light · useFrame 애니메이션의 역할을 코드로 확인한다.
//  이 파일은 React.lazy 로 /lab/r3f-hello 를 열 때만 별도 chunk로 로딩됨.
// ─────────────────────────────────────────────────────────────────────────────
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import type { Mesh } from "three";
import DemoCanvas from "../../components/DemoCanvas";

/** 무대에 올라가는 실제 물체(Mesh) = Geometry(형태) + Material(재질) */
function Cube() {
  // useRef<Mesh>: 렌더 사이에 유지되는 "이 mesh 인스턴스"로의 손잡이.
  // useFrame 안에서 ref.current 로 직접 transform을 만질 때 씀(리렌더 없이).
  const ref = useRef<Mesh>(null);

  // leva: 화면 우상단에 슬라이더/색선택기 패널을 만들어 값을 실시간으로 바꾼다.
  const { color, speed, scale, wireframe } = useControls("Cube", {
    color: "#ff7a45",
    speed: { value: 1, min: 0, max: 5, step: 0.1, label: "회전 속도" },
    scale: { value: 1, min: 0.2, max: 2, step: 0.1, label: "크기" },
    wireframe: { value: false, label: "와이어프레임" },
  });

  // useFrame: 매 프레임 호출. delta = 직전 프레임과의 시간차(초).
  // delta를 곱하면 프레임률(60Hz/120Hz)과 무관하게 같은 속도로 회전.
  useFrame((_state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.4 * speed;
    ref.current.rotation.y += delta * 0.6 * speed;
  });

  return (
    <mesh ref={ref} scale={scale} castShadow>
      {/* Geometry: 형태 — 가로·세로·높이 1짜리 정육면체(꼭짓점 8, 삼각형 12) */}
      <boxGeometry args={[1, 1, 1]} />
      {/* Material: 표면 재질 — 물리 기반(빛에 반응). 빛이 없으면 까맣게 보임 */}
      <meshStandardMaterial
        color={color}
        wireframe={wireframe}
        metalness={0.15}
        roughness={0.4}
      />
    </mesh>
  );
}

/** 바닥 판 — 그림자가 떨어지는 걸 보기 위해. (receiveShadow) */
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <meshStandardMaterial color="#2a2a32" roughness={1} metalness={0} />
    </mesh>
  );
}

export default function RotatingCubeDemo() {
  return (
    <DemoCanvas cameraPosition={[3.5, 2.5, 4.5]} fov={50}>
      {/* ambientLight: 모든 면을 은은하게 — 그림자 진 면이 완전 검정이 되지 않게 */}
      <ambientLight intensity={0.35} />
      {/* directionalLight: 태양처럼 한 방향에서 오는 평행광. castShadow로 그림자 생성 */}
      <directionalLight
        position={[5, 6, 4]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <Cube />
      <Floor />
      {/* gridHelper: 바닥 격자 — 공간감/스케일 확인용(렌더에는 영향, 디버그용 헬퍼) */}
      <gridHelper args={[12, 12, "#444", "#333"]} position={[0, -0.99, 0]} />
    </DemoCanvas>
  );
}
