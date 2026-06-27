// ─────────────────────────────────────────────────────────────────────────────
//  ScrollRevealParagraph — 문단이 스크롤을 따라 "단어별로 또렷해지는" 효과.
//  · olivierlarose 의 About/소개 문단 시그니처. 흐릿(저투명)하게 깔려 있다가
//    스크롤 진행도(scrollYProgress)에 각 단어의 구간을 매핑해 차례로 진해진다.
//  · 이미지가 적은 "기술 소개형" 포트폴리오에 잘 맞는다 — 텍스트 자체가 연출.
//  · 구현: useScroll 로 이 문단의 진행도를 읽고, 단어 i 마다 [start,end] 구간을
//    opacity [흐림→1] 로 useTransform.
// ─────────────────────────────────────────────────────────────────────────────
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import type { MotionValue } from "framer-motion";

interface ScrollRevealParagraphProps {
  text: string;
  className?: string;
  /** 흐릿하게 깔릴 때의 투명도 (0~1) */
  dim?: number;
}

export default function ScrollRevealParagraph({
  text,
  className,
  dim = 0.15,
}: ScrollRevealParagraphProps) {
  const container = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();

  // 이 문단이 화면 하단 90% 에 닿을 때 시작, 상단 25% 지점에서 완성
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "start 0.25"],
  });

  const words = text.split(" ");

  if (reduceMotion) {
    return <p className={className}>{text}</p>;
  }

  return (
    <p ref={container} className={className}>
      {words.map((w, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]} dim={dim}>
            {w}
          </Word>
        );
      })}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
  dim,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  dim: number;
}) {
  const opacity = useTransform(progress, range, [dim, 1]);
  return (
    <span className="reveal-word">
      <motion.span style={{ opacity }}>{children}</motion.span>
      {" "}
    </span>
  );
}
