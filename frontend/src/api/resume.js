import api from "./axios";

export const resumeApi = {
  getMyResumes: () => api.get("/Resume/me"),

  upload: (formData) =>
    api.post("/Resume/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  delete: (id) => api.delete(`/Resume/${id}`),

  setPrimary: (id) => api.put(`/Resume/${id}/primary`),

  recalculate: () => api.post("/Resume/recalculate"),

  analyzeJob: (jobId) => api.get(`/Resume/analyze-job/${jobId}`)
};