// ─────────────────────────────────────────────────────────────────────────────
//  Reveal — 어떤 블록이든 "스크롤로 보이면" 아래에서 페이드+슬라이드업.
//  · 가장 범용적인 진입 모션. 섹션·카드·이미지 무엇이든 감싸면 된다.
//  · viewport once: 한 번 나타나면 다시 사라졌다 나타나지 않음(자연스러움).
//  · ease [0.22,1,0.36,1] = "easeOutExpo" 류 — 크리에이티브 사이트 단골 커브.
// ─────────────────────────────────────────────────────────────────────────────
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** 시작 지연(초) — 여러 요소를 순차로 등장시킬 때 */
  delay?: number;
  /** 시작 시 아래로 내려둘 거리(px) */
  y?: number;
  /** 등장 시간(초) */
  duration?: number;
  className?: string;
}

export default function Reveal({
  children,
  delay = 0,
  y = 28,
  duration = 0.8,
  className,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
