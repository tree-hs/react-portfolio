import { useEffect, useState } from "react";
import useSkillStore from "./layout/Main/Skills/useSkillStore";

function ProjectSection() {
  const [projects, setProjects] = useState([]);
  const { selectedSkill } = useSkillStore();

  useEffect(() => {
    fetch("/projects.json")
      .then((res) => res.json())
      .then(setProjects)
      .catch((err) => console.error("Failed to load projects", err));
  }, []);

  const filtered =
    selectedSkill === "All"
      ? projects
      : projects.filter((p) => p.skills.includes(selectedSkill));

  return (
    <section className="project-section">
      <h2>Projects</h2>
      <ul className="project-list">
        {filtered.map((project) => (
          <li key={project.id} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <p className="project-skills">{project.skills.join(", ")}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ProjectSection;
