# WebGL Lab — 학습 + 포트폴리오 강화 계획서

> 작성: 2026-05-12
> 목적: 채용공고 우대사항 3가지를 **눈에 보이는 결과물**로 증명하기.
> 방식: 기존 `react-portfolio` 안에 `/lab` 섹션을 만들고, 학습 단계마다 데모 1~2개를 거기에 쌓는다.
> 페이스: 주 10시간 이하 기준 → 약 **8~12주** 커리큘럼. 무리하면 멈춤 → 단계는 작게 쪼개 둠.

---

## 0. 우리가 증명해야 하는 것 (채용공고 우대사항)

| # | 공고 문구 | 이 계획에서 대응하는 산출물 |
|---|---|---|
| A | WebGL, GLSL, **Shader(Material) 작성 또는 커스터마이징** 경험 | Phase 2의 셰이더 데모 5종 (특히 `onBeforeCompile` 로 기존 Material 커스터마이징) |
| B | **3D 성능 이슈(FPS 저하, 메모리 누수 등)를 직접 분석·개선** 경험 | Phase 3의 "Before / After" 성능 데모 + `docs/CASE_STUDY_PERF.md` 케이스 스터디 |
| C | **Renderer 내부 동작 방식**에 대한 이해 | Phase 1의 raw WebGL 미니 데모 + Three.js `WebGLRenderer` 동작 정리 문서 |

> 면접에서 강력한 한 줄: "공고의 이 항목 → 사이트 `/lab` 의 이 데모 → 코드 여기"가 1:1로 연결됨.

---

## 1. 기술 스택 (확정)

- **three** — WebGL 위 추상화. Scene/Camera/Mesh/Material/Renderer.
- **@react-three/fiber (R3F)** — three를 React 컴포넌트로. `<Canvas>`, `useFrame`, `useThree`.
- **@react-three/drei** — R3F 헬퍼 모음 (OrbitControls, useTexture, Stats, shaderMaterial 등).
- **leva** — 데모마다 실시간 파라미터 조절 패널 (uniform 값 슬라이더). 학습·시연용으로 매우 유용.
- **r3f-perf** — R3F 전용 성능 HUD (FPS, draw call, 메모리, GPU 시간). Phase 3 핵심 도구.
- (선택) **postprocessing** / **@react-three/postprocessing** — Phase 2 후반 포스트프로세싱 데모용.

> raw WebGL은 별도 라이브러리 없이 `<canvas>` + `WebGLRenderingContext` 만으로 Phase 1에서 딱 1개 예제.

설치(시점 되면 실행):
```
npm i three @react-three/fiber @react-three/drei leva r3f-perf
npm i -D @types/three
```

---

## 2. 사이트 구조 변경 (어떻게 끼워 넣나)

기존 라우트:
- `/` , `/projects/:projectId` — 지금 그대로 둔다.

추가:
- `/lab` — Lab 랜딩. 데모 카드 그리드 (썸네일 + 제목 + 사용 기술 태그 + 공고 대응 #).
- `/lab/:demoId` — 개별 데모 페이지. 좌: 캔버스, 우/하: 설명 패널(무엇을 배웠나·핵심 코드 요약·소스 링크·leva 컨트롤).
- 헤더 네비에 `Lab` 메뉴 추가.

폴더(예정):
```
src/lab/
  LabPage.tsx            # /lab 랜딩
  LabDemoPage.tsx        # /lab/:demoId 셸 (캔버스 + 설명 레이아웃)
  registry.ts            # 데모 메타데이터 배열 (id, title, tags, requirement, Component, sourceUrl, notes)
  components/
    DemoCanvas.tsx       # <Canvas> 공통 래퍼 (배경, 카메라, Stats/Perf 토글)
    DemoExplain.tsx      # 설명 패널 공통 UI
  demos/
    01-r3f-hello/        # Phase 0
    02-raw-webgl-triangle/   # Phase 1 (C)
    03-scene-graph/      # Phase 1
    10-fragment-noise/   # Phase 2 (A)
    11-vertex-displace/  # Phase 2 (A)
    12-uv-distortion/    # Phase 2 (A)
    13-material-customize/   # Phase 2 (A) ← onBeforeCompile
    14-postprocess-pass/ # Phase 2 (A)
    20-perf-before-after/    # Phase 3 (B) ← 포트폴리오 하이라이트
    30-final-showcase/   # Phase 4
```

> `dist/` 번들 크기: three + R3F는 무겁다(수백 KB). `/lab` 라우트와 데모는 **React.lazy + dynamic import** 로 코드 스플리팅 → 메인 페이지(`/`) 첫 로딩에는 영향 없게. (이것 자체가 "번들 최적화 했다" 어필 포인트)

---

## 3. 단계별 커리큘럼

### Phase 0 — 환경 셋업 & Hello R3F (목표 1주) — ✅ 완료 (2026-05-12)
- [x] 패키지 설치 (`three@0.184`, `@react-three/fiber@9`, `@react-three/drei@10`, `leva`, `r3f-perf@7`, `-D @types/three`). R3F v8은 React 19 미지원이라 **v9 명시 설치 필수**.
- [x] `/lab`, `/lab/:demoId` 라우트 (`App.tsx`, `React.lazy`) + 헤더 `Lab` 메뉴(`Header.jsx`) + `src/lab/registry.ts` 스캐폴드.
- [x] `DemoCanvas`(`<Canvas>` 래퍼: dpr 상한, OrbitControls, Stats, 그림자) / `DemoExplain`(설명 패널) 공통 컴포넌트, `src/lab/lab.scss`.
- [x] **데모 01** `src/lab/demos/01-r3f-hello/RotatingCube.tsx`: 회전 큐브 + 바닥 + 그림자, leva로 색·속도·크기·와이어프레임 조절.
- [x] 코드 스플리팅 확인: `npm run build` 결과 — 메인 번들 `index-*.js` ≈ 248 kB(three 미포함), 데모 chunk `RotatingCube-*.js` ≈ 909 kB(three 포함, `/lab/r3f-hello` 열 때만 로딩), `lab-*.css` 별도. → `/` 첫 로딩에 영향 없음 확인.
- 메모/결정:
  - `r3f-perf` `<Perf>`는 DemoCanvas에 안 넣음(R3F v9 호환 안정성 위해) → Phase 3 성능 데모에 직접 붙일 것. 지금은 drei `<Stats>`(FPS)만.
  - 헤더 hash 메뉴(About/Work/Stack)를 `/lab`에서 누르면 아무 일도 안 일어남(해당 섹션이 그 페이지에 없음) — 사소함, 추후 "홈으로 이동 후 스크롤"로 개선 가능.
  - `Career.tsx`의 기존 TS 에러(미커밋 변경분)는 이 작업과 무관 — 따로 처리 필요.
  - 데모가 늘면 Rollup이 `three`+`@react-three/*`를 공유 chunk로 자동 분리함. 그래도 안 되면 Phase 4에서 `manualChunks`로 vendor 분리.

> 다음(Phase 1) 시작 전 TODO: `registry.ts` 의 `GITHUB_BASE` 를 본인 레포 실제 경로로 확인/수정.

### Phase 1 — Renderer 내부 동작 이해 (목표 2주) → 공고 C
- [x] **데모 02 (raw WebGL)** `src/lab/demos/02-raw-webgl-triangle/RawTriangle.tsx`: 라이브러리 없이 `<canvas>` + WebGL API로 회전하는 무지개 삼각형. 셰이더 컴파일/링크 헬퍼, VBO 2개(position·color), uTime/uSpeed/uAspect/uIntensity uniform, drawArrays, dispose까지 직접. 우상단에 FPS / draw calls per sec 오버레이.
- [x] **노트 문서** `docs/RENDERER_NOTES.md`: 한 프레임 파이프라인 → raw WebGL 13단계와 코드 매핑 → Three.js `WebGLRenderer`가 자동화하는 항목 1:1 비교 → `renderer.info` 해석 → draw call 비용(Phase 3 예고편) → `dispose()` 의 진짜 의미. 마지막에 같은 삼각형을 Three.js로 옮기면 170줄→20줄로 짧아진다는 비교.
- [ ] **데모 03 (Scene graph)**: 부모-자식 그룹 transform 시각화 (자식이 부모를 따라 도는 태양계 류). `scene.add`, matrix 합성, `renderer.info` 패널 항상 표시. — 다음 세션 예정.
- 메모/결정:
  - 빌드 결과: `RawTriangle-*.js` **5.2 kB** (라이브러리 없음) vs `RotatingCube-*.js` **909 kB** (three+R3F+drei). 두 chunk 크기 차이 자체가 "Three.js가 대신해주는 일의 양"의 시각적 증거 → RENDERER_NOTES에 적어둠.
  - `function 선언` 안에서는 외부 스코프의 null narrowing이 풀리는 TS 함정 발견 → resize/tick을 `const` 화살표로. 주석에 이유 적음.
  - leva 값을 매 프레임 최신으로 읽으려고 `stateRef` 패턴(별도 effect로 ref 동기화). useEffect deps를 빈 배열로 두면서 외부 값을 closure에서 읽는 정석.

### Phase 2 — GLSL / Shader(Material) (목표 3~4주) → 공고 A (핵심)
GLSL 기본기부터: 좌표계(clip space, UV), `attribute`/`uniform`/`varying`, `precision`, swizzle, `mix`/`step`/`smoothstep`/`fract`, 노이즈 함수.

- [ ] **데모 10 — Fragment 셰이더 기초**: 시간(`uTime`) 기반 그라데이션 → 노이즈 → 패턴(웨이브, 격자). `ShaderMaterial` + `uniforms`. drei `shaderMaterial` 헬퍼도 써보기.
- [ ] **데모 11 — Vertex displacement**: 평면/구를 vertex shader로 출렁이게(파도, blob). `varying`로 노멀 다시 계산, 라이팅과 합치기.
- [ ] **데모 12 — Texture & UV 조작**: 텍스처 샘플링, UV 왜곡(굴절·물결), dissolve(노이즈 임계값으로 사라지는 효과), 알파.
- [ ] **데모 13 — 기존 Material 커스터마이징** ⭐ (공고 "커스터마이징" 직격):
  - `MeshStandardMaterial.onBeforeCompile` 로 셰이더 코드 일부를 가로채 vertex displacement / 색 보정 / 림 라이트 주입. (Three.js 라이팅·그림자는 그대로 쓰면서 일부만 바꾸는 실무 패턴)
  - `CustomShaderMaterial` 라이브러리 비교도 메모.
- [ ] **데모 14 — 포스트프로세싱 패스**: `EffectComposer` + 커스텀 패스 1개(블룸/색수차/픽셀화 중 택1). "화면 전체를 텍스처로 받아 fragment shader로 후처리"의 개념.
- 산출물: 셰이더 데모 5종. 각 데모 설명 패널에 "이 셰이더가 하는 일 / 핵심 GLSL 코드 / 막혔던 점".

### Phase 3 — 3D 성능 분석·개선 (목표 2주) → 공고 B (핵심)
- [ ] **데모 20 — Before / After 성능 데모** ⭐ (포트폴리오 하이라이트):
  - "Bad" 모드: 일부러 느리게 — 수천 개의 개별 `Mesh`(각자 geometry/material), 매 프레임 `new THREE.BoxGeometry`, 4K 텍스처 raw, 항상 렌더(`frameloop="always"`), `OrbitControls` 없이도 계속 그림.
  - 측정: `r3f-perf` HUD + Chrome DevTools Performance 녹화 + Memory 스냅샷(2장 비교로 누수 확인) + `renderer.info`.
  - "Good" 모드(토글): `InstancedMesh`/geometry merge, geometry·material `useMemo`로 1회 생성, 텍스처 다운스케일+mipmap(+KTX2 메모), `frameloop="demand"`(상호작용 시에만 렌더), `LOD`, `dispose()`로 언마운트 시 정리, `gl.dispose()`.
  - 화면에 FPS / draw calls / triangles / geometries / textures / JS heap 을 Before·After 나란히 표시.
- [ ] 케이스 스터디 `docs/CASE_STUDY_PERF.md`: ① 증상(영상/스샷) ② 어떻게 측정했나(도구·지표) ③ 원인 ④ 고친 것 ⑤ 결과 수치(예: 18fps→60fps, draw calls 3,200→4, heap 누수 12MB/min→0). ← 이게 면접 단골 질문 "성능 개선 경험 말해보세요"의 정답지.
- [ ] (보너스) 메모리 누수 전용 미니 데모: 마운트/언마운트 반복 시 `dispose()` 안 하면 텍스처/지오메트리가 쌓이는 걸 `renderer.info.memory` 로 보여주고, 고친 버전 토글.
- 산출물: Before/After 데모 1개 + 케이스 스터디 문서 1개. (이 두 개가 공고 B에 대한 가장 강한 증거)

### Phase 4 — 통합 & 마무리 (목표 1~2주)
- [ ] **데모 30 — 미니 통합 쇼케이스**: 앞에서 만든 조각(커스텀 셰이더 머티리얼 + 인스턴싱 + 포스트프로세싱 + on-demand 렌더)을 한 씬에 합친 작은 인터랙티브 데모.
- [ ] `/lab` 랜딩 정리: 썸네일 이미지(각 데모 캡처), 설명, 기술 태그, 공고 대응 # 뱃지, GitHub 소스 링크.
- [ ] 메인 `About` 섹션 / `README.md` 에 "WebGL Lab" 소개 + 위 매핑표 추가.
- [ ] `docs/PROJECT_GUIDE.md` 에 lab 폴더 구조 항목 추가.
- [ ] 라이트하우스/번들 분석으로 `/` 페이지 로딩이 lab 추가 전과 차이 없는지 확인(코드 스플리팅 검증).
- 산출물: 면접에서 바로 보여줄 수 있는 `/lab` 완성.

---

## 4. 데모마다 지키는 규칙 (일관성 = 포트폴리오 완성도)

각 데모는 항상 이 4개를 같이 만든다:
1. **동작하는 캔버스** — leva로 핵심 파라미터 1~3개 조절 가능.
2. **설명 패널** (`DemoExplain`) — ① 무엇을 하나(2~3줄) ② 핵심 개념/GLSL 스니펫 ③ 막혔던 점·배운 점 ④ 소스 코드 링크.
3. **registry 항목** — id, title, tags, requirement(A/B/C), 썸네일 경로.
4. **`dispose` 정리** — 언마운트 시 geometry/material/texture/renderTarget 해제 (R3F가 자동 처리하는 범위와 직접 해야 하는 범위를 주석으로 구분).

---

## 5. 학습 자료 (참고만; 따라치지 말고 만들면서 찾아볼 것)
- The Book of Shaders (GLSL fragment 기초)
- Three.js Journey (Bruno Simon) — 셰이더/성능 챕터
- Three.js 공식 문서: `WebGLRenderer`, `WebGLRenderer.info`, `BufferGeometry`, `InstancedMesh`, `LOD`
- R3F 공식 문서: `frameloop`, `Performance pitfalls` 페이지 ← Phase 3에 거의 그대로 쓰임
- WebGL Fundamentals (raw WebGL, Phase 1)
- lygia.xyz (GLSL 함수 라이브러리)

---

## 6. 지금 당장 할 일 (Phase 0 시작)
1. `npm i three @react-three/fiber @react-three/drei leva r3f-perf` + `npm i -D @types/three`
2. `src/lab/` 스캐폴드 + `/lab`·`/lab/:demoId` 라우트 + 헤더 `Lab` 메뉴
3. 데모 01(회전 큐브) 구현, `React.lazy` 코드 스플리팅 확인
4. 잘 돌면 이 문서의 Phase 0 체크박스 채우고 Phase 1로

> 진행하면서 이 문서의 체크박스를 업데이트하고, 막힌 점/결정사항은 각 Phase 아래에 메모로 남긴다.
