// type |,& 등의 조합/표현을 담을수 있음.
export type Skill =
  | "All"
  | "React"
  | "TypeScript"
  | "Next.js"
  | "React API"
  | "Vite"
  | "PhpMySql"
  | "Php"
  | "Html"
  | "Css"
  | "JavaScript"
  | "Jquery";

export type Difficulty = "초급" | "중급" | "고급";

export type DurationCategory = "short" | "medium" | "long";

//interface 필드 타입 같은걸 설정해서 담을수 있는듯
export interface ProjectPeriod {
  // 기간
  start: string;
  end?: string; // ?일 경우 undefined로 전달
}

export interface Project {
  id: number;
  title: string;
  description: string;
  skills: Skill[];
  difficulty: Difficulty;
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
