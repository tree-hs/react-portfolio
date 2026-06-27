// ─────────────────────────────────────────────────────────────────────────────
//  SmoothScroll — Lenis 기반 부드러운 스크롤 (사이트 전역)
//  · olivierlarose / studiofreight 류 크리에이티브 사이트의 "감성 8할"이 이 관성 스크롤.
//  · ReactLenis root: <html>/<body> 의 실제 스크롤을 가로채 부드럽게 보간(lerp)한다.
//    (실제 문서 스크롤은 그대로라서 IntersectionObserver 기반 whileInView 도 정상 동작)
//  · 접근성: 사용자가 OS에서 "동작 줄이기"를 켜면 Lenis 를 끄고 기본 스크롤로 둔다.
// ─────────────────────────────────────────────────────────────────────────────
import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const reduceMotion = useReducedMotion();

  // 동작 줄이기 선호 시 — 관성 스크롤 없이 그대로 렌더 (멀미·접근성 배려)
  if (reduceMotion) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1, // 0~1, 작을수록 더 "미끄러지는" 관성
        smoothWheel: true,
        wheelMultiplier: 1,
      }}
    >
      {children}
    </ReactLenis>
  );
}
