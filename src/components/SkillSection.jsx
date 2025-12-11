import SkillChip from "./SkillChip";

const SKILLS = [
  "All",
  "React",
  "RestAPI",
  "TypeScript",
  "React Native",
  "Next.js",
  "Zustand",
  "Lighthouse",
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
