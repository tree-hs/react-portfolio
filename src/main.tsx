// ── import의 { } 차이 ──────────────────────────────────────────────
//  중괄호 X (default import)  : 그 모듈의 "기본(default) export" 하나를 가져옴.
//                              이름은 내가 마음대로 지어도 됨(ReactDOM이든 RD든).
//  중괄호 O (named import)    : 그 모듈이 이름 붙여 내보낸 여러 export 중에서 골라 가져옴.
//                              { } 안의 이름은 내보낸 이름과 정확히 같아야 함.
// ───────────────────────────────────────────────────────────────────

// React 본체. JSX(<App /> 같은 문법)와 React.StrictMode를 쓰기 위해 가져온다. ('react'의 default export)
import React from "react";
// React 18+의 새 렌더링 진입점(createRoot 등). 'react-dom/client'의 default export라서 중괄호 없이 가져옴.
// (한 덩어리로 받아서 ReactDOM.createRoot(...) 처럼 점으로 꺼내 씀)
import ReactDOM from "react-dom/client";
// 클라이언트 사이드 라우터. URL과 화면을 연결해주는 컴포넌트.
// 'react-router-dom'은 BrowserRouter, Routes, Route, Link, useNavigate... 등을 "named export"로 여러 개 내보낸다.
// 그래서 그중 BrowserRouter만 골라 쓰려고 { } 를 쓴다. ( { BrowserRouter, Routes, Route } 처럼 여러 개도 가능 )
// ── react-router-dom 주요 export 용도 (★ = 이 프로젝트에서 실제 사용) ───────────────
//  ★ BrowserRouter      : 라우터 본체(껍데기). 브라우저 주소(History API)와 화면을 연결. 앱 최상단을 감싸야 함.   [main.tsx]
//  ★ Routes             : 여러 <Route> 중 현재 URL에 맞는 "하나"만 골라 렌더 (switch 역할).                    [App.tsx]
//  ★ Route              : "이 path일 때 이 element를 보여줘" 매핑. path="/projects/:projectId" 처럼 :이름=동적구간.  [App.tsx]
//  ★ Link               : 새로고침 없이 이동하는 <a>. to="문자열" 또는 to={{ pathname, search }}.            [Header.jsx, ProjectCard.tsx]
//  ★ useNavigate()      : 코드(클릭 핸들러 등)로 이동시키는 함수 반환. navigate("/"), navigate(p,{replace:true}). [ProjectDetail.tsx]
//  ★ useParams()        : 현재 URL의 :동적구간 값들을 객체로. /projects/:projectId → useParams().projectId.    [App.tsx]
//  ★ useSearchParams()  : URL 쿼리스트링(?stack=React&sort=recent)을 읽고 쓰는 [params, setParams]. useState의 URL판. [App.tsx]
//  ★ useLocation()      : 현재 위치 정보({ pathname, search, hash, state }). 보통 search를 읽어 링크에 그대로 붙임.  [ProjectCard.tsx, ProjectDetail.tsx]
//    NavLink            : Link와 같은데, 현재 경로와 일치하면 자동으로 active 클래스/스타일 부여 (네비 메뉴용).
//    Navigate           : 렌더되는 순간 다른 경로로 리다이렉트. <Navigate to="/login" replace />.
//    Outlet             : 중첩 라우트에서 자식 Route가 그려질 자리 표시.
//    useRoutes()        : <Routes>/<Route>를 JSX 대신 객체 배열로 정의.
//    createBrowserRouter + RouterProvider : v6.4+/v7의 "데이터 라우터" 방식(loader/action 등). BrowserRouter의 상위 호환.
//  → 뼈대: BrowserRouter(껍데기) → Routes(고르기) → Route(URL↔컴포넌트) / 이동: Link·useNavigate / URL 정보 꺼내기: useParams·useSearchParams·useLocation
// ───────────────────────────────────────────────────────────────────────────────
import { BrowserRouter } from "react-router-dom";
// 우리 앱의 최상위 컴포넌트. App.tsx가 'export default App' 하므로 default import (중괄호 없음).
import App from "./App";
// 부드러운 스크롤(Lenis) — 사이트 전역 감성. 권장 기본 CSS도 함께.
import SmoothScroll from "./motion/SmoothScroll";
import "lenis/dist/lenis.css";
import "./motion/motion.scss";

// 페이지가 처음 뜰 때 <body>에 data-theme 속성이 아직 없으면 "dark"로 박아둔다.
// → 크리에이티브 방향 = 다크 기본. CSS의 body[data-theme="dark"] 규칙이 즉시 적용돼
//   다크모드 토글(HeaderTheme) 코드가 실행되기 전 잠깐 색이 깜빡이는 현상(FOUC)을 줄인다.
//   (HeaderTheme가 마운트되며 localStorage 저장값/OS 설정으로 최종 보정)
if (!document.body.getAttribute("data-theme")) {
  document.body.setAttribute("data-theme", "dark");
}

// index.html의 <div id="root">를 찾아 React 렌더 루트를 만든다.
// 끝의 ! 는 "이 요소는 절대 null이 아니다"라는 TypeScript non-null 단언(#root는 항상 존재하므로 안전).
ReactDOM.createRoot(document.getElementById("root")!).render(
  // StrictMode: 개발 모드에서만 동작하는 "안전장치 래퍼".
  // - 잠재적 문제(안전하지 않은 패턴, 부수효과 누수 등)를 콘솔로 경고해준다.
  // - 일부 함수(렌더, useEffect 등)를 일부러 두 번 실행해 버그를 드러낸다 → 개발 중 로그가
  //   두 번 찍히는 건 정상. 프로덕션 빌드에서는 아무 영향 없음.
  <React.StrictMode>
    {/* ── BrowserRouter (1) — "주소창(History API)을 쓰는 라우터" ──────────────────────
        보통 웹페이지는 링크 클릭 = 서버에서 새 HTML 받아 "전체 새로고침".
        하지만 React 같은 SPA는 index.html을 딱 한 번만 받고, 이후엔 JS로 화면만 갈아끼운다.
        그러면서도 주소창은 /projects/8 처럼 바뀌어야(북마크·공유·뒤로가기) 하는데,
        이걸 가능하게 하는 게 브라우저 History API(history.pushState, popstate 이벤트 등) —
        '새로고침 없이 주소창 URL만 바꾸는' 기능이다.
        BrowserRouter가 하는 일:
          · 지금 주소창 URL을 읽고(window.location), 뒤로/앞으로 가기를 감지한다
          · <Link> 클릭이나 navigate() 호출 시 history.pushState로 URL만 바꾼다(새로고침 X)
          · 안의 <Routes>/<Route>에게 "지금 URL은 X야 → 거기 맞는 컴포넌트 그려"라고 알린다
        (형제: HashRouter는 .../index.html#/projects/8 처럼 # 뒤를 쓰는 방식 — URL이 지저분)

        ── basename (2) — "모든 라우트 경로 앞에 자동으로 붙는 접두사" ────────────────────
        이 앱은 도메인 루트가 아니라 https://tree-hs.github.io/react-portfolio/ 하위에 배포된다.
        즉 홈 = .../react-portfolio/ , 8번 상세 = .../react-portfolio/projects/8.
        그런데 코드에서는 라우트를 path="/" , path="/projects/:projectId" 처럼 (루트에 있는 듯) 쓴다.
        basename="/react-portfolio/" 가 그 둘 사이를 통역한다:
          · 매칭 시  : 주소창 /react-portfolio/projects/8 → 앞의 /react-portfolio 떼고 /projects/8 로 매칭
          · 링크 생성: <Link to="/projects/8"> → 실제로는 /react-portfolio/projects/8 로 이동
        basename이 없으면 GitHub Pages에서 <Link to="/projects/8">가 .../github.io/projects/8(앱 바깥)로 가서 404.
        (로컬 dev는 localhost:5173/ = 루트라서 basename이 "/" → 아무것도 안 붙음)

        ── import.meta.env.BASE_URL ─────────────────────────────────────────────────
        = vite.config.ts의 base 값. dev에선 "/" , 이 설정으로 빌드하면 "/react-portfolio/".
        /react-portfolio/ 를 라우터에도 또 손으로 적지 않고 vite.config.ts 한 곳만 진실로 삼으려고 변수로 받아 씀.
        (같은 이유로 JSON fetch도 `${import.meta.env.BASE_URL}projects.json` 으로 함)
    ───────────────────────────────────────────────────────────────────────────── */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {/* SmoothScroll — Lenis 관성 스크롤로 앱 전체를 감싼다.
          (동작 줄이기 선호 사용자에겐 자동으로 비활성화) */}
      <SmoothScroll>
        {/* 실제 우리 앱. 이 안에서만 <Routes>, <Link>, useNavigate 등 라우터 기능을 쓸 수 있다. */}
        <App />
      </SmoothScroll>
    </BrowserRouter>
  </React.StrictMode>
);
