// /study — 학습 페이지. 카테고리 탭으로 React / TS / Sass 전환.
// 각 카테고리 안에서는 레슨들이 세로로 쭉 나열되며, 라이브 예제 + 코드 + 설명 패널이 함께 보인다.
// App.tsx에서 React.lazy로 로딩되므로 메인 번들에는 들어가지 않는다.
import { Suspense, useMemo, useState } from "react";
import {
  CATEGORY_DESC,
  CATEGORY_LABEL,
  getLessonsByCategory,
  type Category,
  type Lesson,
} from "./registry";
import CodeBlock from "./components/CodeBlock";
import { AnimatedText, Reveal } from "../motion";
import "./study.scss";

const CATEGORIES: Category[] = ["react", "typescript", "sass"];

export default function StudyPage() {
  const [active, setActive] = useState<Category>("react");
  const lessons = useMemo(() => getLessonsByCategory(active), [active]);

  return (
    <section className="study">
      <header className="study__header">
        <AnimatedText as="h1" className="study__title" text="Study" />
        <p className="study__lead">
          대기업 프론트엔드 면접/실무에서 자주 묻는 <strong>React · TypeScript · Sass</strong> 기본기를
          한 페이지에 모아두고 단계적으로 학습합니다. 라이브 예제 옆에 같은 코드를 띄워두어
          "이 코드가 곧 이 결과" 를 한눈에 확인합니다.
        </p>
      </header>

      <nav className="study__tabs" aria-label="학습 카테고리">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`study__tab ${c === active ? "is-active" : ""}`}
            onClick={() => setActive(c)}
          >
            {CATEGORY_LABEL[c]}
            <span className="study__tab-count">
              {getLessonsByCategory(c).length}
            </span>
          </button>
        ))}
      </nav>

      <p className="study__cat-desc">{CATEGORY_DESC[active]}</p>

      {/* 카테고리별 목차 (anchor jump) */}
      <ol className="study__toc">
        {lessons.map((l) => (
          <li key={l.id}>
            <a href={`#${l.id}`}>
              <span className="study__toc-no">{l.no}.</span> {l.title}
            </a>
          </li>
        ))}
      </ol>

      <div className="study__lessons">
        {lessons.map((l) => (
          <Reveal key={l.id} y={28}>
            <LessonBlock lesson={l} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function LessonBlock({ lesson }: { lesson: Lesson }) {
  const Example = lesson.Example;
  return (
    <article id={lesson.id} className="lesson">
      <header className="lesson__head">
        <div className="lesson__no">{lesson.no}</div>
        <div>
          <h2 className="lesson__title">{lesson.title}</h2>
          <p className="lesson__summary">{lesson.summary}</p>
          <div className="lesson__keywords">
            {lesson.keywords.map((k) => (
              <span key={k} className="lesson__keyword">
                {k}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="lesson__why">
        <span className="lesson__why-label">왜 배우나</span>
        <p>{lesson.why}</p>
      </div>

      <div className="lesson__split">
        <div className="lesson__stage">
          <div className="lesson__stage-label">▶ 라이브 실행</div>
          <div className="lesson__stage-frame">
            <Suspense
              fallback={
                <div className="lesson__stage-loading">예제 로딩 중…</div>
              }
            >
              <Example />
            </Suspense>
          </div>
        </div>
        <div className="lesson__code">
          <div className="lesson__code-label">{"</> 소스 코드"}</div>
          <CodeBlock code={lesson.code} />
        </div>
      </div>

      <div className="lesson__notes">
        <section>
          <h3>핵심 포인트</h3>
          <ul>
            {lesson.points.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </section>
        {lesson.pitfalls && lesson.pitfalls.length > 0 && (
          <section className="lesson__pitfalls">
            <h3>흔한 실수 / 면접 함정</h3>
            <ul>
              {lesson.pitfalls.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}
