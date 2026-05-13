// /lab — Lab 랜딩. 데모 카드 그리드 + 채용공고 항목 범례.
// App.tsx에서 React.lazy로 로딩되므로 이 파일과 registry는 메인 번들에 들어가지 않음.
import { Link } from "react-router-dom";
import { demos, REQUIREMENT_LABEL } from "./registry";
import type { Requirement } from "./registry";
import "./lab.scss";

const REQUIREMENTS: Requirement[] = ["A", "B", "C"];

export default function LabPage() {
  return (
    <section className="lab">
      <header className="lab__header">
        <h1 className="lab__title">WebGL Lab</h1>
        <p className="lab__lead">
          Three.js / react-three-fiber 로 만든 학습용 데모 모음입니다. 채용공고
          우대사항(WebGL·GLSL·셰이더 작성/커스터마이징, 3D 성능 분석/개선, Renderer
          내부 동작 이해)을 각각의 데모로 증명하는 것이 목표입니다.
        </p>
        <ul className="lab__legend">
          {REQUIREMENTS.map((r) => (
            <li key={r}>
              <span className="lab-badge">공고 {r}</span>
              <span>{REQUIREMENT_LABEL[r]}</span>
            </li>
          ))}
        </ul>
      </header>

      <ul className="lab__grid">
        {demos.map((d) => (
          <li key={d.id} className={`lab-card lab-card--${d.status}`}>
            <Link to={`/lab/${d.id}`} className="lab-card__link">
              <div className="lab-card__thumb" aria-hidden="true">
                {d.no}
              </div>
              <div className="lab-card__body">
                <h2 className="lab-card__title">{d.title}</h2>
                <p className="lab-card__summary">{d.summary}</p>
                <div className="lab-card__meta">
                  {d.requirements.map((r) => (
                    <span key={r} className="lab-badge" title={REQUIREMENT_LABEL[r]}>
                      공고 {r}
                    </span>
                  ))}
                  <span className="lab-badge lab-badge--phase">Phase {d.phase}</span>
                </div>
                <div className="lab-card__tags">
                  {d.tags.map((t) => (
                    <span key={t} className="lab-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
