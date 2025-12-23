import { create } from "zustand";

const useSkillStore = create((set) => ({
  selectedSkill: "All",
  setSelectedSkill: (skill) => set({ selectedSkill: skill }),
}));

export default useSkillStore;