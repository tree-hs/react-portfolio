// 데모 페이지 우측(모바일에선 하단) 설명 패널.
// registry.ts 의 메타데이터만으로 렌더되므로 무거운 import 없음.
import { githubUrl, REQUIREMENT_LABEL } from "../registry";
import type { DemoMeta } from "../registry";

export default function DemoExplain({ demo }: { demo: DemoMeta }) {
  return (
    <aside className="lab-explain">
      <div className="lab-explain__badges">
        {demo.requirements.map((r) => (
          <span key={r} className="lab-badge" title={REQUIREMENT_LABEL[r]}>
            공고 {r}
          </span>
        ))}
        <span className="lab-badge lab-badge--phase">Phase {demo.phase}</span>
      </div>

      <h1 className="lab-explain__title">
        <span className="lab-explain__no">{demo.no}</span> {demo.title}
      </h1>
      <p className="lab-explain__lead">{demo.whatItDoes}</p>

      <h2 className="lab-explain__h2">핵심 개념</h2>
      <dl className="lab-explain__concepts">
        {demo.concepts.map((c) => (
          <div key={c.term} className="lab-explain__concept">
            <dt>{c.term}</dt>
            <dd>{c.desc}</dd>
          </div>
        ))}
      </dl>

      <h2 className="lab-explain__h2">배운 점 / 메모</h2>
      <ul className="lab-explain__learned">
        {demo.learned.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>

      <div className="lab-explain__tags">
        {demo.tags.map((t) => (
          <span key={t} className="lab-tag">
            {t}
          </span>
        ))}
      </div>

      <a
        className="lab-explain__source"
        href={githubUrl(demo.sourcePath)}
        target="_blank"
        rel="noreferrer"
      >
        소스 코드 보기 ↗
      </a>
    </aside>
  );
}
