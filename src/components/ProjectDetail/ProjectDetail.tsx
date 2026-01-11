import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchProjectDetail } from "../../api/projects";
import { Project } from "../../types/project";
import { FilterState } from "../Filters/Filters";

interface ProjectDetailProps {
  projectId: number | null;
  filters: FilterState;
}

function ProjectDetail({ projectId, filters }: ProjectDetailProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!projectId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchProjectDetail(projectId, filters)
      .then((data) => {
        if (!cancelled) setProject(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters, projectId]);

  if (!projectId) return null;

  const handleClose = () => {
    navigate({ pathname: "/", search: location.search }, { replace: true });
  };

  return (
    <div className="project-detail__overlay" role="dialog" aria-modal="true">
      <div className="project-detail">
        <div className="project-detail__header">
          <h3>프로젝트 상세</h3>
          <button
            type="button"
            onClick={handleClose}
            className="project-detail__close"
          >
            닫기
          </button>
        </div>

        {loading && (
          <p className="project-detail__state">세부 정보를 불러오는 중...</p>
        )}
        {error && (
          <p className="project-detail__state project-detail__state--error">
            {error}
          </p>
        )}

        {project && !loading && !error ? (
          <>
            <h4>{project.title}</h4>
            <p className="project-detail__description">{project.description}</p>
            <dl className="project-detail__grid">
              <div>
                <dt>난이도</dt>
                <dd>{project.difficulty}</dd>
              </div>
              <div>
                <dt>기간</dt>
                <dd>
                  {project.period.start} ~ {project.period.end ?? "진행중"}
                </dd>
              </div>
              <div>
                <dt>팀 규모</dt>
                <dd>{project.teamSize ? `${project.teamSize}명` : "개인"}</dd>
              </div>
              <div>
                <dt>스택</dt>
                <dd className="project-detail__skills">
                  {project.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </dd>
              </div>
            </dl>
            <div className="project-detail__links">
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
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Demo
                </a>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default ProjectDetail;
