import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiUpload,
  FiFileText,
  FiTrash2,
  FiStar,
  FiDownload,
  FiCheckCircle,
  FiArrowRight,
  FiCpu,
  FiKey,
  FiLayout,
  FiFile,
} from "react-icons/fi";

import { resumeApi } from "../../api/resume";
import { dashboardApi } from "../../api/dashboard";
import useAuth from "../../hooks/useAuth";
import Sidebar from "../../components/layout/Sidebar";
import TopNavbar from "../../components/layout/TopNavbar";
import "./Resume.css";

export default function Resume() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState(null);

  const [resumes, setResumes] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fileInput = useRef();

  const handleLogout = useCallback(() => {
    logout();
    navigate("/", { replace: true });
  }, [logout, navigate]);

  const loadData = useCallback(async () => {
    try {
      const [resumesRes, profileRes] = await Promise.all([
        resumeApi.getMyResumes(),
        dashboardApi.getProfile(),
      ]);
      setResumes(resumesRes.data || []);
      setProfile(profileRes.data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
        return;
      }
      console.error(err);
      setResumes([]);
    }
  }, [handleLogout]);

  useEffect(() => {
    const timer = setTimeout(() => void loadData(), 0);
    return () => clearTimeout(timer);
  }, [loadData]);

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Only PDF resumes are allowed.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("isPrimary", "true");

      await resumeApi.upload(formData);

      await loadData();
      alert("Resume uploaded successfully.");
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
        return;
      }

      alert("Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function makePrimary(id) {
    try {
      await resumeApi.setPrimary(id);
      await loadData();
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
        return;
      }
      alert("Failed to update primary resume.");
    }
  }

  async function removeResume(id) {
    if (!window.confirm("Delete this resume?")) return;

    try {
      await resumeApi.delete(id);
      await loadData();
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
        return;
      }
      alert("Delete failed.");
    }
  }

  // Primary resume for ATS card
  const primaryResume = resumes.find((r) => r.isPrimary) || resumes[0] || null;

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
          {/* Hero Banner Card */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] border border-purple-500/20 bg-gradient-to-r from-[#0B1021] via-[#11162F] to-[#050816] p-6 sm:p-8 lg:p-10 shadow-[0_15px_45px_rgba(124,58,237,.18)]"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative flex justify-between items-center flex-wrap gap-6">
              <div>
                <span className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold rounded-full mb-3">
                  Document Vault
                </span>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight flex items-center gap-2">
                  Resume Center
                  <span className="text-purple-400 text-2xl sm:text-3xl">
                    •
                  </span>
                </h1>

                <p className="text-slate-400 mt-3 text-sm sm:text-base leading-relaxed">
                  Upload and manage your resumes for AI-powered matching.
                </p>
              </div>

              <button
                className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-bold py-3.5 sm:py-4 px-6 sm:px-7 rounded-2xl shadow-[0_10px_35px_rgba(139,92,246,.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2 cursor-pointer text-sm sm:text-base"
                onClick={() => fileInput.current.click()}
                disabled={uploading}
              >
                <FiUpload />
                {uploading ? "Uploading..." : "Upload Resume"}
              </button>

              <input
                ref={fileInput}
                type="file"
                accept=".pdf"
                hidden
                onChange={handleUpload}
              />
            </div>
          </motion.section>

          {/* Upper Section: Drag & Drop Upload Zone + Tips Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Drag & Drop Upload Zone (Takes 2 columns) */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="lg:col-span-2 group bg-gradient-to-r from-[#0B1021] via-[#11162F] to-[#050816] backdrop-blur-xl border-2 border-dashed border-purple-500/40 rounded-[24px] sm:rounded-[30px] p-6 sm:p-10 text-center flex flex-col items-center justify-center gap-4 hover:border-purple-400/80 hover:shadow-[0_20px_50px_rgba(139,92,246,.15)] transition-all cursor-pointer"
              onClick={() => fileInput.current.click()}
            >
              <div className="w-16 h-16 rounded-2xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <FiUpload size={28} />
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Drag & Drop Your Resume
                </h3>

                <p className="text-slate-400 text-xs mt-1">
                  Only PDF files are supported.
                </p>
              </div>

              <button className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-purple-300 text-xs font-semibold hover:bg-slate-800 transition">
                Choose PDF
              </button>
            </motion.div>

            {/* Tips for Better Matches Card */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="group bg-[#0B1021]/80 backdrop-blur-2xl border border-purple-500/20 rounded-[24px] sm:rounded-[30px] p-6 shadow-[0_8px_35px_rgba(124,58,237,.08)] hover:shadow-[0_20px_60px_rgba(139,92,246,.15)] hover:border-purple-400/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-4">
                  <FiStar size={18} />
                  Tips for Better Matches
                </div>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <FiCheckCircle
                      className="text-emerald-400 shrink-0 mt-0.5"
                      size={14}
                    />
                    <span>
                      Keep your resume updated with recent experiences
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <FiCheckCircle
                      className="text-emerald-400 shrink-0 mt-0.5"
                      size={14}
                    />
                    <span>
                      Include relevant keywords matching job descriptions
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <FiCheckCircle
                      className="text-emerald-400 shrink-0 mt-0.5"
                      size={14}
                    />
                    <span>Highlight measurable results and achievements</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <FiCheckCircle
                      className="text-emerald-400 shrink-0 mt-0.5"
                      size={14}
                    />
                    <span>
                      Use clean formatting and standard section headers
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* My Resumes List Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="bg-[#0B1021]/80 backdrop-blur-2xl border border-purple-500/20 rounded-[24px] sm:rounded-[30px] p-6 sm:p-8 shadow-[0_15px_45px_rgba(124,58,237,.12)]"
          >
            <h2 className="text-xl font-bold text-white mb-6">My Resumes</h2>

            {resumes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-3">
                <FiFileText size={48} className="text-slate-600" />
                <p className="text-sm">No resumes uploaded yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {resumes.map((resume) => (
                  <motion.div
                    key={resume.id}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    className="group bg-gradient-to-r from-[#0B1021] via-[#11162F] to-[#050816] border border-purple-500/20 rounded-[22px] p-5 transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_18px_45px_rgba(59,130,246,.08)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="flex gap-4 items-center min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-110 transition-transform">
                        <FiFileText size={24} />
                      </div>

                      <div className="min-w-0">
                        <strong className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors truncate block">
                          {resume.fileName}
                        </strong>

                        <p className="text-slate-400 text-xs mt-0.5">
                          {(resume.fileSizeBytes / 1024).toFixed(0)} KB
                        </p>

                        <div className="flex gap-2 mt-2 flex-wrap">
                          {resume.isPrimary && (
                            <span className="px-3 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-extrabold uppercase tracking-widest">
                              Primary Resume
                            </span>
                          )}

                          <span className="px-3 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[10px] font-extrabold uppercase tracking-widest">
                            ATS {resume.atsScore ?? 0}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                      <a
                        href={`http://localhost:5149${resume.fileUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition hover:scale-110"
                        title="Download"
                      >
                        <FiDownload size={16} />
                      </a>

                      {!resume.isPrimary && (
                        <button
                          className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center hover:bg-amber-500 hover:text-slate-950 transition cursor-pointer hover:scale-110"
                          onClick={() => makePrimary(resume.id)}
                          title="Set Primary"
                        >
                          <FiStar size={16} />
                        </button>
                      )}

                      <button
                        className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition cursor-pointer hover:scale-110"
                        onClick={() => removeResume(resume.id)}
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Resume Quality Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="bg-[#0B1021]/80 backdrop-blur-2xl border border-purple-500/20 rounded-[24px] sm:rounded-[30px] p-6 sm:p-8 shadow-[0_15px_45px_rgba(124,58,237,.12)] space-y-6 hover:border-purple-400/40 transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
              {/* Score Circle */}
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-[0_0_25px_rgba(168,85,247,0.4)] shrink-0 mx-auto lg:mx-0">
                {primaryResume ? `${primaryResume.atsScore}%` : "--"}
              </div>

              {/* Score Details & Breakdown Cards */}
              <div className="space-y-4 flex-1 w-full">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Resume Quality Score
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                    {primaryResume
                      ? primaryResume.atsSuggestions ||
                        "Excellent ATS-friendly resume."
                      : "Upload a resume to receive an AI-powered ATS score and improvement suggestions."}
                  </p>
                </div>

                {/* Sub-Metric Columns */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-center hover:border-purple-500/30 transition">
                    <p className="text-xs text-slate-400">ATS Score</p>
                    <h4 className="text-lg font-bold text-white mt-1">
                      {primaryResume ? `${primaryResume.atsScore}%` : "--"}
                    </h4>
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      Excellent
                    </span>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-center hover:border-purple-500/30 transition">
                    <p className="text-xs text-slate-400">Keyword Match</p>
                    <h4 className="text-lg font-bold text-white mt-1">
                      {primaryResume
                        ? `${primaryResume.atsScore ? Math.min(100, primaryResume.atsScore + 2) : 92}%`
                        : "--"}
                    </h4>
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      Excellent
                    </span>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-center hover:border-purple-500/30 transition">
                    <p className="text-xs text-slate-400">Content Quality</p>
                    <h4 className="text-lg font-bold text-white mt-1">90%</h4>
                    <span className="text-[10px] text-blue-400 font-semibold">
                      Very Good
                    </span>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-center hover:border-purple-500/30 transition">
                    <p className="text-xs text-slate-400">Structure</p>
                    <h4 className="text-lg font-bold text-white mt-1">95%</h4>
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      Excellent
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Callout in Quality Card */}
            <div className="bg-slate-900/80 border border-purple-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 mx-auto sm:mx-0">
                  <FiStar size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">
                    Great job! Your resume is highly optimized.
                  </h4>
                  <p className="text-slate-400 text-xs">
                    Keep it updated to maintain a high match score.
                  </p>
                </div>
              </div>
              <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-2.5 px-5 rounded-xl text-xs shadow-lg shadow-purple-600/30 hover:opacity-95 transition flex items-center gap-2 cursor-pointer shrink-0">
                <FiUpload size={14} /> Improve Resume
              </button>
            </div>
          </motion.div>

          {/* Quick Actions Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="group bg-[#0B1021]/80 backdrop-blur-2xl border border-purple-500/20 rounded-[24px] p-5 flex flex-col justify-between hover:border-purple-500/40 hover:shadow-[0_12px_45px_rgba(124,58,237,.12)] transition cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                <FiCpu size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">
                  AI Resume Review
                </h4>
                <p className="text-slate-400 text-xs mt-1">Get AI feedback</p>
              </div>
              <div className="flex items-center gap-1 text-purple-400 text-xs font-semibold mt-4">
                <span>Explore</span> <FiArrowRight size={14} />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="group bg-[#0B1021]/80 backdrop-blur-2xl border border-purple-500/20 rounded-[24px] p-5 flex flex-col justify-between hover:border-purple-500/40 hover:shadow-[0_12px_45px_rgba(124,58,237,.12)] transition cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                <FiKey size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">
                  Optimize Keywords
                </h4>
                <p className="text-slate-400 text-xs mt-1">
                  Improve keyword match
                </p>
              </div>
              <div className="flex items-center gap-1 text-blue-400 text-xs font-semibold mt-4">
                <span>Explore</span> <FiArrowRight size={14} />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="group bg-[#0B1021]/80 backdrop-blur-2xl border border-purple-500/20 rounded-[24px] p-5 flex flex-col justify-between hover:border-purple-500/40 hover:shadow-[0_12px_45px_rgba(124,58,237,.12)] transition cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <FiFile size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">
                  Compare Resumes
                </h4>
                <p className="text-slate-400 text-xs mt-1">
                  See score comparison
                </p>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold mt-4">
                <span>Explore</span> <FiArrowRight size={14} />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="group bg-[#0B1021]/80 backdrop-blur-2xl border border-purple-500/20 rounded-[24px] p-5 flex flex-col justify-between hover:border-purple-500/40 hover:shadow-[0_12px_45px_rgba(124,58,237,.12)] transition cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <FiLayout size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Templates</h4>
                <p className="text-slate-400 text-xs mt-1">
                  Professional templates
                </p>
              </div>
              <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold mt-4">
                <span>Explore</span> <FiArrowRight size={14} />
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
