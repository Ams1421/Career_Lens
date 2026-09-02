import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiAward,
  FiBriefcase,
  FiArrowRight,
  FiStar,
  FiTrendingUp,
} from "react-icons/fi";
import { matchingApi } from "../../api/matching";
import { careerApi } from "../../api/career";
import Sidebar from "../../components/layout/Sidebar";
import TopNavbar from "../../components/layout/TopNavbar";
import { dashboardApi } from "../../api/dashboard";
import useAuth from "../../hooks/useAuth";

export default function Matching() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState(null);

  const [match, setMatch] = useState(null);
  const [topJobs, setTopJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/", { replace: true });
  }, [logout, navigate]);

  // CareerLens demo job
  const jobId = "01a02561-2159-7be0-9fe8-86d73e1751e7";

  const loadData = useCallback(async () => {
    try {
      const [response, profileRes, topJobsRes] = await Promise.all([
        matchingApi.getJobMatch(jobId),
        dashboardApi.getProfile(),
        careerApi.getTopJobs(),
      ]);

      setMatch(response.data);
      setProfile(profileRes.data);
      setTopJobs(topJobsRes.data || []);
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
        return;
      }

      console.error("Failed to load match", error);
    } finally {
      setLoading(false);
    }
  }, [jobId, handleLogout]);

  useEffect(() => {
  const id = requestAnimationFrame(() => {
    void loadData();
  });

  return () => cancelAnimationFrame(id);
}, [loadData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-slate-300">
        Loading AI Match...
      </div>
    );
  }
  if (!match) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-slate-300">
        Unable to load match.
      </div>
    );
  }

  const matchPercent = Math.round(match.matchPercentage || 84);
  const circumference = 314; // 2 * pi * r (r=50)
  const strokeDashoffset = circumference - (circumference * matchPercent) / 100;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-20 right-10 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <TopNavbar
        profile={profile}
        logout={handleLogout}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <main
        className={`transition-all duration-300 ml-0 ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        } mt-20 sm:mt-24 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 relative z-10 overflow-x-hidden`}
      >
        <div className="w-full max-w-[98%] mx-auto space-y-6 sm:space-y-8">
          {/* Header Title Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] border border-purple-500/20 bg-gradient-to-r from-[#0B1021] via-[#11162F] to-[#050816] p-6 sm:p-8 lg:p-10 shadow-[0_15px_45px_rgba(124,58,237,.18)]"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative flex flex-col gap-2">
              <span className="inline-block w-fit px-4 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold rounded-full mb-1">
                AI Match Engine
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight flex items-center gap-2">
                AI Match Dashboard{" "}
                <span className="w-3 h-3 rounded-full bg-purple-500 inline-block"></span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base mt-1">
                Find jobs that match your skills
              </p>
            </div>
          </motion.section>

          {/* Top Row: Multi-Colored Segmented Progress Ring & Top Matched Jobs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Circular Match Card with Multi-Colored Ring */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="lg:col-span-5 group bg-[#0B1021]/80 backdrop-blur-2xl border border-purple-500/20 rounded-[24px] sm:rounded-[30px] p-6 sm:p-8 shadow-[0_15px_45px_rgba(124,58,237,.12)] hover:border-purple-400/40 hover:shadow-[0_20px_60px_rgba(139,92,246,.18)] transition-all duration-300 flex flex-col items-center justify-center text-center relative overflow-hidden"
            >
              <h3 className="text-sm font-semibold text-slate-400 mb-4">
                Overall Match Score
              </h3>

              <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center my-2">
                {/* SVG Multi-Colored Neon Ring */}
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 120 120"
                >
                  {/* Background Track */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    className="text-slate-800"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                  />

                  {/* Animated Multi-Colored Gradient Progress Ring */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="url(#multiColorNeonGradient)"
                    fill="transparent"
                    style={{
                      filter: "drop-shadow(0 0 8px rgba(168,85,247,0.5))",
                      transition: "stroke-dashoffset 1.5s ease-in-out",
                    }}
                  />

                  {/* Multi-Color Gradient Definition matching the reference image */}
                  <defs>
                    <linearGradient
                      id="multiColorNeonGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#a855f7" /> {/* Purple */}
                      <stop offset="35%" stopColor="#3b82f6" /> {/* Blue */}
                      <stop offset="70%" stopColor="#10b981" /> {/* Emerald */}
                      <stop offset="100%" stopColor="#ec4899" /> {/* Pink */}
                    </linearGradient>
                  </defs>
                </svg>

                {/* Inner Percentage Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    {topJobs[0]?.matchPercentage || matchPercent}%
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                    OVERALL MATCH
                  </span>
                  <div className="mt-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold px-3 py-0.5 rounded-full">
                    Great Match
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <FiTrendingUp size={14} /> 12% higher than last week
              </div>
            </motion.div>

            {/* Top Matched Jobs Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="lg:col-span-7 group bg-[#0B1021]/80 backdrop-blur-2xl border border-purple-500/20 rounded-[24px] sm:rounded-[30px] p-6 sm:p-8 shadow-[0_15px_45px_rgba(124,58,237,.12)] hover:border-purple-400/40 hover:shadow-[0_20px_60px_rgba(139,92,246,.18)] transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FiBriefcase className="text-purple-400 text-lg" />
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    Top Matched Jobs
                  </h2>
                </div>
                <button className="text-xs text-purple-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer">
                  View All &rarr;
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-900/60 border border-purple-500/40 rounded-2xl p-4 flex items-center justify-between hover:border-purple-500/70 transition gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow shrink-0">
                      FS
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-white text-sm truncate">
                        {topJobs[0]?.title || "Full Stack Developer"}
                      </h4>
                      <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-2 flex-wrap">
                        <span>AI Career Match</span> • <span>Remote</span> •{" "}
                        <span>Full Time</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-emerald-400 font-extrabold text-sm sm:text-base">
                      {topJobs[0]?.matchPercentage || matchPercent}%
                    </span>
                    <FiArrowRight className="text-slate-500" />
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:border-purple-500/40 transition gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center font-bold text-white text-xs shadow shrink-0">
                      RD
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-white text-sm truncate">
                        React Developer
                      </h4>
                      <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-2 flex-wrap truncate">
                        <span>Infosys • Bengaluru</span> •{" "}
                        <span>Bengaluru</span> • <span>Full Time</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-amber-400 font-extrabold text-sm sm:text-base">
                      25.00%
                    </span>
                    <FiArrowRight className="text-slate-500" />
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:border-purple-500/40 transition gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center font-bold text-white text-xs shadow shrink-0">
                      .NET
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-white text-sm truncate">
                        .NET Developer
                      </h4>
                      <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-2 flex-wrap truncate">
                        <span>TCS • Hyderabad</span> • <span>Hyderabad</span> •{" "}
                        <span>Full Time</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-blue-400 font-extrabold text-sm sm:text-base">
                      20.00%
                    </span>
                    <FiArrowRight className="text-slate-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Row: Matched Skills, Missing Skills, Strong Skills */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Matched Skills Card */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="group bg-[#0B1021]/80 backdrop-blur-2xl border border-purple-500/20 rounded-[24px] sm:rounded-[30px] p-6 shadow-[0_15px_45px_rgba(124,58,237,.12)] hover:border-purple-400/50 hover:shadow-[0_20px_60px_rgba(139,92,246,.18)] transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <FiCheckCircle /> Matched Skills
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white mb-1">
                  {match.matchedSkills?.length || 1}
                </div>
                <p className="text-xs text-slate-400">
                  skill matches your target role
                </p>
              </div>

              <div className="py-4 flex justify-center">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] group-hover:scale-110 transition-transform">
                  <FiCheckCircle size={36} />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800">
                {(match.matchedSkills || [".NET"]).map((skill) => (
                  <span
                    key={skill}
                    className="bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Missing Skills Card */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="group bg-[#0B1021]/80 backdrop-blur-2xl border border-purple-500/20 rounded-[24px] sm:rounded-[30px] p-6 shadow-[0_15px_45px_rgba(124,58,237,.12)] hover:border-purple-400/50 hover:shadow-[0_20px_60px_rgba(139,92,246,.18)] transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs uppercase font-bold tracking-wider text-orange-400 flex items-center gap-1.5">
                    <FiAlertCircle /> Missing Skills
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white mb-1">
                  {match.missingSkills?.length || 2}
                </div>
                <p className="text-xs text-slate-400">
                  skills to improve your match
                </p>
              </div>

              <div className="py-4 flex justify-center">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-orange-600/20 to-amber-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.2)] group-hover:scale-110 transition-transform">
                  <FiAlertCircle size={36} />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800">
                {(match.missingSkills || ["React", "PostgreSQL"]).map(
                  (skill) => (
                    <span
                      key={skill}
                      className="bg-orange-950/70 border border-orange-500/40 text-orange-300 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                    >
                      {skill}
                    </span>
                  ),
                )}
              </div>
            </motion.div>

            {/* Strong Skills Card */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="group bg-[#0B1021]/80 backdrop-blur-2xl border border-purple-500/20 rounded-[24px] sm:rounded-[30px] p-6 shadow-[0_15px_45px_rgba(124,58,237,.12)] hover:border-purple-400/50 hover:shadow-[0_20px_60px_rgba(139,92,246,.18)] transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs uppercase font-bold tracking-wider text-blue-400 flex items-center gap-1.5">
                    <FiAward /> Strong Skills
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white mb-1">
                  {match.skillGap?.length || 2}
                </div>
                <p className="text-xs text-slate-400">
                  strong skills increasing your match
                </p>
              </div>

              <div className="py-4 flex justify-center">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)] group-hover:scale-110 transition-transform">
                  <FiAward size={36} />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800">
                {(
                  match.skillGap?.map((g) => g.skill) || ["React", "PostgreSQL"]
                ).map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-950/70 border border-blue-500/40 text-blue-300 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* AI Recommendation Banner with Learning Path */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="group bg-[#0B1021]/80 backdrop-blur-2xl border border-purple-500/40 rounded-[24px] sm:rounded-[30px] p-6 sm:p-8 shadow-[0_15px_45px_rgba(124,58,237,.12)] hover:border-purple-400/80 transition-all duration-300 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"
          >
            <div className="space-y-2 flex-1">
              <h2 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                <FiStar className="text-purple-400" /> AI Recommendation
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {match.recommendation ||
                  "Learn React, PostgreSQL to improve your match. These skills are in high demand and can boost your match score by up to 35%."}
              </p>
            </div>

            {/* Recommended Learning Path Stepper */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full lg:w-auto justify-between">
              <div>
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-2">
                  Recommended Learning Path
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-bold rounded-xl flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">
                      1
                    </span>{" "}
                    React Basics
                  </span>
                  <span className="text-slate-500">&rarr;</span>
                  <span className="px-3 py-1 bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-bold rounded-xl flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">
                      2
                    </span>{" "}
                    Advanced React
                  </span>
                  <span className="text-slate-500">&rarr;</span>
                  <span className="px-3 py-1 bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-bold rounded-xl flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">
                      3
                    </span>{" "}
                    PostgreSQL Mastery
                  </span>
                </div>
              </div>

              <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold px-5 py-3 rounded-xl text-xs shadow-lg shadow-purple-600/30 hover:opacity-95 transition flex items-center gap-2 shrink-0 cursor-pointer">
                Start Learning Path <FiArrowRight />
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
