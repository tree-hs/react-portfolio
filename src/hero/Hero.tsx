// ─────────────────────────────────────────────────────────────────────────────
//  Hero — 첫 화면(풀뷰포트). WebGL 파티클 배경 + 타이포 인트로.
//  · 배경 캔버스는 lazy + Suspense. 동작 줄이기 선호 시 캔버스 자체를 띄우지 않음.
//  · 텍스트는 모션 컴포넌트(AnimatedText/Reveal)로 등장 → 이미지 없이 인상 형성.
// ─────────────────────────────────────────────────────────────────────────────
import { lazy, Suspense } from "react";
import { useReducedMotion } from "framer-motion";
import { AnimatedText, Reveal } from "../motion";
import "./hero.scss";

const HeroCanvas = lazy(() => import("./HeroCanvas"));

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="hero" id="hero">
      <div className="hero__bg" aria-hidden="true">
        {!reduceMotion && (
          <Suspense fallback={null}>
            <HeroCanvas />
          </Suspense>
        )}
      </div>

      <div className="hero__inner">
        <p className="hero__eyebrow">
          <Reveal y={12} duration={0.6}>
            <span>정한석 — Hs</span>
          </Reveal>
        </p>
        <AnimatedText
          as="h1"
          className="hero__title"
          text="Frontend Developer"
          stagger={0.08}
        />
        <Reveal delay={0.5} y={20}>
          <p className="hero__tagline">
            웹 퍼블리셔 9년의 마크업·접근성·디자인 감각 위에
            <br />
            React · TypeScript 로 직접 만들고 배포하는 프론트엔드.
          </p>
        </Reveal>
      </div>

      <a className="hero__scroll" href="#about" aria-label="아래로 스크롤">
        <span>Scroll</span>
      </a>
    </section>
  );
}
