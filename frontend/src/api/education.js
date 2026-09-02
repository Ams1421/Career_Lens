import api from "./axios";

const educationApi = {
  getEducation: () => api.get("/Education"),

  addEducation: (data) =>
    api.post("/Education", data),

  updateEducation: (id, data) =>
    api.put(`/Education/${id}`, data),

  deleteEducation: (id) =>
    api.delete(`/Education/${id}`),
};

export default educationApi;