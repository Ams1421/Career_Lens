import api from "./axios";

export const projectsApi = {
  getProjects: () => api.get("/Projects"),

  addProject: (data) => api.post("/Projects", data),

  updateProject: (id, data) => api.put(`/Projects/${id}`, data),

  deleteProject: (id) => api.delete(`/Projects/${id}`),
};