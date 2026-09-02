import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiBriefcase,
  FiDollarSign,
  FiArrowLeft,
  FiCalendar,
} from "react-icons/fi";
import Sidebar from "../../components/layout/Sidebar";
import TopNavbar from "../../components/layout/TopNavbar";
import { dashboardApi } from "../../api/dashboard";
import useAuth from "../../hooks/useAuth";

export default function JobDetails() {
  const { id } = useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
    navigate("/", { replace: true });
  }, [logout, navigate]);
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState(null);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchJob = async () => {
      try {
        const [response, profileRes] = await Promise.all([
          api.get(`/Jobs/${id}`),
          dashboardApi.getProfile(),
        ]);

        if (isMounted) {
          setJob(response.data);
          setProfile(profileRes.data);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          handleLogout();
          return;
        }

        console.error("Failed to load job:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(() => {
      void fetchJob();
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [id, handleLogout]);

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-300 bg-[#030712] min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-10 text-center text-red-400 bg-[#030712] min-h-screen flex items-center justify-center">
        Job not found.
      </div>
    );
  }

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
        <div className="w-full max-w-[98%] mx-auto space-y-6">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-purple-400 hover:underline font-semibold text-sm transition hover:translate-x-[-2px]"
          >
            <FiArrowLeft />
            Back to Jobs
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="group bg-gradient-to-r from-[#0B1021] via-[#11162F] to-[#050816] backdrop-blur-2xl rounded-[24px] sm:rounded-[30px] border border-purple-500/20 shadow-[0_15px_45px_rgba(124,58,237,.12)] p-6 sm:p-8 lg:p-10 space-y-6 hover:border-purple-400/40 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight truncate">
                  {job.title}
                </h1>
                <p className="text-base sm:text-lg text-purple-400 font-semibold mt-1 truncate">
                  {job.companyName}
                </p>
              </div>

              <div className="flex gap-3 shrink-0">
                <button
                  onClick={() => navigate(`/matching/${id}`)}
                  className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-[0_10px_35px_rgba(99,102,241,.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  AI Match
                </button>

                <button
                  onClick={() => alert("Application submitted successfully.")}
                  className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-[0_10px_35px_rgba(139,92,246,.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  Apply Now
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 sm:gap-6 text-slate-300 text-xs sm:text-sm pt-4 border-t border-slate-800/80 pb-4">
              <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-xl">
                <FiMapPin className="text-purple-400 shrink-0" />
                <span className="truncate">{job.location}</span>
              </div>

              <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-xl">
                <FiBriefcase className="text-blue-400 shrink-0" />
                <span className="truncate">
                  {job.workMode || job.employmentType || "Full Time"}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-xl">
                <FiDollarSign className="text-emerald-400 shrink-0" />
                <span className="truncate">
                  ₹{job.minimumSalary?.toLocaleString()} - ₹
                  {job.maximumSalary?.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-xl">
                <FiCalendar className="text-pink-400 shrink-0" />
                <span className="truncate">
                  {job.applicationDeadlineUtc
                    ? new Date(job.applicationDeadlineUtc).toLocaleDateString()
                    : "Open"}
                </span>
              </div>
            </div>

            <div className="space-y-6 pt-2 text-slate-300">
              <section className="bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-slate-800/80 hover:border-purple-500/30 transition">
                <h2 className="text-base sm:text-lg font-bold text-white mb-2">
                  Description
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
                  {job.description}
                </p>
              </section>

              {job.requirements && (
                <section className="bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-slate-800/80 hover:border-purple-500/30 transition">
                  <h2 className="text-base sm:text-lg font-bold text-white mb-2">
                    Requirements
                  </h2>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
                    {job.requirements}
                  </p>
                </section>
              )}

              {job.responsibilities && (
                <section className="bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-slate-800/80 hover:border-purple-500/30 transition">
                  <h2 className="text-base sm:text-lg font-bold text-white mb-2">
                    Responsibilities
                  </h2>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
                    {job.responsibilities}
                  </p>
                </section>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
