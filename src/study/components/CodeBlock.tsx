// 가벼운 코드 표시 컴포넌트.
// · 외부 syntax highlighter 의존성 없이 단순 <pre><code> 로 출력 (번들 가볍게).
// · 클립보드 복사 버튼 제공.
import { useState } from "react";

interface Props {
  code: string;
  /** 표시용 언어 라벨 (구문 강조는 안 하지만 라벨로 보여줌) */
  lang?: string;
}

export default function CodeBlock({ code, lang = "tsx" }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="codeblock">
      <div className="codeblock__head">
        <span className="codeblock__lang">{lang}</span>
        <button
          type="button"
          className="codeblock__copy"
          onClick={handleCopy}
          aria-label="코드 복사"
        >
          {copied ? "✓ 복사됨" : "복사"}
        </button>
      </div>
      <pre className="codeblock__pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}
