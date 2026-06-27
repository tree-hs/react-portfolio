import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Route, Routes, useParams, useSearchParams } from "react-router-dom";
import Career from "./components/Career/Career";
import Filters, { FilterState } from "./components/Filters/Filters";
import type { Project } from "./types/project";
import ProjectDetail from "./components/ProjectDetail/ProjectDetail";
import ProjectList from "./components/ProjectList/ProjectList";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header/Header";
import {
  DIFFICULTY_OPTIONS,
  DURATION_OPTIONS,
  STACK_OPTIONS,
} from "./api/projects";
import { AnimatedText, Reveal, ScrollRevealParagraph } from "./motion";
import Hero from "./hero/Hero";
import LabTeaser from "./components/LabTeaser/LabTeaser";
import "./styles/reset.scss";
import "./styles/template.scss";
import "./App.scss";

// WebGL Lab — three/R3F 같은 무거운 의존성이 메인 번들에 들어오지 않도록
// React.lazy + dynamic import 로 코드 스플리팅 (LabPage / LabDemoPage 와 각 데모는 별도 chunk).
const LabPage = lazy(() => import("./lab/LabPage"));
const LabDemoPage = lazy(() => import("./lab/LabDemoPage"));
const TestLabPage = lazy(() => import("./testLab/testLabPage"));
const TestLabDemoPage = lazy(() => import("./testLab/TestLabDemoPage"));
// /study — React / TypeScript / Sass 학습 페이지. 메인 번들과 분리.
const StudyPage = lazy(() => import("./study/StudyPage"));

const DEFAULT_FILTERS: FilterState = {
  stack: "All",
  difficulty: "all",
  duration: "all",
  sort: "recent",
};

const isValidOption = <T extends string>(
  value: string | null,
  list: readonly T[]
): value is T => !!value && (list as readonly string[]).includes(value);

const parseFilters = (searchParams: URLSearchParams): FilterState => {
  const stack = searchParams.get("stack");
  const difficulty = searchParams.get("difficulty");
  const duration = searchParams.get("duration");
  const sort = searchParams.get("sort");

  return {
    stack: isValidOption(stack, STACK_OPTIONS) ? stack : DEFAULT_FILTERS.stack,
    difficulty: isValidOption(difficulty, DIFFICULTY_OPTIONS)
      ? difficulty
      : DEFAULT_FILTERS.difficulty,
    duration: isValidOption(duration, DURATION_OPTIONS)
      ? duration
      : DEFAULT_FILTERS.duration,
    sort: sort === "duration" ? "duration" : DEFAULT_FILTERS.sort,
  };
};


function AboutSection() {
  return (
    <section id="about" className="about-section">
      <div className="about__title">
        <AnimatedText as="h2" className="section__title" text="About" />
      </div>
      <ScrollRevealParagraph
        className="about__intro"
        text="시장의 변화에 흐름에 맞춰 프론트엔드 개발로 전향하며 계속 배워 나아가고 있습니다."
      />
      <div className="about__content">
        <Reveal className="about__text">
          <dl className="about__facts">
            <div className="about__fact">
              <dt>이름</dt>
              <dd>정한석</dd>
            </div>
            <div className="about__fact">
              <dt>생년월일</dt>
              <dd>1991. 07. 03</dd>
            </div>
            <div className="about__fact">
              <dt>이메일</dt>
              <dd>
                <a href="mailto:harrison14@naver.com">harrison14@naver.com</a>
              </dd>
            </div>
            <div className="about__fact">
              <dt>학력</dt>
              <dd>서일대학교 인터넷정보과 졸업</dd>
            </div>
            <div className="about__fact">
              <dt>연락처</dt>
              <dd>
                <a href="tel:+821032682612">010-3268-2612</a>
              </dd>
            </div>
          </dl>
          <a href="#projects" className="about__cta">
            프로젝트 보기 <span aria-hidden="true">→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function ProjectPage() {
  const { projectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}projects.json`;

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        // projects.json이 배열이든 {projects,total}든 둘 다 대응
        const list: Project[] = Array.isArray(data) ? data : data.projects;
        setProjects(list ?? []);
        setLoadError(null);
      })
      .catch((e) => {
        setProjects([]);
        setLoadError(e instanceof Error ? e.message : String(e));
      });
  }, []);

  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);
  const activeId = projectId ? Number(projectId) : null;

  const handleFilterChange = (next: FilterState) => {
    const params = new URLSearchParams();

    if (next.stack && next.stack !== "All") params.set("stack", next.stack);
    if (next.difficulty && next.difficulty !== "all")
      params.set("difficulty", next.difficulty);
    if (next.duration && next.duration !== "all")
      params.set("duration", next.duration);
    params.set("sort", next.sort);

    setSearchParams(params, { replace: false });
  };

  return (
    <>
      <Hero />
      <AboutSection />
      <section id="projects" className="projects-section">
        <Career />
      </section>
      <section id="stack" className="filters-section">
        <Filters
          filters={filters}
          onChange={handleFilterChange}
          projects={projects}
        />
        {loadError && <p className="error-message">Failed to fetch: {loadError}</p>}
        <ProjectList filters={filters} activeProjectId={activeId} />
        <ProjectDetail projectId={activeId} filters={filters} />
      </section>
      <section className="lab-teaser-section">
        <LabTeaser />
      </section>
    </>
  );
}

function App() {
  return (
    <>
      <Header />
      <main className="main">
        <Suspense fallback={<div className="lab-loading">Loading…</div>}>
          <Routes>
            <Route path="/" element={<ProjectPage />} />
            <Route path="/projects/:projectId" element={<ProjectPage />} />
            <Route path="/lab" element={<LabPage />} />
            <Route path="/lab/:demoId" element={<LabDemoPage />} />
            <Route path="/testLab" element={<TestLabPage />} />
            <Route path="/testLab/:demoId" element={<TestLabDemoPage />} />
            <Route path="/study" element={<StudyPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default App;
