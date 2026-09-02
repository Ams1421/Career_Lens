import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiMapPin, FiFilter, FiBookmark } from "react-icons/fi";
import { jobsApi } from "../../api/jobs";
import Sidebar from "../../components/layout/Sidebar";
import TopNavbar from "../../components/layout/TopNavbar";
import { dashboardApi } from "../../api/dashboard";
import useAuth from "../../hooks/useAuth";

export default function Jobs() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  const handleLogout = useCallback(() => {
    logout();
    navigate("/", { replace: true });
  }, [logout, navigate]);

  const loadJobs = useCallback(async () => {
    try {
      const [response, profileRes] = await Promise.all([
        search ? jobsApi.searchJobs(search) : jobsApi.getJobs(),
        dashboardApi.getProfile(),
      ]);

      setJobs(response.data ?? []);
      setProfile(profileRes.data);
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
        return;
      }

      console.error("Failed to load jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [search, handleLogout]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadJobs();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadJobs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-slate-300">
        Loading Jobs...
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
        <div className="w-full max-w-[98%] mx-auto space-y-6 sm:space-y-8">
          {/* Header & Search / Filter Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] border border-purple-500/20 bg-gradient-to-r from-[#0B1021] via-[#11162F] to-[#050816] p-6 sm:p-8 lg:p-10 shadow-[0_15px_45px_rgba(124,58,237,.18)] space-y-6"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

            <div>
              <span className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold rounded-full mb-3">
                Job Opportunities
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight flex items-center gap-2">
                Browse Jobs
                <span className="text-purple-400 text-2xl sm:text-3xl">•</span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base mt-2">
                Find the perfect job that matches your skills and career goals.
              </p>
            </div>

            <div className="relative">
              <FiSearch className="absolute left-4 top-4 text-slate-400 text-lg" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs by title, company or skills..."
                className="w-full bg-slate-900/80 border border-slate-700/70 rounded-2xl pl-12 pr-4 py-3.5 sm:py-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition text-sm"
              />
            </div>

            {/* Filter Dropdown Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 flex items-center justify-between min-w-[130px] sm:min-w-[140px]">
                <span>All Locations</span> ▾
              </div>
              <div className="bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 flex items-center justify-between min-w-[110px] sm:min-w-[120px]">
                <span>All Types</span> ▾
              </div>
              <div className="bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 flex items-center justify-between min-w-[130px] sm:min-w-[140px]">
                <span>All Experience</span> ▾
              </div>
              <div className="bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl text-xs font-semibold text-purple-400 flex items-center gap-2 ml-auto cursor-pointer border-purple-500/40 hover:bg-slate-800 transition">
                <FiFilter size={14} /> Filters
              </div>
            </div>
          </motion.section>

          {/* Jobs Grid Container */}
          {jobs.length === 0 ? (
            <div className="bg-[#0B1021]/80 backdrop-blur-2xl rounded-3xl border border-slate-700/50 shadow-2xl p-12 text-center text-slate-400">
              No jobs found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="group bg-gradient-to-r from-[#0B1021] via-[#11162F] to-[#050816] border border-purple-500/20 shadow-[0_8px_35px_rgba(124,58,237,.08)] hover:shadow-[0_20px_60px_rgba(139,92,246,.18)] rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/50 flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Top company avatar & bookmark */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-purple-600/20 border border-purple-500/40 flex items-center justify-center text-white font-black text-lg group-hover:scale-110 transition-transform duration-300 shrink-0">
                        {job.companyName
                          ? job.companyName.substring(0, 2).toUpperCase()
                          : "CL"}
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition hover:scale-110 shrink-0">
                        <FiBookmark size={16} />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-base sm:text-lg font-extrabold text-white group-hover:text-purple-300 transition-colors truncate">
                        {job.title}
                      </h2>
                      <p className="text-purple-400 font-semibold text-xs mt-0.5 truncate">
                        {job.companyName}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <FiMapPin className="text-purple-400 shrink-0" />
                      <span className="truncate">
                        {job.location || "Remote"}
                      </span>
                    </div>

                    <p className="font-bold text-emerald-400 text-sm">
                      {job.minimumSalary && job.maximumSalary
                        ? `₹${job.minimumSalary?.toLocaleString()} - ₹${job.maximumSalary?.toLocaleString()}`
                        : "Salary not disclosed"}
                    </p>

                    {/* Tech Badges / Skills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2.5 py-0.5 bg-purple-950/70 border border-purple-500/40 text-purple-300 text-[10px] font-bold rounded-full">
                        .NET
                      </span>
                      <span className="px-2.5 py-0.5 bg-purple-950/70 border border-purple-500/40 text-purple-300 text-[10px] font-bold rounded-full">
                        React
                      </span>
                      <span className="px-2.5 py-0.5 bg-purple-950/70 border border-purple-500/40 text-purple-300 text-[10px] font-bold rounded-full">
                        SQL
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="block w-full text-center py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-purple-600/30 hover:opacity-95 transition"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
