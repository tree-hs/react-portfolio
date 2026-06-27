// ─────────────────────────────────────────────────────────────────────────────
//  AnimatedText — 제목/문구가 "마스크 뒤에서 단어별로 올라오는" 리빌.
//  · olivierlarose 의 헤딩 시그니처. 각 단어를 overflow:hidden 마스크로 감싸고,
//    안쪽 단어를 translateY(110% → 0) 로 끌어올린다 → 가려졌다가 솟아오르는 느낌.
//  · staggerChildren 으로 단어가 차례로 등장.
//  · as 로 시맨틱 태그 지정(h1/h2/p…) — 마크업 의미는 유지(퍼블리셔 관점).
// ─────────────────────────────────────────────────────────────────────────────
import { createElement } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { ElementType } from "react";

interface AnimatedTextProps {
  text: string;
  /** 렌더할 시맨틱 태그 (기본 div) */
  as?: ElementType;
  className?: string;
  /** 전체 시작 지연(초) */
  delay?: number;
  /** 단어 간 등장 간격(초) */
  stagger?: number;
}

const container: Variants = {
  hidden: {},
  visible: (custom: { delay: number; stagger: number }) => ({
    transition: {
      staggerChildren: custom.stagger,
      delayChildren: custom.delay,
    },
  }),
};

const word: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function AnimatedText({
  text,
  as = "div",
  className,
  delay = 0,
  stagger = 0.07,
}: AnimatedTextProps) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  // 동작 줄이기 — 모션 없이 평범한 텍스트로
  if (reduceMotion) {
    return createElement(as, { className }, text);
  }

  return createElement(
    as,
    { className },
    <motion.span
      style={{ display: "inline-block" }}
      variants={container}
      custom={{ delay, stagger }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
    >
      {words.map((w, i) => (
        <span key={i} className="anim-text__mask">
          <motion.span className="anim-text__word" variants={word}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
