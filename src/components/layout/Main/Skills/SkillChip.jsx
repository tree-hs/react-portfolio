import useSkillStore from "./useSkillStore";

function SkillChip({ label }) {
  const { selectedSkill, setSelectedSkill } = useSkillStore();

  const isActive = selectedSkill === label;

  return (
    <button
      type="button"
      className={`skill-chip ${isActive ? "is-active" : ""}`}
      onClick={() => setSelectedSkill(label)}
    >
      {label}
    </button>
  );
}

export default SkillChip;
