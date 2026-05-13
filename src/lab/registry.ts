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
