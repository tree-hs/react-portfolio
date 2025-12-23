export type Skill =
  | "All"
  | "React"
  | "TypeScript"
  | "Next.js"
  | "Zustand"
  | "RestAPI"
  | "React Native"
  | "Lighthouse"
  | "Vite"
  | "GraphQL";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type DurationCategory = "short" | "medium" | "long";

export interface ProjectPeriod {
  start: string;
  end?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  skills: Skill[];
  difficulty: Difficulty;
  durationWeeks: number;
  period: ProjectPeriod;
  repository?: string;
  demoUrl?: string;
  teamSize?: number;
}

export interface ProjectQueryParams {
  stack?: Skill | "All";
  difficulty?: Difficulty | "all";
  duration?: DurationCategory | "all";
  sort?: "recent" | "duration";
}

export interface ProjectResponse {
  projects: Project[];
  total: number;
}
