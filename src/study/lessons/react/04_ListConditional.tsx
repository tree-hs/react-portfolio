// 레슨 04: 리스트 & 조건부 렌더링.
import { useState } from "react";

interface Todo {
  id: number;
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
    <div className="study-stack">
      {remaining === 0 ? (
        <p className="study-banner study-banner--ok">모두 끝났습니다! 🎉</p>
      ) : (
        <p className="study-muted">
          남은 작업: <strong>{remaining}개</strong>
        </p>
      )}

      <ul className="study-list">
        {todos.map((t) => (
          <li key={t.id} className="study-list__item">
            <label>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggle(t.id)}
              />
              <span
                style={{
                  textDecoration: t.done ? "line-through" : "none",
                  marginLeft: 8,
                }}
              >
                {t.text}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
