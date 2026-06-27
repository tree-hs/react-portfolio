// 레슨 03: React Props 타이핑.
import { useState, type ReactNode } from "react";

interface ButtonProps {
  label: string;
  variant?: "primary" | "ghost";
  disabled?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}

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
      className={`study-btn ${variant === "ghost" ? "study-btn--ghost" : ""}`}
    >
      {label}
      {children}
    </button>
  );
}

export default function Demo() {
  const [clicks, setClicks] = useState(0);
  return (
    <div className="study-stack">
      <div className="study-row">
        <Button label="저장" onClick={() => setClicks((c) => c + 1)} />
        <Button label="취소" variant="ghost" />
        <Button label="제출 불가" disabled />
      </div>
      <p className="study-muted">"저장" 누른 횟수: {clicks}</p>
    </div>
  );
}
