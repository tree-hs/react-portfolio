// ─────────────────────────────────────────────────────────────────────────────
//  WebGL Lab — 데모 레지스트리
//  · 이 파일은 "가벼운" 메타데이터만 담는다 (three / R3F import 없음).
//    → /lab 페이지를 열기 전에는 무거운 3D 코드가 번들에 들어오지 않게 하기 위함.
//  · 각 데모의 실제 컴포넌트는 React.lazy(() => import(...)) 로 "그 데모 페이지를
//    실제로 열 때만" 별도 chunk로 로딩된다. (코드 스플리팅 = 메인 페이지 첫 로딩 보호)
// ─────────────────────────────────────────────────────────────────────────────
import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";

/** 채용공고 우대사항 식별자 */
export type Requirement = "A" | "B" | "C";

export const REQUIREMENT_LABEL: Record<Requirement, string> = {
  A: "WebGL · GLSL · Shader(Material) 작성 / 커스터마이징",
  B: "3D 성능 이슈(FPS 저하 · 메모리 누수) 분석 / 개선",
  C: "Renderer 내부 동작 방식 이해",
};

export type DemoStatus = "done" | "wip" | "planned";

export interface Concept {
  term: string;
  desc: string;
}

export interface DemoMeta {
  /** URL slug — /lab/:id */
  id: string;
  /** 정렬·표시용 번호 ("01") */
  no: string;
  title: string;
  /** 카드에 보일 한 줄 요약 */
  summary: string;
  /** 사용 기술 태그 */
  tags: string[];
  /** 어떤 채용공고 항목을 증명하는가 */
  requirements: Requirement[];
  /** 커리큘럼 단계 (WEBGL_LAB_PLAN.md의 Phase) */
  phase: number;
  status: DemoStatus;
  /** GitHub 소스 링크용 (레포 루트 기준 상대 경로) */
  sourcePath: string;
  /** 데모 본체 (lazy) */
  Component: LazyExoticComponent<ComponentType>;
  /** 데모 페이지 설명: 이 데모가 하는 일 */
  whatItDoes: string;
  /** 데모 페이지 설명: 핵심 개념들 */
  concepts: Concept[];
  /** 데모 페이지 설명: 배운 점 / 막혔던 점 메모 */
  learned: string[];
}

// TODO: 본인 GitHub 레포 경로에 맞게 수정 (배포 후 README 링크와 일치시킬 것)
const GITHUB_BASE = "https://github.com/tree-hs/react-portfolio/blob/main/";
export const githubUrl = (sourcePath: string) => GITHUB_BASE + sourcePath;

export const demos: DemoMeta[] = [
  {
    id: "raw-webgl-triangle",
    no: "02",
    title: "Raw WebGL — 삼각형 1개를 손으로",
    summary:
      "라이브러리 없이 <canvas> + WebGL API만으로 회전하는 무지개 삼각형. 셰이더 컴파일/링크/VBO/attribute/uniform/drawArrays 전 과정을 직접 — Three.js가 자동화해주는 일들을 한 번 풀어본다.",
    tags: ["WebGL", "GLSL", "draw call", "no library"],
    requirements: ["C"],
    phase: 1,
    status: "done",
    sourcePath: "src/lab/demos/02-raw-webgl-triangle/RawTriangle.tsx",
    Component: lazy(() => import("./demos/02-raw-webgl-triangle/RawTriangle")),
    whatItDoes:
      "WebGLRenderingContext 를 직접 받아 vertex/fragment 셰이더(GLSL 문자열)를 컴파일하고, GPU 메모리에 꼭짓점 데이터를 업로드한 뒤, 매 프레임 drawArrays 한 번으로 삼각형을 그립니다. 오버레이에 FPS / 초당 draw call 수 / 꼭짓점 수가 떠서 'draw call 1번이 화면 한 장에 어떻게 대응되는지'를 눈으로 확인할 수 있어요.",
    concepts: [
      {
        term: "WebGLRenderingContext (gl)",
        desc: "canvas.getContext('webgl')로 얻는 저수준 API. 'createShader / bindBuffer / drawArrays …' 같은 명령들로 GPU를 직접 지시. Three.js는 이걸 감싸 'Scene/Camera/Mesh' 추상화를 제공.",
      },
      {
        term: "GLSL 셰이더 (vertex / fragment)",
        desc: "GPU에서 돌아가는 작은 프로그램. vertex shader는 꼭짓점마다 1번 실행돼 gl_Position을 정하고, fragment shader는 픽셀마다 1번 실행돼 gl_FragColor를 정함. varying으로 vertex→fragment 보간.",
      },
      {
        term: "VBO (Vertex Buffer Object)",
        desc: "꼭짓점 데이터를 GPU 메모리에 올린 덩어리. createBuffer → bindBuffer → bufferData. 한 번 올려두면 매 프레임 재업로드 불필요.",
      },
      {
        term: "attribute (per-vertex) vs uniform (per-draw)",
        desc: "attribute는 꼭짓점마다 다른 값(위치·색…), uniform은 한 draw call 동안 모든 꼭짓점이 공유하는 값(시간·행렬·색 보정 등). vertexAttribPointer로 attribute와 VBO를 연결.",
      },
      {
        term: "Draw call (drawArrays / drawElements)",
        desc: "GPU에게 '지금까지 셋팅한 걸로 그려!' 명령 1회. 이 데모는 매 프레임 drawArrays 1번 = 1 draw call. Three.js에서는 보통 mesh 1개 = draw call 1번. Phase 3에서 이 비용을 깊게 다룸.",
      },
      {
        term: "Clip space (-1..1)",
        desc: "vertex shader 최종 출력(gl_Position)의 좌표계. 캔버스 한가운데가 (0,0,0,1), 사방 ±1. 카메라/원근/모델 행렬을 *곱한 결과*가 여기로 와야 화면에 보임.",
      },
      {
        term: "WebGL의 current-state 모델",
        desc: "bindBuffer / useProgram 같은 호출은 '지금 활성화된 무엇'을 바꾸고, 이후 호출은 그 기준으로 동작. 잊으면 silent bug. 그래서 매 프레임 같은 순서로 다시 묶어주는 게 안전.",
      },
    ],
    learned: [
      "셰이더 컴파일 실패는 getShaderInfoLog로 직접 꺼내야 보인다 — 안 하면 그냥 검정 화면. → 항상 에러 로그를 throw하는 헬퍼로 감쌌다.",
      "WebGL 1 fragment shader는 'precision mediump float;'를 빼먹으면 컴파일 자체가 안 됨.",
      "캔버스 CSS 크기와 picture 픽셀 크기(canvas.width/height)는 별개. devicePixelRatio 곱하고 gl.viewport도 같이 갱신해야 레티나에서 선명.",
      "Three.js의 renderer.render() 한 줄 = 여기 코드의 (a)~(g) 단계를 매 mesh마다 자동으로 + frustum culling + depth test + 정렬 + 행렬 자동 계산까지. 자세히는 docs/RENDERER_NOTES.md.",
      "dispose 빼먹으면 GPU 자원 누적 — gl.deleteBuffer/deleteProgram/deleteShader 를 언마운트 cleanup에 명시했음. Three.js에서도 같은 책임(.dispose()) — Phase 3 핵심 주제 중 하나.",
    ],
  },
  {
    id: "r3f-hello",
    no: "01",
    title: "Hello R3F — 회전하는 큐브",
    summary:
      "react-three-fiber의 기본 골격: <Canvas>(Scene+Camera+Renderer+루프), <mesh>(Geometry+Material), Light, useFrame 애니메이션.",
    tags: ["three.js", "react-three-fiber", "drei", "leva"],
    requirements: [],
    phase: 0,
    status: "done",
    sourcePath: "src/lab/demos/01-r3f-hello/RotatingCube.tsx",
    Component: lazy(() => import("./demos/01-r3f-hello/RotatingCube")),
    whatItDoes:
      "정육면체 하나를 무대에 올려 매 프레임 회전시킵니다. leva 패널로 색·회전 속도·크기·와이어프레임을 실시간으로 바꿔보면서 'Geometry(형태) + Material(재질) + Light(조명) + Camera(시점)'이 각각 무엇을 담당하는지 감을 잡는 게 목적입니다.",
    concepts: [
      {
        term: "<Canvas>",
        desc: "Scene·Camera·WebGLRenderer 생성과 requestAnimationFrame 렌더 루프를 자동으로 만들어 주는 R3F의 진입점. 안에 넣은 JSX가 곧 Scene에 add 되는 것들.",
      },
      {
        term: "<mesh> = Geometry + Material",
        desc: "<boxGeometry> 는 '형태'(꼭짓점·삼각형), <meshStandardMaterial> 은 '표면 재질'(색·금속감·거칠기). Mesh 는 이 둘을 합쳐 무대에 놓인 실제 물체.",
      },
      {
        term: "Light",
        desc: "MeshStandardMaterial은 물리 기반이라 빛이 없으면 새까맣게 보임. ambientLight(전체를 은은하게) + directionalLight(태양처럼 평행광)로 면이 보이게 함.",
      },
      {
        term: "useFrame((state, delta) => …)",
        desc: "매 프레임 호출되는 훅. delta(직전 프레임과의 시간차, 초)를 곱해 회전시키면 프레임률과 무관하게 일정한 속도가 됨.",
      },
      {
        term: "OrbitControls (drei)",
        desc: "마우스로 카메라를 궤도 회전/줌/패닝. makeDefault 로 등록하면 다른 컨트롤과 충돌 없이 동작.",
      },
    ],
    learned: [
      "Geometry와 Material은 분리돼 있어 서로 공유 가능 — 나중에 성능 최적화(InstancedMesh, geometry 재사용)의 출발점.",
      "delta 안 곱하고 rotation += 0.01 하면 빠른 모니터(120Hz)에서 두 배로 빨라짐 → 항상 delta 기준으로.",
      "leva의 useControls 는 컴포넌트에서 호출하면 자동으로 전역 패널에 슬라이더가 뜸. uniform 값 튜닝에 그대로 재활용 예정(Phase 2).",
    ],
  },
];

export const getDemo = (id: string): DemoMeta | undefined =>
  demos.find((d) => d.id === id);
