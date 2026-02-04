import { Link, useLocation } from "react-router-dom";
import type { Project } from "../../types/project";

interface ProjectCardProps {
  project: Project;
  isActive?: boolean;
}

const formatPeriod = (start: string, end?: string) => {
  const toYearMonth = (s: string) => s.slice(0, 7);
  const startStr = toYearMonth(start);
  if (!end) return `${startStr} ~ 진행중`;
  return `${startStr} ~ ${toYearMonth(end)}`;
};

function ProjectCard({ project, isActive }: ProjectCardProps) {
  const location = useLocation();

  return (
    <article
      className={`project-card ${isActive ? "project-card--active" : ""}`}
    >
      <div className="project-card__header">
        <div>
          <p className="project-card__label">{project.difficulty}</p>
          <h3>{project.title}</h3>
        </div>
      </div>

      <p className="project-card__description">{project.description}</p>

      <div className="project-card__meta">
        <span>{formatPeriod(project.period.start, project.period.end)}</span>
        {project.teamSize ? <span>팀 {project.teamSize}명</span> : null}
      </div>

      <div className="project-card__skills">
        {project.skills.map((skill) => (
          <span key={skill} className="project-card__skill">
            {skill}
          </span>
        ))}
      </div>

      <div className="project-card__links">
        {project.repository ? (
          <a
            href={project.repository}
            target="_blank"
            rel="noopener noreferrer"
          >
            Repository
          </a>
        ) : null}
        {project.demoUrl ? (
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
            Demo
          </a>
        ) : null}
        <Link
          to={{ pathname: `/projects/${project.id}`, search: location.search }}
        >
          상세 보기
        </Link>
      </div>
    </article>
  );
}

export default ProjectCard;
