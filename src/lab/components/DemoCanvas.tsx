// 모든 데모가 공유하는 <Canvas> 래퍼.
//  · 캔버스는 부모 div의 크기를 따라가므로 .lab-canvas 에 명시적 height가 필요(lab.scss).
//  · OrbitControls / Stats(FPS) 같은 "데모마다 거의 항상 쓰는 것"을 여기서 한 번에 켠다.
//  · r3f-perf(<Perf/>)는 Phase 3 성능 데모에서 직접 붙일 예정(여기선 가벼운 drei <Stats/>만).
import type { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";

interface DemoCanvasProps {
  children: ReactNode;
  /** 카메라 초기 위치 [x, y, z] */
  cameraPosition?: [number, number, number];
  /** 카메라 화각(도) */
  fov?: number;
  /** 마우스 궤도 컨트롤 사용 여부 */
  orbit?: boolean;
  /** FPS 통계(drei Stats) 표시 여부 */
  stats?: boolean;
  /** 배경색 (CSS color) */
  background?: string;
}

export default function DemoCanvas({
  children,
  cameraPosition = [3, 2, 4],
  fov = 50,
  orbit = true,
  stats = true,
  background = "#1a1a1f",
}: DemoCanvasProps) {
  return (
    <div className="lab-canvas" style={{ background }}>
      <Canvas
        // dpr=[1,2]: 레티나에서 너무 무겁지 않게 픽셀 비율 상한을 2로 제한
        dpr={[1, 2]}
        camera={{ position: cameraPosition, fov }}
        // shadows: directionalLight.castShadow + mesh.castShadow/receiveShadow 와 함께 그림자 활성
        shadows
      >
        {children}
        {orbit && <OrbitControls makeDefault enableDamping dampingFactor={0.08} />}
        {stats && <Stats />}
      </Canvas>
    </div>
  );
}
