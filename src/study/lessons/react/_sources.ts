// 각 React 레슨의 "코드 옆에 보여줄 소스 문자열".
// 실제 라이브 컴포넌트(01_JsxProps.tsx 등)와 거의 동일한 코드를 문자열로 보관한다.
// — 라이브 컴포넌트가 변경되면 여기도 함께 갱신해야 표시 코드와 동작이 일치한다.

export const reactJsxPropsCode = `// JSX는 결국 React.createElement 호출로 컴파일된다.
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
}`;

export const reactUseStateCode = `import { useState } from "react";

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
}`;

export const reactUseEffectCode = `import { useEffect, useState } from "react";

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
}`;

export const reactListConditionalCode = `import { useState } from "react";

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
}`;

export const reactFormCode = `import { useState } from "react";

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
}`;
