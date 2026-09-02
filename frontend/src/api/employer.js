import api from "./axios";

export const employerApi = {
  getJobs: () => api.get("/Employer/jobs"),

  getJob: (id) => api.get(`/Employer/jobs/${id}`),

  createJob: (data) => api.post("/Employer/jobs", data),

  updateJob: (id, data) => api.put(`/Employer/jobs/${id}`, data),

  deleteJob: (id) => api.delete(`/Employer/jobs/${id}`),

  getApplicants: (jobId) =>
    api.get(`/Employer/jobs/${jobId}/applicants`),

  scheduleInterview: (data) =>
    api.post("/Employer/interviews", data),
};