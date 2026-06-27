// 레슨 03: useEffect — 사이드 이펙트와 cleanup.
import { useEffect, useState } from "react";

export default function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [running]);

  return (
    <div className="study-stack">
      <h4 className="study-h4">경과 시간: {seconds}초</h4>
      <div className="study-row">
        <button
          type="button"
          className="study-btn"
          onClick={() => setRunning((r) => !r)}
        >
          {running ? "정지" : "재개"}
        </button>
        <button
          type="button"
          className="study-btn study-btn--ghost"
          onClick={() => setSeconds(0)}
        >
          리셋
        </button>
      </div>
      <p className="study-muted">
        상태: <strong>{running ? "동작 중" : "정지됨"}</strong> — 정지/재개로
        cleanup이 잘 호출되는지 콘솔에서도 확인해 보세요.
      </p>
    </div>
  );
}
