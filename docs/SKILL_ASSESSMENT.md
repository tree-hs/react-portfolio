# react-portfolio 기술 역량 평가서

> 목적: 프로젝트 **디자인·방향성**을 정하기 전에, 이 코드가 증명하는 **실제 역량 수준**을 기술별로 진단한다.
> 관점: "어떻게 쓰였나"(→ [PROJECT_GUIDE.md](./PROJECT_GUIDE.md))가 아니라 **"어느 수준인가 / 무엇이 다음 단계인가"**.
> 작성 기준: 2026-06-27 코드. 모든 판단은 `파일:줄` 근거를 단다.
> 레벨 척도: **입문 → 초급 → 중급 → 중상 → 고급**.

---

## 0. 한눈에 — 역량 레이더

| 영역 | 현재 레벨 | 근거 한 줄 | 가장 큰 공백 |
|---|---|---|---|
| **React** | 중급 | hooks·cleanup·code-splitting·합성 패턴이 일관됨 | Context/useReducer/custom hook/테스트 부재 |
| **TypeScript** | 중급 | 제네릭+제약, 타입가드(`value is T`), `keyof` 활용 | discriminated union·`as` 남용·런타임 검증 없음 |
| **SCSS / 스타일링** | **중상** | `@each/@for/@while/@function`로 유틸리티·테마 자동 생성 | 디자인 토큰의 *의미(semantic)* 계층이 얕음 |
| **빌드·도구체인** | 중급 | Vite alias·base·gh-pages·lazy chunk 분리 | ESLint가 `.ts/.tsx` 미검사, CI/테스트 없음 |
| **아키텍처·데이터** | 초급~중급 | URL을 상태의 단일 진실원으로, 클라이언트 캐시 | 중복 fetch·데드코드·타입↔데이터 불일치 |
| **WebGL / Three.js** | 입문 (학습 진행 중) | raw WebGL 삼각형을 손으로 + R3F hello | Phase 1 초반. 셰이더/성능은 아직 미착수 |
| **테스트·품질보증** | 없음 | 테스트 파일 0, CI 0 | 진입 자체가 다음 과제 |

**한 줄 요약**: *"혼자서 React+TS SPA를 설계·구현·배포할 수 있는 탄탄한 중급 프론트엔드"*. 특히 **SCSS 메타프로그래밍 역량이 평균 이상**이고, **WebGL을 체계적으로 학습 중**(차별화 포인트)이라는 게 이 포트폴리오의 두 축이다. 보강 1순위는 **테스트·아키텍처 정리**.

---

## 1. React — 중급

### 증명되는 것 (강점)
- **hooks 전반을 목적에 맞게 사용**: `useState/useEffect/useMemo/useRef`를 각각 제 자리에 씀. ([App.tsx:109-132](../src/App.tsx#L109-L132))
- **비동기 cleanup 패턴이 일관됨** — `let cancelled = false … return () => { cancelled = true }`로 race condition·언마운트 후 setState를 막는다. ([ProjectList.tsx:17-42](../src/components/ProjectList/ProjectList.tsx#L17-L42)) 중급 이상에서 기대하는 패턴.
- **이벤트 리스너 cleanup**: `addEventListener` ↔ `removeEventListener` 짝을 항상 맞춤. ([Career.tsx](../src/components/Career/Career.tsx))
- **코드 스플리팅**: `React.lazy + Suspense`로 three/R3F 같은 무거운 의존성을 메인 번들에서 분리. ([App.tsx:21-26](../src/App.tsx#L21-L26)) — 번들 비용을 의식한다는 신호.
- **단방향 데이터 흐름·합성**: 작은 단일책임 컴포넌트를 `App`이 조립, `Filters`는 완전 controlled(상태는 부모가 소유).
- **controlled 컴포넌트**: select/checkbox를 `value/checked`로 묶음. ([Filters.tsx](../src/components/Filters/Filters.tsx), [HeaderTheme.jsx](../src/components/layout/Header/HeaderTheme.jsx))

### 아직 안 보이는 것 (성장 여지)
- **추상화 도구 미사용**: `useCallback`·`useReducer`·`Context`·**커스텀 훅**이 코드 어디에도 없다. 예컨대 `ProjectList`/`ProjectDetail`이 거의 똑같은 fetch+cleanup 로직을 복붙하는데 → `useFetch` 커스텀 훅 하나로 추출하면 "추상화 역량"을 보여줄 수 있다.
- **명령형 DOM 조작**: `Career`에서 스크롤에 따라 `tabs.style.position`을 직접 만진다([PROJECT_GUIDE 3.5 참고]). React스럽지 않고 `position: sticky` CSS나 `IntersectionObserver`로 대체 가능.
- **에러 처리 비대칭**: `ProjectList`는 화면에 에러를 노출하지만 `Career`는 `console.error`만 하고 조용히 빈 화면. **Error Boundary** 부재.
- **데이터 fetch가 컴포넌트에 직접 박힘**: React Query/SWR 같은 서버상태 도구 없이 `useEffect` raw fetch. 학습용으론 OK지만 실무 신호로는 한 단계 위가 있다.
- **테스트 0건**: React Testing Library 컴포넌트 테스트가 하나라도 있으면 레벨 인식이 크게 올라간다.
- `.jsx`와 `.tsx`가 혼재(`Header.jsx`, `HeaderTheme.jsx`, `Footer.jsx`). 점진적 TS 전환의 흔적 — 통일하면 좋다.

> **결론**: "동작하는 SPA를 혼자 만든다"는 중급은 확실. "재사용 가능한 추상화를 설계한다"는 중상으로 가는 문턱에 있다.

---

## 2. TypeScript — 중급

### 증명되는 것 (강점)
- **리터럴 유니온으로 도메인 모델링**: `Skill`, `Difficulty`, `DurationCategory`로 오타를 컴파일 타임에 차단. ([types/project.ts:2-18](../src/types/project.ts#L2-L18))
- **제네릭 + 제약 + 타입가드**를 실제 코드에서 씀:
  - `isValidOption<T extends string>(...): value is T` — 사용자 정의 타입가드. ([App.tsx:35-38](../src/App.tsx#L35-L38))
  - `handleSelect<K extends keyof FilterState>` — `keyof` 제네릭으로 key↔value 타입 연결. ([Filters.tsx](../src/components/Filters/Filters.tsx))
- **유틸리티 타입 응용**: `NonNullable<ProjectQueryParams["difficulty"]>[]`로 옵션 배열 타입을 파생. ([api/projects.ts:124-131](../src/api/projects.ts#L124-L131))
- **`strict: true`** 켜고 작업 — 타입 안전성의 토대.
- **학습 깊이가 문서화돼 있음**: `/study` 레슨이 `any vs unknown`, `interface vs type`(선언 병합/유니온), 제네릭 추론, `as const`→리터럴 유니온, `noUncheckedIndexedAccess`까지 정확히 짚는다. ([study/lessons/typescript/04_Generics.tsx](../src/study/lessons/typescript/04_Generics.tsx)) — **개념 이해도는 중급 상단**.

### 아직 안 보이는 것 (성장 여지)
- **`as` 단언에 의존하는 지점**: `Filters`의 `value as FilterState["difficulty"]` 등은 런타임 보장이 없는 강제 캐스팅. 정작 `parseFilters`처럼 가드로 좁히는 좋은 패턴을 알면서도 이벤트 핸들러에선 캐스팅으로 우회.
- **discriminated union 부재**: 로딩/에러/성공을 `loading`·`error`·`data` 3개 boolean state로 표현(불가능 상태가 표현 가능). `type State = {status:'loading'} | {status:'error',msg} | {status:'ok',data}` 패턴이면 한 단계 위.
- **런타임 검증 없음**: `projects.json`을 `Project[]`로 **단언**만 하고 실제 형태 검증은 안 함. `zod` 등으로 fetch 경계를 막으면 "타입을 런타임까지 책임진다"는 신호.
- **타입↔실데이터 불일치(실버그)**: `Career`가 `c.position/c.team/c.highlights/c.techStack`을 쓰는데 `types/companys.ts`의 `CompanyCareer`엔 이 필드가 없다(`PROJECT_GUIDE` 4·8장). 타입을 신뢰 못 하게 만드는 부분 — **정리 1순위**.
- **데드 타입**: `ProjectResponse`가 정의돼 있으나 미사용.

> **결론**: 문법·개념 이해는 중급 상단인데, **실제 코드의 엄격함이 그 이해를 못 따라간다**(캐스팅·미검증·타입 불일치). 이 갭을 메우면 바로 중상.

---

## 3. SCSS / 스타일링 — 중상 (이 프로젝트 최강 영역)

### 증명되는 것 (강점)
- **Sass 메타프로그래밍을 실전 활용**: `@function _as-list`, `@mixin scale`, `@while`/`@for`/`@each`로 **유틸리티 클래스를 프로그램으로 생성**(margin/padding/gap/font-size/grid 스케일). ([styles/template.scss:110-261](../src/styles/template.scss#L110-L261)) — 단순 nesting 수준을 한참 넘는다.
- **CSS 변수 기반 테마링**: 팔레트 Map을 `@each`로 순회해 CSS 커스텀 프로퍼티를 emit, `[data-theme]`만 갈아끼워 다크모드. ([template.scss:9-58](../src/styles/template.scss#L9-L58)) — *값은 런타임(CSS var), 로직은 컴파일타임(Sass)* 역할 분리를 이해함.
- **`@use` 모듈 시스템**(`sass:map/list/meta`)으로 deprecated `@import` 안 씀.
- **테마 우선순위 설계**: localStorage → OS설정(`prefers-color-scheme`) → light. ([HeaderTheme.jsx](../src/components/layout/Header/HeaderTheme.jsx)) + FOUC 방지로 `main.tsx`에서 기본 테마 선주입.

### 아직 안 보이는 것 (성장 여지)
- **디자인 토큰의 *의미 계층*이 얕다**: `--blue600` 같은 원시 토큰은 풍부하나, `--text-primary`/`--surface`/`--border-strong` 같은 **semantic 토큰**층이 얇다. 자기 `/study` 레슨조차 "`--text-primary`가 `--gray-900`보다 낫다"고 가르치는데([study sass 05]) 정작 본 사이트엔 덜 적용. → **방향성 정리의 핵심 후보**.
- **매직넘버 분산**: 헤더 높이가 `Header.jsx`=80, `Career.tsx`=90, `App.scss`=90으로 제각각. 토큰화(`--header-h`) 필요.
- **`App.scss` 1078줄 단일 파일** — 컴포넌트별 `.module.scss` 분리나 폴더 구조화 여지.
- 유틸리티 클래스 네이밍(`amg`,`mgt`,`pdx`,`flx-vct`…)이 자작 컨벤션이라 가독성·표준성은 트레이드오프. Tailwind 비교 시 설명 포인트가 될 수 있음.

> **결론**: **기술적으로 가장 앞선 영역**. 다만 "유틸리티 생성기"는 강한데 "디자인 시스템(semantic 토큰 + 컴포넌트 일관성)"은 아직. 디자인 방향을 잡는다면 *여기에 레버리지*가 있다.

---

## 4. 빌드·도구체인 — 중급

### 증명되는 것
- Vite `base`(GitHub Pages 서브경로)·`@` alias·React 플러그인 구성. project reference(`tsconfig.node.json`) 분리.
- `gh-pages`로 `dist` 자동 배포(`predeploy`/`deploy`).
- ESLint **flat config(v9)** + react-hooks + react-refresh 플러그인.
- 라우트별 lazy chunk로 **번들 분할**까지 의식.

### 공백
- ⚠️ **ESLint가 `.ts/.tsx`를 검사 안 함** — `files: ['**/*.{js,jsx}']`로 한정돼 정작 대부분인 TS 코드는 린트 사각지대. `typescript-eslint` 도입이 즉효.
- **CI 없음**(GitHub Actions). build/lint/test 자동화가 없어 "배포 전 검증"이 수동.
- 테스트 러너(Vitest 등) 미설정.

---

## 5. 아키텍처·데이터 계층 — 초급~중급

### 증명되는 것
- **URL = 상태의 단일 진실원**: 필터를 `useSearchParams`로, 상세 id를 path param으로 → 새로고침·공유·뒤로가기·딥링크가 자연히 동작. ([App.tsx](../src/App.tsx)) **설계 의도가 분명한 좋은 선택**.
- **클라이언트 캐시**: `Map<쿼리스트링, 결과>`로 중복 네트워크 절감, 상세는 목록 캐시 재활용. ([api/projects.ts:9,86-97](../src/api/projects.ts#L9-L97))
- data layer(`api/`)와 view를 분리하려는 시도.

### 공백
- **중복 fetch**: `App.ProjectPage`가 `projects.json`을 직접 fetch([App.tsx:112-130](../src/App.tsx#L112-L130))하는데, 자식 `ProjectList`도 `fetchProjects`로 **또** 가져온다. 한쪽으로 통일 필요(상태 끌어올리기 or 캐시 일원화).
- **데드코드**: `zustand` 의존성과 `components/layout/Main/Skills/*` 4개 파일이 화면 어디서도 import 안 됨(레거시). 제거하면 번들·인지부하 감소.
- **정렬/필터 로직 미완**: `api/projects.ts`의 `duration` 필터는 `!duration || 'all'`만 보고 실제 기간 분류를 안 함, `sortProjects`도 `sort` 인자를 받지만 항상 최신순 고정.
- 백엔드 없음(정적 JSON) — 포트폴리오로는 적정하나, "API 연동/인증/페이지네이션" 경험은 이 레포만으론 미증명.

---

## 6. WebGL / Three.js — 입문 (체계적 학습 진행 중) ★차별화 축

### 현황
- **계획이 탄탄**: 채용공고 우대사항 A(셰이더)·B(성능)·C(렌더러 이해)를 **데모 산출물과 1:1 매핑**한 12주 커리큘럼. ([docs/WEBGL_LAB_PLAN.md](./WEBGL_LAB_PLAN.md)) — *학습 설계 능력 자체가 강점.*
- **Phase 0 완료**: R3F `<Canvas>`/`<mesh>`/Light/`useFrame`/OrbitControls hello world. ([lab/demos/01-r3f-hello](../src/lab/demos/01-r3f-hello/RotatingCube.tsx))
- **Phase 1 착수**: **라이브러리 없이** raw WebGL로 회전 삼각형을 손으로 — 셰이더 컴파일/링크/VBO/attribute·uniform/`drawArrays`/dispose까지 전 과정 + FPS·draw call 오버레이. ([lab/demos/02-raw-webgl-triangle/RawTriangle.tsx](../src/lab/demos/02-raw-webgl-triangle/RawTriangle.tsx))
  - 디테일이 좋다: `getShaderInfoLog` 에러 throw, `precision mediump float`, devicePixelRatio·`gl.viewport` 동기화, 언마운트 시 `deleteBuffer/Program/Shader`로 GPU 자원 정리, leva 값을 `stateRef`로 우회해 stale closure 회피.

### 평가
- **기술 절대 수준은 입문**(삼각형 1개 단계). 그러나 **접근 방식이 중급 이상** — "Three.js가 자동화하는 일을 한 번 손으로 풀어본다"는 학습 철학, 주석으로 Three.js 대응점을 항상 연결, 메모리 누수까지 의식.
- 아직 미착수: GLSL 셰이더 응용(A), `onBeforeCompile` 머티리얼 커스터마이징, 성능 Before/After 케이스 스터디(B), InstancedMesh·frustum culling 등.

> **결론**: 결과물은 이제 시작이지만 **이 레포에서 가장 "성장 서사"가 분명한 영역**. 포트폴리오 차별화는 여기서 나온다 — 완성보다 *진행과 깊이*를 보여주는 게 맞다.

---

## 7. 교육 콘텐츠(`/study`, `/lab`) — 메타 역량

별도 평가 가치가 있다. `/study`의 React/TS/Sass 레슨은 **면접 빈출 포인트·자주 하는 실수까지** 구조화돼 있고([study/registry.ts](../src/study/registry.ts)), 코드 주석이 "왜 이렇게 쓰는가"를 끈질기게 설명한다. 이는 **개념을 남에게 설명할 수 있는 수준(이해의 정착)**을 시사하며, 그 자체로 포트폴리오의 강한 셀링포인트다. 단, 일부 레슨 폴더는 일부만 채워져 있어(예: TS 03 외 진행 편차) **완성도 편차 정리**가 필요.

---

## 8. 종합 진단 & 방향성 제안

### 강점 (밀어줄 것)
1. **SCSS 메타프로그래밍 + 테마 시스템** — 평균 이상. 디자인 방향의 레버리지.
2. **WebGL 학습 서사** — 차별화 축. "공고 항목 → 데모 → 코드" 연결이 강력.
3. **혼자 설계·구현·배포하는 완결성**과 학습을 콘텐츠로 만드는 메타 역량.

### 보강 (레벨을 끌어올릴 것) — 우선순위순
1. **정합성 정리(즉시·저비용·고효과)**: `CompanyCareer` 타입↔데이터 불일치 수정, 데드코드(zustand/Skills/`ProjectResponse`) 제거, 중복 `projects.json` fetch 일원화, 헤더 높이 매직넘버 토큰화.
2. **품질 기반 마련**: ESLint를 `.ts/.tsx`까지 확장(`typescript-eslint`) + 컴포넌트 테스트 1~2개(RTL) + GitHub Actions로 build/lint/test → "검증된 코드"라는 신호.
3. **추상화 한 단계**: 공통 fetch+cleanup을 `useFetch` 커스텀 훅으로, 로딩/에러/성공을 discriminated union 상태로. React·TS를 동시에 중상으로.
4. **디자인 시스템화**: 원시 토큰 위에 **semantic 토큰**층(`--text-primary/--surface/--header-h`)을 세우고 컴포넌트가 그것만 참조하도록 → 본인이 `/study`에서 가르친 패턴을 본 사이트에 적용(일관성 메시지).
5. **WebGL 계속**: Phase 1 마무리 → Phase 2 셰이더(A) → Phase 3 성능 케이스 스터디(B). 완성된 데모 1개당 포트폴리오 가치가 가장 크다.

### 디자인 방향 한 줄
> 지금 사이트는 "기능은 다 되지만 **시각적 정체성·일관성이 옅은** 개발자 포트폴리오"다. 보유한 **SCSS/테마 역량을 semantic 디자인 토큰 + 타이포·여백 스케일 통일**에 투입하면, 추가 학습 없이도 완성도가 가장 크게 오른다. 그 위에 **WebGL Lab을 시그니처 섹션**으로 전면 배치하는 것이 차별화 전략으로 자연스럽다.

---

### 부록 — 레벨 판단의 핵심 근거 파일
- React 패턴: [ProjectList.tsx](../src/components/ProjectList/ProjectList.tsx), [App.tsx](../src/App.tsx)
- TS 역량: [App.tsx:35-56](../src/App.tsx#L35-L56), [api/projects.ts](../src/api/projects.ts), [study/lessons/typescript/04_Generics.tsx](../src/study/lessons/typescript/04_Generics.tsx)
- SCSS 역량: [styles/template.scss](../src/styles/template.scss)
- WebGL: [lab/demos/02-raw-webgl-triangle/RawTriangle.tsx](../src/lab/demos/02-raw-webgl-triangle/RawTriangle.tsx), [lab/registry.ts](../src/lab/registry.ts)
- 상세 사용법은 → [PROJECT_GUIDE.md](./PROJECT_GUIDE.md), 향후 계획은 → [WEBGL_LAB_PLAN.md](./WEBGL_LAB_PLAN.md)

---

## ✅ 내가 보완/추가로 해야 할 것 (실행 체크리스트)

> 위 진단의 결론을 "바로 손댈 수 있는 작업"으로만 추린 목록. **위에서부터** 하면 효율적이다.
> 표시: ⚡저비용·고효과 / 🧱기반작업 / 🚀역량업 / 🎨디자인 / 🟢차별화

### 1순위 — 정합성 정리 (반나절, 신뢰도 회복) ⚡
- [ ] `Career`의 타입↔데이터 불일치 수정 — `CompanyCareer`에 `position/team/highlights/techStack` 추가하거나 코드를 타입에 맞춤 ([types/companys.ts](../src/types/companys.ts), [Career.tsx](../src/components/Career/Career.tsx))
- [ ] 데드코드 제거 — `zustand` 의존성 + `components/layout/Main/Skills/*` 4파일 + 미사용 타입 `ProjectResponse`
- [ ] 중복 fetch 일원화 — `App.ProjectPage`와 `ProjectList`가 `projects.json`을 각각 받음 → 한쪽으로 통일 ([App.tsx:112-130](../src/App.tsx#L112-L130))
- [ ] 헤더 높이 매직넘버 토큰화 — 80/90/90 흩어진 값을 `--header-h` 하나로 (Header.jsx · Career.tsx · App.scss)
- [ ] `Career` 에러 처리 추가 — 현재 `console.error`만 → 화면에 에러/빈 상태 표시
- [ ] `.jsx` → `.tsx` 통일 (Header / HeaderTheme / Footer)

### 2순위 — 품질 기반 마련 (검증된 코드 신호) 🧱
- [ ] ESLint를 `.ts/.tsx`까지 확장 — `typescript-eslint` 도입 (지금은 TS가 린트 사각지대)
- [ ] 테스트 진입 — Vitest + React Testing Library로 컴포넌트 테스트 1~2개 (`Filters`/`ProjectList` 추천)
- [ ] GitHub Actions CI — push 시 `build` + `lint` + `test` 자동 실행

### 3순위 — 추상화 한 단계 (React·TS 동시에 중상으로) 🚀
- [ ] 공통 fetch+cleanup을 `useFetch` **커스텀 훅**으로 추출 (`ProjectList`/`ProjectDetail` 중복 제거)
- [ ] 로딩/에러/성공을 **discriminated union** 상태로 (`{status:'loading'|'error'|'ok'}`) — boolean 3개 대체
- [ ] fetch 경계에 **런타임 검증**(`zod`) 추가 — `projects.json`을 단언 말고 검증
- [ ] 이벤트 핸들러의 `as` 캐스팅을 타입가드로 교체 ([Filters.tsx](../src/components/Filters/Filters.tsx))
- [ ] `Career`의 명령형 DOM 조작을 `position: sticky` / `IntersectionObserver`로 교체

### 4순위 — 디자인 시스템화 (완성도 최대 상승 지점) 🎨
- [ ] **semantic 토큰층** 도입 — `--text-primary` `--surface` `--border-strong` 등을 원시 토큰(`--blue600`) 위에 세우고 컴포넌트는 이것만 참조
- [ ] 타이포·여백 스케일 통일 (자작 유틸 네이밍 정리 포함)
- [ ] `App.scss`(1078줄) 컴포넌트별 분리 검토
- [ ] 내가 `/study`에서 가르친 디자인 토큰 패턴을 **본 사이트에 실제 적용**(말↔코드 일치)

### 5순위 — WebGL Lab 전진 (차별화 축) 🟢🟢
- [ ] Phase 1 마무리 → Phase 2 셰이더 데모(공고 A) → Phase 3 성능 Before/After 케이스 스터디(공고 B)
- [ ] `/lab`을 포트폴리오 **시그니처 섹션**으로 전면 배치 (헤더 네비 노출 강화)
- [ ] `/study` 레슨 완성도 편차 메우기 (폴더별 진행 차이 정리)

### 콘텐츠/포트폴리오 마감
- [ ] About 하드코딩 정보 점검 (연락처·이메일 노출 범위)
- [ ] "공고 항목 → /lab 데모 → 코드 위치" 1:1 매핑을 메인에서 한눈에 보이게
</content>
</invoke>
