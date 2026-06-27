const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/01_JsxProps-CZCY6_fm.js","assets/index-D5znGMJm.js","assets/index-B8FFVlWb.css","assets/02_UseState-DFSkqA6Q.js","assets/03_UseEffect-Bxo6uKcz.js","assets/04_ListConditional-DhjYwXF0.js","assets/05_Form-CIpbjN2V.js","assets/01_BasicTypes-BMs7U_nV.js","assets/02_InterfaceType-sjOTci2B.js","assets/03_PropsTyping-CP_iYB_S.js","assets/04_Generics-VslMtl2Y.js","assets/05_UtilityTypes-B3081Mtq.js","assets/01_Variables-C1OqwiXQ.js","assets/01_Variables-ikzRC6gv.css","assets/02_Mixin-DblZjWlm.js","assets/02_Mixin-D6zn_oce.css","assets/03_Function-Cte1AHIX.js","assets/03_Function-BgPMDpqp.css","assets/04_Modules-C3a0ifRv.js","assets/04_Modules-B15BkHVH.css","assets/05_DesignTokens-Byb5l8pF.js","assets/05_DesignTokens-BwVr9MRr.css"])))=>i.map(i=>d[i]);
import{r as a,_ as n,j as e,A as c,a as l}from"./index-D5znGMJm.js";const p=`// JSX는 결국 React.createElement 호출로 컴파일된다.
// 함수형 컴포넌트 = JSX 를 반환하는 함수.

interface GreetProps {
  name: string;
  age?: number;        // optional prop
}

function Greet({ name, age }: GreetProps) {
  return (
    <div>
      <p>안녕하세요, <strong>{name}</strong> 님!</p>
      {age !== undefined && <p>나이: {age}살</p>}
    </div>
  );
}

// children prop — 컴포넌트 태그 안의 내용
function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>;
}

export default function Example() {
  return (
    <Card>
      <Greet name="정한석" age={34} />
      <Greet name="익명" />
    </Card>
  );
}`,u=`import { useState } from "react";

// useState 호출 = "이 컴포넌트가 기억해야 할 값" 등록.
// set 함수를 호출하면 React가 컴포넌트를 다시 렌더한다.

export default function Counter() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");

  // 이전 상태 기반 업데이트는 함수형 setter 사용 권장
  const inc = () => setCount((c) => c + 1);
  const dec = () => setCount((c) => c - 1);
  const reset = () => setCount(0);

  return (
    <div>
      <h4>카운터: {count}</h4>
      <button onClick={inc}>+1</button>
      <button onClick={dec}>-1</button>
      <button onClick={reset}>리셋</button>

      <hr />

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름을 입력"
      />
      <p>{name ? \`반가워요, \${name}!\` : "이름을 입력하세요."}</p>
    </div>
  );
}`,m=`import { useEffect, useState } from "react";

// effect = "렌더 후에 실행되는 사이드 이펙트".
// cleanup 함수 반환으로 다음 effect 직전/언마운트 시 정리한다.

export default function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    // cleanup: setInterval로 등록한 타이머를 해제.
    // 빠뜨리면 컴포넌트 언마운트 후에도 계속 동작 = 메모리 누수.
    return () => clearInterval(id);
  }, [running]); // running 이 바뀔 때마다 effect 재실행

  return (
    <div>
      <h4>경과 시간: {seconds}초</h4>
      <button onClick={() => setRunning((r) => !r)}>
        {running ? "정지" : "재개"}
      </button>
      <button onClick={() => setSeconds(0)}>리셋</button>
    </div>
  );
}`,y=`import { useState } from "react";

interface Todo {
  id: number;        // ← key 에 쓸 안정적인 ID
  text: string;
  done: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "React 공부", done: true },
    { id: 2, text: "TypeScript 공부", done: false },
    { id: 3, text: "Sass 공부", done: false },
  ]);

  const toggle = (id: number) =>
    setTodos((arr) =>
      arr.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div>
      {/* 조건부 렌더링 — 삼항 / && */}
      {remaining === 0 ? (
        <p>모두 끝났습니다! 🎉</p>
      ) : (
        <p>남은 작업: {remaining}개</p>
      )}

      {/* 리스트 렌더링 — key 는 index 가 아니라 안정적인 ID */}
      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            <label>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggle(t.id)}
              />
              <span style={{ textDecoration: t.done ? "line-through" : "none" }}>
                {t.text}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}`,f=`import { useState } from "react";

interface FormState {
  name: string;
  email: string;
  agreed: boolean;
}

export default function SignUpForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    agreed: false,
  });
  const [submitted, setSubmitted] = useState<FormState | null>(null);

  // name 으로 분기하는 통합 핸들러 — 입력이 많을 때 깔끔.
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 페이지 새로고침 방지!
    setSubmitted(form);
  };

  return (
    <form onSubmit={onSubmit}>
      <label>
        이름{" "}
        <input name="name" value={form.name} onChange={onChange} required />
      </label>
      <label>
        이메일{" "}
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          required
        />
      </label>
      <label>
        <input
          name="agreed"
          type="checkbox"
          checked={form.agreed}
          onChange={onChange}
        />
        약관에 동의합니다
      </label>
      <button type="submit" disabled={!form.agreed}>
        제출
      </button>

      {submitted && (
        <pre>제출됨: {JSON.stringify(submitted, null, 2)}</pre>
      )}
    </form>
  );
}`,b=`// 1) primitive 타입
const userName: string = "정한석";
const age: number = 34;
const isActive: boolean = true;

// 2) 배열 / 튜플
const tags: string[] = ["react", "ts", "sass"];
const point: [number, number] = [10, 20]; // 길이 고정

// 3) 리터럴 유니온 — enum 대신 가장 흔하게 쓰임
type Size = "sm" | "md" | "lg";
const size: Size = "md";

// 4) any 는 검사 OFF, unknown 은 "쓰기 전에 좁혀라"
function safeParse(input: unknown): number {
  if (typeof input === "number") return input;
  if (typeof input === "string") return Number(input);
  return 0;
}

// 5) 함수 타입
type Add = (a: number, b: number) => number;
const add: Add = (a, b) => a + b;

export default function Demo() {
  return (
    <ul>
      <li>name: {userName} ({typeof userName})</li>
      <li>tags: {tags.join(", ")}</li>
      <li>size: {size}</li>
      <li>safeParse('42'): {safeParse('42')}</li>
      <li>add(3,4): {add(3,4)}</li>
    </ul>
  );
}`,x=`// interface 와 type 모두 객체 형태를 묘사할 수 있다.
interface UserI {
  id: string;
  name: string;
}

type UserT = {
  id: string;
  name: string;
};

// 확장 방식 차이
interface AdminI extends UserI {
  role: "admin";
}
type AdminT = UserT & { role: "admin" };

// 유니온 / 튜플 / 리터럴은 type 만 가능
type ID = string | number;
type Point = [number, number];

// 선언 병합 — interface 만 가능 (라이브러리 d.ts 확장에 유용)
interface Window {
  __MY_FLAG__?: boolean;
}

const admin: AdminI = { id: "u1", name: "Hs", role: "admin" };
const id1: ID = "abc";
const id2: ID = 42;`,g=`import type { ReactNode } from "react";

interface ButtonProps {
  label: string;
  variant?: "primary" | "ghost";   // optional
  disabled?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}

// 디스트럭처링에서 default 값으로 \`variant\` 기본값 부여
function Button({
  label,
  variant = "primary",
  disabled,
  onClick,
  children,
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
    >
      {label}
      {children}
    </button>
  );
}

export default function Demo() {
  return (
    <div>
      <Button label="저장" />
      <Button label="취소" variant="ghost" />
      <Button label="제출" disabled />
    </div>
  );
}`,h=`// 1) 함수 제네릭 — 입력 타입과 반환 타입의 관계를 표현
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

// 2) 제약 (constraint) — T 가 id 를 가져야 함
function byId<T extends { id: string }>(arr: T[], id: string): T | undefined {
  return arr.find((x) => x.id === id);
}

// 3) 여러 타입 변수
function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}

// 사용
const n = first([1, 2, 3]);          // number | undefined
const s = first(["a", "b"]);         // string | undefined

interface Todo { id: string; text: string; }
const todos: Todo[] = [
  { id: "t1", text: "공부" },
  { id: "t2", text: "운동" },
];
const found = byId(todos, "t2");      // Todo | undefined

const tup = pair("size", 12);         // [string, number]`,_=`interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

// Partial — 모든 prop optional. PATCH 요청 body 타이핑에 자주 사용.
type UserUpdate = Partial<User>;
const update: UserUpdate = { name: "정한석" }; // OK

// Pick — 일부만 골라내기
type UserPreview = Pick<User, "id" | "name">;
const preview: UserPreview = { id: "u1", name: "Hs" };

// Omit — 일부만 빼기 (Pick 의 반대)
type UserCreate = Omit<User, "id">;            // 서버가 id 생성, 클라이언트는 id 없이 보냄
const draft: UserCreate = {
  name: "Hs", email: "a@b.c", age: 34,
};

// Record — 키/값 쌍 객체
type Role = "admin" | "editor" | "viewer";
const labels: Record<Role, string> = {
  admin: "관리자", editor: "에디터", viewer: "구독자",
};

// Required — 다 필수로
type StrictUpdate = Required<UserUpdate>;       // 다시 User 와 동일

// ReturnType — 함수 반환 타입 추출
function makeUser() { return { id: "u1", name: "Hs" }; }
type MadeUser = ReturnType<typeof makeUser>;`,v=`// _variables.scss
// 1) $변수 — 컴파일 타임 상수
$primary: #2563eb;
$radius: 6px;
$gap: 12px;

// 2) 중첩 + & (부모 셀렉터 참조)
.sass-card {
  padding: 16px;
  border: 2px solid $primary;
  border-radius: $radius;
  display: flex;
  gap: $gap;
  align-items: center;

  // & 는 부모(.sass-card) 자리에 들어감.
  // 컴파일 결과: .sass-card:hover { ... }
  &:hover {
    background: rgba($primary, 0.05);
  }

  // .sass-card--primary
  &--primary {
    background: $primary;
    color: #fff;
  }

  // .sass-card .sass-card__label
  &__label {
    font-weight: 600;
    color: $primary;
  }
}`,S=`// _mixin.scss
@mixin flex-center($gap: 8px) {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $gap;
}

// 미디어 쿼리 mixin — 가장 자주 쓰이는 패턴
@mixin mobile {
  @media (max-width: 768px) {
    @content;   // ← 호출자의 블록이 여기에 끼워짐
  }
}

// 버튼 variant mixin
@mixin button-style($bg, $color: #fff) {
  background: $bg;
  color: $color;
  border: 0;
  padding: 10px 18px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover { opacity: 0.85; }
}

// 사용
.sass-toolbar {
  @include flex-center(12px);
  padding: 12px;

  @include mobile {
    flex-direction: column;
    gap: 8px;
  }
}

.sass-btn--primary { @include button-style(#2563eb); }
.sass-btn--danger  { @include button-style(#dc2626); }
.sass-btn--ghost   { @include button-style(transparent, #2563eb); }`,k=`@use 'sass:math';
@use 'sass:color';

// rem() — px 값을 받아 rem 단위로 반환
@function rem($px, $base: 16) {
  @return math.div($px, $base) * 1rem;
}

// spacing — 4의 배수 step 시스템 (디자인 시스템 단골)
@function space($step) {
  @return $step * 4px;
}

$brand: #2563eb;

.sass-fn-demo {
  // 함수 호출
  padding: space(4) space(6);          // 16px 24px
  font-size: rem(18);                  // 1.125rem
  border-radius: rem(8);               // 0.5rem

  // 색상 함수 — 명도 / 채도 조절
  border: 2px solid color.adjust($brand, $lightness: -10%);
  background: color.adjust($brand, $lightness: 45%);

  // 런타임 값이 섞이면 calc() 사용
  height: calc(100% - #{space(2)});
}`,C=`// _tokens.scss
$primary: #2563eb !default;        // !default → 외부에서 덮어쓰기 허용
$radius: 8px !default;

// _mixins.scss
@use 'tokens' as t;

@mixin card {
  border: 2px solid t.$primary;
  border-radius: t.$radius;
  padding: 16px;
}

// main.scss — 진입점
@use 'tokens' as t;
@use 'mixins' as m;

.sass-module-demo {
  @include m.card;

  color: t.$primary;
}

// 다른 파일에서 토큰을 덮어쓰며 가져오기
// @use 'tokens' as t with ($primary: #dc2626);
//
// @forward 패턴 (index.scss)
// @forward 'tokens';
// @forward 'mixins';
// → 이 한 파일만 @use 하면 둘 다 사용 가능`,T=`// 1) :root 에 라이트 토큰. body[data-theme="dark"] 에 다크 오버라이드.
:root {
  --bg: #ffffff;
  --text: #1a1a1a;
  --muted: #666666;
  --brand: #2563eb;
}

body[data-theme="dark"] {
  --bg: #0a0a0a;
  --text: #ffffff;
  --muted: #999999;
  --brand: #60a5fa;
}

// 2) Sass mixin 은 토큰의 var() 를 참조.
//    → 한 mixin 으로 양쪽 테마에 자동 대응.
@mixin themed-surface {
  background: var(--bg);
  color: var(--text);
  border: 1px solid var(--muted);
  transition: background 0.3s, color 0.3s, border-color 0.3s;
}

.sass-token-demo {
  @include themed-surface;
  padding: 16px;
  border-radius: 8px;

  strong { color: var(--brand); }
}

// 3) 토글은 JS 한 줄:
//    document.body.dataset.theme = "dark"
//    → :root 의 변수가 그대로 갈아끼워지므로 별도 클래스 수정 불필요.`,E={react:"React",typescript:"TypeScript",sass:"Sass / SCSS"},j={react:"함수형 컴포넌트의 핵심 — 상태(useState), 사이드이펙트(useEffect), 이벤트, 리스트/조건부 렌더링. 대기업 면접에서 가장 먼저 검증되는 기본기.",typescript:'props 타입, 인터페이스/타입 별칭, 제네릭, 유틸리티 타입. "any 안 쓰고 짤 수 있나?"를 묻는 회사가 많다.',sass:"변수·중첩·믹스인·@use 모듈 시스템. CSS 변수와 함께 디자인 토큰을 운영하는 패턴까지."},w=[{id:"react-jsx-props",category:"react",no:"01",title:"JSX와 컴포넌트, Props",summary:"함수형 컴포넌트 = JSX를 반환하는 함수. props로 부모→자식 데이터 전달.",keywords:["JSX","props","function component","children"],Example:a.lazy(()=>n(()=>import("./01_JsxProps-CZCY6_fm.js"),__vite__mapDeps([0,1,2]))),code:p,why:"모든 React 코드의 출발점. props가 단방향(부모→자식)이라는 것, 그리고 JSX가 결국 React.createElement 호출로 컴파일된다는 사실은 면접 단골 질문.",points:["컴포넌트 이름은 PascalCase (소문자로 시작하면 HTML 태그로 해석)","JSX 안에서 자바스크립트 표현식은 { } 로 감싸 사용","props는 읽기 전용 (자식이 직접 수정 X) — 변경하려면 부모가 다시 내려줘야 함","children prop: <Comp>여기</Comp> 안의 내용이 props.children 으로 들어옴"],pitfalls:["JSX의 class 가 아닌 className, for 가 아닌 htmlFor 사용","조건부 렌더링에 && 쓸 때 좌변이 0이면 '0'이 그대로 렌더링됨 → Boolean() 으로 감싸거나 삼항 연산자 사용"]},{id:"react-usestate",category:"react",no:"02",title:"useState — 상태 관리의 기본",summary:"값이 바뀌면 화면이 다시 그려진다. useState 가 React의 가장 기본 약속.",keywords:["useState","state","re-render","immutable update"],Example:a.lazy(()=>n(()=>import("./02_UseState-DFSkqA6Q.js"),__vite__mapDeps([3,1,2]))),code:u,why:'"리렌더가 언제 일어나는가" 를 이해하는 출발점. 상태를 직접 mutate 하면 안 된다는 것은 면접에서 100% 묻는다.',points:['setState 호출 = React에게 "리렌더해줘"라는 신호',"객체/배열은 새 참조로 교체해야 함 — push, splice, prop 변경 X","이전 상태 기반으로 업데이트할 때는 함수형 setter: setCount(c => c + 1)","같은 값을 set 하면 React가 알아서 리렌더를 건너뜀 (Object.is 비교)"],pitfalls:["useState(initial) 의 initial은 매 렌더마다 평가됨 — 무거운 계산이면 useState(() => heavy()) 형태로 lazy 초기화","setState 호출 직후 state 값을 읽으면 옛 값이 보임 (다음 렌더에서 반영)"]},{id:"react-useeffect",category:"react",no:"03",title:"useEffect — 사이드 이펙트와 cleanup",summary:"렌더 바깥의 일(데이터 fetch, 구독, 타이머)을 처리. cleanup 잊으면 메모리 누수.",keywords:["useEffect","cleanup","dependency array","fetch"],Example:a.lazy(()=>n(()=>import("./03_UseEffect-Bxo6uKcz.js"),__vite__mapDeps([4,1,2]))),code:m,why:"타이머·구독·이벤트 리스너에서 cleanup을 빠뜨려 메모리 누수를 만드는 게 가장 흔한 버그. dep array의 동작 원리도 면접 빈출.",points:["의존성 배열 [] → 마운트 때 1번. [a] → a가 바뀔 때마다. 생략 → 매 렌더마다.","effect 함수가 반환하는 함수가 cleanup — 다음 effect 실행 직전과 언마운트 시점에 호출","fetch에는 AbortController로 cleanup 처리하는 게 권장 (언마운트 후 setState 방지)","React 18 StrictMode 개발 모드에서는 effect가 마운트 시 2번 실행됨 (cleanup이 제대로 되는지 확인 목적)"],pitfalls:["deps에 객체/함수 그대로 넣으면 매 렌더마다 새 참조라 매번 실행됨 → useMemo / useCallback / primitive 분해","deps 빼먹으면 stale closure (옛 값을 참조) — ESLint react-hooks/exhaustive-deps 켜둘 것"]},{id:"react-list-conditional",category:"react",no:"04",title:"리스트 렌더링 & 조건부 렌더링",summary:"배열은 map으로, 분기는 && / 삼항으로. key는 안정적인 ID를 써야 한다.",keywords:["map","key","conditional rendering","Fragment"],Example:a.lazy(()=>n(()=>import("./04_ListConditional-DhjYwXF0.js"),__vite__mapDeps([5,1,2]))),code:y,why:"key 를 index로 쓰면 안 되는 이유, Fragment로 wrapper 줄이는 법은 실무에서 매일 마주친다.",points:["map 결과 각 element에 unique key 필요 (형제 사이에서만 unique 하면 됨)","key는 데이터의 안정적인 ID. index는 항목 순서가 절대 안 바뀔 때만","&& 의 좌변에 숫자 0이 오면 그대로 렌더됨 → !!flag && ... 또는 flag ? X : null","여러 노드를 반환할 땐 <>...</> (Fragment) 로 묶기"],pitfalls:['key를 index로 잡고 리스트 중간 항목을 삭제하면 React가 "같은 위치 = 같은 컴포넌트"로 오인해 입력값이 엉뚱한 행에 남는 버그']},{id:"react-form",category:"react",no:"05",title:"이벤트 핸들링 & 제어 컴포넌트",summary:"input의 value를 state로 관리하는 controlled component 패턴.",keywords:["onChange","controlled","form","preventDefault"],Example:a.lazy(()=>n(()=>import("./05_Form-CIpbjN2V.js"),__vite__mapDeps([6,1,2]))),code:f,why:"React에서 폼을 다루는 표준 방식. 검증·포맷팅·서버 전송 전 변환 — 다 state 기반이라 가능.",points:["Controlled: <input value={state} onChange={e => setState(e.target.value)} />","form의 onSubmit 안에서 e.preventDefault() — 페이지 새로고침 방지","여러 input을 하나의 핸들러로: e.target.name 으로 분기 (객체 state 사용)","Uncontrolled: ref로 직접 DOM 접근. 파일 업로드 / 외부 라이브러리 통합 때 필요"],pitfalls:["value 만 주고 onChange 없으면 readonly 경고. 명시적으로 readOnly 또는 defaultValue 사용","checkbox/radio는 value가 아니라 checked 속성을 제어해야 함"]},{id:"ts-basic-types",category:"typescript",no:"01",title:'기본 타입 — 변수에 "형태" 입히기',summary:"string, number, boolean, array, tuple, literal union. TS의 출발점.",keywords:["primitive","array","tuple","literal","union"],Example:a.lazy(()=>n(()=>import("./01_BasicTypes-BMs7U_nV.js"),__vite__mapDeps([7,1,2]))),code:b,why:"any 와 unknown 의 차이, literal union 의 표현력은 코드의 안정성을 가른다.",points:["primitive: string / number / boolean / null / undefined / bigint / symbol","배열: number[] 또는 Array<number>","튜플: 길이와 각 자리 타입이 고정된 배열. [string, number]","리터럴 유니온: type Size = 'sm' | 'md' | 'lg' — enum 대안으로 가장 흔함",'any는 검사 OFF, unknown은 "뭔지 모름 — 쓰기 전에 좁혀라" (훨씬 안전)'],pitfalls:["as 로 강제 단언 남발하면 컴파일러가 못 잡는 런타임 에러 양산","[] as string[] 로 안 쓰면 never[] 로 추론되는 경우가 있음"]},{id:"ts-interface-type",category:"typescript",no:"02",title:"interface vs type — 객체 형태 정의",summary:"둘 다 객체 모양을 묘사. 차이를 알면 적절한 곳에 쓸 수 있다.",keywords:["interface","type alias","extends","intersection"],Example:a.lazy(()=>n(()=>import("./02_InterfaceType-sjOTci2B.js"),__vite__mapDeps([8,1,2]))),code:x,why:'면접 빈출 "interface와 type의 차이는?" — 단순히 문법 차이가 아니라 선언 병합/유니온 표현/확장 방식이 다르다.',points:["interface는 선언 병합(같은 이름 여러 번 선언 시 합쳐짐) 가능. type 은 불가","유니온/튜플/원시 타입의 별칭은 type 만 가능: type ID = string | number","확장: interface는 extends, type은 & (intersection)","객체 모양만 정의할 땐 둘 다 OK — 팀 컨벤션에 맞춰 일관성 유지"],pitfalls:["라이브러리 d.ts 와 합쳐지길 원하면 interface (전역 augmentation)","복잡한 매핑/조건부 타입에는 type 이 더 유연 (제네릭과 조합)"]},{id:"ts-props-typing",category:"typescript",no:"03",title:"React Props 타이핑",summary:"함수형 컴포넌트의 props를 interface로 정의. children, optional, default value 패턴.",keywords:["FC","PropsWithChildren","optional props","default props"],Example:a.lazy(()=>n(()=>import("./03_PropsTyping-CP_iYB_S.js"),__vite__mapDeps([9,1,2]))),code:g,why:'실무 TSX 코드의 90%가 props 타이핑. "FC<P> vs (props: P) => JSX.Element" 문답도 면접에서 자주 나온다.',points:["function Greet({ name }: Props) — 가장 권장되는 형태","선택 prop: name?: string (있으면 string, 없으면 undefined)","기본값: 디스트럭처링에서 { size = 'md' } — Props 타입 자체는 optional 로","children 받기: ReactNode 타입. PropsWithChildren<P> 헬퍼도 있음","이벤트: React.MouseEventHandler<HTMLButtonElement> 또는 (e) => void 직접 지정"],pitfalls:["React.FC<P>는 children을 자동 포함했었으나 v18에서 제거됨 — 명시적 children 선언 권장","any를 props 타입으로 두면 TS 의미가 없어짐"]},{id:"ts-generics",category:"typescript",no:"04",title:"제네릭 — 타입을 변수처럼",summary:'함수/컴포넌트가 "어떤 타입이든" 다룰 수 있게. <T> 가 그 변수.',keywords:["generic","<T>","extends constraint","infer"],Example:a.lazy(()=>n(()=>import("./04_Generics-VslMtl2Y.js"),__vite__mapDeps([10,1,2]))),code:h,why:"useState<T>, Array<T>, Promise<T> — TS 표준 라이브러리는 제네릭 천지. 직접 쓸 줄 알아야 라이브러리 코드도 읽힌다.",points:["function first<T>(arr: T[]): T | undefined — 입력 배열의 원소 타입을 그대로 반환","제약: <T extends { id: string }> — T는 id를 가진 객체여야 함","useState<string>('') — 초기값으로 추론이 어려울 때 명시적으로","여러 타입 변수: function pair<A, B>(a: A, b: B): [A, B]"],pitfalls:["<T> 를 한 번만 쓰면 사실상 any 와 차이가 없다 — 입력↔출력 관계가 있을 때 의미가 생김","리액트 컴포넌트 제네릭은 <T,>(props: ...) — TSX 파싱 모호성 회피용 comma"]},{id:"ts-utility-types",category:"typescript",no:"05",title:"유틸리티 타입 — Partial / Pick / Omit / Record",summary:'기존 타입에서 새 타입을 "파생". 중복 선언 줄이고 안전성은 유지.',keywords:["Partial","Pick","Omit","Record","Required"],Example:a.lazy(()=>n(()=>import("./05_UtilityTypes-B3081Mtq.js"),__vite__mapDeps([11,1,2]))),code:_,why:"User → UserUpdateInput (모든 필드 optional), User → UserPreview (일부 필드만) 같은 변환을 매일 한다.",points:["Partial<T>: 모든 prop 을 optional 로","Required<T>: 모든 prop 을 필수로","Pick<T, K>: T에서 K 키들만 골라낸 타입","Omit<T, K>: T에서 K 키들만 제외한 타입","Record<K, V>: 키 K, 값 V 인 객체 타입. { [k: K]: V } 의 단축","ReturnType<F>, Parameters<F>: 함수 시그니처에서 추출"],pitfalls:["Partial<T> 가 깊은(deep) Partial 이 아닌 점 주의 — 중첩 객체 안쪽은 그대로 필수","as const 와 typeof 를 조합하면 객체 → 리터럴 유니온으로 변환 가능 (자주 쓰는 트릭)"]},{id:"sass-variables",category:"sass",no:"01",title:"변수와 중첩 — Sass의 기본",summary:"$변수로 값 재사용, 중첩으로 셀렉터 계층 표현. &로 부모 참조.",keywords:["$variable","nesting","&","BEM"],Example:a.lazy(()=>n(()=>import("./01_Variables-C1OqwiXQ.js"),__vite__mapDeps([12,1,2,13]))),code:v,why:"이 두 가지만 알아도 평범한 CSS 의 반복이 절반으로 줄어든다. & 셀렉터는 BEM 작성의 핵심.",points:["$변수: 컴파일 타임 상수. ` --css-var` 와는 다름 (CSS 변수는 런타임)","중첩으로 .parent .child 를 계층 그대로 작성","& 는 부모 셀렉터 참조. .btn { &:hover, &--primary, .parent & } 모두 가능","중첩은 3~4 레벨 이상 가지 말 것 — 셀렉터 specificity 폭발"],pitfalls:["$변수는 테마 전환 불가 (컴파일 시점에 박힘) — 테마는 CSS 변수로","& 셀렉터를 BEM과 섞어 쓸 때 &__elem, &--modifier 패턴이 가장 흔함"]},{id:"sass-mixin",category:"sass",no:"02",title:"Mixin — 재사용 가능한 스타일 블록",summary:"@mixin 으로 묶고 @include 로 펴낸다. 인자로 동적 스타일도.",keywords:["@mixin","@include","argument","@content"],Example:a.lazy(()=>n(()=>import("./02_Mixin-DblZjWlm.js"),__vite__mapDeps([14,1,2,15]))),code:S,why:"media query, flex 정렬, 버튼 variant — 반복되는 스타일 패턴을 mixin 으로 추출하는 게 SCSS 활용의 핵심.",points:["@mixin name($arg) { ... } — 인자 받을 수 있음, default 값 지정 가능","@include name(value);","@content: mixin 안에 호출자의 스타일 블록을 끼워넣을 자리","미디어 쿼리 mixin이 가장 흔한 사용처: @include mobile { ... }"],pitfalls:["mixin은 호출할 때마다 코드가 복제됨 — 자주 쓰는 패턴은 @extend 도 고려 (단, @extend 는 셀렉터 합쳐서 부작용 있을 수 있음)"]},{id:"sass-function",category:"sass",no:"03",title:"함수 & 연산 — 값 계산하기",summary:"@function 으로 값 계산해서 반환. 색상 함수, math 모듈도 활용.",keywords:["@function","math.div","color.adjust","calc()"],Example:a.lazy(()=>n(()=>import("./03_Function-Cte1AHIX.js"),__vite__mapDeps([16,1,2,17]))),code:k,why:"spacing 8px 베이스로 step 계산, 색상 lighten/darken, rem 변환 — 디자인 시스템 구현의 단골 도구.",points:["@function rem($px) { @return math.div($px, 16) * 1rem; }","Sass 1.x: / 는 더 이상 나눗셈이 아님 → math.div 사용 (@use 'sass:math')","color 함수: color.adjust($c, $lightness: 10%) 로 명도 조절","런타임 값이 섞이면 calc() 가 정답: calc(100vh - #{$header-height})"],pitfalls:["Sass 함수와 CSS 함수 혼동 주의 — Sass의 calc는 컴파일 시 계산, CSS의 calc는 브라우저에서 계산"]},{id:"sass-modules",category:"sass",no:"04",title:"@use / @forward — 모듈 시스템",summary:"@import 는 deprecated. @use 로 네임스페이스 있게 가져오기.",keywords:["@use","@forward","namespace","as *"],Example:a.lazy(()=>n(()=>import("./04_Modules-C3a0ifRv.js"),__vite__mapDeps([18,1,2,19]))),code:C,why:"큰 SCSS 프로젝트의 표준 구조. 어디서 무엇이 오는지 명확해진다. Webpack/Vite 빌드 속도도 향상.",points:["@use '경로'; → 파일명 네임스페이스로 등록 (variables.scss → variables.$primary)","@use '경로' as v; → 별칭","@use '경로' as *; → 네임스페이스 생략 (충돌 위험 있어 신중히)",'@forward: 다른 파일을 "중계" — index.scss 패턴','변수에 ! default 를 붙이면 "덮어쓰기 허용" — 테마 설정 패턴'],pitfalls:["@use 는 같은 파일을 여러 번 불러와도 1번만 컴파일 (좋은 점)","@import 와 @use 를 섞으면 변수 스코프가 헷갈림 — 한 프로젝트에선 하나만"]},{id:"sass-design-tokens",category:"sass",no:"05",title:"디자인 토큰 — Sass + CSS 변수 조합",summary:"값은 CSS 변수로(테마 전환), 함수/믹스인은 Sass로. 둘의 역할 분리.",keywords:["design token","CSS variable","data-theme","dark mode"],Example:a.lazy(()=>n(()=>import("./05_DesignTokens-Byb5l8pF.js"),__vite__mapDeps([20,1,2,21]))),code:T,why:'이 포트폴리오 사이트도 이 패턴이다. 다크모드 토글은 [data-theme="dark"] 의 CSS 변수만 갈아끼우면 끝.',points:[':root 에 라이트 토큰, [data-theme="dark"] 에 다크 토큰',"Sass mixin이 var(--text), var(--bg) 를 사용 → 한 mixin 으로 양쪽 테마 대응","토큰 이름은 의미(semantic): --text-primary 가 --gray-900 보다 좋음","transition: background 0.3s, color 0.3s — 테마 전환 시 부드럽게"],pitfalls:["border-color 처럼 단축 속성에서 일부만 transition 하려면 개별 속성 명시","사용자 OS 다크모드 자동 감지는 @media (prefers-color-scheme: dark) 와 조합"]}],o=t=>w.filter(i=>i.category===t).sort((i,r)=>i.no.localeCompare(r.no));function R({code:t,lang:i="tsx"}){const[r,s]=a.useState(!1),d=async()=>{try{await navigator.clipboard.writeText(t),s(!0),setTimeout(()=>s(!1),1500)}catch{s(!1)}};return e.jsxs("div",{className:"codeblock",children:[e.jsxs("div",{className:"codeblock__head",children:[e.jsx("span",{className:"codeblock__lang",children:i}),e.jsx("button",{type:"button",className:"codeblock__copy",onClick:d,"aria-label":"코드 복사",children:r?"✓ 복사됨":"복사"})]}),e.jsx("pre",{className:"codeblock__pre",children:e.jsx("code",{children:t})})]})}const P=["react","typescript","sass"];function A(){const[t,i]=a.useState("react"),r=a.useMemo(()=>o(t),[t]);return e.jsxs("section",{className:"study",children:[e.jsxs("header",{className:"study__header",children:[e.jsx(c,{as:"h1",className:"study__title",text:"Study"}),e.jsxs("p",{className:"study__lead",children:["대기업 프론트엔드 면접/실무에서 자주 묻는 ",e.jsx("strong",{children:"React · TypeScript · Sass"}),' 기본기를 한 페이지에 모아두고 단계적으로 학습합니다. 라이브 예제 옆에 같은 코드를 띄워두어 "이 코드가 곧 이 결과" 를 한눈에 확인합니다.']})]}),e.jsx("nav",{className:"study__tabs","aria-label":"학습 카테고리",children:P.map(s=>e.jsxs("button",{type:"button",className:`study__tab ${s===t?"is-active":""}`,onClick:()=>i(s),children:[E[s],e.jsx("span",{className:"study__tab-count",children:o(s).length})]},s))}),e.jsx("p",{className:"study__cat-desc",children:j[t]}),e.jsx("ol",{className:"study__toc",children:r.map(s=>e.jsx("li",{children:e.jsxs("a",{href:`#${s.id}`,children:[e.jsxs("span",{className:"study__toc-no",children:[s.no,"."]})," ",s.title]})},s.id))}),e.jsx("div",{className:"study__lessons",children:r.map(s=>e.jsx(l,{y:28,children:e.jsx(N,{lesson:s})},s.id))})]})}function N({lesson:t}){const i=t.Example;return e.jsxs("article",{id:t.id,className:"lesson",children:[e.jsxs("header",{className:"lesson__head",children:[e.jsx("div",{className:"lesson__no",children:t.no}),e.jsxs("div",{children:[e.jsx("h2",{className:"lesson__title",children:t.title}),e.jsx("p",{className:"lesson__summary",children:t.summary}),e.jsx("div",{className:"lesson__keywords",children:t.keywords.map(r=>e.jsx("span",{className:"lesson__keyword",children:r},r))})]})]}),e.jsxs("div",{className:"lesson__why",children:[e.jsx("span",{className:"lesson__why-label",children:"왜 배우나"}),e.jsx("p",{children:t.why})]}),e.jsxs("div",{className:"lesson__split",children:[e.jsxs("div",{className:"lesson__stage",children:[e.jsx("div",{className:"lesson__stage-label",children:"▶ 라이브 실행"}),e.jsx("div",{className:"lesson__stage-frame",children:e.jsx(a.Suspense,{fallback:e.jsx("div",{className:"lesson__stage-loading",children:"예제 로딩 중…"}),children:e.jsx(i,{})})})]}),e.jsxs("div",{className:"lesson__code",children:[e.jsx("div",{className:"lesson__code-label",children:"</> 소스 코드"}),e.jsx(R,{code:t.code})]})]}),e.jsxs("div",{className:"lesson__notes",children:[e.jsxs("section",{children:[e.jsx("h3",{children:"핵심 포인트"}),e.jsx("ul",{children:t.points.map((r,s)=>e.jsx("li",{children:r},s))})]}),t.pitfalls&&t.pitfalls.length>0&&e.jsxs("section",{className:"lesson__pitfalls",children:[e.jsx("h3",{children:"흔한 실수 / 면접 함정"}),e.jsx("ul",{children:t.pitfalls.map((r,s)=>e.jsx("li",{children:r},s))})]})]})]})}export{A as default};
