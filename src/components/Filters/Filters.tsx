import { ChangeEvent } from "react";
import {
  DIFFICULTY_OPTIONS,
  DURATION_OPTIONS,
  STACK_OPTIONS,
} from "../../api/projects";
import type { Project, ProjectQueryParams, Skill } from "../../types/project";

export interface FilterState {
  stack: Skill | "All";
  difficulty: ProjectQueryParams["difficulty"];
  duration: ProjectQueryParams["duration"];
  sort: NonNullable<ProjectQueryParams["sort"]>;
}

interface FiltersProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  projects: Project[]; // ✅ 추가
}

const labelForDuration = (duration: FilterState["duration"]): string => {
  switch (duration) {
    case "short":
      return "단기 (≤4주)";
    case "medium":
      return "중기 (≤12주)";
    case "long":
      return "장기";
    default:
      return "전체 기간";
  }
};

function Filters({ filters, onChange, projects }: FiltersProps) {
  const handleSelect = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    onChange({ ...filters, [key]: value });
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;

    if (name === "difficulty") {
      handleSelect("difficulty", value as FilterState["difficulty"]);
    }
    if (name === "duration") {
      handleSelect("duration", value as FilterState["duration"]);
    }
    if (name === "sort") {
      handleSelect("sort", value as FilterState["sort"]);
    }
  };

  const handleReset = () => {
    onChange({
      stack: "All",
      difficulty: "all",
      duration: "all",
      sort: "recent",
    });
  };

  const countByStack = (stack: Skill | "All") => {
    if (stack === "All") return projects.length;
    return projects.filter((p) => p.skills.includes(stack)).length;
  };

  return (
    <section id="projects" className="projects-section">
      <div className="filters">

        <div className="filters__group">
          <div className="filters__header">
            <h2 className="section__title">Stack</h2>
            <button className="filters__reset" type="button" onClick={handleReset}>
                Reset
            </button>
          </div>
          <div className="filters__chips">
            {STACK_OPTIONS.map((stack) => (
              <button
                key={stack}
                type="button"
                className={`skill-chip ${
                  filters.stack === stack ? "is-active" : ""
                }`}
                onClick={() => handleSelect("stack", stack)}
              >
                {stack}({countByStack(stack)})
              </button>
            ))}
          </div>
        </div>
        <div className="filters_select-group">
          <div className="filters__row">
            <label className="filters__label" htmlFor="difficulty">
              난이도
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={filters.difficulty ?? "all"}
              onChange={handleSelectChange}
            >
              {DIFFICULTY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? "전체" : option}
                </option>
              ))}
            </select>
          </div>
        

          <div className="filters__row">
            <label className="filters__label" htmlFor="duration">
              기간
            </label>
            <select
              id="duration"
              name="duration"
              value={filters.duration ?? "all"}
              onChange={handleSelectChange}
            >
              {DURATION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {labelForDuration(option)}
                </option>
              ))}
            </select>
          </div>

          <div className="filters__row">
            <label className="filters__label" htmlFor="sort">
              정렬
            </label>
            <select
              id="sort"
              name="sort"
              value={filters.sort}
              onChange={handleSelectChange}
            >
              <option value="recent">최근 시작일</option>
              <option value="duration">소요 기간</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Filters;
