import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiTrash2,
  FiSearch,
  FiFilter,
  FiMapPin,
  FiCalendar,
  FiBookmark,
  FiExternalLink,
  FiPlus,
  FiBriefcase,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import { applicationsApi } from "../../api/applications";
import Sidebar from "../../components/layout/Sidebar";
import TopNavbar from "../../components/layout/TopNavbar";
import { dashboardApi } from "../../api/dashboard";
import useAuth from "../../hooks/useAuth";

export default function Applications() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
    navigate("/", { replace: true });
  }, [logout, navigate]);
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");

  const loadApplications = useCallback(async () => {
    try {
      const [response, profileRes] = await Promise.all([
        applicationsApi.getMyApplications(),
        dashboardApi.getProfile(),
      ]);

      setApplications(response.data ?? []);
      setProfile(profileRes.data);
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
        return;
      }

      console.error(error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadApplications();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadApplications]);

  async function removeApplication(id) {
    if (!window.confirm("Delete this application?")) return;

    try {
      await applicationsApi.deleteApplication(id);
      await loadApplications();
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
        return;
      }

      console.error(error);
      alert("Failed to delete application.");
    }
  }

  function getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case "applied":
        return "bg-blue-950/60 border border-blue-500/40 text-blue-300";
      case "reviewed":
      case "in review":
        return "bg-yellow-950/60 border border-yellow-500/40 text-yellow-300";
      case "shortlisted":
      case "interview":
        return "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300";
      case "rejected":
        return "bg-red-950/60 border border-red-500/40 text-red-300";
      default:
        return "bg-slate-800 border border-slate-700 text-slate-300";
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-slate-300">
        Loading Applications...
      </div>
    );
  }

  // Calculate dynamic stats from real data
  const totalApplications = applications.length;
  const appliedCount = applications.filter(
    (a) => a.status?.toLowerCase() === "applied" || !a.status,
  ).length;
  const inReviewCount = applications.filter((a) =>
    ["reviewed", "in review"].includes(a.status?.toLowerCase()),
  ).length;
  const interviewCount = applications.filter((a) =>
    ["shortlisted", "interview"].includes(a.status?.toLowerCase()),
  ).length;
  const offerCount = applications.filter(
    (a) => a.status?.toLowerCase() === "offer",
  ).length;

  // Filtered applications based on search query
  const filteredApplications = applications.filter((app) => {
    const query = search.toLowerCase();
    return (
      app.jobTitle?.toLowerCase().includes(query) ||
      app.companyName?.toLowerCase().includes(query)
    );
  });

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
          {/* Header Title Section & Track Button */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] border border-purple-500/20 bg-gradient-to-r from-[#0B1021] via-[#11162F] to-[#050816] p-6 sm:p-8 lg:p-10 shadow-[0_15px_45px_rgba(124,58,237,.18)] flex justify-between items-center flex-wrap gap-6"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

            <div>
              <span className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold rounded-full mb-3">
                Career Tracker
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight flex items-center gap-2">
                My Applications{" "}
                <span className="w-3 h-3 rounded-full bg-purple-500 inline-block"></span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base mt-2">
                Track all your job applications in one place.
              </p>
            </div>

            <button
              onClick={() => navigate("/jobs")}
              className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl font-bold shadow-[0_10px_35px_rgba(139,92,246,.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2 cursor-pointer text-sm"
            >
              <FiPlus size={18} />
              Track New Application
            </button>
          </motion.section>

          {/* 5 Statistics Cards Grid */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            <div className="group bg-[#0B1021]/80 backdrop-blur-2xl border border-purple-500/20 p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] relative overflow-hidden flex flex-col justify-between shadow-[0_8px_35px_rgba(124,58,237,.08)] hover:shadow-[0_20px_60px_rgba(139,92,246,.15)] hover:-translate-y-1 hover:border-purple-400/50 transition-all duration-300">
              <div className="absolute top-4 right-4 p-2.5 sm:p-3 bg-purple-600/20 text-purple-400 rounded-2xl group-hover:scale-110 transition-transform">
                <FiBriefcase size={18} />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-medium">
                  Total Applications
                </p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {totalApplications}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-4">All time</p>
            </div>

            <div className="group bg-[#0B1021]/80 backdrop-blur-2xl border border-purple-500/20 p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] relative overflow-hidden flex flex-col justify-between shadow-[0_8px_35px_rgba(124,58,237,.08)] hover:shadow-[0_20px_60px_rgba(139,92,246,.15)] hover:-translate-y-1 hover:border-purple-400/50 transition-all duration-300">
              <div className="absolute top-4 right-4 p-2.5 sm:p-3 bg-blue-600/20 text-blue-400 rounded-2xl group-hover:scale-110 transition-transform">
                <FiBriefcase size={18} />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-medium">Applied</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {appliedCount}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-4">All time</p>
            </div>

            <div className="group bg-[#0B1021]/80 backdrop-blur-2xl border border-purple-500/20 p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] relative overflow-hidden flex flex-col justify-between shadow-[0_8px_35px_rgba(124,58,237,.08)] hover:shadow-[0_20px_60px_rgba(139,92,246,.15)] hover:-translate-y-1 hover:border-purple-400/50 transition-all duration-300">
              <div className="absolute top-4 right-4 p-2.5 sm:p-3 bg-amber-600/20 text-amber-400 rounded-2xl group-hover:scale-110 transition-transform">
                <FiClock size={18} />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-medium">In Review</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {inReviewCount}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-4">All time</p>
            </div>

            <div className="group bg-[#0B1021]/80 backdrop-blur-2xl border border-purple-500/20 p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] relative overflow-hidden flex flex-col justify-between shadow-[0_8px_35px_rgba(124,58,237,.08)] hover:shadow-[0_20px_60px_rgba(139,92,246,.15)] hover:-translate-y-1 hover:border-purple-400/50 transition-all duration-300">
              <div className="absolute top-4 right-4 p-2.5 sm:p-3 bg-emerald-600/20 text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform">
                <FiCheckCircle size={18} />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-medium">Interview</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {interviewCount}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-4">All time</p>
            </div>

            <div className="group bg-[#0B1021]/80 backdrop-blur-2xl border border-purple-500/20 p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] relative overflow-hidden flex flex-col justify-between shadow-[0_8px_35px_rgba(124,58,237,.08)] hover:shadow-[0_20px_60px_rgba(139,92,246,.15)] hover:-translate-y-1 hover:border-purple-400/50 transition-all duration-300">
              <div className="absolute top-4 right-4 p-2.5 sm:p-3 bg-pink-600/20 text-pink-400 rounded-2xl group-hover:scale-110 transition-transform">
                <FiBookmark size={18} />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-medium">Offer</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {offerCount}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-4">All time</p>
            </div>
          </motion.section>

          {/* Search & Filter Bar Card */}
          <div className="bg-[#0B1021]/85 backdrop-blur-2xl rounded-3xl border border-slate-700/50 shadow-2xl p-6 space-y-4">
            <div className="relative">
              <FiSearch className="absolute left-4 top-4 text-slate-400 text-lg" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by job title, company or skills..."
                className="w-full bg-slate-900/80 border border-slate-700/70 rounded-2xl pl-12 pr-4 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition text-sm"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 flex items-center justify-between min-w-[120px] sm:min-w-[130px]">
                <span>All Status</span> ▾
              </div>
              <div className="bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 flex items-center justify-between min-w-[110px] sm:min-w-[120px]">
                <span>All Jobs</span> ▾
              </div>
              <div className="bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 flex items-center justify-between min-w-[130px] sm:min-w-[140px]">
                <span>All Locations</span> ▾
              </div>

              <div className="bg-slate-900/80 border border-purple-500/40 px-4 py-2.5 rounded-xl text-xs font-semibold text-purple-400 flex items-center gap-2 cursor-pointer hover:bg-slate-800 transition">
                <FiFilter size={14} /> Filters
              </div>

              <button
                onClick={() => setSearch("")}
                className="text-xs text-slate-400 hover:text-white transition ml-auto px-3 py-2 cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Applications Section Header & Sorting */}
          <div className="flex justify-between items-center pt-2 flex-wrap gap-4">
            <h2 className="text-xl font-bold text-white">
              {filteredApplications.length} Application
              {filteredApplications.length === 1 ? "" : "s"}
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Sort by:</span>
              <select className="bg-slate-900 border border-slate-700/70 text-slate-200 text-xs px-3 py-2 rounded-xl outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer">
                <option>Newest First</option>
                <option>Oldest First</option>
              </select>
            </div>
          </div>

          {/* Applications List */}
          {filteredApplications.length === 0 ? (
            <div className="bg-[#0B1021]/85 backdrop-blur-2xl rounded-3xl border border-slate-700/50 shadow-2xl p-12 text-center text-slate-400">
              You haven't applied for any jobs matching your search.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <motion.div
                  key={application.id}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                  className="group bg-gradient-to-r from-[#0B1021] via-[#11162F] to-[#050816] backdrop-blur-2xl border border-purple-500/20 rounded-[24px] p-5 sm:p-6 shadow-[0_15px_45px_rgba(124,58,237,.12)] hover:border-purple-400/50 hover:shadow-[0_18px_45px_rgba(59,130,246,.08)] transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  <div className="flex items-start gap-4 sm:gap-5 min-w-0">
                    {/* Company Initial / Avatar Box */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-indigo-600/20 border border-purple-500/40 flex items-center justify-center text-white font-black text-lg shrink-0 group-hover:scale-110 transition-transform">
                      {application.companyName
                        ? application.companyName.substring(0, 2).toUpperCase()
                        : "CL"}
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <h3 className="text-base sm:text-lg font-extrabold text-white group-hover:text-purple-300 transition-colors truncate">
                        {application.jobTitle}
                      </h3>

                      <p className="text-purple-400 font-semibold text-xs truncate">
                        {application.companyName}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                          <FiMapPin className="text-purple-400 shrink-0" />{" "}
                          Remote
                        </span>
                        <span className="flex items-center gap-1">
                          <FiCalendar className="text-pink-400 shrink-0" />{" "}
                          Applied:{" "}
                          {new Date(
                            application.appliedAtUtc,
                          ).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="pt-2">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(application.status)}`}
                        >
                          {application.status || "Applied"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side metadata & Actions */}
                  <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto justify-between md:justify-end pt-4 md:pt-0 border-t md:border-t-0 border-slate-800 flex-wrap">
                    <div className="text-left md:text-right">
                      <p className="text-xs text-slate-400">Status</p>
                      <p className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>{" "}
                        {application.status || "Applied"}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-xs text-slate-400">Job Type</p>
                      <p className="text-xs font-bold text-white mt-0.5">
                        Full Time
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-xs text-slate-400">Experience</p>
                      <p className="text-xs font-bold text-white mt-0.5">
                        3-5 Years
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition hover:scale-110 cursor-pointer"
                        title="Bookmark"
                      >
                        <FiBookmark size={16} />
                      </button>

                      <button
                        onClick={() => navigate(`/jobs/${application.jobId}`)}
                        className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        View Job <FiExternalLink size={12} />
                      </button>

                      <button
                        onClick={() => removeApplication(application.id)}
                        className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition hover:scale-110 cursor-pointer"
                        title="Delete Application"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination Footer Bar */}
          <div className="flex justify-center items-center pt-4">
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer">
                &lt;
              </button>
              <button className="w-9 h-9 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center shadow-md cursor-pointer">
                1
              </button>
              <button className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
