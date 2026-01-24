import { useEffect, useMemo, useState } from "react";
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
import "./styles/reset.scss";
import "./styles/template.scss";
import "./App.scss";

const DEFAULT_FILTERS: FilterState = {
  stack: "All",
  difficulty: "all",
  duration: "all",
  sort: "recent",
};

const isValidOption = <T extends string>(
  value: string | null,
  list: readonly T[]
): value is T => !!value && (list as string[]).includes(value);

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
        <h2 className="section__title">
          React portfolio
        </h2>
        <span className="section__title-accent">Frontend developer</span>
      </div>
      <div className="about__content">
        <div className="about__text">
          <p>
            이것 저것 해보긴 했는데 퍼블리셔 포지션으로만 경력을 쌓아서
            퍼블리싱 외 대다수 stack은 초급이라 생각해서 초급이라 했습니다.
          </p>
          <p>
            현재는 React와 TypeScript를 활용한 프론트엔드 개발에 집중하고 있으며,
            사용자 경험을 개선하고 접근성을 고려한 웹 애플리케이션을 만드는 것을 좋아합니다.
          </p>
          <p>주로 사용하는 기술 스택:</p>
          <ul className="about__skills">
            <li>JavaScript</li>
            <li>Html</li>
            <li>Css</li>
            <li>TypeScript</li>
            <li>Jquery</li>
            <li>React</li>
            <li>Php</li>
            <li>MySQL</li>
          </ul>
          <a href="#projects" className="about__cta">
            View services
          </a>
        </div>
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
    </>
  );
}

function App() {
  return (
    <>
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<ProjectPage />} />
          <Route path="/projects/:projectId" element={<ProjectPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
