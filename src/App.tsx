import { useMemo } from "react";
import { Route, Routes, useParams, useSearchParams } from "react-router-dom";
import Filters, { FilterState } from "./components/Filters/Filters";
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

const isValidOption = <T extends string>(value: string | null, list: readonly T[]): value is T =>
  !!value && (list as string[]).includes(value);

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
    duration: isValidOption(duration, DURATION_OPTIONS) ? duration : DEFAULT_FILTERS.duration,
    sort: sort === "duration" ? "duration" : DEFAULT_FILTERS.sort,
  };
};

function ProjectPage() {
  const { projectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);
  const activeId = projectId ? Number(projectId) : null;

  const handleFilterChange = (next: FilterState) => {
    const params = new URLSearchParams();

    if (next.stack && next.stack !== "All") params.set("stack", next.stack);
    if (next.difficulty && next.difficulty !== "all") params.set("difficulty", next.difficulty);
    if (next.duration && next.duration !== "all") params.set("duration", next.duration);
    params.set("sort", next.sort);

    setSearchParams(params, { replace: false });
  };

  return (
    <>
      <Filters filters={filters} onChange={handleFilterChange} />
      <ProjectList filters={filters} activeProjectId={activeId} />
      <ProjectDetail projectId={activeId} filters={filters} />
    </>
  );
}

function App() {
  return (
    <>
      <Header />
      <main className="main mgy40">
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
