// ─────────────────────────────────────────────────────────────────────────────
//  Study Lab — 학습 레슨 레지스트리
//  · React / TypeScript / Sass 카테고리별로 기초 레슨을 단계적으로 등록한다.
//  · 각 레슨의 라이브 예제 컴포넌트는 React.lazy로 분할 로딩 — /study 페이지의
//    초기 번들에 모든 예제가 들어오지 않도록.
//  · "기초부터 차근차근" 원칙: 각 카테고리 1번 레슨은 가장 기초, 뒤로 갈수록 심화.
// ─────────────────────────────────────────────────────────────────────────────
import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";

export type Category = "react" | "typescript" | "sass";

export const CATEGORY_LABEL: Record<Category, string> = {
  react: "React",
  typescript: "TypeScript",
  sass: "Sass / SCSS",
};

export const CATEGORY_DESC: Record<Category, string> = {
  react:
    "함수형 컴포넌트의 핵심 — 상태(useState), 사이드이펙트(useEffect), 이벤트, 리스트/조건부 렌더링. 대기업 면접에서 가장 먼저 검증되는 기본기.",
  typescript:
    "props 타입, 인터페이스/타입 별칭, 제네릭, 유틸리티 타입. \"any 안 쓰고 짤 수 있나?\"를 묻는 회사가 많다.",
  sass:
    "변수·중첩·믹스인·@use 모듈 시스템. CSS 변수와 함께 디자인 토큰을 운영하는 패턴까지.",
};

export interface Lesson {
  /** URL용 slug — 현재는 anchor scroll로 사용 */
  id: string;
  category: Category;
  /** 정렬·표시용 번호 */
  no: string;
  title: string;
  /** 한 줄 요약 — 카드 / 목차에 노출 */
  summary: string;
  /** 이 레슨에서 다루는 키워드 */
  keywords: string[];
  /** 라이브 예제 컴포넌트 (lazy) */
  Example: LazyExoticComponent<ComponentType>;
  /** 원본 소스 코드 문자열 — CodeBlock 옆 표시용. 예제 컴포넌트와 동기화하여 유지. */
  code: string;
  /** "왜 이걸 배우나" — 면접/실무 관점 */
  why: string;
  /** 핵심 포인트 (불릿) */
  points: string[];
  /** 자주 하는 실수 / 면접 함정 */
  pitfalls?: string[];
}

// ─── React 레슨들 ───────────────────────────────────────────────────────────
import {
  reactJsxPropsCode,
  reactUseStateCode,
  reactUseEffectCode,
  reactListConditionalCode,
  reactFormCode,
} from "./lessons/react/_sources";

// ─── TypeScript 레슨들 ──────────────────────────────────────────────────────
import {
  tsBasicTypesCode,
  tsInterfaceTypeCode,
  tsPropsTypingCode,
  tsGenericsCode,
  tsUtilityTypesCode,
} from "./lessons/typescript/_sources";

// ─── Sass 레슨들 ────────────────────────────────────────────────────────────
import {
  sassVariablesCode,
  sassMixinCode,
  sassFunctionCode,
  sassModulesCode,
  sassDesignTokensCode,
} from "./lessons/sass/_sources";

export const lessons: Lesson[] = [
  // ───── React ─────
  {
    id: "react-jsx-props",
    category: "react",
    no: "01",
    title: "JSX와 컴포넌트, Props",
    summary:
      "함수형 컴포넌트 = JSX를 반환하는 함수. props로 부모→자식 데이터 전달.",
    keywords: ["JSX", "props", "function component", "children"],
    Example: lazy(() => import("./lessons/react/01_JsxProps")),
    code: reactJsxPropsCode,
    why:
      "모든 React 코드의 출발점. props가 단방향(부모→자식)이라는 것, 그리고 JSX가 결국 React.createElement 호출로 컴파일된다는 사실은 면접 단골 질문.",
    points: [
      "컴포넌트 이름은 PascalCase (소문자로 시작하면 HTML 태그로 해석)",
      "JSX 안에서 자바스크립트 표현식은 { } 로 감싸 사용",
      "props는 읽기 전용 (자식이 직접 수정 X) — 변경하려면 부모가 다시 내려줘야 함",
      "children prop: <Comp>여기</Comp> 안의 내용이 props.children 으로 들어옴",
    ],
    pitfalls: [
      "JSX의 class 가 아닌 className, for 가 아닌 htmlFor 사용",
      "조건부 렌더링에 && 쓸 때 좌변이 0이면 '0'이 그대로 렌더링됨 → Boolean() 으로 감싸거나 삼항 연산자 사용",
    ],
  },
  {
    id: "react-usestate",
    category: "react",
    no: "02",
    title: "useState — 상태 관리의 기본",
    summary:
      "값이 바뀌면 화면이 다시 그려진다. useState 가 React의 가장 기본 약속.",
    keywords: ["useState", "state", "re-render", "immutable update"],
    Example: lazy(() => import("./lessons/react/02_UseState")),
    code: reactUseStateCode,
    why:
      "\"리렌더가 언제 일어나는가\" 를 이해하는 출발점. 상태를 직접 mutate 하면 안 된다는 것은 면접에서 100% 묻는다.",
    points: [
      "setState 호출 = React에게 \"리렌더해줘\"라는 신호",
      "객체/배열은 새 참조로 교체해야 함 — push, splice, prop 변경 X",
      "이전 상태 기반으로 업데이트할 때는 함수형 setter: setCount(c => c + 1)",
      "같은 값을 set 하면 React가 알아서 리렌더를 건너뜀 (Object.is 비교)",
    ],
    pitfalls: [
      "useState(initial) 의 initial은 매 렌더마다 평가됨 — 무거운 계산이면 useState(() => heavy()) 형태로 lazy 초기화",
      "setState 호출 직후 state 값을 읽으면 옛 값이 보임 (다음 렌더에서 반영)",
    ],
  },
  {
    id: "react-useeffect",
    category: "react",
    no: "03",
    title: "useEffect — 사이드 이펙트와 cleanup",
    summary:
      "렌더 바깥의 일(데이터 fetch, 구독, 타이머)을 처리. cleanup 잊으면 메모리 누수.",
    keywords: ["useEffect", "cleanup", "dependency array", "fetch"],
    Example: lazy(() => import("./lessons/react/03_UseEffect")),
    code: reactUseEffectCode,
    why:
      "타이머·구독·이벤트 리스너에서 cleanup을 빠뜨려 메모리 누수를 만드는 게 가장 흔한 버그. dep array의 동작 원리도 면접 빈출.",
    points: [
      "의존성 배열 [] → 마운트 때 1번. [a] → a가 바뀔 때마다. 생략 → 매 렌더마다.",
      "effect 함수가 반환하는 함수가 cleanup — 다음 effect 실행 직전과 언마운트 시점에 호출",
      "fetch에는 AbortController로 cleanup 처리하는 게 권장 (언마운트 후 setState 방지)",
      "React 18 StrictMode 개발 모드에서는 effect가 마운트 시 2번 실행됨 (cleanup이 제대로 되는지 확인 목적)",
    ],
    pitfalls: [
      "deps에 객체/함수 그대로 넣으면 매 렌더마다 새 참조라 매번 실행됨 → useMemo / useCallback / primitive 분해",
      "deps 빼먹으면 stale closure (옛 값을 참조) — ESLint react-hooks/exhaustive-deps 켜둘 것",
    ],
  },
  {
    id: "react-list-conditional",
    category: "react",
    no: "04",
    title: "리스트 렌더링 & 조건부 렌더링",
    summary:
      "배열은 map으로, 분기는 && / 삼항으로. key는 안정적인 ID를 써야 한다.",
    keywords: ["map", "key", "conditional rendering", "Fragment"],
    Example: lazy(() => import("./lessons/react/04_ListConditional")),
    code: reactListConditionalCode,
    why:
      "key 를 index로 쓰면 안 되는 이유, Fragment로 wrapper 줄이는 법은 실무에서 매일 마주친다.",
    points: [
      "map 결과 각 element에 unique key 필요 (형제 사이에서만 unique 하면 됨)",
      "key는 데이터의 안정적인 ID. index는 항목 순서가 절대 안 바뀔 때만",
      "&& 의 좌변에 숫자 0이 오면 그대로 렌더됨 → !!flag && ... 또는 flag ? X : null",
      "여러 노드를 반환할 땐 <>...</> (Fragment) 로 묶기",
    ],
    pitfalls: [
      "key를 index로 잡고 리스트 중간 항목을 삭제하면 React가 \"같은 위치 = 같은 컴포넌트\"로 오인해 입력값이 엉뚱한 행에 남는 버그",
    ],
  },
  {
    id: "react-form",
    category: "react",
    no: "05",
    title: "이벤트 핸들링 & 제어 컴포넌트",
    summary:
      "input의 value를 state로 관리하는 controlled component 패턴.",
    keywords: ["onChange", "controlled", "form", "preventDefault"],
    Example: lazy(() => import("./lessons/react/05_Form")),
    code: reactFormCode,
    why:
      "React에서 폼을 다루는 표준 방식. 검증·포맷팅·서버 전송 전 변환 — 다 state 기반이라 가능.",
    points: [
      "Controlled: <input value={state} onChange={e => setState(e.target.value)} />",
      "form의 onSubmit 안에서 e.preventDefault() — 페이지 새로고침 방지",
      "여러 input을 하나의 핸들러로: e.target.name 으로 분기 (객체 state 사용)",
      "Uncontrolled: ref로 직접 DOM 접근. 파일 업로드 / 외부 라이브러리 통합 때 필요",
    ],
    pitfalls: [
      "value 만 주고 onChange 없으면 readonly 경고. 명시적으로 readOnly 또는 defaultValue 사용",
      "checkbox/radio는 value가 아니라 checked 속성을 제어해야 함",
    ],
  },

  // ───── TypeScript ─────
  {
    id: "ts-basic-types",
    category: "typescript",
    no: "01",
    title: "기본 타입 — 변수에 \"형태\" 입히기",
    summary:
      "string, number, boolean, array, tuple, literal union. TS의 출발점.",
    keywords: ["primitive", "array", "tuple", "literal", "union"],
    Example: lazy(() => import("./lessons/typescript/01_BasicTypes")),
    code: tsBasicTypesCode,
    why:
      "any 와 unknown 의 차이, literal union 의 표현력은 코드의 안정성을 가른다.",
    points: [
      "primitive: string / number / boolean / null / undefined / bigint / symbol",
      "배열: number[] 또는 Array<number>",
      "튜플: 길이와 각 자리 타입이 고정된 배열. [string, number]",
      "리터럴 유니온: type Size = 'sm' | 'md' | 'lg' — enum 대안으로 가장 흔함",
      "any는 검사 OFF, unknown은 \"뭔지 모름 — 쓰기 전에 좁혀라\" (훨씬 안전)",
    ],
    pitfalls: [
      "as 로 강제 단언 남발하면 컴파일러가 못 잡는 런타임 에러 양산",
      "[] as string[] 로 안 쓰면 never[] 로 추론되는 경우가 있음",
    ],
  },
  {
    id: "ts-interface-type",
    category: "typescript",
    no: "02",
    title: "interface vs type — 객체 형태 정의",
    summary:
      "둘 다 객체 모양을 묘사. 차이를 알면 적절한 곳에 쓸 수 있다.",
    keywords: ["interface", "type alias", "extends", "intersection"],
    Example: lazy(() => import("./lessons/typescript/02_InterfaceType")),
    code: tsInterfaceTypeCode,
    why:
      "면접 빈출 \"interface와 type의 차이는?\" — 단순히 문법 차이가 아니라 선언 병합/유니온 표현/확장 방식이 다르다.",
    points: [
      "interface는 선언 병합(같은 이름 여러 번 선언 시 합쳐짐) 가능. type 은 불가",
      "유니온/튜플/원시 타입의 별칭은 type 만 가능: type ID = string | number",
      "확장: interface는 extends, type은 & (intersection)",
      "객체 모양만 정의할 땐 둘 다 OK — 팀 컨벤션에 맞춰 일관성 유지",
    ],
    pitfalls: [
      "라이브러리 d.ts 와 합쳐지길 원하면 interface (전역 augmentation)",
      "복잡한 매핑/조건부 타입에는 type 이 더 유연 (제네릭과 조합)",
    ],
  },
  {
    id: "ts-props-typing",
    category: "typescript",
    no: "03",
    title: "React Props 타이핑",
    summary:
      "함수형 컴포넌트의 props를 interface로 정의. children, optional, default value 패턴.",
    keywords: ["FC", "PropsWithChildren", "optional props", "default props"],
    Example: lazy(() => import("./lessons/typescript/03_PropsTyping")),
    code: tsPropsTypingCode,
    why:
      "실무 TSX 코드의 90%가 props 타이핑. \"FC<P> vs (props: P) => JSX.Element\" 문답도 면접에서 자주 나온다.",
    points: [
      "function Greet({ name }: Props) — 가장 권장되는 형태",
      "선택 prop: name?: string (있으면 string, 없으면 undefined)",
      "기본값: 디스트럭처링에서 { size = 'md' } — Props 타입 자체는 optional 로",
      "children 받기: ReactNode 타입. PropsWithChildren<P> 헬퍼도 있음",
      "이벤트: React.MouseEventHandler<HTMLButtonElement> 또는 (e) => void 직접 지정",
    ],
    pitfalls: [
      "React.FC<P>는 children을 자동 포함했었으나 v18에서 제거됨 — 명시적 children 선언 권장",
      "any를 props 타입으로 두면 TS 의미가 없어짐",
    ],
  },
  {
    id: "ts-generics",
    category: "typescript",
    no: "04",
    title: "제네릭 — 타입을 변수처럼",
    summary:
      "함수/컴포넌트가 \"어떤 타입이든\" 다룰 수 있게. <T> 가 그 변수.",
    keywords: ["generic", "<T>", "extends constraint", "infer"],
    Example: lazy(() => import("./lessons/typescript/04_Generics")),
    code: tsGenericsCode,
    why:
      "useState<T>, Array<T>, Promise<T> — TS 표준 라이브러리는 제네릭 천지. 직접 쓸 줄 알아야 라이브러리 코드도 읽힌다.",
    points: [
      "function first<T>(arr: T[]): T | undefined — 입력 배열의 원소 타입을 그대로 반환",
      "제약: <T extends { id: string }> — T는 id를 가진 객체여야 함",
      "useState<string>('') — 초기값으로 추론이 어려울 때 명시적으로",
      "여러 타입 변수: function pair<A, B>(a: A, b: B): [A, B]",
    ],
    pitfalls: [
      "<T> 를 한 번만 쓰면 사실상 any 와 차이가 없다 — 입력↔출력 관계가 있을 때 의미가 생김",
      "리액트 컴포넌트 제네릭은 <T,>(props: ...) — TSX 파싱 모호성 회피용 comma",
    ],
  },
  {
    id: "ts-utility-types",
    category: "typescript",
    no: "05",
    title: "유틸리티 타입 — Partial / Pick / Omit / Record",
    summary:
      "기존 타입에서 새 타입을 \"파생\". 중복 선언 줄이고 안전성은 유지.",
    keywords: ["Partial", "Pick", "Omit", "Record", "Required"],
    Example: lazy(() => import("./lessons/typescript/05_UtilityTypes")),
    code: tsUtilityTypesCode,
    why:
      "User → UserUpdateInput (모든 필드 optional), User → UserPreview (일부 필드만) 같은 변환을 매일 한다.",
    points: [
      "Partial<T>: 모든 prop 을 optional 로",
      "Required<T>: 모든 prop 을 필수로",
      "Pick<T, K>: T에서 K 키들만 골라낸 타입",
      "Omit<T, K>: T에서 K 키들만 제외한 타입",
      "Record<K, V>: 키 K, 값 V 인 객체 타입. { [k: K]: V } 의 단축",
      "ReturnType<F>, Parameters<F>: 함수 시그니처에서 추출",
    ],
    pitfalls: [
      "Partial<T> 가 깊은(deep) Partial 이 아닌 점 주의 — 중첩 객체 안쪽은 그대로 필수",
      "as const 와 typeof 를 조합하면 객체 → 리터럴 유니온으로 변환 가능 (자주 쓰는 트릭)",
    ],
  },

  // ───── Sass ─────
  {
    id: "sass-variables",
    category: "sass",
    no: "01",
    title: "변수와 중첩 — Sass의 기본",
    summary:
      "$변수로 값 재사용, 중첩으로 셀렉터 계층 표현. &로 부모 참조.",
    keywords: ["$variable", "nesting", "&", "BEM"],
    Example: lazy(() => import("./lessons/sass/01_Variables")),
    code: sassVariablesCode,
    why:
      "이 두 가지만 알아도 평범한 CSS 의 반복이 절반으로 줄어든다. & 셀렉터는 BEM 작성의 핵심.",
    points: [
      "$변수: 컴파일 타임 상수. ` --css-var` 와는 다름 (CSS 변수는 런타임)",
      "중첩으로 .parent .child 를 계층 그대로 작성",
      "& 는 부모 셀렉터 참조. .btn { &:hover, &--primary, .parent & } 모두 가능",
      "중첩은 3~4 레벨 이상 가지 말 것 — 셀렉터 specificity 폭발",
    ],
    pitfalls: [
      "$변수는 테마 전환 불가 (컴파일 시점에 박힘) — 테마는 CSS 변수로",
      "& 셀렉터를 BEM과 섞어 쓸 때 &__elem, &--modifier 패턴이 가장 흔함",
    ],
  },
  {
    id: "sass-mixin",
    category: "sass",
    no: "02",
    title: "Mixin — 재사용 가능한 스타일 블록",
    summary:
      "@mixin 으로 묶고 @include 로 펴낸다. 인자로 동적 스타일도.",
    keywords: ["@mixin", "@include", "argument", "@content"],
    Example: lazy(() => import("./lessons/sass/02_Mixin")),
    code: sassMixinCode,
    why:
      "media query, flex 정렬, 버튼 variant — 반복되는 스타일 패턴을 mixin 으로 추출하는 게 SCSS 활용의 핵심.",
    points: [
      "@mixin name($arg) { ... } — 인자 받을 수 있음, default 값 지정 가능",
      "@include name(value);",
      "@content: mixin 안에 호출자의 스타일 블록을 끼워넣을 자리",
      "미디어 쿼리 mixin이 가장 흔한 사용처: @include mobile { ... }",
    ],
    pitfalls: [
      "mixin은 호출할 때마다 코드가 복제됨 — 자주 쓰는 패턴은 @extend 도 고려 (단, @extend 는 셀렉터 합쳐서 부작용 있을 수 있음)",
    ],
  },
  {
    id: "sass-function",
    category: "sass",
    no: "03",
    title: "함수 & 연산 — 값 계산하기",
    summary:
      "@function 으로 값 계산해서 반환. 색상 함수, math 모듈도 활용.",
    keywords: ["@function", "math.div", "color.adjust", "calc()"],
    Example: lazy(() => import("./lessons/sass/03_Function")),
    code: sassFunctionCode,
    why:
      "spacing 8px 베이스로 step 계산, 색상 lighten/darken, rem 변환 — 디자인 시스템 구현의 단골 도구.",
    points: [
      "@function rem($px) { @return math.div($px, 16) * 1rem; }",
      "Sass 1.x: / 는 더 이상 나눗셈이 아님 → math.div 사용 (@use 'sass:math')",
      "color 함수: color.adjust($c, $lightness: 10%) 로 명도 조절",
      "런타임 값이 섞이면 calc() 가 정답: calc(100vh - #{$header-height})",
    ],
    pitfalls: [
      "Sass 함수와 CSS 함수 혼동 주의 — Sass의 calc는 컴파일 시 계산, CSS의 calc는 브라우저에서 계산",
    ],
  },
  {
    id: "sass-modules",
    category: "sass",
    no: "04",
    title: "@use / @forward — 모듈 시스템",
    summary:
      "@import 는 deprecated. @use 로 네임스페이스 있게 가져오기.",
    keywords: ["@use", "@forward", "namespace", "as *"],
    Example: lazy(() => import("./lessons/sass/04_Modules")),
    code: sassModulesCode,
    why:
      "큰 SCSS 프로젝트의 표준 구조. 어디서 무엇이 오는지 명확해진다. Webpack/Vite 빌드 속도도 향상.",
    points: [
      "@use '경로'; → 파일명 네임스페이스로 등록 (variables.scss → variables.$primary)",
      "@use '경로' as v; → 별칭",
      "@use '경로' as *; → 네임스페이스 생략 (충돌 위험 있어 신중히)",
      "@forward: 다른 파일을 \"중계\" — index.scss 패턴",
      "변수에 ! default 를 붙이면 \"덮어쓰기 허용\" — 테마 설정 패턴",
    ],
    pitfalls: [
      "@use 는 같은 파일을 여러 번 불러와도 1번만 컴파일 (좋은 점)",
      "@import 와 @use 를 섞으면 변수 스코프가 헷갈림 — 한 프로젝트에선 하나만",
    ],
  },
  {
    id: "sass-design-tokens",
    category: "sass",
    no: "05",
    title: "디자인 토큰 — Sass + CSS 변수 조합",
    summary:
      "값은 CSS 변수로(테마 전환), 함수/믹스인은 Sass로. 둘의 역할 분리.",
    keywords: ["design token", "CSS variable", "data-theme", "dark mode"],
    Example: lazy(() => import("./lessons/sass/05_DesignTokens")),
    code: sassDesignTokensCode,
    why:
      "이 포트폴리오 사이트도 이 패턴이다. 다크모드 토글은 [data-theme=\"dark\"] 의 CSS 변수만 갈아끼우면 끝.",
    points: [
      ":root 에 라이트 토큰, [data-theme=\"dark\"] 에 다크 토큰",
      "Sass mixin이 var(--text), var(--bg) 를 사용 → 한 mixin 으로 양쪽 테마 대응",
      "토큰 이름은 의미(semantic): --text-primary 가 --gray-900 보다 좋음",
      "transition: background 0.3s, color 0.3s — 테마 전환 시 부드럽게",
    ],
    pitfalls: [
      "border-color 처럼 단축 속성에서 일부만 transition 하려면 개별 속성 명시",
      "사용자 OS 다크모드 자동 감지는 @media (prefers-color-scheme: dark) 와 조합",
    ],
  },
];

/*
  getLessonsByCategory — 카테고리 하나를 받아서 그 카테고리에 속한 레슨들을
                         번호(no) 오름차순으로 정렬해 돌려준다.

  ─── 한 줄씩 풀어보기 ─────────────────────────────────────────────────────

  export const getLessonsByCategory
    · export    : 이 함수를 다른 파일에서 import 해서 쓰겠다고 공개.
    · const     : 한 번 정의하면 다시 대입 불가 (함수 자체를 재할당 못 함).
    · 이름      : "getX" 패턴 — 무언가를 가져오는 함수임을 이름으로 표현.

  = (cat: Category): Lesson[] =>
    · = (...) => ... : "화살표 함수(arrow function)" 문법.
                       function 키워드 없이 함수를 만드는 짧은 표기.
    · cat            : 매개변수 이름. 호출 시 받는 값 (예: "react").
    · : Category     : TypeScript 타입. cat 은 "react" | "typescript" | "sass"
                       중 하나여야 한다 (registry.ts 위쪽 type Category 참조).
    · : Lesson[]     : 화살표 오른쪽의 콜론은 "반환 타입" 표기.
                       이 함수가 Lesson 객체들의 배열을 반환한다고 약속.

  본문이 중괄호 없이 한 줄짜리 → "암묵적 반환".
    화살표 함수는 본문이 { } 없이 식 하나면, 그 식의 결과가 자동으로 return 된다.
    아래 두 코드는 동일:

      const f = (x) => x * 2;
      const f = (x) => { return x * 2; };

  ─── 본문: 체이닝(chaining) ───────────────────────────────────────────────
  lessons.filter((l) => l.category === cat).sort((a, b) => a.no.localeCompare(b.no))

    lessons
      → registry 의 전체 레슨 배열 (React+TS+Sass 다 섞여있음).

    .filter((l) => l.category === cat)
      → 배열에서 "조건을 만족하는 원소만" 추려 새 배열을 반환하는 메서드.
        · 콜백 (l) => ... 가 각 원소마다 한 번씩 호출된다.
        · l 은 배열의 한 원소(Lesson 객체). 이름은 자유.
        · l.category === cat 가 true 인 원소만 결과 배열에 포함.
        · === 는 "엄격한 같음" 비교 (타입까지 같아야 true).
        · 결과: 받은 cat 에 해당하는 레슨들만 담긴 새 배열.
        · 중요한 점 — filter 는 새 배열을 반환한다 (원본 lessons 는 안 건드림).

    .sort((a, b) => a.no.localeCompare(b.no))
      → 위에서 추려진 새 배열을 "no" 문자열 기준으로 오름차순 정렬.
        · 비교함수 (a, b) => ... 가 두 원소를 비교.
          · 음수 → a 가 앞 / 양수 → a 가 뒤 / 0 → 순서 유지.
        · a.no.localeCompare(b.no)
          : 문자열을 사전식으로 비교하는 String 메서드.
            "01" < "02" → 음수 반환, sort 의 형식과 정확히 일치.
            no 가 number 였다면 a.no - b.no 로 간단히 비교 가능했겠지만,
            여기서는 "01", "02" 같은 문자열이라 localeCompare 사용.
        · 보통 sort 는 원본을 변경하지만 여기서는 안전하다 —
          filter 가 이미 "새 배열" 을 만들어줬기 때문.
          (그래서 [...lessons] 같은 별도 복사가 필요 없음.)

  ─── 흐름 그림 ────────────────────────────────────────────────────────────
    lessons (전체 15개)
      │  .filter(l.category === "react")
      ▼
    [react 레슨 5개] (새 배열, 순서는 등록 순서 그대로)
      │  .sort(no 오름차순)
      ▼
    [react 레슨 5개, 01 → 02 → 03 → 04 → 05]
      │  return
      ▼
    호출한 쪽 (StudyPage 의 탭 전환 로직)

  ─── 사용 예 ─────────────────────────────────────────────────────────────
    const reactLessons = getLessonsByCategory("react");
    // → 번호순 정렬된 React 레슨 5개
*/
export const getLessonsByCategory = (cat: Category): Lesson[] =>
  lessons.filter((l) => l.category === cat).sort((a, b) => a.no.localeCompare(b.no));
