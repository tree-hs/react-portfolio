import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fetchProjectDetail } from "@/api/projects";
import { Project } from "@/types/project";
import { FilterState } from "@/components/Filters/Filters";
// src/images/ top50_stock* 이미지 4개 (실제 파일명: top50_stcok_*)
import top50Main from "@/images/top50_stcok_main.png";
import top50MainDataList from "@/images/top50_stcok_main_data_list.png";
import top50MainDataPopup from "@/images/top50_stcok_main_data_popup.png";
import top50MainLightMode from "@/images/top50_stcok_main_light_mode.png";

const TOP50_IMAGES = [
  { src: top50Main, label: "메인" },
  { src: top50MainDataList, label: "데이터 목록" },
  { src: top50MainDataPopup, label: "데이터 팝업" },
  { src: top50MainLightMode, label: "라이트 모드" },
];

interface ProjectDetailProps {
  projectId: number | null;
  filters: FilterState;
}

function ProjectDetail({ projectId, filters }: ProjectDetailProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
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

  const handleClose = () => {
    navigate({ pathname: "/", search: location.search }, { replace: true });
  };

  const handleLightboxBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setLightboxImage(null);
  };

  // ESC 닫기(라이트박스 우선) + 모달 열린 동안 배경 스크롤 잠금 (a11y/UX)
  useEffect(() => {
    if (!projectId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (lightboxImage) setLightboxImage(null);
      else handleClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, lightboxImage]);

  const EASE = [0.22, 1, 0.36, 1] as const;

  return (
    <AnimatePresence>
      {projectId && (
        <motion.div
          className="project-detail__overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-detail-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="project-detail"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
        <div className="project-detail__header">
          <h3 id="project-detail-title">Project Details</h3>
          <button
            type="button"
            onClick={handleClose}
            className="project-detail__close"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {loading && (
          <p className="project-detail__state">Loading project details...</p>
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

            {project.id === 8 ? (
              <section className="project-detail__top50-gallery" aria-label="TOP50 프로젝트 이미지">
                <p className="project-detail__gallery-desc">아래 이미지를 클릭하면 원본 크기로 볼 수 있습니다.</p>
                <div className="project-detail__image-gallery">
                  {TOP50_IMAGES.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      className="project-detail__gallery-item"
                      onClick={() => setLightboxImage(img.src)}
                    >
                      <img
                        src={img.src}
                        alt={`TOP50 ${img.label}`}
                        width={300}
                        loading="lazy"
                        decoding="async"
                        className="project-detail__gallery-img"
                      />
                    </button>
                  ))}
                </div>
              </section>
            ) : null}
          </>
            ) : null}
          </motion.div>

          {lightboxImage ? (
            <div
              className="project-detail__lightbox-overlay"
              onClick={handleLightboxBackdropClick}
              role="dialog"
              aria-modal="true"
              aria-label="이미지 확대 보기"
            >
              <img
                src={lightboxImage}
                alt="확대 보기"
                className="project-detail__lightbox-image"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ProjectDetail;
