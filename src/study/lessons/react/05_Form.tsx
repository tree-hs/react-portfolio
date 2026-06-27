// 레슨 05: 이벤트 핸들링 & 제어 컴포넌트.
import { useState } from "react";

interface FormState {
  name: string;
  email: string;
  agreed: boolean;
}

const INITIAL: FormState = { name: "", email: "", agreed: false };

export default function SignUpForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState<FormState | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(form);
  };

  const onReset = () => {
    setForm(INITIAL);
    setSubmitted(null);
  };

  return (
    <form className="study-stack" onSubmit={onSubmit}>
      <label className="study-field">
        <span>이름</span>
        <input
          className="study-input"
          name="name"
          value={form.name}
          onChange={onChange}
          required
        />
      </label>
      <label className="study-field">
        <span>이메일</span>
        <input
          className="study-input"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          required
        />
      </label>
      <label className="study-field study-field--row">
        <input
          name="agreed"
          type="checkbox"
          checked={form.agreed}
          onChange={onChange}
        />
        <span>약관에 동의합니다</span>
      </label>
      <div className="study-row">
        <button type="submit" className="study-btn" disabled={!form.agreed}>
          제출
        </button>
        <button
          type="button"
          className="study-btn study-btn--ghost"
          onClick={onReset}
        >
          초기화
        </button>
      </div>

      {submitted && (
        <pre className="study-pre">
          {JSON.stringify(submitted, null, 2)}
        </pre>
      )}
    </form>
  );
}
