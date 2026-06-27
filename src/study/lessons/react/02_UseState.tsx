// 레슨 02: useState — 상태 관리의 기본.
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");

  const inc = () => setCount((c) => c + 1);
  const dec = () => setCount((c) => c - 1);
  const reset = () => setCount(0);

  return (
    <div className="study-stack">
      <h4 className="study-h4">카운터: {count}</h4>
      <div className="study-row">
        <button type="button" className="study-btn" onClick={inc}>
          +1
        </button>
        <button type="button" className="study-btn" onClick={dec}>
          -1
        </button>
        <button type="button" className="study-btn study-btn--ghost" onClick={reset}>
          리셋
        </button>
      </div>

      <hr className="study-hr" />

      <label className="study-field">
        <span>이름</span>
        <input
          className="study-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력해 보세요"
        />
      </label>
      <p className="study-muted">
        {name ? `반가워요, ${name}!` : "이름을 입력하세요."}
      </p>
    </div>
  );
}
