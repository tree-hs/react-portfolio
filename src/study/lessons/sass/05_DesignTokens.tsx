import "./05_DesignTokens.scss";

export default function Demo() {
  return (
    <div className="sass-token-demo">
      <div>
        토큰 사용: <code>background: var(--bg)</code>,{" "}
        <code>color: var(--text)</code>
      </div>
      <div>
        강조 색: <strong>var(--accent)</strong> — 테마 토글에 따라 자동 변경
      </div>
      <div className="sass-token-demo__hint">
        헤더 우측 테마 토글 버튼을 눌러보세요. 이 박스의 배경/글자색이 바로 바뀝니다.
      </div>
    </div>
  );
}
