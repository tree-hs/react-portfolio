import {
  DurationCategory,
  Project,
  ProjectQueryParams,
  Skill,
} from "../types/project";

const ENDPOINT = "/projects.json";
const responseCache = new Map<string, Project[]>();

const durationCategory = (weeks: number): DurationCategory => {
  if (weeks <= 4) return "short";
  if (weeks <= 12) return "medium";
  return "long";
};

const buildQueryString = (params: ProjectQueryParams): string => {
  const searchParams = new URLSearchParams();

  if (params.stack && params.stack !== "All")
    searchParams.set("stack", params.stack);
  if (params.difficulty && params.difficulty !== "all") {
    searchParams.set("difficulty", params.difficulty);
  }
  if (params.duration && params.duration !== "all") {
    searchParams.set("duration", params.duration);
  }
  if (params.sort) searchParams.set("sort", params.sort);

  return searchParams.toString();
};

const matchesFilters = (
  project: Project,
  params: ProjectQueryParams
): boolean => {
  const { stack, difficulty, duration } = params;

  const matchesStack =
    !stack ||
    stack === "All" ||
    project.skills.some((skill) => skill === stack);
  const matchesDifficulty =
    !difficulty || difficulty === "all" || project.difficulty === difficulty;
  const matchesDuration = !duration || duration === "all";

  return matchesStack && matchesDifficulty && matchesDuration;
};

const sortProjects = (
  projects: Project[],
  sort?: ProjectQueryParams["sort"]
): Project[] => {
  return [...projects].sort(
    (a, b) =>
      new Date(b.period.start).getTime() - new Date(a.period.start).getTime()
  );
};

export const fetchProjects = async (
  params: ProjectQueryParams = {}
): Promise<Project[]> => {
  const queryString = buildQueryString(params);

  if (responseCache.has(queryString)) {
    return responseCache.get(queryString)!;
  }

  const url = `${import.meta.env.BASE_URL}projects.json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.statusText}`);
  }

  const payload: Project[] = await response.json();
  const filtered = sortProjects(
    payload.filter((project) => matchesFilters(project, params)),
    params.sort
  );

  responseCache.set(queryString, filtered);
  return filtered;
};

export const fetchProjectDetail = async (
  id: number,
  params: ProjectQueryParams = {}
): Promise<Project> => {
  // Prefer cached list results to avoid duplicate network calls when the list has already been fetched.
  const queryString = buildQueryString(params);
  const cached = responseCache.get(queryString);

  if (cached) {
    const cachedProject = cached.find((project) => project.id === id);
    if (cachedProject) return cachedProject;
  }

  const projects = await fetchProjects(params);
  const project = projects.find((item) => item.id === id);

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};

export const STACK_OPTIONS: Skill[] = [
  "All",
  "React",
  "TypeScript",
  "Next.js",
  "React API",
  "Vite",
  "PhpMySql",
  "Php",
  "Html",
  "Css",
  "JavaScript",
  "Jquery",
];

export const DIFFICULTY_OPTIONS: ProjectQueryParams["difficulty"][] = [
  "all",
  "초급",
  "중급",
  "고급",
];

export const DURATION_OPTIONS: ProjectQueryParams["duration"][] = [
  "all",
  "short",
  "medium",
  "long",
];
