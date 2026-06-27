// ═══════════════════════════════════════════════════════════════════════════
//  Lab Demo 01 — Hello R3F: 회전하는 큐브
// ───────────────────────────────────────────────────────────────────────────
//  목표: <Canvas>(Scene/Camera/Renderer/루프) · <mesh>(Geometry+Material) ·
//        Light · useFrame 애니메이션의 역할을 *코드*로 확인한다.
//
//  이 파일은 App.tsx 의 React.lazy 로 등록돼 있어서 /lab/r3f-hello 페이지를
//  실제로 열 때만 별도 chunk로 다운로드된다. (메인 번들에 three가 안 들어오게)
//
//  비교: 같은 일을 라이브러리 없이 하면 ../02-raw-webgl-triangle/RawTriangle.tsx
//        쪽이 약 270줄. 이 파일은 80줄. 그 차이의 정체는 docs/RENDERER_NOTES.md.
// ═══════════════════════════════════════════════════════════════════════════

import { useRef } from "react";
// ─ React 표준 훅. useRef는 "렌더 사이를 가로질러 살아남는 한 칸짜리 저장소".
//   .current 에 값을 직접 써도 *재렌더가 일어나지 않는다*. 그래서 매 프레임
//   ref.current.rotation.x 를 만져도 React는 알아채지 못함 — 그게 우리가 원하는 동작.
//   (3D는 60fps로 변하니까 매 프레임 setState 하면 React가 미쳐버린다.)

import { useFrame } from "@react-three/fiber";
// ─ R3F가 제공하는 "매 프레임 콜백 등록" 훅.
//   내부적으로는 <Canvas> 의 requestAnimationFrame 루프에 우리 함수를 끼워 넣음.
//   useEffect + rAF 를 직접 짜는 대신 useFrame((state, delta) => {...}) 한 줄이면 끝.

import { useControls } from "leva";
// ─ leva: 화면 한쪽에 슬라이더/색 선택기/체크박스 패널을 자동 생성해주는 라이브러리.
//   useControls(이름, 스키마) 한 번 부르면 그 컴포넌트가 패널에 컨트롤들을 등록하고,
//   사용자가 값을 바꿀 때마다 그 값으로 컴포넌트가 재렌더된다.
//   학습/시연용으로 거의 필수 — 셰이더 데모(Phase 2)에서 uniform 튜닝에 그대로 재활용.

import type { Mesh } from "three";
// ─ three.js의 Mesh 클래스 *타입만* import (`import type` = 런타임 코드 0).
//   useRef<Mesh>(null) 의 제네릭 인자에 쓰여 ref.current.rotation 같은 자동완성을 켬.

import DemoCanvas from "../../components/DemoCanvas";
// ─ 우리가 만든 공통 부품. 내부적으로 <Canvas> + dpr 상한 + OrbitControls + Stats를
//   묶어서 노출. 사이즈를 가진 .lab-canvas <div>로 감싸 캔버스가 부모를 채우게 함.

// ───────────────────────────────────────────────────────────────────────────
//  Cube — 무대 위 실제 물체.
//  three.js 식으로 표현하면: const mesh = new THREE.Mesh(geometry, material).
//  R3F에서는 <mesh> JSX 한 덩이 = mesh 인스턴스 + 그 아래 자식 geometry/material.
// ───────────────────────────────────────────────────────────────────────────
function Cube() {
  // ─── (1) ref: 이 mesh 인스턴스로의 "손잡이" ────────────────────────────────
  //   처음 렌더 시점에는 ref.current === null (아직 안 마운트).
  //   <mesh ref={ref}> 의 ref가 R3F 내부에서 mesh가 만들어지는 순간 .current에
  //   THREE.Mesh 인스턴스를 꽂아 준다. 그 뒤로는 ref.current.rotation 등을
  //   직접 만질 수 있음. (값을 *읽기* 위한 게 아니라 *쓰기* 위한 출구.)
  const ref = useRef<Mesh>(null);

  // ─── (2) leva 컨트롤 ────────────────────────────────────────────────────────
  //   첫 인자 "Cube" = leva 패널에서 이 컨트롤들이 묶일 섹션 이름.
  //   둘째 인자 = 스키마. 값의 *형태*로 leva가 컨트롤 종류를 추론.
  //     · "#ff7a45" 같은 hex 문자열 → 색 선택기
  //     · 숫자 객체 { value, min, max, step } → 슬라이더
  //     · 불리언 → 체크박스
  //   바뀌면 컴포넌트가 새 값으로 재렌더 → 아래 JSX의 color/scale/wireframe 갱신.
  //   (단, useFrame 안에서 쓰는 speed는 매 프레임 closure로 자연스럽게 최신값 읽음)
  const { color, speed, scale, wireframe } = useControls("Cube", {
    color: "#ff7a45",
    speed: { value: 1, min: 0, max: 5, step: 0.1, label: "회전 속도" },
    scale: { value: 1, min: 0.2, max: 2, step: 0.1, label: "크기" },
    wireframe: { value: false, label: "와이어프레임" },
  });

  // ─── (3) 매 프레임 콜백 ─────────────────────────────────────────────────────
  //   첫 인자 state: { gl, scene, camera, clock, pointer, ... } — 안 쓸 때 _ 로 받음.
  //   둘째 인자 delta: 직전 프레임과의 시간 차(초). 60fps면 ≒ 0.0167, 120fps면 ≒ 0.0083.
  //   "delta * 단위/초" 를 더해야 화면 주사율과 무관하게 같은 속도가 됨.
  //   if(!ref.current) return : 첫 프레임엔 mesh가 아직 안 붙었을 수도 있어 안전장치.
  useFrame((_state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.4 * speed; // x축 회전 (앞뒤로 끄덕)
    ref.current.rotation.y += delta * 0.6 * speed; // y축 회전 (좌우로 도리)
    // ↑ rotation 은 Euler. 단위 라디안. 한 바퀴 = 2π ≒ 6.28. 5에 가까운 speed면 거의 한 바퀴/초.
  });

  // ─── (4) JSX → three 객체 트리 ──────────────────────────────────────────────
  //   <mesh>            ─ new THREE.Mesh()  (geometry/material은 자식으로 끼움)
  //   ref={ref}          ─ 위 (1) 의 ref 와 연결
  //   scale={scale}      ─ mesh.scale.setScalar(scale)  ← 숫자 1개면 x/y/z 동일
  //   castShadow         ─ mesh.castShadow = true  → 이 mesh가 *그림자를 만든다*
  //                        (light의 castShadow + 떨어질 mesh의 receiveShadow 가 있어야 보임)
  return (
    <mesh ref={ref} scale={scale} castShadow>
      {/* Geometry: 형태(꼭짓점·삼각형 정보). args = THREE.BoxGeometry(1,1,1) 생성자 인자.
          1×1×1 정육면체. 내부적으로 꼭짓점 24개(면마다 다른 노멀 위해 중복) / 삼각형 12개. */}
      <boxGeometry args={[1, 1, 1]} />

      {/* Material: 표면 재질. MeshStandardMaterial = 물리 기반(PBR).
          · color       : 표면 기본 색 (선형 공간 기준)
          · metalness   : 0=비금속(플라스틱/나무/피부) ~ 1=금속. 금속일수록 색이 반사에 더 영향.
          · roughness   : 0=거울처럼 매끈 ~ 1=완전 무광. 하이라이트 크기/번짐 결정.
          · wireframe   : 삼각형의 가장자리만 그리기 (디버그/스타일용)
          ⚠ MeshStandard는 *라이트가 필요*. 빛이 없으면 색이 깜깜하게 보임(현실과 같음).
          (가벼운 단색이 필요하면 MeshBasicMaterial — 라이트 무시.) */}
      <meshStandardMaterial
        color={color}
        wireframe={wireframe}
        metalness={0.15}
        roughness={0.4}
      />
    </mesh>
  );
}

// ───────────────────────────────────────────────────────────────────────────
//  Floor — 그림자가 *떨어지는* 면.
//  <planeGeometry> 의 기본 방향은 +Z (벽처럼 카메라를 정면으로 보고 서 있음).
//  바닥(노멀이 위, 즉 +Y)으로 만들려면 X축 기준으로 -90° 회전 = -Math.PI / 2.
//  (three.js의 각도는 전부 라디안. 180° = π ≒ 3.14159)
// ───────────────────────────────────────────────────────────────────────────
function Floor() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}  // [x, y, z] Euler. X로 -90°.
      position={[0, -1, 0]}             // 큐브(중심 y=0) 아래로 1만큼 내려
      receiveShadow                     // *받는* 쪽. 그림자 픽셀이 여기 칠해짐.
    >
      <planeGeometry args={[12, 12]} /> {/* 가로 12, 세로 12 */}
      <meshStandardMaterial
        color="#2a2a32"
        roughness={1}     // 완전 무광 → 큐브 그림자가 또렷이 보임
        metalness={0}     // 비금속
      />
    </mesh>
  );
}

// ───────────────────────────────────────────────────────────────────────────
//  Demo — 모든 걸 무대(Canvas)에 올림.
//  DemoCanvas 가 <Canvas camera={...}>(Scene+Camera+Renderer+rAF 루프) + OrbitControls
//  + Stats(FPS) 를 자동으로 켜 둠. 우리는 *무대에 올릴 것*만 자식으로 적으면 됨.
// ───────────────────────────────────────────────────────────────────────────
export default function RotatingCubeDemo() {
  return (
    // cameraPosition: 카메라 시작 좌표.
    //   3D 기본 우손좌표계: +X 오른쪽, +Y 위, +Z 화면 바깥(=관찰자 쪽).
    //   (3.5, 2.5, 4.5) = 오른위앞 살짝. 약간 내려다보는 각도.
    //   카메라가 어디 바라보는지는 OrbitControls 가 자동으로 origin(0,0,0)으로 맞춰줌.
    // fov: 카메라 화각(시야각, 도 단위). 50은 표준 렌즈 같은 자연스러운 시야.
    //   더 크면(예: 90) 광각, 더 작으면(예: 20) 망원처럼 평평해짐.
    <DemoCanvas cameraPosition={[3.5, 2.5, 4.5]} fov={50}>
      {/* ─ ambientLight ─ "환경광" : 모든 면을 같은 양만큼 비춤 (방향 없음).
            그림자 진 면이 *완전 검정*이 되지 않게 해주는 채움광. 너무 세면 입체감 사라짐.
            three.js: new THREE.AmbientLight(0xffffff, 0.35); scene.add(...) */}
      <ambientLight intensity={0.35} />

      {/* ─ directionalLight ─ 태양처럼 한 방향에서 평행하게 오는 빛 (위치는 *방향* 결정).
            position=[5,6,4] 에서 origin(0,0,0)을 향하는 방향 = (-5,-6,-4) 정규화한 게 광원 방향.
            castShadow: 이 라이트가 *그림자를 만든다*. mesh의 castShadow / receiveShadow와 함께.
            shadow-mapSize: R3F 의 'foo-bar' prop 패턴.
              → 내부적으로 light.shadow.mapSize.set(1024, 1024) 가 실행됨.
              값이 클수록 그림자 가장자리가 매끈해지지만 VRAM/연산 비용↑.
              일반적으로 1024~2048 사이. 모바일 고려하면 512도. */}
      <directionalLight
        position={[5, 6, 4]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* 무대 위 물체들 — 컴포넌트 단위로 분리해서 가독성. */}
      <Cube />
      <Floor />

      {/* ─ gridHelper ─ 바닥 격자(눈금자). 공간감/스케일 확인용 디버그 헬퍼.
            args: [전체 크기, 분할 수, 중심선 색, 격자선 색].
            "헬퍼" 는 실제 씬 로직(레이캐스팅·물리)에 거의 영향 없고, 그저 *그려*주기만 함.
            three.js 내장: new THREE.GridHelper(12, 12, ...). 라이트 무시.
            position y=-0.99: 바닥(planeGeometry, y=-1)보다 살짝 위에 띄워야 z-fighting(깜빡임) 안 남. */}
      <gridHelper args={[12, 12, "#444", "#333"]} position={[0, -0.99, 0]} />
    </DemoCanvas>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   읽고 나서 한 번 더 점검할 것 (학습 체크리스트)
   ───────────────────────────────────────────────────────────────────────────
   □ <mesh> = Geometry(형태) + Material(재질). 둘은 분리 가능 → 공유로 성능 절감(Phase 3).
   □ useRef + useFrame = "리액트 재렌더 없이" 매 프레임 transform 만지는 정석 패턴.
   □ delta(초) 를 항상 곱해서 프레임률 독립적인 속도로.
   □ MeshStandardMaterial은 *라이트 필요*. 검정으로 보이면 라이트부터 의심.
   □ 그림자 = 라이트.castShadow + 막는 mesh.castShadow + 받는 mesh.receiveShadow 모두 필요.
     (셋 중 하나라도 빠지면 그림자 안 보임 또는 부분만 보임)
   □ shadow-mapSize 같은 'foo-bar' prop = R3F의 nested-set 패턴. 점(.)으로 들어가는 속성.
   □ rotation/position 의 단위는 라디안 / 월드 좌표. 우손좌표계(+Y 위).
   ═════════════════════════════════════════════════════════════════════════════ */
