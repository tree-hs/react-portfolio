// ─────────────────────────────────────────────────────────────────────────────
//  LabTeaser — 홈에서 /lab(WebGL) 을 전면에 노출하는 시그니처 섹션.
//  · 이미지 대신 "번호 · 제목 · 태그 · 화살표" 텍스트 리스트(올리비에 라로즈 류).
//  · registry 의 메타데이터를 그대로 써서 데모가 늘면 자동 반영(three import는 없음 → 가벼움).
// ─────────────────────────────────────────────────────────────────────────────
import { Link } from "react-router-dom";
import { demos } from "../../lab/registry";
import { AnimatedText, Reveal } from "../../motion";
import "./labTeaser.scss";

export default function LabTeaser() {
  const sorted = [...demos].sort((a, b) => a.no.localeCompare(b.no));

  return (
    <section id="lab" className="lab-teaser">
      <div className="lab-teaser__head">
        <AnimatedText as="h2" className="section__title" text="WebGL Lab" />
        <Reveal delay={0.3}>
          <p className="lab-teaser__lead">
            Three.js · react-three-fiber 로 렌더러 내부 동작과 셰이더를 직접 파보는
            실험실. 채용공고 우대사항(WebGL·성능·렌더러 이해)을 데모로 증명합니다.
          </p>
        </Reveal>
      </div>

      <div className="lab-teaser__list">
        {sorted.map((d, idx) => (
          <Reveal key={d.id} delay={Math.min(idx * 0.06, 0.3)} y={20}>
            <Link
              to={`/lab/${d.id}`}
              className={`lab-teaser__row lab-teaser__row--${d.status}`}
            >
              <span className="lab-teaser__no">{d.no}</span>
              <span className="lab-teaser__title">{d.title}</span>
              <span className="lab-teaser__tags">
                {d.tags.slice(0, 3).join(" · ")}
              </span>
              <span className="lab-teaser__arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <Link to="/lab" className="lab-teaser__cta">
          전체 Lab 보기 <span aria-hidden="true">→</span>
        </Link>
      </Reveal>
    </section>
  );
}
