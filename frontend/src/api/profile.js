import api from "./axios";

const profileApi = {
  getProfile: () => api.get("/CandidateProfile/me"),

  updateProfile: (data) => api.put("/CandidateProfile/me", data),

  uploadProfileImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post("/CandidateProfile/me/image", formData);
  },
};

export default profileApi;