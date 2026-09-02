import api from "./axios";

export const skillsApi = {
  getSkills: () => api.get("/CandidateSkills"),

  getAvailableSkills: () => api.get("/Skills"),

  addSkill: (data) =>
    api.post("/CandidateSkills", {
      SkillId: data.skillId,
      ProficiencyLevel: data.proficiencyLevel,
      YearsOfExperience: data.yearsOfExperience,
    }),

  updateSkill: (id, data) =>
  api.put(`/CandidateSkills/${id}`, {
    SkillId: data.skillId,
    ProficiencyLevel: data.proficiencyLevel,
    YearsOfExperience: data.yearsOfExperience,
  }),

  deleteSkill: (id) => api.delete(`/CandidateSkills/${id}`),
};
