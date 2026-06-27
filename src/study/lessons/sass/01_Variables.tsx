// 레슨 01 라이브 데모 — 같은 폴더의 01_Variables.scss 가 실제 스타일을 담당.
import "./01_Variables.scss";

export default function Demo() {
  return (
    <div>
      <div className="sass-card">
        <span className="sass-card__label">기본 카드</span>
        <span>$primary, $radius, $gap 변수를 적용</span>
      </div>
      <div className="sass-card sass-card--primary">
        <span className="sass-card__label">강조 카드</span>
        <span>&amp;--primary modifier 적용</span>
      </div>
    </div>
  );
}
