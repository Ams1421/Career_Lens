import axios from "./axios";

export const matchingApi = {
  getJobMatch: (jobId) => axios.get(`/Matching/jobs/${jobId}`),
};