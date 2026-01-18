import { useEffect, useMemo, useState } from "react";
import { fetchProjects } from "../../api/projects";
import { Project } from "../../types/project";
import ProjectCard from "../ProjectCard/ProjectCard";
import { FilterState } from "../Filters/Filters";

interface ProjectListProps {
  filters: FilterState;
  activeProjectId?: number | null;
}

function ProjectList({ filters, activeProjectId }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchProjects(filters)
      .then((data) => {
        if (!cancelled) {
          setProjects(data);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [filters]);

  const emptyState = !loading && !error && projects.length === 0;

  const listTitle = useMemo(() => {
    const pieces = [] as string[];
    if (filters.stack && filters.stack !== "All") pieces.push(filters.stack);
    if (filters.difficulty && filters.difficulty !== "all") pieces.push(filters.difficulty);
    if (filters.duration && filters.duration !== "all") pieces.push(filters.duration);
    if (pieces.length === 0) return "전체 프로젝트";
    return pieces.join(" · ");
  }, [filters]);

  return (
    <div className="project-list__section">
      {loading && <div className="project-list__state">Loading projects...</div>}
      {error && <div className="project-list__state project-list__state--error">{error}</div>}
      {emptyState && <div className="project-list__state">No projects found matching your criteria.</div>}

      {!loading && !error && projects.length > 0 ? (
        <div className="project-list">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isActive={project.id === activeProjectId}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default ProjectList;
