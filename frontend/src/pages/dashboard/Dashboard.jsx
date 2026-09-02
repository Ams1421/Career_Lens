/*
===============================================================================
 CareerLens Dashboard (React + Tailwind + Framer Motion)
 Purpose:
 - Displays the AI-powered CareerLens dashboard.
 - Fetches profile, resume, roadmap, job matches and dashboard statistics.
 - UI only; business logic remains unchanged.
===============================================================================
*/

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiCode,
  FiBookOpen,
  FiFolder,
  FiFileText,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiCalendar,
  FiActivity,
} from "react-icons/fi";

import { LuSparkles } from "react-icons/lu";

import { motion } from "framer-motion";

import { dashboardApi } from "../../api/dashboard";
import { resumeApi } from "../../api/resume";
import { careerApi } from "../../api/career";
import { matchingApi } from "../../api/matching";

import useAuth from "../../hooks/useAuth";

import Sidebar from "../../components/layout/Sidebar";
import TopNavbar from "../../components/layout/TopNavbar";
import QuickActions from "../../components/dashboard/QuickActions";
import MatchScoreCard from "../../components/dashboard/MatchScoreCard";
import dashboardHeroImg from "../../assets/dashboard-hero.svg";

/**
 * Dashboard
 * -----------------------------------------------------------------------------
 * Main container for the CareerLens AI Dashboard.
 */
export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
    navigate("/", { replace: true });
  }, [logout, navigate]);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [resume, setResume] = useState(null);
  const [careerRecommendations, setCareerRecommendations] = useState([]);
  const [roadmap, setRoadmap] = useState(null);
  const [topJobs, setTopJobs] = useState([]);

  const [stats, setStats] = useState({
    skills: 0,
    education: 0,
    projects: 0,
    applications: 0,
  });

  const [recentApplications, setRecentApplications] = useState([]);
  const [matchScore, setMatchScore] = useState(84);

  const loadDashboard = useCallback(async () => {
    try {
      const jobId = "01a02561-2159-7be0-9fe8-86d73e1751e7";

      const [
        profileRes,
        skillsRes,
        educationRes,
        projectsRes,
        applicationsRes,
        recommendationsRes,
        roadmapRes,
        topJobsRes,
        resumeRes,
        matchRes,
      ] = await Promise.all([
        dashboardApi.getProfile(),
        dashboardApi.getSkills(),
        dashboardApi.getEducation(),
        dashboardApi.getProjects(),
        dashboardApi.getApplications(),
        careerApi.getRecommendations(),
        careerApi.getRoadmap(),
        careerApi.getTopJobs(),
        resumeApi.getMyResumes(),
        matchingApi.getJobMatch(jobId),
      ]);

      setResume(
        resumeRes.data?.find((r) => r.isPrimary) || resumeRes.data?.[0] || null,
      );

      setCareerRecommendations(recommendationsRes.data || []);
      setRoadmap(roadmapRes.data || null);
      setTopJobs(topJobsRes.data || []);
      setProfile(profileRes.data);

      if (matchRes?.data?.matchPercentage) {
        setMatchScore(Math.round(matchRes.data.matchPercentage));
      }

      setStats({
        skills: skillsRes.data?.length ?? 0,
        education: educationRes.data?.length ?? 0,
        projects: projectsRes.data?.length ?? 0,
        applications: applicationsRes.data?.length ?? 0,
      });

      setRecentApplications((applicationsRes.data || []).slice(0, 5));
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
        return;
      }

      console.error("Dashboard loading failed:", error);
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    const timer = setTimeout(loadDashboard, 0);

    const clock = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(clock);
    };
  }, [loadDashboard]);

  const greeting =
    currentTime.getHours() < 12
      ? "Good Morning"
      : currentTime.getHours() < 18
        ? "Good Afternoon"
        : "Good Evening";

  if (loading) {
    return (
      <div className="h-screen bg-[#030712] flex flex-col items-center justify-center text-slate-200">
        <div className="w-16 h-16 border-4 border-slate-800 border-t-purple-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-medium">
          Loading CareerLens Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans relative overflow-x-hidden">
      {/* Background Neon Ambient Glows matching the theme */}
      <div className="absolute top-20 right-10 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/2 left-20 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-blue-600/10 blur-[160px] rounded-full pointer-events-none"></div>

      {/* Single Unified Sidebar and TopNavbar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <TopNavbar
        profile={profile}
        logout={handleLogout}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Responsive main layout wrapping wrapper */}
      <main
        className={`transition-all duration-300 ml-0 ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        } mt-20 sm:mt-24 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 relative z-10 overflow-x-hidden`}
      >
        {/* Hero Banner - Premium AI Command Center */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] border border-purple-500/20 bg-gradient-to-br from-[#0B1021] via-[#11162F] to-[#050816] p-6 sm:p-8 lg:p-12 shadow-[0_0_45px_rgba(124,58,237,.18)]"
        >
          {/* Animated Background Glow */}
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-purple-500/25 blur-[90px]"></div>
          <div className="absolute bottom-0 left-10 h-56 w-56 rounded-full bg-blue-600/20 blur-[80px]"></div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 h-full">
            {/* Left Content */}
            <div className="flex-1 w-full">
              <div className="inline-flex items-center gap-3 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 sm:px-5 py-2 text-xs font-semibold text-purple-300 hover:border-purple-400 hover:bg-purple-500/20 transition">
                <LuSparkles />
                AI Career Intelligence
              </div>

              <h1 className="mt-4 sm:mt-5 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-white break-words">
                {greeting},{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {profile?.firstName}
                </span>
                👋
              </h1>

              <p className="mt-3 sm:mt-4 max-w-xl text-slate-400 text-xs sm:text-base leading-relaxed">
                Your personalized AI career workspace is ready. Track your
                profile, improve your resume, and discover your next
                opportunity.
              </p>

              {/* Date Pills */}
              <div className="mt-5 sm:mt-6 flex flex-wrap gap-2 sm:gap-3">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-700/70 bg-slate-900/60 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-300 backdrop-blur-xl">
                  <FiCalendar className="text-blue-400 shrink-0" />
                  {currentTime.toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </div>

                <div className="flex items-center gap-2 rounded-2xl border border-slate-700/70 bg-slate-900/60 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-300 backdrop-blur-xl">
                  <FiClock className="text-purple-400 shrink-0" />
                  {currentTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-emerald-300 backdrop-blur-xl">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                  System Online
                </div>
              </div>
            </div>

            {/* Right Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative hidden lg:flex h-[320px] w-[360px] items-center justify-center shrink-0"
            >
              <div className="absolute h-72 w-72 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/20 blur-[90px] animate-pulse"></div>

              <div className="absolute top-8 right-4 animate-float rounded-2xl border border-purple-500/30 bg-[#11162F]/80 px-4 py-3 backdrop-blur-xl shadow-[0_0_20px_rgba(124,58,237,.2)]">
                <div className="flex items-center gap-2 text-purple-300 text-sm font-semibold">
                  <FiActivity />
                  AI Active
                </div>
              </div>

              <img
                src={dashboardHeroImg}
                alt="AI Career Interface"
                className="relative z-10 h-full w-full object-contain drop-shadow-[0_0_35px_rgba(168,85,247,.45)]"
              />
            </motion.div>
          </div>
        </motion.section>

        {/* Floating Hero Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 -mt-1 sm:-mt-2">
          <div className="rounded-2xl border border-slate-700/60 bg-[#0B1021]/85 backdrop-blur-xl p-3.5 sm:p-4 shadow-[0_15px_40px_rgba(124,58,237,.15)]">
            <p className="text-[10px] sm:text-xs uppercase text-slate-500 font-medium">
              Profile
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {profile?.profileStrength ?? 0}%
            </h3>
          </div>

          <div className="rounded-2xl border border-slate-700/60 bg-[#0B1021]/85 backdrop-blur-xl p-3.5 sm:p-4 shadow-[0_15px_40px_rgba(124,58,237,.15)]">
            <p className="text-[10px] sm:text-xs uppercase text-slate-500 font-medium">
              Skills
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {stats.skills}
            </h3>
          </div>

          <div className="rounded-2xl border border-slate-700/60 bg-[#0B1021]/85 backdrop-blur-xl p-3.5 sm:p-4 shadow-[0_15px_40px_rgba(124,58,237,.15)]">
            <p className="text-[10px] sm:text-xs uppercase text-slate-500 font-medium">
              Projects
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {stats.projects}
            </h3>
          </div>

          <div className="rounded-2xl border border-slate-700/60 bg-[#0B1021]/85 backdrop-blur-xl p-3.5 sm:p-4 shadow-[0_15px_40px_rgba(124,58,237,.15)]">
            <p className="text-[10px] sm:text-xs uppercase text-slate-500 font-medium">
              Applications
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {stats.applications}
            </h3>
          </div>
        </div>

        {/* 2. Premium Profile Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] border border-purple-500/20 bg-[#0B1021]/85 backdrop-blur-2xl p-5 sm:p-8 shadow-[0_0_40px_rgba(124,58,237,.15)]"
        >
          <div className="absolute -right-20 top-0 h-64 w-72 rounded-full bg-purple-600/10 blur-[90px]"></div>

          <div className="relative z-10 flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 sm:gap-6">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 blur-xl opacity-40 scale-110"></div>

                <img
                  src={
                    profile?.profileImageUrl
                      ? profile.profileImageUrl.startsWith("http")
                        ? profile.profileImageUrl
                        : `https://careerlens-api-7h4w.onrender.com${profile.profileImageUrl}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          `${profile?.firstName || "User"} ${
                            profile?.lastName || ""
                          }`,
                        )}&background=0b1021&color=fff`
                  }
                  alt="Profile"
                  className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,.45)]"
                />

                <div className="absolute bottom-1 right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-[#0B1021] flex items-center justify-center shadow-lg text-xs">
                  ✓
                </div>
              </div>

              <div className="w-full">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h2 className="text-xl sm:text-3xl font-black text-white">
                    {profile?.firstName} {profile?.lastName}
                  </h2>

                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] sm:text-xs font-semibold">
                    VERIFIED
                  </span>
                </div>

                <p className="text-purple-400 font-semibold mt-1.5 sm:mt-2 text-sm sm:text-base">
                  {profile?.headline || "CareerLens Candidate"}
                </p>

                <p className="text-slate-400 mt-2.5 sm:mt-3 max-w-2xl leading-relaxed text-xs sm:text-base">
                  {profile?.bio ||
                    "Complete your profile to unlock AI-powered recommendations, ATS optimization, and personalized career guidance."}
                </p>

                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4 sm:mt-5">
                  <span className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-900/70 border border-slate-700 text-slate-300 text-[11px] sm:text-xs">
                    🎯 AI Ready
                  </span>
                  <span className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-900/70 border border-slate-700 text-slate-300 text-[11px] sm:text-xs">
                    📄 Resume
                  </span>
                  <span className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-900/70 border border-slate-700 text-slate-300 text-[11px] sm:text-xs">
                    💼 Portfolio
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:w-80 w-full bg-slate-900/40 lg:bg-transparent p-4 lg:p-0 rounded-2xl border border-slate-800/80 lg:border-none">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs sm:text-sm font-semibold text-slate-300">
                  Profile Completion
                </span>
                <span className="text-base sm:text-lg font-bold text-purple-300">
                  {profile?.profileStrength ?? 0}%
                </span>
              </div>

              <div className="h-2.5 sm:h-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profile?.profileStrength ?? 0}%` }}
                  transition={{ duration: 1 }}
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,.5)]"
                />
              </div>

              <p className="text-[11px] sm:text-xs text-slate-400 mt-2.5">
                Complete more sections to improve AI job matching.
              </p>

              <button
                onClick={() => navigate("/profile")}
                className="mt-4 sm:mt-6 w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 transition font-semibold text-white text-sm sm:text-base shadow-[0_0_20px_rgba(124,58,237,.3)] cursor-pointer"
              >
                Edit Profile
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 sm:mt-8 sm:pt-8 border-t border-slate-800">
            <Info title="Location" value={profile?.location} />
            <Info title="Graduation" value={profile?.graduationYear} />
            <Info title="CGPA" value={profile?.cgpa} />
            <Info title="Email" value={profile?.email} />
          </div>
        </motion.section>

        {/* 3. Progress + AI Match Score Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProgressCard
            title="Profile Strength"
            value={profile?.profileStrength ?? 0}
            text="Complete more sections for better recommendations."
          />

          <MatchScoreCard score={matchScore} />
        </div>

        {/* 4. Quick Actions */}
        <QuickActions />

        {/* 5. Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard title="Skills" value={stats.skills} icon={<FiCode />} />
          <StatCard
            title="Education"
            value={stats.education}
            icon={<FiBookOpen />}
          />
          <StatCard
            title="Projects"
            value={stats.projects}
            icon={<FiFolder />}
          />
          <StatCard
            title="Applications"
            value={stats.applications}
            icon={<FiFileText />}
          />
        </div>

        {/* 6. AI Insights & Resume Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative overflow-hidden rounded-[24px] sm:rounded-[30px] border border-purple-500/20 bg-[#0B1021]/85 backdrop-blur-2xl p-5 sm:p-8 shadow-[0_15px_40px_rgba(124,58,237,.12)]">
            <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-purple-500/10 blur-3xl"></div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
                🤖 AI Career Insights
              </div>

              <h3 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-black text-white">
                Personalized Recommendations
              </h3>

              <p className="mt-2.5 sm:mt-3 text-slate-400 text-xs sm:text-sm">
                Based on your profile, AI suggests these improvements.
              </p>

              <div className="mt-5 sm:mt-6 space-y-3 sm:space-y-4">
                {careerRecommendations.length === 0 ? (
                  <p className="text-slate-400 text-sm">
                    No recommendations yet.
                  </p>
                ) : (
                  careerRecommendations.slice(0, 3).map((career) => (
                    <motion.div
                      key={career.title}
                      whileHover={{ x: 6 }}
                      className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-700 hover:border-purple-500/40 transition"
                    >
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white shrink-0">
                        <FiTrendingUp />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm sm:text-base truncate">
                          {career.title}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-400">
                          {career.matchPercentage}% Match
                        </p>
                      </div>

                      <span className="text-emerald-400 font-bold text-sm sm:text-base shrink-0">
                        {career.matchPercentage}%
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[24px] sm:rounded-[30px] border border-purple-500/20 bg-[#0B1021]/85 backdrop-blur-2xl p-5 sm:p-8 shadow-[0_15px_40px_rgba(124,58,237,.12)]">
            <div className="absolute -right-12 top-0 w-40 h-40 rounded-full bg-purple-500/10 blur-3xl"></div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                ✨ AI Resume Intelligence
              </div>

              <h3 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-black text-white">
                Resume Optimization
              </h3>

              <div className="flex flex-col items-center mt-6 sm:mt-8">
                <div className="relative w-36 h-36 sm:w-40 sm:h-40">
                  <div className="absolute inset-4 rounded-full bg-purple-500/15 blur-2xl"></div>

                  <svg
                    className="relative w-full h-full -rotate-90"
                    viewBox="0 0 120 120"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="rgba(51,65,85,.45)"
                      strokeWidth="12"
                      fill="none"
                    />

                    <motion.circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="url(#atsGradient)"
                      strokeWidth="10"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={314}
                      initial={{ strokeDashoffset: 314 }}
                      whileInView={{
                        strokeDashoffset:
                          314 - (314 * (resume?.atsScore || 0)) / 100,
                      }}
                      transition={{ duration: 1 }}
                    />

                    <defs>
                      <linearGradient id="atsGradient">
                        <stop offset="0%" stopColor="#2563EB" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-3xl sm:text-4xl font-black text-white">
                      {resume?.atsScore || 0}
                    </p>
                    <p className="text-[11px] sm:text-xs text-purple-300 font-medium">
                      ATS Score
                    </p>
                  </div>
                </div>

                <p className="mt-4 sm:mt-5 text-center text-slate-400 max-w-xs text-xs sm:text-sm">
                  {resume?.atsSuggestions ||
                    "Upload a resume to unlock AI analysis."}
                </p>

                <div className="flex flex-wrap justify-center gap-2 mt-4 sm:mt-5">
                  {["ATS Optimized", "Skills Match", "AI Suggestions"].map(
                    (chip) => (
                      <span
                        key={chip}
                        className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-900/70 border border-slate-700 text-slate-300 text-[11px] sm:text-xs hover:bg-purple-500/15 hover:border-purple-500/40 transition"
                      >
                        {chip}
                      </span>
                    ),
                  )}
                </div>

                <button
                  onClick={() => navigate("/resume")}
                  className="mt-5 sm:mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 transition text-white font-semibold text-sm sm:text-base shadow-[0_0_20px_rgba(124,58,237,.3)] cursor-pointer"
                >
                  Improve Resume
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 8. AI Learning Roadmap */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-[24px] sm:rounded-[30px] border border-purple-500/20 bg-[#0B1021]/85 backdrop-blur-2xl p-5 sm:p-8 shadow-[0_15px_40px_rgba(124,58,237,.12)]"
        >
          <div className="absolute -right-16 top-0 w-56 h-56 rounded-full bg-purple-500/10 blur-3xl"></div>

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              🚀 AI Career Roadmap
            </div>

            <h2 className="mt-3 sm:mt-4 text-xl sm:text-3xl font-black text-white">
              Your Personalized Learning Journey
            </h2>

            <p className="mt-2.5 sm:mt-3 text-slate-400 max-w-2xl text-xs sm:text-base">
              Follow this AI-generated roadmap to strengthen your skills and
              improve your career opportunities.
            </p>

            {roadmap?.weeks?.length ? (
              <div className="mt-8 sm:mt-10 space-y-4 sm:space-y-6">
                {roadmap.weeks.map((week, index) => (
                  <motion.div
                    key={week.week}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ y: -4 }}
                    className="group relative rounded-[20px] sm:rounded-[24px] border border-slate-700 bg-slate-900/60 p-4 sm:p-6 hover:border-purple-500/40 hover:shadow-[0_20px_40px_rgba(124,58,237,.18)] transition-all duration-300"
                  >
                    <div className="flex gap-4 sm:gap-5">
                      <div className="relative flex flex-col items-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-[0_0_18px_rgba(168,85,247,.35)] shrink-0 text-sm sm:text-base">
                          {week.week}
                        </div>

                        {index !== roadmap.weeks.length - 1 && (
                          <div className="mt-3 w-1 flex-1 min-h-[50px] sm:min-h-[60px] rounded-full bg-gradient-to-b from-purple-500 to-transparent"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <p className="text-purple-300 text-[10px] sm:text-xs uppercase tracking-[0.18em] font-semibold">
                              Week {week.week}
                            </p>
                            <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5 sm:mt-1 truncate">
                              {week.title}
                            </h3>
                          </div>

                          <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] sm:text-xs font-semibold">
                            AI Recommended
                          </span>
                        </div>

                        <ul className="mt-4 sm:mt-5 space-y-2.5 sm:space-y-3">
                          {(week.tasks || []).map((task, i) => (
                            <motion.li
                              key={i}
                              whileHover={{ x: 4 }}
                              className="flex items-center gap-3 text-slate-300 text-xs sm:text-sm"
                            >
                              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                                <FiCheckCircle className="text-purple-400 text-xs sm:text-sm" />
                              </div>
                              <span className="break-words">{task}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-900/60 p-6 sm:p-8 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl sm:text-2xl mb-4">
                  🚀
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Roadmap Not Ready Yet
                </h3>
                <p className="text-slate-400 mt-2 max-w-md mx-auto text-xs sm:text-sm">
                  Complete your profile and upload a resume to generate your
                  personalized AI learning roadmap.
                </p>
                <button
                  onClick={() => navigate("/profile")}
                  className="mt-5 sm:mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 transition text-white font-semibold text-sm cursor-pointer"
                >
                  Complete Profile
                </button>
              </div>
            )}
          </div>
        </motion.section>

        {/* 9. Recent Activity & Top Matched Job */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="relative overflow-hidden rounded-[24px] sm:rounded-[30px] border border-purple-500/20 bg-[#0B1021]/85 backdrop-blur-2xl p-5 sm:p-8 shadow-[0_15px_40px_rgba(124,58,237,.12)]"
          >
            <div className="absolute -left-10 top-0 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl"></div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
                ⚡ Activity Timeline
              </div>

              <h3 className="mt-3 sm:mt-4 text-xl sm:text-3xl font-black text-white">
                Recent Activity
              </h3>

              <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-5">
                {[
                  "Applied for Full Stack Developer",
                  "Updated Profile",
                  "Added .NET Skill",
                  "AI Match Calculated",
                ].map((activity, index) => (
                  <motion.div
                    key={activity}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-700 hover:border-purple-500/40 transition"
                  >
                    <div className="relative flex flex-col items-center">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,.35)] shrink-0">
                        <FiCheckCircle className="text-white text-sm" />
                      </div>

                      {index !== 3 && (
                        <div className="w-1 h-6 sm:h-8 mt-2 rounded-full bg-gradient-to-b from-purple-500 to-transparent"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-xs sm:text-base break-words">
                        {activity}
                      </p>
                      <p className="text-[11px] sm:text-sm text-slate-400 mt-0.5 sm:mt-1">
                        Just now
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="relative overflow-hidden rounded-[24px] sm:rounded-[30px] border border-purple-500/20 bg-[#0B1021]/85 backdrop-blur-2xl p-5 sm:p-8 shadow-[0_15px_40px_rgba(124,58,237,.12)] flex flex-col justify-between"
          >
            <div className="absolute -right-12 top-0 w-44 h-44 rounded-full bg-purple-500/10 blur-3xl"></div>

            {topJobs.length > 0 ? (
              <div className="relative flex flex-col h-full justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold w-fit">
                    💼 AI Best Match
                  </div>

                  <h3 className="mt-3 sm:mt-4 text-xl sm:text-3xl font-black text-white break-words">
                    {topJobs[0].title}
                  </h3>

                  <p className="mt-1 sm:mt-2 text-slate-400 text-xs sm:text-sm">
                    Based on your ATS resume analysis
                  </p>

                  <div className="mt-6 sm:mt-8 flex items-center justify-center sm:justify-start gap-4 sm:gap-6 flex-wrap">
                    <div className="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0">
                      <div className="absolute inset-4 rounded-full bg-emerald-500/10 blur-3xl"></div>

                      <svg
                        className="relative w-full h-full -rotate-90"
                        viewBox="0 0 120 120"
                      >
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="rgba(51,65,85,.35)"
                          strokeWidth="12"
                          fill="none"
                        />

                        <motion.circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="url(#jobGradient)"
                          strokeWidth="12"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={314}
                          initial={{ strokeDashoffset: 314 }}
                          whileInView={{
                            strokeDashoffset:
                              314 - (314 * topJobs[0].matchPercentage) / 100,
                          }}
                          transition={{ duration: 1 }}
                        />

                        <defs>
                          <linearGradient id="jobGradient">
                            <stop offset="0%" stopColor="#10B981" />
                            <stop offset="100%" stopColor="#8B5CF6" />
                          </linearGradient>
                        </defs>
                      </svg>

                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-3xl sm:text-4xl font-black text-white">
                          {topJobs[0].matchPercentage}
                        </p>
                        <p className="text-[11px] sm:text-xs text-emerald-300 font-semibold">
                          Match
                        </p>
                      </div>
                    </div>

                    <div className="flex-1 min-w-[160px]">
                      <p className="text-slate-300 text-xs sm:text-sm mb-2.5 sm:mb-3 font-semibold">
                        Top Skills
                      </p>

                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {topJobs[0].strengths?.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-900/70 border border-slate-700 hover:border-purple-500/40 hover:bg-purple-500/10 transition text-[11px] sm:text-xs text-slate-300"
                          >
                            {skill === ".net"
                              ? ".NET"
                              : skill.toUpperCase() === "SQL"
                                ? "SQL"
                                : skill.charAt(0).toUpperCase() +
                                  skill.slice(1)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 sm:mt-8 rounded-2xl border border-slate-700 bg-slate-900/60 p-3.5 sm:p-4">
                    <div className="flex items-center gap-2 text-emerald-300 text-xs sm:text-sm font-semibold">
                      <FiTrendingUp />
                      AI Analysis
                    </div>

                    <p className="mt-1.5 sm:mt-2 text-slate-400 text-xs sm:text-sm leading-relaxed">
                      This role aligns strongly with your resume skills and ATS
                      profile. Strengthening your highlighted skills can improve
                      future match scores.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/matching")}
                  className="mt-4 sm:mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:brightness-110 transition text-white font-semibold text-sm sm:text-base shadow-[0_0_20px_rgba(124,58,237,.35)] cursor-pointer"
                >
                  View AI Match
                </button>
              </div>
            ) : (
              <div className="text-center py-10 my-auto">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl sm:text-2xl mb-4">
                  💼
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white">
                  No Matches Yet
                </h3>
                <p className="text-slate-400 mt-2 max-w-xs mx-auto text-xs sm:text-sm">
                  Upload your resume to discover AI-matched jobs based on your
                  profile.
                </p>

                <button
                  onClick={() => navigate("/resume")}
                  className="mt-5 sm:mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:brightness-110 transition text-white font-semibold text-sm cursor-pointer"
                >
                  Upload Resume
                </button>
              </div>
            )}
          </motion.section>
        </div>

        {/* 8. Recent Jobs & Applications */}
        <div className="relative overflow-hidden rounded-[24px] sm:rounded-[30px] border border-purple-500/20 bg-[#0B1021]/85 backdrop-blur-2xl p-5 sm:p-8 shadow-[0_15px_40px_rgba(124,58,237,.12)]">
          <div className="absolute -left-10 bottom-0 w-40 h-40 rounded-full bg-purple-500/10 blur-3xl"></div>

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              📄 Applications
            </div>

            <h3 className="mt-3 sm:mt-4 text-xl sm:text-3xl font-black text-white">
              Recent Applications
            </h3>

            {recentApplications.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl sm:text-2xl mb-4">
                  📄
                </div>
                <p className="text-slate-400 text-xs sm:text-sm">
                  No applications yet.
                </p>
                <button
                  onClick={() => navigate("/jobs")}
                  className="mt-5 sm:mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 transition text-white font-semibold text-sm cursor-pointer"
                >
                  Browse Jobs
                </button>
              </div>
            ) : (
              <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                {recentApplications.map((app, index) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06 }}
                    whileHover={{ y: -4 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-700 hover:border-purple-500/40 hover:shadow-[0_20px_35px_rgba(124,58,237,.15)] transition"
                  >
                    <div className="min-w-0">
                      <h4 className="font-bold text-white text-sm sm:text-base truncate">
                        {app.jobTitle}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-400 mt-0.5 sm:mt-1 truncate">
                        {app.companyName}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      <span
                        className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                          app.status === "Accepted"
                            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                            : app.status === "Rejected"
                              ? "bg-red-500/10 text-red-300 border border-red-500/30"
                              : "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {app.status}
                      </span>

                      <button
                        onClick={() => navigate("/applications")}
                        className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm transition cursor-pointer"
                      >
                        View
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  const gradients = {
    Skills: "from-purple-600 to-indigo-500",
    Education: "from-blue-600 to-cyan-500",
    Projects: "from-pink-600 to-purple-500",
    Applications: "from-emerald-600 to-teal-500",
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="group relative overflow-hidden rounded-[24px] sm:rounded-[28px] border border-slate-700/50 bg-[#0B1021]/85 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_15px_40px_rgba(124,58,237,.12)] hover:border-purple-500/40 hover:shadow-[0_25px_55px_rgba(124,58,237,.25)]"
    >
      <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-purple-500/10 blur-3xl group-hover:bg-purple-500/20 transition"></div>

      <div className="relative z-10 flex items-start justify-between">
        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${
            gradients[title] || "from-purple-600 to-blue-600"
          } flex items-center justify-center text-white text-xl sm:text-2xl shadow-[0_0_18px_rgba(168,85,247,.35)] group-hover:rotate-6 transition shrink-0`}
        >
          {icon}
        </div>

        <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 sm:py-1 rounded-full">
          +12%
        </span>
      </div>

      <div className="relative z-10 mt-5 sm:mt-6">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-slate-500 font-semibold">
          {title}
        </p>

        <h2 className="mt-1.5 sm:mt-2 text-3xl sm:text-4xl font-black text-white">
          {value}
        </h2>

        <div className="mt-4 sm:mt-5 flex items-center gap-2">
          <div className="flex-1 h-1.5 sm:h-2 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 0.8 }}
              className={`h-full rounded-full bg-gradient-to-r ${
                gradients[title] || "from-purple-600 to-blue-600"
              }`}
            />
          </div>

          <span className="text-[10px] sm:text-xs text-slate-400">100%</span>
        </div>
      </div>
    </motion.div>
  );
}

function ProgressCard({ title, value, text }) {
  const circumference = 239;
  const strokeDashoffset = circumference - (circumference * value) / 100;

  return (
    <div className="bg-[#0b1021]/85 backdrop-blur-2xl border border-slate-700/50 rounded-[24px] sm:rounded-3xl p-5 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center gap-5 sm:gap-6 text-center sm:text-left">
      <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 90 90">
          <circle
            cx="45"
            cy="45"
            r="38"
            className="text-slate-800"
            strokeWidth="7"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="45"
            cy="45"
            r="38"
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="url(#progressMultiGradient)"
            fill="transparent"
            style={{
              filter: "drop-shadow(0 0 6px rgba(168,85,247,0.5))",
            }}
          />
          <defs>
            <linearGradient
              id="progressMultiGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="35%" stopColor="#3b82f6" />
              <stop offset="70%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base sm:text-lg font-extrabold text-white tracking-tight">
            {value}%
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-lg sm:text-xl font-bold text-white">{title}</h3>
        <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}

function Info({ title, value }) {
  return (
    <div className="min-w-0">
      <span className="text-slate-500 uppercase tracking-widest text-[9px] sm:text-[10px] font-bold block truncate">
        {title}
      </span>
      <p className="text-slate-200 font-semibold text-xs sm:text-sm mt-0.5 sm:mt-1 truncate">
        {value || "-"}
      </p>
    </div>
  );
}
