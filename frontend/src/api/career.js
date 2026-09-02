import axios from "./axios";

export const careerApi = {
  getRecommendations: () => axios.get("/Career/recommendations"),
  getRoadmap: () => axios.get("/Career/roadmap"),
  getTopJobs: () => axios.get("/Career/top-jobs"),
};