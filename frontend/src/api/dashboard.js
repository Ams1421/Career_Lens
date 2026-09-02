import api from "./axios";

export const dashboardApi = {
  getProfile: () => api.get("/CandidateProfile/me"),

  getSkills: () => api.get("/CandidateSkills"),

  getEducation: () => api.get("/Education"),

  getProjects: () => api.get("/Projects"),

  getApplications: () => api.get("/Applications/me"),
  // NEW
  getJobs: () => api.get("/Jobs"),
};