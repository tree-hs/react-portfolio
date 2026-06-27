// ─────────────────────────────────────────────────────────────────────────────
//  Hero — 첫 화면(풀뷰포트). WebGL 파티클 배경 + 타이포 인트로.
//  · 배경 캔버스는 lazy + Suspense. 동작 줄이기 선호 시 캔버스 자체를 띄우지 않음.
//  · 텍스트는 모션 컴포넌트(AnimatedText/Reveal)로 등장 → 이미지 없이 인상 형성.
// ─────────────────────────────────────────────────────────────────────────────
import { lazy, Suspense, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { AnimatedText, Reveal } from "../motion";
import "./hero.scss";

const HeroCanvas = lazy(() => import("./HeroCanvas"));

export default function Hero() {
  const reduceMotion = useReducedMotion();
  // WebGL 배경은 "마우스가 있는 데스크톱"에서만 로드한다.
  // → 모바일/터치 기기에서 무거운 three(약 888KB)와 GPU 부하를 아예 안 받게 함.
  //   (파티클 패럴럭스 자체가 마우스 전제라 터치에선 의미도 적음)
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setShowCanvas(false);
      return;
    }
    const mq = window.matchMedia("(min-width: 768px) and (pointer: fine)");
    const update = () => setShowCanvas(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduceMotion]);

  return (
    <section className="hero" id="hero">
      <div className="hero__bg" aria-hidden="true">
        {showCanvas && (
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
          text="Hs Portfolio"
          stagger={0.08}
        />
        <Reveal delay={0.5} y={20}>
          <p className="hero__tagline">
            끊임 없이 배워나가 프론트엔드 개발자입니다.
          </p>
        </Reveal>
      </div>

      <a className="hero__scroll" href="#about" aria-label="아래로 스크롤">
        <span>Scroll</span>
      </a>
    </section>
  );
}
