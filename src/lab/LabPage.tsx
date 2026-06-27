// /lab — Lab 랜딩. 데모 카드 그리드 + 채용공고 항목 범례.
// App.tsx에서 React.lazy로 로딩되므로 이 파일과 registry는 메인 번들에 들어가지 않음.
import { Link } from "react-router-dom";
import { demos, REQUIREMENT_LABEL } from "./registry";
import type { Requirement } from "./registry";
import { AnimatedText, Reveal } from "../motion";
import "./lab.scss";

const REQUIREMENTS: Requirement[] = ["A", "B", "C"];

export default function LabPage() {
  return (
    <section className="lab">
      <header className="lab__header">
        <AnimatedText as="h1" className="lab__title" text="WebGL Lab" />
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

      <div className="lab__grid">
        {/*
          [...demos] : 스프레드 연산자로 demos 배열을 "복사" 한다.
                       sort()는 원본 배열을 직접 바꾸는 메서드(mutating)라
                       원본 demos 를 건드리지 않기 위해 사본을 만들어 정렬한다.

          .sort(비교함수)
            - 배열의 메서드. 비교함수가 어떤 값을 반환하느냐로 두 원소의 순서가 정해짐.
            - 비교함수는 배열에서 임의의 두 원소를 (a, b) 로 받아 호출됨.
              · return < 0  → a 가 b 보다 앞으로
              · return = 0  → 순서 유지
              · return > 0  → a 가 b 보다 뒤로
            - 정렬이 끝날 때까지 (a, b) 쌍이 여러 번 호출됨 — 실제로 어떤 두 원소가
              뽑힐지는 엔진(브라우저)이 알아서 결정. 우리는 "이 두 개를 비교한다면
              누가 앞이냐"만 알려주면 됨.

          a, b : 비교함수의 매개변수. 이름은 자유.
                 여기서는 둘 다 DemoMeta 객체 (registry.ts 의 한 항목).
                 그래서 a.no, b.no 같은 속성에 접근 가능.

          a.no.localeCompare(b.no)
            - 문자열을 "사전식"으로 비교하는 String 내장 메서드.
            - a.no 가 b.no 보다 사전순으로 앞이면 음수, 같으면 0, 뒤면 양수 반환.
              → sort 비교함수가 원하는 형식과 정확히 일치한다.
            - 그냥 a.no - b.no 처럼 빼면 문자열은 NaN 이 됨 (숫자 연산 불가).
              그래서 문자열 정렬에는 localeCompare 가 표준.
            - 보너스: localeCompare 는 한글/영문 혼합도 사람이 기대하는 순서로 정렬해줌
              ("가" < "나" 같은 한글 자모 순서도 처리). 단순 a < b 비교는 UTF-16
              코드포인트 순이라 어색해질 수 있음.

          .map((d) => (...))
            - 정렬된 배열을 순회하며 각 원소를 JSX 로 변환.
            - d 는 sort 결과 배열의 한 원소(= DemoMeta 객체). 이름은 자유.
              d.id, d.title, d.summary 등을 카드 안에서 꺼내 쓴다.

          전체 흐름:
            demos
              ↓ [...demos]        (배열 복사)
              ↓ .sort(...)        (사본을 no 기준 오름차순으로 정렬)
              ↓ .map(d => <li>)   (각 demo 를 <li> JSX 로 변환)
            → <ul> 안에 카드들이 들어감.
        */}
        {[...demos].sort((a, b) => a.no.localeCompare(b.no)).map((d, idx) => (
          <Reveal
            key={d.id}
            className={`lab-card lab-card--${d.status}`}
            delay={Math.min(idx * 0.06, 0.3)}
            y={28}
          >
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
          </Reveal>
        ))}
      </div>
    </section>
  );
}
