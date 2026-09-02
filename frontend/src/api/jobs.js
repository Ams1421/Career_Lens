import api from "./axios";

export const jobsApi = {
  getJobs: () => api.get("/Jobs"),

  getJobById: (id) => api.get(`/Jobs/${id}`),

  applyJob: (jobId) =>
    api.post("/Applications", {
      jobId,
    }),
};