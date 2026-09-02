import api from "./axios";

export const applicationsApi = {
  getMyApplications: () => api.get("/Applications/me"),

  apply: (jobId) =>
    api.post("/Applications", { jobId }),

  getApplication: (id) =>
    api.get(`/Applications/${id}`),

  updateStatus: (id, status) =>
    api.put(`/Applications/${id}/status`, { status }),

  deleteApplication: (id) =>
    api.delete(`/Applications/${id}`),
};