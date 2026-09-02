import api from "./api";

export default{
 getDashboard(){
  return api.get("/CandidateProfile/me")
   .then(profile=>Promise.all([
    api.get("/Skills"),
    api.get("/Education"),
    api.get("/Projects"),
    api.get("/Applications/me")
   ]).then(([skills,education,projects,applications])=>({
    data:{
      profile:profile.data,
      skills:skills.data.length,
      education:education.data.length,
      projects:projects.data.length,
      applications:applications.data.length
    }
   })));
 }
};