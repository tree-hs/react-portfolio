# react-portfolio 학습용 프로젝트 가이드

> 목적: 이 프로젝트를 **기술·디자인 양면으로 고도화**하기 전에, 지금 코드에 React / TypeScript / Vite / SCSS 등이 *각각 어떤 용도로, 어떻게* 들어가 있는지 정확히 이해하기 위한 문서입니다.
> 모든 코드 인용은 `파일경로:줄번호` 형식이며, 작성 시점(2026-05-10)의 코드 기준입니다.
>
> ※ 직전 작업에서 이미 고친 부분: `src/App.tsx` 의 `as readonly string[]` 캐스팅, `src/api/projects.ts` 의 `DIFFICULTY_OPTIONS`/`DURATION_OPTIONS` 를 `NonNullable<...>[]` 로, `src/styles/template.scss` 의 `type-of` → `meta.type-of`. 이 문서는 그 수정이 반영된 상태를 설명합니다.

---

## 목차

0. [한눈에 보기](#0-한눈에-보기)
1. [빌드 & 도구 체인 — 무엇이 어떻게 끼워졌나](#1-빌드--도구-체인--무엇이-어떻게-끼워졌나)
2. [라우팅 — react-router-dom v7](#2-라우팅--react-router-dom-v7)
3. [React 코드 상세 — 컴포넌트·Hooks·데이터 흐름](#3-react-코드-상세--컴포넌트hooks데이터-흐름)
4. [TypeScript 상세 — 문법별로](#4-typescript-상세--문법별로)
5. [데이터 계층 (`src/api/`) 상세](#5-데이터-계층-srcapi-상세)
6. [스타일링 (SCSS) 상세](#6-스타일링-scss-상세)
7. [빌드·배포 흐름](#7-빌드배포-흐름)
8. [개선해야 할 점 (목록)](#8-개선해야-할-점-목록)
9. [부록 — 더 공부하면 좋은 키워드](#9-부록--더-공부하면-좋은-키워드)

---

## 0. 한눈에 보기

**한 줄 요약**: `Vite` 로 번들하고 `React 19` + `TypeScript` 로 만든 1인 포트폴리오 SPA. 라우팅은 `react-router-dom v7`, 스타일은 `SCSS`(CSS 커스텀 프로퍼티로 다크모드). `GitHub Pages` 의 서브경로 `/react-portfolio/` 로 배포.

### 사용 기술 표

| 기술 | 버전(`package.json`) | 종류 | 용도 | 어디에 |
|---|---|---|---|---|
| `react` / `react-dom` | ^19.2.0 | dependency | UI 컴포넌트·렌더링 | 전체 |
| `react-router-dom` | ^7.10.1 | dependency | 클라이언트 라우팅 (Routes, Link, useParams, useSearchParams, useNavigate, useLocation) | `main.tsx`, `App.tsx`, `ProjectCard.tsx`, `ProjectDetail.tsx`, `Header.jsx` |
| `zustand` | ^5.0.9 | dependency | 전역 상태 (스킬 선택) — **현재 본 화면에서 미사용** | `components/layout/Main/Skills/useSkillStore.js` (레거시) |
| `vite` | ^7.3.1 | devDependency | 개발 서버(HMR) + 프로덕션 번들 | `vite.config.ts`, `npm run dev/build/preview` |
| `@vitejs/plugin-react` | ^5.1.2 | devDependency | Vite에서 JSX/TSX 변환 + Fast Refresh | `vite.config.ts` |
| `typescript` | ^5.7.3 | devDependency | 정적 타입 검사 | `*.ts`, `*.tsx`, `tsconfig*.json` |
| `sass` | ^1.96.0 | devDependency | SCSS → CSS 컴파일 | `*.scss` |
| `eslint` + `@eslint/js` | ^9.39.1 | devDependency | 코드 린트 (flat config) | `eslint.config.js`, `npm run lint` |
| `eslint-plugin-react-hooks` | ^7.0.1 | devDependency | hooks 규칙(의존성 배열 등) 검사 | `eslint.config.js` |
| `eslint-plugin-react-refresh` | ^0.4.24 | devDependency | HMR 호환성 검사 | `eslint.config.js` |
| `@types/react`, `@types/react-dom`, `@types/node` | ^19.2.x / ^25.1.0 | devDependency | 타입 정의 | 전역 |
| `globals` | ^16.5.0 | devDependency | ESLint용 브라우저 전역 변수 목록 | `eslint.config.js` |
| `gh-pages` | ^6.3.0 | devDependency | `dist/` 를 `gh-pages` 브랜치로 배포 | `npm run deploy` |

### 디렉터리 구조

```
react-portfolio/
├─ index.html                 # 진입 HTML. #root + Google Fonts(Do Hyeon) preconnect
├─ vite.config.ts             # Vite 설정 (react 플러그인, base, @ alias)
├─ tsconfig.json              # src/ 용 TS 설정
├─ tsconfig.node.json         # vite.config.ts 전용 TS 설정 (project reference)
├─ eslint.config.js           # ESLint flat config (v9)
├─ package.json               # 의존성 + 스크립트
├─ public/                    # 그대로 서빙되는 정적 파일
│  ├─ projects.json           # 프로젝트 목록 데이터
│  ├─ companies.json          # 경력 데이터
│  └─ vite.svg
└─ src/
   ├─ main.tsx                # React 마운트 진입점 (BrowserRouter 래핑)
   ├─ App.tsx                 # 라우팅 + 페이지 레이아웃 + 필터 상태
   ├─ App.scss                # 컴포넌트 스타일 (~1067줄), 다크모드 토큰
   ├─ vite-env.d.ts           # Vite 클라이언트 타입 참조
   ├─ api/
   │  ├─ projects.ts          # projects.json fetch + 필터/정렬 + 캐시
   │  └─ companys.ts          # companies.json fetch + 연도 필터 + 캐시
   ├─ types/
   │  ├─ project.ts           # Project, Skill, Difficulty, ProjectQueryParams ...
   │  └─ companys.ts          # CompanyCareer, CompanyQueryParams ...
   ├─ styles/
   │  ├─ reset.scss           # 미니멀 CSS 리셋 + 커스텀 스크롤바
   │  ├─ template.scss        # 전역 유틸리티 클래스 + CSS 변수 테마 (@mixin/@for/@while/@each)
   │  └─ palette.legacy.scss  # 라이트/다크 컬러 Map
   ├─ images/                 # 프로젝트 스크린샷 4장 (top50_stcok_*.png)
   ├─ assets/react.svg        # (미사용)
   └─ components/
      ├─ Career/Career.tsx              # 경력 타임라인 + 연도 필터 + 스크롤 sticky
      ├─ Filters/Filters.tsx            # 스택 칩 + 난이도/기간/정렬 select
      ├─ ProjectList/ProjectList.tsx    # 필터 결과를 ProjectCard 리스트로
      ├─ ProjectCard/ProjectCard.tsx    # 프로젝트 카드 1개
      ├─ ProjectDetail/ProjectDetail.tsx# 프로젝트 상세 모달 + 이미지 라이트박스
      └─ layout/
         ├─ Footer.jsx
         ├─ Header/Header.jsx           # 내비 + 부드러운 스크롤
         ├─ Header/HeaderTheme.jsx      # 다크/라이트 토글 (localStorage)
         ├─ Header/Header.scss
         └─ Main/Skills/                # ⚠️ 전체 레거시·미사용
            ├─ SkillChip.jsx
            ├─ SkillSection.jsx
            ├─ ProjectSection.jsx
            └─ useSkillStore.js         # zustand 스토어 (여기서만 쓰임)
```

> **레거시 표시**: `src/components/layout/Main/Skills/*` 4개 파일과 `zustand` 의존성은 현재 화면 어디에도 import되지 않습니다. (8장 데드코드 항목 참고)

---

## 1. 빌드 & 도구 체인 — 무엇이 어떻게 끼워졌나

### 1.1 `package.json` — 의존성과 스크립트

`src` 코드(이미지·SCSS 포함)는 모두 **dependencies**(런타임에 번들에 포함), 빌드 도구는 **devDependencies**(개발/빌드에만 필요)로 나뉩니다.

스크립트(`package.json:6-13`):

| 명령 | 실제 동작 | 설명 |
|---|---|---|
| `npm run dev` | `vite` | 개발 서버 + HMR (기본 `localhost:5173`) |
| `npm run build` | `vite build` | TSX/SCSS 변환·최적화·minify → `dist/` |
| `npm run lint` | `eslint .` | 코드 린트 |
| `npm run preview` | `vite preview` | 빌드된 `dist/` 를 로컬에서 미리보기(기본 `localhost:4173`) |
| `npm run predeploy` | `npm run build` | `deploy` 직전에 npm이 자동 실행 |
| `npm run deploy` | `gh-pages -d dist` | `dist/` 를 `gh-pages` 브랜치로 push |

### 1.2 `vite.config.ts`

```ts
// vite.config.ts:9-17
export default defineConfig({
  plugins: [react()],            // JSX/TSX 변환 + Fast Refresh
  base: "/react-portfolio/",     // GitHub Pages 서브경로. import.meta.env.BASE_URL = "/react-portfolio/"
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },  // import "@/..." → src/...
  },
});
```

- `base` 가 핵심입니다. 배포된 사이트가 `https://tree-hs.github.io/react-portfolio/` 라는 **하위 경로**에 있기 때문에, 모든 자산 경로 앞에 `/react-portfolio/` 가 붙어야 합니다. 이 값은 코드에서 `import.meta.env.BASE_URL` 로 읽을 수 있고, 실제로 `App.tsx`, `api/projects.ts`, `api/companys.ts` 가 `fetch` URL 만들 때 이걸 붙입니다.
- `@` alias 는 `tsconfig.json` 의 `paths` 와 짝을 이룹니다. (`ProjectDetail.tsx` 가 `import { fetchProjectDetail } from "@/api/projects"` 처럼 씀)

### 1.3 `tsconfig.json` / `tsconfig.node.json`

`tsconfig.json` 주요 옵션(`tsconfig.json:2-22`):

| 옵션 | 값 | 의미 |
|---|---|---|
| `target` | `ES2020` | 출력 JS 문법 수준 |
| `lib` | `["DOM","DOM.Iterable","ES2020"]` | 사용 가능한 빌트인 타입(브라우저 API 등) |
| `module` / `moduleResolution` | `ESNext` / `Bundler` | ES 모듈 + 번들러(Vite) 방식 모듈 해석 |
| `jsx` | `react-jsx` | React 17+ 자동 JSX 변환 → 컴포넌트 파일에서 `import React` 불필요 |
| `strict` | `true` | 엄격 모드 전부 켬 (`strictNullChecks` 등). 이 프로젝트의 타입 안전성의 토대 |
| `paths` | `{"@/*": ["src/*"]}` | `@` import alias (Vite의 alias와 일치시켜야 함) |
| `allowImportingTsExtensions` | `true` | `import ".../foo.ts"` 처럼 확장자까지 써도 됨 (실제로 `companys.ts:1` 가 그렇게 함) |
| `resolveJsonModule` | `true` | `import data from "./x.json"` 허용 |
| `isolatedModules` | `true` | 파일 단위로 독립 트랜스파일 가능하게 강제 (Vite 안전) |
| `noEmit` | `true` | tsc는 타입 검사만, JS 출력은 Vite가 담당 |
| `allowJs` | `true` | `.js/.jsx` 파일도 같이 컴파일 (Header.jsx 등) |
| `esModuleInterop`, `forceConsistentCasingInFileNames` | `true` | CommonJS 호환 / 파일명 대소문자 일관 강제 |

`tsconfig.node.json` 은 `vite.config.ts` **하나만** 검사하는 별도 설정입니다(`composite: true`, `types: ["node"]`). `tsconfig.json:24` 의 `references` 가 둘을 묶습니다.

### 1.4 `eslint.config.js` — flat config (ESLint 9)

```js
// eslint.config.js
export default defineConfig([
  globalIgnores(['dist']),                       // 빌드 결과는 검사 안 함
  {
    files: ['**/*.{js,jsx}'],                    // ⚠️ .ts/.tsx 는 대상 아님 (아래 주의)
    extends: [
      js.configs.recommended,                    // 기본 JS 규칙
      reactHooks.configs.flat.recommended,        // hooks 규칙 (의존성 배열 누락 등)
      reactRefresh.configs.vite,                  // 컴포넌트가 HMR에 안전한지
    ],
    languageOptions: { /* ecmaVersion latest, module, browser globals, jsx */ },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // 대문자/언더스코어로 시작하는 변수(상수·컴포넌트)는 안 써도 에러 안 냄
    },
  },
])
```

- 주의: `files` 패턴이 `**/*.{js,jsx}` 라서 **TypeScript 파일은 ESLint가 안 봅니다.** `.ts/.tsx` 의 미사용 변수·hook 의존성 등은 `tsc` 와 IDE에만 의존합니다. (8장 개선 항목)

### 1.5 `index.html` / `src/main.tsx`

```html
<!-- index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Do+Hyeon&display=swap" rel="stylesheet">
...
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

- `preconnect` 는 폰트 서버에 미리 연결을 터서 폰트 로딩을 빠르게 하는 힌트입니다.
- React는 `#root` 에 마운트됩니다.

```tsx
// src/main.tsx
if (!document.body.getAttribute("data-theme")) {
  document.body.setAttribute("data-theme", "light");      // 기본 테마 light
}
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>   // 라우터 base = "/react-portfolio/"
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

- `getElementById("root")!` 의 `!` 는 "이 요소는 절대 `null` 이 아니다"라는 TypeScript non-null 단언입니다. (`index.html` 에 `#root` 가 있으니 안전)
- `React.StrictMode` 는 개발 모드에서 잠재적 문제를 잡기 위해 일부 함수(렌더·effect)를 **두 번** 실행합니다. → 개발 중 콘솔 로그가 두 번 찍히거나 effect가 두 번 도는 게 정상입니다.
- `BrowserRouter basename` 은 모든 라우트 경로의 접두사를 잡아줍니다(`base` 와 일치시켜야 함).

---

## 2. 라우팅 — react-router-dom v7

라우트 정의(`src/App.tsx`):

```tsx
// App.tsx:159-172  (function App)
<Routes>
  <Route path="/" element={<ProjectPage />} />
  <Route path="/projects/:projectId" element={<ProjectPage />} />
</Routes>
```

- 두 경로 **모두 같은 `ProjectPage` 를 렌더**합니다. `/projects/8` 이면 `:projectId` 가 `"8"` 이 되고, `ProjectDetail` 모달이 페이지 위에 떠서 8번 프로젝트를 보여줍니다. 즉 "상세"는 별도 페이지가 아니라 같은 페이지 + 오버레이입니다.

사용하는 라우터 hook들:

| hook | 어디 | 하는 일 |
|---|---|---|
| `useParams()` | `App.tsx:97` (`ProjectPage`) | URL의 `:projectId` 추출 → `Number(projectId)` 로 변환 |
| `useSearchParams()` | `App.tsx:98` | URL 쿼리스트링(`?stack=React&...`) 읽기/쓰기. **필터 상태의 단일 진실 공급원** |
| `useNavigate()` | `ProjectDetail.tsx:29` | 모달 닫을 때 코드로 `/` 로 이동 (`replace: true` 로 히스토리 안 쌓음) |
| `useLocation()` | `ProjectCard.tsx:17`, `ProjectDetail.tsx:30`, `Header.jsx:14`(미사용) | 현재 `search`(쿼리스트링) 를 읽어서 링크에 그대로 붙임 |
| `Link` / `Routes` / `Route` / `BrowserRouter` | 여러 곳 | 선언적 네비게이션 |

**필터를 유지하며 이동하는 패턴** (`ProjectCard.tsx:60-64`):

```tsx
<Link to={{ pathname: `/projects/${project.id}`, search: location.search }}>
  상세 보기
</Link>
```

- 카드의 "상세 보기"를 누르면 `/projects/8` 로 가되, 지금 걸려 있던 필터 쿼리(`?stack=React` 등)를 그대로 들고 갑니다. 그래서 모달을 닫고 돌아와도 필터가 유지됩니다. `ProjectDetail.handleClose` (`ProjectDetail.tsx:57-59`)도 마찬가지로 `search` 를 유지하며 `/` 로 돌아갑니다.

**`import.meta.env.BASE_URL`**: dev에서는 `/`, GitHub Pages 배포에서는 `/react-portfolio/`. `fetch(`${import.meta.env.BASE_URL}projects.json`)` (`App.tsx:104`, `api/projects.ts:69`, `api/companys.ts:49`)이 두 환경 모두에서 올바른 경로를 가리키게 해줍니다.

---

## 3. React 코드 상세 — 컴포넌트·Hooks·데이터 흐름

### 3.0 전체 데이터 흐름 한눈에

```
                URL(?stack=...&difficulty=...&sort=...)  +  /projects/:projectId
                                │
                       useSearchParams / useParams
                                ▼
┌───────────────────────────── App.tsx (ProjectPage) ─────────────────────────────┐
│  state: projects(=projects.json fetch), loadError                                │
│  derived: filters = useMemo(parseFilters(searchParams))                          │
│           activeId = Number(projectId) | null                                    │
│                                                                                  │
│   <Career/>            ← 독립적으로 companies.json fetch                          │
│   <Filters filters onChange={handleFilterChange} projects={projects} />          │
│   <ProjectList filters activeProjectId={activeId} />   ← 스스로 fetchProjects     │
│   <ProjectDetail projectId={activeId} filters />       ← 스스로 fetchProjectDetail│
└──────────────────────────────────────────────────────────────────────────────────┘
        ▲ onChange(next)                                   │ <ProjectCard>
        │ → setSearchParams(...)                           │  isActive, <Link search 유지>
        └── URL 변경 → useMemo 재계산 → filters 새로 흘러내려감 ┘
```

- "위에서 아래로(props)" 내려가는 건 `filters`, `activeId`, `projects`.
- "아래에서 위로(이벤트)" 올라오는 건 `Filters` 의 `onChange` 하나. 그 콜백은 상태를 직접 바꾸는 게 아니라 **URL을 바꿉니다**(`setSearchParams`). URL이 바뀌면 `useMemo` 가 다시 돌아 새 `filters` 가 만들어지고 자식들에게 전달됩니다.
- 왜 필터를 URL에? → 새로고침해도 유지되고, 링크 공유·북마크·브라우저 뒤로가기가 자연스럽게 동작합니다.

---

### 3.1 `src/App.tsx`

역할: 라우팅, 페이지 섹션 배치(About → Career → Filters → ProjectList → ProjectDetail), 필터 상태 파싱, `projects.json` 로드.

`ProjectPage` 안의 hook들:

```tsx
// App.tsx:96-124
const { projectId } = useParams();                          // 1) URL :projectId
const [searchParams, setSearchParams] = useSearchParams();  // 2) URL 쿼리

const [projects, setProjects] = useState<Project[]>([]);    // 3) 로드된 프로젝트 목록
const [loadError, setLoadError] = useState<string | null>(null);

useEffect(() => {                                            // 4) 마운트 시 1회 fetch
  const url = `${import.meta.env.BASE_URL}projects.json`;
  fetch(url)
    .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then((data) => {
      const list: Project[] = Array.isArray(data) ? data : data.projects; // 배열 / {projects,total} 둘 다 대응
      setProjects(list ?? []);
      setLoadError(null);
    })
    .catch((e) => { setProjects([]); setLoadError(e instanceof Error ? e.message : String(e)); });
}, []);                                                      // [] → 마운트 때 한 번만

const filters = useMemo(() => parseFilters(searchParams), [searchParams]); // 5) 쿼리→FilterState 파싱(메모이즈)
const activeId = projectId ? Number(projectId) : null;
```

- `useState<T>` : 컴포넌트가 다시 그려져도 값을 기억하는 칸. `setX` 를 부르면 그 부분이 리렌더됩니다.
- `useEffect(fn, [])` : "마운트 직후 한 번"의 부수효과. 여기선 `projects.json` 을 가져옵니다. `r.ok` 체크로 404 등을 에러로 만들고, `Array.isArray` 분기로 데이터가 배열이든 `{projects,total}` 래퍼든 둘 다 받습니다.
- `useMemo(fn, [searchParams])` : `searchParams` 가 안 바뀌면 `parseFilters` 를 다시 계산하지 않고 이전 결과를 재사용합니다. (자식에게 넘기는 객체의 참조가 불필요하게 바뀌는 걸 줄이는 효과도 있음)

이벤트 핸들러(`App.tsx:126-137`):

```tsx
const handleFilterChange = (next: FilterState) => {
  const params = new URLSearchParams();
  if (next.stack && next.stack !== "All") params.set("stack", next.stack);
  if (next.difficulty && next.difficulty !== "all") params.set("difficulty", next.difficulty);
  if (next.duration && next.duration !== "all") params.set("duration", next.duration);
  params.set("sort", next.sort);
  setSearchParams(params, { replace: false });  // URL 변경 → filters 재계산
};
```

헬퍼 함수 두 개(`App.tsx:26-47`):

```tsx
const isValidOption = <T extends string>(
  value: string | null,
  list: readonly T[]
): value is T => !!value && (list as readonly string[]).includes(value);

const parseFilters = (searchParams: URLSearchParams): FilterState => {
  const stack = searchParams.get("stack");
  const difficulty = searchParams.get("difficulty");
  const duration = searchParams.get("duration");
  const sort = searchParams.get("sort");
  return {
    stack: isValidOption(stack, STACK_OPTIONS) ? stack : DEFAULT_FILTERS.stack,
    difficulty: isValidOption(difficulty, DIFFICULTY_OPTIONS) ? difficulty : DEFAULT_FILTERS.difficulty,
    duration: isValidOption(duration, DURATION_OPTIONS) ? duration : DEFAULT_FILTERS.duration,
    sort: sort === "duration" ? "duration" : DEFAULT_FILTERS.sort,
  };
};
```

- `parseFilters` 는 URL 쿼리값을 "신뢰할 수 없는 문자열"로 보고, 허용 목록(`STACK_OPTIONS` 등)에 있을 때만 통과시키고 아니면 기본값(`DEFAULT_FILTERS`, `App.tsx:19-24`)으로 떨어뜨립니다. 누가 `?stack=해킹` 같은 걸 넣어도 안전합니다.
- `isValidOption` 의 타입 메커니즘은 [4장](#4-typescript-상세--문법별로)에서 자세히 설명합니다.

조건부 렌더(`App.tsx:151`): `{loadError && <p className="error-message">Failed to fetch: {loadError}</p>}` — 로드 실패 시에만 배너.

`AboutSection` (`App.tsx:50-94`) 은 hook 없는 정적 컴포넌트로, 이름·생년월일·이메일 등을 `<table>` 로 하드코딩해 보여줍니다.

---

### 3.2 `src/components/layout/Header/Header.jsx`

역할: 상단 내비게이션. 스크롤하면 클래스 토글, 메뉴 클릭하면 해당 섹션으로 부드럽게 스크롤.

```jsx
// Header.jsx
const [scrolled, setScrolled] = useState(false);
const location = useLocation();          // ⚠️ import만 하고 안 씀 (데드코드)

useEffect(() => {
  const handleScroll = () => setScrolled(window.scrollY > 20);
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);   // 클린업: 언마운트 시 리스너 제거
}, []);

const scrollToSection = (path) => {
  const hash = path.split("#")[1];                  // "#about" → "about"
  if (hash) {
    const element = document.getElementById(hash);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  }
};
```

- `useEffect` 의 **return 함수가 클린업**입니다. 이벤트 리스너를 effect 안에서 등록했으면, 컴포넌트가 사라질 때 꼭 떼야 메모리 누수가 안 생깁니다.
- `navItems` (`Header.jsx:6-10`) 배열을 `.map` 으로 `<li>` 렌더. 정적 배열이라 `key={idx}` 도 무방합니다(목록이 재정렬·삽입되지 않으므로).
- `<a href="#about">` 의 기본 점프 동작을 `e.preventDefault()` 로 막고, 헤더 높이(80px)만큼 빼서 부드럽게 스크롤합니다. — 헤더 높이가 여기선 `80`, `Career.tsx` 의 sticky 계산에선 `90`, `App.scss` 에서도 `90px` 으로 제각각 (8장 매직넘버 항목).

---

### 3.3 `src/components/layout/Header/HeaderTheme.jsx`

역할: 다크/라이트 토글. 우선순위는 **localStorage 저장값 → OS 설정 → light**.

```jsx
// HeaderTheme.jsx
const STORAGE_KEY = "theme";                       // 'light' | 'dark'
const [isDark, setIsDark] = useState(false);

useEffect(() => {                                  // ① 마운트 시 초기화
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "dark" || saved === "light") {
    setIsDark(saved === "dark");
    document.body.dataset.theme = saved;
    return;
  }
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  setIsDark(!!prefersDark);
  document.body.dataset.theme = prefersDark ? "dark" : "light";
}, []);

useEffect(() => {                                  // ② isDark 바뀔 때마다 동기화
  const theme = isDark ? "dark" : "light";
  document.body.dataset.theme = theme;             // <body data-theme="dark">
  localStorage.setItem(STORAGE_KEY, theme);
}, [isDark]);
```

- effect 2개의 역할 분담: ①은 "처음 한 번" 어떤 테마로 시작할지 결정, ②는 "이후 상태 변화"를 DOM(`<body data-theme>`)과 localStorage에 반영. `<body data-theme>` 가 바뀌면 [6장](#6-스타일링-scss-상세)의 CSS 변수들이 다크 색상으로 갈아끼워집니다.
- `?.` (옵셔널 체이닝): `window.matchMedia` 가 없는 환경(아주 옛 브라우저)에서도 터지지 않게.
- `<input type="checkbox" checked={isDark} onChange={...} />` — 값이 상태에 묶인 **controlled input**.
- 참고: `main.tsx` 도 `data-theme="light"` 를 미리 박아두므로(깜빡임 방지) 이 effect와 약간 중복됩니다.

---

### 3.4 `src/components/layout/Footer.jsx`

hook 없는 정적 컴포넌트. `const currentYear = new Date().getFullYear();` 로 ⓒ 연도만 동적으로 출력.

---

### 3.5 `src/components/Career/Career.tsx`

역할: 경력 타임라인 + 연도 select 필터 + 스크롤 시 탭(`.experience__tabs`)을 sticky 로 붙였다 떼는 처리.

```tsx
// Career.tsx
const [selectedYear, setSelectedYear] = useState<number | "all">("all");  // select 값
const [companyList, setCompanyList]   = useState<CompanyCareer[]>([]);    // 화면에 뿌릴 목록
const [allCompanies, setAllCompanies] = useState<CompanyCareer[]>([]);    // 연도 옵션 만들 원본

const tabsRef      = useRef<HTMLDivElement>(null);   // sticky 조작 대상
const contentRef   = useRef<HTMLDivElement>(null);
const containerRef = useRef<HTMLDivElement>(null);

// ① 마운트 시 전체 회사 데이터 로드
useEffect(() => {
  fetchCompanies().then((list) => { setAllCompanies(list); setCompanyList(list); }).catch(console.error);
}, []);

const toYear = (v: number | string): number => Number(String(v).slice(0, 4));   // "2016.07" → 2016

// ② allCompanies → 연도 옵션 [maxYear ... minYear]
const yearOptions = useMemo(() => {
  if (allCompanies.length === 0) return [];
  const currentYear = new Date().getFullYear();
  const minYear = Math.min(...allCompanies.map((c) => toYear(c.period.start)));
  const maxYear = Math.max(...allCompanies.map((c) => c.period.end === "present" ? currentYear : toYear(c.period.end)));
  const years: number[] = [];
  for (let y = maxYear; y >= minYear; y--) years.push(y);
  return years;
}, [allCompanies]);

// ③ select 바뀌면 필터된 목록 다시 받기 (api 내부 캐시 있어 빠름)
useEffect(() => {
  const params = selectedYear === "all" ? {} : { year: selectedYear };
  fetchCompanies(params).then(setCompanyList).catch(console.error);
}, [selectedYear]);

// ④ scroll/resize 마다 tabs 의 position 을 직접 조작 (헤더 높이 90 매직넘버)
useEffect(() => {
  if (!tabsRef.current || !contentRef.current || !containerRef.current) return;
  const tabs = tabsRef.current, container = containerRef.current;
  const headerHeight = 90;
  const handleScroll = () => {
    const containerBottom = container.getBoundingClientRect().bottom;
    if (containerBottom <= headerHeight) { tabs.style.position = 'relative'; tabs.style.top = '0'; }
    else { tabs.style.position = 'sticky'; tabs.style.top = `${headerHeight}px`; }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll, { passive: true });
  handleScroll();
  return () => { window.removeEventListener('scroll', handleScroll); window.removeEventListener('resize', handleScroll); };
}, [companyList]);
```

- `useRef` : 렌더와 무관하게 "어떤 값(여기선 DOM 노드)"을 들고 있는 상자. `.current` 로 접근. JSX의 `ref={tabsRef}` 로 실제 `<div>` 가 들어옵니다. 여기선 그 div의 `style.position` 을 직접 만지려고 씁니다(React식이 아닌 명령형 DOM 조작 — 8장 개선 항목).
- `useMemo([allCompanies])` : 데이터가 안 바뀌면 연도 배열 계산을 건너뜀.
- effect ④의 의존성이 `[companyList]` 라서 목록이 바뀔 때마다 리스너를 다시 붙입니다.
- 리스트 렌더(`Career.tsx:120-141`): 바깥 `companyList.map((c) => ... key={c.id})`, 안쪽 `c.techStack.map((t) => ... key={`${c.id}-${t}`})` 처럼 **중첩 map + 합성 key**. `idx` 를 받아오지만 안 씁니다(데드코드).
- ⚠️ 타입 불일치: 여기서 `c.position`, `c.team`, `c.highlights`, `c.techStack` 를 쓰는데 `types/companys.ts` 의 `CompanyCareer` 에는 이 필드들이 없습니다. (4·8장 참고)
- `console.error` 만 하고 화면에 에러 표시가 없어서, 데이터 로드 실패 시 섹션이 조용히 빈 채로 남습니다.

---

### 3.6 `src/components/Filters/Filters.tsx`

역할: 스택 칩 버튼들 + 난이도/기간/정렬 select. hook을 하나도 안 씁니다 — **완전 controlled**(상태는 부모 `App` 이 가짐).

```tsx
// Filters.tsx
interface FiltersProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  projects: Project[];                       // 스택별 개수 세려고 받음
}

const handleSelect = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
  onChange({ ...filters, [key]: value });    // 기존 filters 복사 + 한 키만 교체 → 부모에 통째로 올림
};

const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
  const { name, value } = event.target;      // <select name="difficulty"> 등
  if (name === "difficulty") handleSelect("difficulty", value as FilterState["difficulty"]);
  if (name === "duration")   handleSelect("duration",   value as FilterState["duration"]);
  if (name === "sort")       handleSelect("sort",       value as FilterState["sort"]);
};

const handleReset = () => onChange({ stack: "All", difficulty: "all", duration: "all", sort: "recent" });

const countByStack = (stack: Skill | "All") =>
  stack === "All" ? projects.length : projects.filter((p) => p.skills.includes(stack)).length;
```

- 칩 버튼(`Filters.tsx:83-94`): `STACK_OPTIONS.map(...)`, 활성 표시는 `className={`skill-chip ${filters.stack === stack ? "is-active" : ""}`}`, 라벨에 `{stack}({countByStack(stack)})` 로 개수 표시.
- select 3개: `난이도`(`DIFFICULTY_OPTIONS`), `기간`(`DURATION_OPTIONS` + `labelForDuration` 으로 한글 라벨), `정렬`(recent/duration 하드코딩). 모두 `value={filters.x}` 로 바인딩된 controlled select.
- `handleSelect` 의 제네릭은 [4장](#4-typescript-상세--문법별로)에서.
- 참고: `<section id="projects">` 가 여기에도 있고 `App.tsx` 의 다른 `<section id="projects">` 와 겹칩니다(id 중복 — 사소한 정리거리).

---

### 3.7 `src/components/ProjectList/ProjectList.tsx`

역할: `filters` 를 받아 `fetchProjects(filters)` 로 목록을 가져와 `ProjectCard` 들로 렌더. loading/error/empty 상태 관리.

```tsx
// ProjectList.tsx
const [projects, setProjects] = useState<Project[]>([]);
const [loading, setLoading]   = useState(true);
const [error, setError]       = useState<string | null>(null);

useEffect(() => {
  let cancelled = false;                       // ★ 클린업 플래그
  setLoading(true); setError(null);
  fetchProjects(filters)
    .then((data) => { if (!cancelled) setProjects(data); })
    .catch((err: Error) => { if (!cancelled) setError(err.message); })
    .finally(() => { if (!cancelled) setLoading(false); });
  return () => { cancelled = true; };          // filters가 또 바뀌거나 언마운트되면 이전 요청 결과 무시
}, [filters]);

const emptyState = !loading && !error && projects.length === 0;

const listTitle = useMemo(() => {              // "React · 중급" 같은 제목 (현재 화면에 안 그려지긴 함)
  const pieces = [] as string[];
  if (filters.stack && filters.stack !== "All") pieces.push(filters.stack);
  if (filters.difficulty && filters.difficulty !== "all") pieces.push(filters.difficulty);
  if (filters.duration && filters.duration !== "all") pieces.push(filters.duration);
  return pieces.length === 0 ? "전체 프로젝트" : pieces.join(" · ");
}, [filters]);
```

- **클린업 플래그 패턴**(`cancelled`): 비동기 요청이 끝나기 전에 `filters` 가 또 바뀌면 새 effect가 돌면서 옛 effect의 클린업(`cancelled = true`)이 먼저 실행됩니다. 그러면 옛 요청이 늦게 응답해도 `if (!cancelled)` 때문에 `setState` 를 안 합니다 → 오래된 결과가 화면을 덮어쓰거나, 언마운트된 컴포넌트에 setState 하는 일을 막습니다.
- 조건부 렌더(`ProjectList.tsx:55-73`): `loading` / `error` / `emptyState` / 카드목록 중 **하나만** 보이도록 4분기.
- 리스트 렌더: `projects.map((project) => <ProjectCard key={project.id} project={project} isActive={project.id === activeProjectId} />)`.

---

### 3.8 `src/components/ProjectCard/ProjectCard.tsx`

역할: 프로젝트 한 개 카드. hook 없음(단 `useLocation` 만 — 링크에 `search` 붙이려고).

```tsx
// ProjectCard.tsx
const formatPeriod = (start: string, end?: string) => {
  const toYearMonth = (s: string) => s.slice(0, 7);          // "2025-12-21" → "2025-12"
  return !end ? `${toYearMonth(start)} ~ 진행중` : `${toYearMonth(start)} ~ ${toYearMonth(end)}`;
};

function ProjectCard({ project, isActive }: ProjectCardProps) {
  const location = useLocation();
  return (
    <article className={`project-card ${isActive ? "project-card--active" : ""}`}>
      ...
      {project.teamSize ? <span>팀 {project.teamSize}명</span> : null}             {/* 있을 때만 */}
      {project.skills.map((skill) => <span key={skill} className="project-card__skill">{skill}</span>)}
      {project.repository ? <a href={project.repository} target="_blank" rel="noopener noreferrer">Repository</a> : null}
      {project.demoUrl ? <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">Demo</a> : null}
      <Link to={{ pathname: `/projects/${project.id}`, search: location.search }}>상세 보기</Link>
    </article>
  );
}
```

- `isActive` → `project-card--active` 클래스 토글(현재 URL이 `/projects/<이 카드>` 일 때 강조).
- `repository`/`demoUrl`/`teamSize` 는 옵셔널이라 **truthy일 때만** 렌더(`? ... : null`).
- `target="_blank"` 외부 링크엔 `rel="noopener noreferrer"` 를 붙임(보안: 새 탭이 원래 페이지를 조작 못 하게).
- props는 React 함수의 첫 인자에서 **구조분해**로 받습니다: `function ProjectCard({ project, isActive }: ProjectCardProps)`.

---

### 3.9 `src/components/ProjectDetail/ProjectDetail.tsx`

역할: `projectId` 가 있으면 상세를 fetch해서 **모달 오버레이**로 표시. 8번 프로젝트만 스크린샷 갤러리 + 라이트박스.

```tsx
// ProjectDetail.tsx
import top50Main from "@/images/top50_stcok_main.png";       // Vite가 이미지를 import하면 최종 URL 문자열을 줌
...
const TOP50_IMAGES = [ { src: top50Main, label: "메인" }, ... ];   // 4장 하드코딩

const [project, setProject]           = useState<Project | null>(null);
const [loading, setLoading]           = useState(false);
const [error, setError]               = useState<string | null>(null);
const [lightboxImage, setLightboxImage] = useState<string | null>(null);   // 확대해서 볼 이미지 URL
const navigate = useNavigate();
const location = useLocation();

useEffect(() => {
  if (!projectId) return;                       // id 없으면 아무것도 안 함
  let cancelled = false;
  setLoading(true); setError(null);
  fetchProjectDetail(projectId, filters)
    .then((data) => { if (!cancelled) setProject(data); })
    .catch((err: Error) => { if (!cancelled) setError(err.message); })
    .finally(() => { if (!cancelled) setLoading(false); });
  return () => { cancelled = true; };
}, [filters, projectId]);

if (!projectId) return null;                     // ★ 조건부로 컴포넌트 자체를 안 그림

const handleClose = () => navigate({ pathname: "/", search: location.search }, { replace: true });
const handleLightboxBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
  if (e.target === e.currentTarget) setLightboxImage(null);   // 배경(오버레이 자체)을 눌렀을 때만 닫기
};
```

- `if (!projectId) return null;` — early return. `/` 경로(상세 안 봄)에서는 이 컴포넌트가 `null` 을 반환해 아무것도 안 그립니다.
- `ProjectList`/`ProjectDetail` 둘 다 같은 **클린업 플래그 패턴**을 씁니다.
- 모달 본문(`ProjectDetail.tsx:65-162`): `loading`/`error`/`project` 상태에 따라 분기, `<dl>` 로 난이도·기간·팀·스택, 링크들. `aria-modal="true"` `role="dialog"` 가 붙어 있지만 `aria-labelledby`(제목 연결)와 ESC 닫기는 없습니다(8장).
- `project.id === 8` 일 때만 `TOP50_IMAGES.map((img, index) => <button key={index} onClick={() => setLightboxImage(img.src)}><img src={img.src} ... /></button>)` — **특정 id 하드코딩**(8장 개선 항목).
- 라이트박스(`ProjectDetail.tsx:164-179`): `lightboxImage` 가 있으면 전체화면 오버레이 + 큰 이미지. 이미지 클릭은 `e.stopPropagation()` 으로 막아서(버블링 차단) 이미지를 눌러도 안 닫히고, 배경을 눌러야 닫힘.

---

### 3.10 전역 상태 정리

| 종류 | 무엇 | 어디 | 왜 |
|---|---|---|---|
| URL `searchParams` | 프로젝트 필터(stack/difficulty/duration/sort) | `App.tsx` `useSearchParams` ↔ `Filters` `onChange` | 새로고침·공유·뒤로가기 지원. **단일 진실 공급원** |
| URL path param | 열려 있는 상세 프로젝트 id | `App.tsx` `useParams` → `ProjectDetail` | 상세를 URL로 표현 (딥링크 가능) |
| Zustand 스토어 | `selectedSkill` 하나 | `components/layout/Main/Skills/useSkillStore.js` | **현재 미사용** (레거시 SkillChip/ProjectSection 전용) |
| 컴포넌트 로컬 state | 각자의 로딩/에러/데이터/UI 상태 | `ProjectList`(projects/loading/error), `ProjectDetail`(project/loading/error/lightboxImage), `Career`(selectedYear/companyList/allCompanies), `Header`(scrolled), `HeaderTheme`(isDark), `App`(projects/loadError) | 한 컴포넌트 안에서만 쓰는 상태 |

### 3.11 이 코드에서 반복적으로 보이는 React 패턴

- **클린업 플래그**(`let cancelled = false; ... return () => { cancelled = true; }`) — 비동기 + `useEffect` 의 정석 (`ProjectList`, `ProjectDetail`).
- **이벤트 리스너 클린업** — `addEventListener` 했으면 `useEffect` return에서 `removeEventListener` (`Header`, `Career`).
- **controlled inputs** — `<select value={...} onChange={...}>`, `<input checked={...} onChange={...}>` (`Filters`, `Career`, `HeaderTheme`).
- **선택적 `useMemo`** — 값비싼 계산(연도 목록)이나 매 렌더 새로 만들면 아까운 객체(`filters`)에만 사용.
- **합성(composition)** — 작은 단일 책임 컴포넌트들을 `App` 이 조립.
- **클라이언트 캐시** — `api/*.ts` 의 `Map<쿼리스트링, 결과>` (다음 장).
- **조건부 렌더** — `{cond && <X/>}`, `{cond ? <X/> : null}`, early `return null`.
- **`.map` + `key`** — 리스트는 항상 안정적인 `key`(주로 `id`). 정적 배열에 한해 index key 허용.

---

## 4. TypeScript 상세 — 문법별로

### 4.1 `src/types/project.ts`

```ts
// project.ts
export type Skill = "All" | "React" | "TypeScript" | "Next.js" | "React API"
  | "Vite" | "PhpMySql" | "Php" | "Html" | "Css" | "JavaScript" | "Jquery";   // 리터럴 유니온
export type Difficulty = "초급" | "중급" | "고급";
export type DurationCategory = "short" | "medium" | "long";

export interface ProjectPeriod { start: string; end?: string; }               // end? = 진행중 표현
export interface Project {
  id: number; title: string; description: string;
  skills: Skill[]; difficulty: Difficulty; period: ProjectPeriod;
  repository?: string; demoUrl?: string; teamSize?: number;                    // ? = 옵셔널
}
export interface ProjectQueryParams {
  stack?: Skill | "All"; difficulty?: Difficulty | "all";
  duration?: DurationCategory | "all"; sort?: "recent" | "duration";
}
export interface ProjectResponse { projects: Project[]; total: number; }       // ⚠️ 현재 미사용
```

- **리터럴 유니온 타입**(`"a" | "b" | ...`): 값이 그 문자열들 중 하나여야 함을 컴파일러가 강제. `project.difficulty = "어려움"` 같은 오타를 즉시 잡고, `switch (duration)` 같은 데서 자동완성이 됩니다. `Skill[]` 은 "Skill들의 배열".
- **옵셔널 필드 `?`**: `end?: string` 의 실제 타입은 `string | undefined`. `repository?`/`demoUrl?`/`teamSize?` 도 마찬가지 → 그래서 `ProjectCard` 에서 `project.teamSize ? ... : null` 같은 체크가 필요합니다.
- `ProjectQueryParams` 는 `Skill | "All"` (대문자 "All")과 `difficulty?: ... | "all"` (소문자 "all")을 섞어 씁니다. 의도: 스택은 도메인 값 자체가 `"All"` 칩이고, 난이도/기간은 "필터 없음"을 뜻하는 별도 토큰 `"all"`. 약간 헷갈리는 네이밍입니다.
- `ProjectResponse` 는 어디서도 import되지 않습니다(데드코드). `App.tsx:113` 이 `data.projects` 를 쓰면서도 이 타입을 안 쓰는 게 아쉬운 부분.

### 4.2 `src/types/companys.ts`

```ts
// companys.ts
export type Year = number;                                  // 의미 부여용 별칭(newtype 흉내)
export type YearRange = { start: Year; end: Year | "present"; };
export interface CompanyCareer {
  id: number; company: string; role: string;
  employmentLabel?: string;
  period: { start: string; end: string | "present" };
}
export interface CompanyQueryParams { year?: Year; }
```

- `type Year = number` — 그냥 `number` 지만 의도를 드러내는 별칭. `YearRange` 의 `end: Year | "present"` 처럼 "숫자 또는 문자열 'present'"를 표현.
- ⚠️ **실제 JSON과 불일치**: `public/companies.json` 의 항목은 `company`, `employmentType`, `team`, `position`, `period`, `highlights`, `techStack` 를 가지는데, `CompanyCareer` 는 `role`, `employmentLabel?` 만 정의합니다. `Career.tsx` 가 `c.position` / `c.team` / `c.highlights` / `c.techStack` 를 접근하므로 `tsc` 에서 타입 에러가 납니다(런타임은 JSON에 필드가 있어 일단 동작). → 타입을 JSON에 맞게 고쳐야 합니다(8장).

### 4.3 타입가드 — `value is T` (App.tsx)

```ts
// App.tsx:26-29
const isValidOption = <T extends string>(
  value: string | null,
  list: readonly T[]
): value is T => !!value && (list as readonly string[]).includes(value);
```

뜯어보면:

- `<T extends string>` — **제네릭 + 제약**. 이 함수는 어떤 타입 `T` 든 받을 수 있되, `T` 는 반드시 `string` 의 서브타입이어야 합니다(`"All" | "React" | ...` 같은 리터럴 유니온이 들어옴). 그래서 `STACK_OPTIONS: Skill[]` 를 넘기면 `T = Skill`.
- `): value is T` — **타입 술어(type predicate)**. 반환값이 `true` 면 "그 시점부터 `value` 를 `T` 로 취급해도 된다"고 컴파일러에게 알려줍니다. 그래서 `parseFilters` 의 `isValidOption(stack, STACK_OPTIONS) ? stack : ...` 에서 `?` 쪽의 `stack` 은 `string | null` 이 아니라 `Skill` 로 좁혀집니다 — 그래서 `FilterState.stack` 에 그대로 넣을 수 있습니다.
- `readonly T[]` 와 `(list as readonly string[])` — `STACK_OPTIONS` 등은 읽기 전용 배열로 받습니다(실수로 `list.push(...)` 못 하게). 그런데 `Array.prototype.includes` 를 `readonly T[]` 에서 부르면 인자 타입이 `T` 라서, `value: string` 을 넣으면 "string은 T가 아닐 수도 있다"고 거부됩니다. 그래서 `as readonly string[]` 로 잠깐 넓혀서 `.includes(value: string)` 를 호출합니다. **`readonly` 를 떼고 일반 `string[]` 로 캐스팅하면 막힙니다**(읽기전용 → 변경가능 변환 불가) — 직전 작업에서 `as string[]` → `as readonly string[]` 로 고친 이유가 이것입니다.
- `!!value` — `value` 가 `null` 이나 빈 문자열이면 false (`null` 을 빨리 걸러냄).

### 4.4 인덱스 접근 타입 (indexed access type)

`T["key"]` 로 객체 타입에서 한 프로퍼티의 타입을 끄집어냅니다.

- `sortProjects(projects, sort?: ProjectQueryParams["sort"])` (`api/projects.ts:52`) — `sort` 의 타입을 `"recent" | "duration" | undefined` 로 (즉 `ProjectQueryParams` 의 `sort` 필드 그대로) 가져옴.
- `FilterState` (`Filters.tsx:9-14`):
  ```ts
  export interface FilterState {
    stack: Skill | "All";
    difficulty: ProjectQueryParams["difficulty"];   // = Difficulty | "all" | undefined
    duration: ProjectQueryParams["duration"];       // = DurationCategory | "all" | undefined
    sort: NonNullable<ProjectQueryParams["sort"]>;  // = "recent" | "duration"  (undefined 제거)
  }
  ```
- `value as FilterState["difficulty"]` (`Filters.tsx:47`) — `<select>` 의 `value` 는 항상 `string` 이므로, 그 문자열이 사실 `FilterState["difficulty"]` 임을 단언.

### 4.5 유틸리티 타입

- **`NonNullable<T>`** — `T` 에서 `null | undefined` 를 빼냅니다.
  - `FilterState.sort: NonNullable<ProjectQueryParams["sort"]>` → `"recent" | "duration"`.
  - `DIFFICULTY_OPTIONS: NonNullable<ProjectQueryParams["difficulty"]>[]` (`api/projects.ts:124`) / `DURATION_OPTIONS: NonNullable<ProjectQueryParams["duration"]>[]` (`api/projects.ts:131`). 왜냐하면 `difficulty?` 가 옵셔널이라 `ProjectQueryParams["difficulty"]` 는 `Difficulty | "all" | undefined` 인데, `undefined` 가 끼면 `isValidOption<T extends string>` 의 제약(`T extends string`)을 못 지킵니다. `NonNullable` 로 `undefined` 를 빼야 `isValidOption(difficulty, DIFFICULTY_OPTIONS)` 호출이 통과합니다 — 직전 작업에서 고친 부분입니다. (반면 `STACK_OPTIONS: Skill[]` 는 애초에 `undefined` 가 없어서 멀쩡했음)
- **`Map<K, V>` 제네릭** — `new Map<string, Project[]>()` (`api/projects.ts:9`), `new Map<string, CompanyCareer[]>()` (`api/companys.ts:6`). 키는 쿼리스트링, 값은 결과 배열.
- **`Promise<T>`** — `fetchProjects(): Promise<Project[]>` 등. `async` 함수의 반환 타입.
- **`ReactDOM` / 이벤트 타입** — `ChangeEvent<HTMLSelectElement>` (`Filters.tsx:43`), `React.MouseEvent<HTMLDivElement>` (`ProjectDetail.tsx:61`). DOM 이벤트 객체에 타입을 입혀 `event.target.value` 같은 접근을 안전하게.
- **`useState<T>` / `useRef<T>` 의 제네릭** — `useState<Project[]>([])`, `useState<number | "all">("all")`, `useRef<HTMLDivElement>(null)`. 초깃값만으로 추론이 안 되거나(빈 배열·null) 더 정확히 못박고 싶을 때 명시.

### 4.6 제네릭 함수 — `keyof` + 인덱스 접근 (Filters.tsx)

```ts
// Filters.tsx:36-41
const handleSelect = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
  onChange({ ...filters, [key]: value });
};
```

- `K extends keyof FilterState` — `K` 는 `"stack" | "difficulty" | "duration" | "sort"` 중 하나.
- `value: FilterState[K]` — `key` 로 넘긴 그 키에 **딱 맞는 타입의 값**만 받습니다. `handleSelect("stack", "all")` 처럼 잘못 짝지으면 컴파일 에러. `handleSelect("difficulty", value as FilterState["difficulty"])` 처럼 써야 통과. 한 함수로 어떤 필터 키든 타입 안전하게 갱신하는 패턴입니다.

### 4.7 non-null 단언 `!` 이 쓰인 곳

- `document.getElementById("root")!` (`main.tsx:11`) — `index.html` 에 `#root` 가 있으니 안전.
- `responseCache.get(queryString)!` (`api/projects.ts:66`), `responseCache.get(key)!` (`api/companys.ts:42`) — 바로 윗줄에서 `.has(...)` 로 존재를 확인했으니 안전. (대안: `const v = cache.get(k); if (v) return v;` 또는 `?? fallback`)
- `params.year!` (`api/companys.ts:83`) — 윗부분에서 `if (params.year == null) { ... return; }` 로 걸렀으니 안전. (대안: 분기를 `if (params.year != null) { ... }` 안쪽에 두면 `!` 없이도 좁혀짐)

### 4.8 `strict` 모드의 효과

`tsconfig.json` 의 `"strict": true` 때문에 `strictNullChecks` 등이 켜져 있어서, "값이 `null/undefined` 일 수 있는지"를 항상 신경 써야 합니다. 그래서 위의 `!` 단언들, `?? "all"`, `if (!projectId) return null`, `value ?? []` 같은 방어 코드가 자연스럽게 등장합니다.

---

## 5. 데이터 계층 (`src/api/`) 상세

이 폴더는 "정적 JSON을 fetch해서 필터·정렬한 뒤, 같은 조건이면 캐시에서 즉시 돌려주는" 얇은 레이어입니다. 진짜 서버 API는 없습니다(GitHub Pages는 정적 호스팅).

### 5.1 `src/api/projects.ts`

```ts
const ENDPOINT = "/projects.json";                       // ⚠️ 선언만 하고 안 씀
const responseCache = new Map<string, Project[]>();      // 쿼리스트링 → 결과 캐시

const durationCategory = (weeks: number): DurationCategory => {  // ⚠️ 어디서도 호출 안 함(데드코드)
  if (weeks <= 4) return "short";
  if (weeks <= 12) return "medium";
  return "long";
};

const buildQueryString = (params: ProjectQueryParams): string => {  // 캐시 key 생성용
  const sp = new URLSearchParams();
  if (params.stack && params.stack !== "All") sp.set("stack", params.stack);
  if (params.difficulty && params.difficulty !== "all") sp.set("difficulty", params.difficulty);
  if (params.duration && params.duration !== "all") sp.set("duration", params.duration);
  if (params.sort) sp.set("sort", params.sort);
  return sp.toString();          // 단, fetch URL에는 안 쓰임 — 필터링은 클라이언트에서 함
};

const matchesFilters = (project: Project, params: ProjectQueryParams): boolean => {
  const { stack, difficulty, duration } = params;
  const matchesStack      = !stack || stack === "All" || project.skills.some((s) => s === stack);
  const matchesDifficulty = !difficulty || difficulty === "all" || project.difficulty === difficulty;
  const matchesDuration   = !duration || duration === "all";   // ⚠️ 항상 true — 기간 필터 미구현
  return matchesStack && matchesDifficulty && matchesDuration;
};

const sortProjects = (projects: Project[], sort?: ProjectQueryParams["sort"]): Project[] =>
  [...projects].sort((a, b) =>                                  // ⚠️ sort 인자 무시, 항상 start 내림차순
    new Date(b.period.start).getTime() - new Date(a.period.start).getTime());

export const fetchProjects = async (params: ProjectQueryParams = {}): Promise<Project[]> => {
  const queryString = buildQueryString(params);
  if (responseCache.has(queryString)) return responseCache.get(queryString)!;   // 캐시 히트
  const url = `${import.meta.env.BASE_URL}projects.json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch projects: ${response.statusText}`);
  const payload: Project[] = await response.json();
  const filtered = sortProjects(payload.filter((p) => matchesFilters(p, params)), params.sort);
  responseCache.set(queryString, filtered);                     // 결과 캐싱
  return filtered;
};

export const fetchProjectDetail = async (id: number, params: ProjectQueryParams = {}): Promise<Project> => {
  const queryString = buildQueryString(params);
  const cached = responseCache.get(queryString);
  if (cached) { const found = cached.find((p) => p.id === id); if (found) return found; }   // 캐시 우선
  const projects = await fetchProjects(params);
  const project = projects.find((item) => item.id === id);
  if (!project) throw new Error("Project not found");
  return project;
};

export const STACK_OPTIONS: Skill[] = ["All","React","TypeScript","Next.js","React API","Vite","PhpMySql","Php","Html","Css","JavaScript","Jquery"];
export const DIFFICULTY_OPTIONS: NonNullable<ProjectQueryParams["difficulty"]>[] = ["all","초급","중급","고급"];
export const DURATION_OPTIONS: NonNullable<ProjectQueryParams["duration"]>[] = ["all","short","medium","long"];
```

흐름: **캐시 확인 → (없으면) fetch → `matchesFilters` 로 거름 → `sortProjects` 로 정렬 → 캐시에 저장 → 반환.** `fetchProjectDetail` 은 목록 캐시가 있으면 거기서 `find` 만 하고, 없으면 `fetchProjects` 를 거쳐서 찾습니다.

`STACK_OPTIONS` / `DIFFICULTY_OPTIONS` / `DURATION_OPTIONS` 는 ① `App.parseFilters` 가 URL 쿼리값 검증에, ② `Filters` 가 칩/`<option>` 렌더에 씁니다.

알아둘 점(8장에서 다시):
- `matchesDuration` 가 항상 `true` → **기간 필터가 실제로 안 걸립니다**. `durationCategory` 가 그 용도로 만들어졌지만 호출되지 않습니다.
- `sortProjects` 가 `sort` 인자를 안 봅니다 → `정렬: 소요 기간` 을 골라도 항상 시작일 내림차순.
- `ENDPOINT`, `buildQueryString` 의 반환값(fetch에는 미사용 — 캐시 key로만 의미) 등 군더더기.
- `new Date(b.period.start)` — `"2025-12-21"` 은 잘 파싱되지만 `"2021-03"`(일 없음)도 섞여 있어 파싱이 다소 위태롭습니다.

### 5.2 `src/api/companys.ts`

`projects.ts` 와 거의 같은 구조 + 풍부한 한국어 주석(학습용)이 달려 있습니다.

```ts
const ENDPOINT = "/companies.json";                      // 이건 실제로 fetch URL에 쓰임 (아래)
const responseCache = new Map<string, CompanyCareer[]>();

const buildQueryString = (params: CompanyQueryParams): string => {   // year만 직렬화
  const sp = new URLSearchParams();
  if (params.year) sp.set("year", String(params.year));
  return sp.toString();
};

const toYear = (v: string | number) => Number(String(v).slice(0, 4));   // "2016.07" → 2016 (앞 4글자 가정)

const includesYear = (start: string|number, end: string|number|"present", year: number) => {
  const startYear = toYear(start);
  const endYear = end === "present" ? new Date().getFullYear() : toYear(end);
  return startYear <= year && year <= endYear;          // 그 연도에 재직 중이었나
};

export const fetchCompanies = async (params: CompanyQueryParams = {}): Promise<CompanyCareer[]> => {
  const key = buildQueryString(params);
  if (responseCache.has(key)) return responseCache.get(key)!;
  const url = `${import.meta.env.BASE_URL}${ENDPOINT}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch companies: ${res.statusText}`);
  const payload: CompanyCareer[] = await res.json();
  if (params.year == null) { responseCache.set(key, payload); return payload; }   // 연도 없으면 전체
  const filtered = payload.filter((item) => includesYear(item.period.start, item.period.end, params.year!));
  responseCache.set(key, filtered);
  return filtered;
};
```

- `Career` 는 마운트 시 `fetchCompanies()` 로 전체를, 연도 select가 바뀌면 `fetchCompanies({ year })` 로 필터본을 받습니다. 둘 다 캐시되므로 연도를 왔다갔다 해도 빠릅니다.
- `includesYear` 가 핵심: 2021–2022 재직이면 2021도 2022도 매칭.
- `toYear` 의 `slice(0,4)` 는 `"2016.07"` 포맷 전제 — 포맷이 바뀌면 깨집니다(8장).

### 5.3 정적 데이터

- `public/projects.json` — `Project[]` 배열. 예: `{ "id":1, "title":"React 현재 git", "skills":["React","React API","TypeScript"], "description":"[포트폴리오]", "difficulty":"초급", "period":{"start":"2025-12-21","end":"2025-12-26"}, "repository":"...", "demoUrl":"...", "teamSize":1 }`. `period.start/end` 가 `"2025-12-21"` 인 것도 있고 `"2021-03"` 처럼 일이 빠진 것도 있음.
- `public/companies.json` — 항목이 `{ "id", "company", "employmentType", "team", "position", "period":{"start":"2016.07","end":"2016.12"}, "highlights":[...], "techStack":[...] }`. ← 이게 `CompanyCareer` 타입과 어긋나는 실제 데이터입니다.
- 둘 다 `${import.meta.env.BASE_URL}<파일명>` 으로 fetch (dev에선 `/projects.json`, 배포에선 `/react-portfolio/projects.json`).

---

## 6. 스타일링 (SCSS) 상세

### 6.1 구조

| 파일 | 역할 |
|---|---|
| `src/styles/reset.scss` | 미니멀 리셋: `* { margin/padding 0; box-sizing: border-box }`, 리스트/링크/버튼 기본값 제거, `html { scroll-behavior: smooth }`, `body::-webkit-scrollbar` 커스텀 |
| `src/styles/palette.legacy.scss` | 색 팔레트 두 개를 **SCSS Map** 으로: `$palette-light`, `$palette-dark` (Brittany Chiang 풍 — `blueNNN`, `grayNNN`, `navyNNN`, `greenNNN`, `redNNN`) |
| `src/styles/template.scss` | 전역 **유틸리티 클래스 생성기** + CSS 변수 테마. `@use`/`@mixin`/`@function`/`@each`/`@for`/`@while` 총출동 |
| `src/App.scss` (~1067줄) | 실제 컴포넌트들 스타일 + 다크모드 토큰. `App.tsx` 가 import |
| `src/components/layout/Header/Header.scss` | 헤더 전용 |
| 컴포넌트별 클래스 | `.project-card`, `.experience__item`, `.filters__chips` 등 (대부분 `App.scss` 안에) |

네이밍은 대체로 **BEM-ish**: `block__element`, `block--modifier` (`.project-card__skill`, `.project-card--active`, `.experience__tech-item`). 다만 유틸리티는 약어 컨벤션을 따로 씁니다(`.mgt40`, `.flx-btw`, `.fs16-line`) — 두 컨벤션이 섞여 있습니다.

### 6.2 SCSS 문법 — `template.scss` 로 보는 핵심

```scss
// template.scss:1-4
@use "./palette.legacy" as pal;     // 다른 SCSS 파일을 모듈로 가져옴 (이름공간 pal)
@use "sass:map";                    // Sass 빌트인 모듈들
@use "sass:list";
@use "sass:meta";                   // meta.type-of (예전 전역 type-of()는 deprecated → 이걸로 교체함)
```

**`@mixin` (재사용 스타일 블록)** — `@include` 로 펼침:

```scss
// template.scss:8-13  CSS 커스텀 프로퍼티 한꺼번에 찍어내기
@mixin emit-css-vars($palette) {
  @each $name, $value in $palette {          // Map 순회: 키, 값
    --#{$name}: #{$value};                   // #{} = 보간(interpolation) → --gray50: #fafafa;
  }
}
:root { @include emit-css-vars(pal.$palette-light); ... }   // 라이트 팔레트를 CSS 변수로
@media (prefers-color-scheme: dark) { :root { @include emit-css-vars(pal.$palette-dark); ... } }
html[data-theme="light"] { @include emit-css-vars(pal.$palette-light); }
html[data-theme="dark"]  { @include emit-css-vars(pal.$palette-dark);  }
```

**`@function` (값을 계산해 돌려줌)**:

```scss
// template.scss:109-111  + scale 믹스인(113~)에서 사용
@function _as-list($v) {
  @return if(meta.type-of($v) == "list", $v, ($v));   // 값이 list가 아니면 1개짜리로 감싸 일관 처리
}
```

**`@for` (정수 반복)** — font-weight 유틸:

```scss
// template.scss:199-204
@for $i from 1 through 9 { .fw#{$i * 100} { font-weight: $i * 100; } }   // .fw100 ~ .fw900
```

**`@while` (조건 반복)** — spacing/폰트 크기 스케일:

```scss
// template.scss:113-146 (scale 믹스인 일부)
@mixin scale($prefix, $properties, $max: 100, $unit: px, $step: 2, $include1: true) {
  $props: _as-list($properties);
  .#{$prefix}0 { @each $p in $props { #{$p}: 0#{$unit}; } }
  @if $include1 { .#{$prefix}1 { ... } }
  $n: 2;
  @while $n <= $max { .#{$prefix}#{$n} { @each $p in $props { #{$p}: #{$n}#{$unit}; } } $n: $n + $step; }
}
// 호출(149~168): @include scale("amg", margin); @include scale("mgt", margin-top); ... @include scale("agp", gap, 100, px, 2, false);
// → .amg0 .amg2 ... .amg100, .mgt0 .mgt2 ..., .pdl0 ..., .agp2 ... 같은 유틸리티 클래스가 대량 생성됨
@include font-scale("fs", font-size, 64);   // template.scss:196 → .fs10 .fs12 ... .fs64 + .fs10-line(line-height 포함)
```

**`@each` (리스트/맵 순회)** — 팔레트 색마다 유틸 생성:

```scss
// template.scss:63, 83-92
$palette-keys: map.keys(pal.$palette-light);
@each $name in $palette-keys {
  .#{$name}    { color: var(--#{$name}); }            // .gray50 { color: var(--gray50) }
  .bg-#{$name} { background-color: var(--#{$name}); } // .bg-blue500 { ... }
  @include border-utils($name);                       // .bd-x .bdt-x .bdb-x .bdl-x .bdr-x
}
```

그 외: 중첩 `&`(`&:hover`, `&::before`, `&.is-active`), 문자열 보간 `#{$var}` 를 선택자·속성·값 어디에나.

### 6.3 테마 / 다크모드

- **두 단계**로 동작합니다.
  1. `template.scss` — `:root` 와 `html[data-theme=...]` 에 팔레트(`--gray50` 등 "원색" 토큰)를 깔고, 그 위에 `--bg`/`--fg`/`--muted`/`--border`/`--primary` 같은 **시맨틱 토큰**을 정의 (`@media (prefers-color-scheme: dark)` 로 자동 전환 + `html[data-theme]` 로 수동 오버라이드).
  2. `App.scss` — `body[data-theme="light"]` / `body[data-theme="dark"]` / `body:not([data-theme])` (OS 따라가기) 블록에서 또 다른 변수들(`--bg`, `--overlay-bg` 등)을 정의하고, 컴포넌트 스타일은 `var(--bg)` 처럼 그 변수들을 씀.
- `HeaderTheme.jsx` 가 `<body data-theme="dark">` 를 토글하면 위 셀렉터가 활성화되며 색이 통째로 바뀝니다. `main.tsx` 가 초기에 `data-theme="light"` 를 박아 깜빡임을 줄입니다.
- 주의할 현황(8장): `App.scss` 에 `body[data-theme="light"]` 변수 정의가 두 번(`App.scss:45`, `App.scss:91`) 거의 동일하게 중복. 그리고 그림자·테두리에 `var(--border)` 대신 `rgba(0,0,0,0.1)` 같은 **하드코딩 색**이 여러 곳에 있어 다크모드에서 어색해질 수 있음. 헤더 높이 `90px`(`App.scss:339` 외) 같은 매직넘버도 흩어져 있음.

---

## 7. 빌드·배포 흐름

```
개발:   npm run dev      → Vite 개발서버(HMR), http://localhost:5173
검사:   npm run lint     → ESLint (단, .ts/.tsx는 대상 아님)  /  (타입은 IDE·tsc --noEmit)
빌드:   npm run build    → dist/  (TSX·SCSS 변환, 트리셰이킹, minify, 자산 해시)
미리보기: npm run preview → dist/ 를 로컬 서버로, http://localhost:4173
배포:   npm run deploy   → (predeploy가 자동 build) gh-pages -d dist  → gh-pages 브랜치 push
                         → https://tree-hs.github.io/react-portfolio/
```

서브경로 배포가 깨지지 않는 이유: `vite.config.ts` 의 `base: "/react-portfolio/"` → 번들 자산 경로 앞에 `/react-portfolio/` 가 붙고, `import.meta.env.BASE_URL` 도 그 값이 되며, `<BrowserRouter basename={import.meta.env.BASE_URL}>` 가 라우팅 경로도 맞춰줍니다. JSON fetch도 `${import.meta.env.BASE_URL}projects.json` 으로 합니다.

---

## 8. 개선해야 할 점 (목록)

> 이번 문서에서는 **목록만** 정리합니다. 실제 수정은 별도 작업으로.
> ※ 직전 작업에서 이미 수정 완료: `App.tsx` 의 `as readonly string[]`, `api/projects.ts` 의 `DIFFICULTY_OPTIONS`/`DURATION_OPTIONS` → `NonNullable<...>[]`, `template.scss` 의 `type-of` → `meta.type-of`. 아래에는 다시 넣지 않음.

| 우선순위 | 카테고리 | 이슈 | 파일(추정 라인) | 권장 |
|---|---|---|---|---|
| **High** | 기능 | `duration` 필터가 실제로 안 걸림 — `matchesDuration` 가 항상 `true` | `src/api/projects.ts:45` | `period.start/end` 로 주 수 계산 → `durationCategory()` 와 비교 |
| **High** | 기능 | `정렬: 소요 기간` 무효 — `sortProjects` 가 `sort` 인자를 무시 | `src/api/projects.ts:50-58` | `sort === "duration"` 이면 기간 길이로 정렬하도록 분기 |
| **High** | 타입 | `CompanyCareer` 타입이 실제 JSON과 불일치 — `position/team/highlights/techStack/employmentType` 누락인데 `Career.tsx` 가 접근 (`tsc` 에러) | `src/types/companys.ts:8-14`, `src/components/Career/Career.tsx:124-134` | 타입에 누락 필드 추가(필요하면 `role`/`employmentLabel` 정리) |
| Med | 구조 | `projects.json` 을 `App.tsx` 와 `ProjectList.tsx` 가 **각각 fetch**(중복) | `src/App.tsx:103-121`, `src/components/ProjectList/ProjectList.tsx:17-42` | App은 `Filters` 의 개수 표시용으로만 받음 → 상태를 끌어올려 공유하거나 한 곳으로 통일 |
| Med | React | `Career` 의 sticky 를 JS(`tabs.style.position`)로 수동 제어 — `headerHeight=90` 매직넘버, 리스너를 `companyList` 마다 재등록 | `src/components/Career/Career.tsx:58-93` | CSS `position: sticky` + `scroll-margin-top` 으로 대체 시도, 안 되면 `IntersectionObserver` |
| Med | UX/에러 | `Career` 가 fetch 실패를 `console.error` 만 하고 화면엔 표시 안 함 → 섹션이 조용히 빈 채로 | `src/components/Career/Career.tsx:27,54` | `error` state + 에러 메시지 렌더 (`ProjectList`/`ProjectDetail` 처럼) |
| Med | 설계 | 8번 프로젝트만 갤러리 — `project.id === 8` 하드코딩 | `src/components/ProjectDetail/ProjectDetail.tsx:138-159` | `Project` 에 `images?: {src,label}[]` 같은 필드 추가, 데이터로 처리 |
| Med | 접근성 | 상세 모달이 `<div role="dialog">` 인데 `aria-labelledby`(제목 연결) 없음, ESC로 못 닫음, 포커스 트랩 없음 | `src/components/ProjectDetail/ProjectDetail.tsx:66-78` | 네이티브 `<dialog>` 검토 또는 `aria-labelledby` + ESC 핸들러 + 포커스 관리 |
| Low | 데드코드 | `ENDPOINT`(projects.ts), `buildQueryString`(두 api에서 fetch엔 미사용), `durationCategory`, `ProjectResponse`(types), `Header.jsx` 의 `useLocation` import, `Career.tsx` map의 `idx`, `layout/Main/Skills/*` 4파일 전체, `zustand` 의존성 | `src/api/projects.ts:8,11-15,17-31`, `src/api/companys.ts:10-19`, `src/types/project.ts:46-49`, `src/components/layout/Header/Header.jsx:2,14`, `src/components/Career/Career.tsx:120`, `src/components/layout/Main/Skills/*`, `package.json:18` | 사용 안 하면 삭제(특히 Skills 폴더·zustand) |
| Low | 스타일 | `App.scss` 라이트 테마 변수 중복 정의 | `src/App.scss:45-70` 과 `91-113` | 한쪽 제거 |
| Low | 스타일 | 그림자/테두리에 `var(--border)` 대신 `rgba(0,0,0,0.x)` 하드코딩 다수 | `src/App.scss` (`:230,443,468,514,683,753,810,840,962,987,993,1027,1042`) | 시맨틱 CSS 변수로 치환 |
| Low | 스타일 | 매직넘버 — 헤더 높이 `90px`(App.scss·Career.tsx), `headerOffset 80`(Header.jsx), 컨테이너 `1400px` | `src/App.scss:339`, `Career.tsx:64`, `Header.jsx:29`, `App.scss:160` | `:root { --header-height: ... }` 등 CSS 변수로 일원화 |
| Low | 스타일 | `template.scss` 유틸 과다 생성(margin 50+개, font-size 30+개 등) → CSS 비대 | `src/styles/template.scss:113-204` | `$max`/`$step` 축소 또는 실제 쓰는 클래스만 남기기 |
| Low | 견고성 | 깨지기 쉬운 날짜 파싱 — `companys.ts` 의 `slice(0,4)`, `projects.ts` 의 `new Date(period.start)`(일 없는 `"2021-03"` 혼재) | `src/api/companys.ts:20`, `src/api/projects.ts:56` | ISO 정규화 또는 안전한 파서 + 폴백 |
| Low | 도구 | ESLint가 `.ts/.tsx` 를 검사 안 함(`files: ['**/*.{js,jsx}']`) | `eslint.config.js:10` | `typescript-eslint` 추가하고 `.ts/.tsx` 포함 |
| Low | 성능 | `ProjectCard` 에 `React.memo` 미적용, `App.handleFilterChange` 에 `useCallback` 미적용 | `src/components/ProjectCard/ProjectCard.tsx`, `src/App.tsx:126` | 필요 시 메모이즈 (목록 커지면 체감) |
| Low | 테스트 | 단위 테스트 0개 | (전체) | `matchesFilters` / `includesYear` / `isValidOption` / `parseFilters` 같은 순수함수부터 Vitest 도입 |
| Low | 사소 | `id="projects"` 가 `App.tsx` 와 `Filters.tsx` 양쪽에 — id 중복 | `src/App.tsx:142`, `src/components/Filters/Filters.tsx:72` | 한쪽 id 변경 |

---

## 9. 부록 — 더 공부하면 좋은 키워드

- **React**: hooks 규칙(최상위에서만 호출), `useEffect` 의존성 배열 & 클린업, `useMemo`/`useCallback` 을 언제 쓰나, controlled vs uncontrolled input, 리스트 `key` 의 의미, lifting state up, `React.StrictMode` 의 이중 실행, `React.memo`.
- **TypeScript**: 리터럴/유니온 타입, 타입가드(`x is T`), 제네릭과 제약(`<T extends ...>`), `keyof` 와 인덱스 접근 타입(`T[K]`), 유틸리티 타입(`NonNullable`, `Partial`, `Pick`, `Omit`, `Record`, `ReturnType`), `as`(타입 단언)와 `as const`, `strict`/`strictNullChecks`, `?` 옵셔널과 `?.`/`??`.
- **Vite**: `import.meta.env`(`BASE_URL`, `MODE`, 커스텀 `VITE_*`), `base`, 정적 자산 import(이미지 → URL 문자열), `public/` vs `src/assets/`.
- **react-router-dom v7**: `BrowserRouter`/`basename`, `Routes`/`Route`/`:param`, `Link`/`NavLink`, `useParams`/`useSearchParams`/`useNavigate`/`useLocation`, `replace` 옵션.
- **SCSS**: `@use`/`@forward` 모듈 시스템, 빌트인 모듈(`sass:map`, `sass:list`, `sass:math`, `sass:meta`), `@mixin`/`@include`, `@function`, `@if`/`@each`/`@for`/`@while`, 보간 `#{}`, Map 자료구조, CSS 커스텀 프로퍼티로 테마링.
- **접근성**: `dialog`/`role`/`aria-*`, 포커스 트랩, 키보드 조작(ESC, Tab), 색만으로 정보 전달하지 않기.
- **테스트**: Vitest + React Testing Library (순수함수 → 컴포넌트 순).
