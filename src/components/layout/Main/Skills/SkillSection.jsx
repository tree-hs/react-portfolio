import SkillChip from "./SkillChip";

const SKILLS = [
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

function SkillSection() {
  return (
    <section className="skill-section mgb20">
      <h2 className="mgb10">Tech Stack</h2>
      <div className="flx_gp10">
        {SKILLS.map((skill) => (
          <SkillChip key={skill} label={skill} />
        ))}
      </div>
    </section>
  );
}

export default SkillSection;
