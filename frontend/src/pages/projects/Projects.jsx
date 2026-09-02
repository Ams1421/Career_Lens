import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiGithub,
  FiExternalLink,
  FiX,
  FiCheck,
  FiFolder,
  FiStar,
  FiCode,
  FiEye,
  FiTrendingUp,
  FiSearch,
  FiGrid,
  FiList,
  FiCalendar,
} from "react-icons/fi";
import { projectsApi } from "../../api/projects";
import Sidebar from "../../components/layout/Sidebar";
import TopNavbar from "../../components/layout/TopNavbar";
import { dashboardApi } from "../../api/dashboard";
import useAuth from "../../hooks/useAuth";

const emptyForm = {
  title: "",
  description: "",
  technologies: "",
  projectUrl: "",
  gitHubUrl: "",
  startDate: "",
  endDate: "",
};

export default function Projects() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);

  // Search & Filtering controls
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Newest First");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'

  const handleLogout = useCallback(() => {
    logout();
    navigate("/", { replace: true });
  }, [logout, navigate]);

  const loadProjects = useCallback(async () => {
    try {
      const [res, profileRes] = await Promise.all([
        projectsApi.getProjects(),
        dashboardApi.getProfile(),
      ]);

      setProjects(res.data ?? []);
      setProfile(profileRes.data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
        return;
      }

      console.error(err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    const timer = setTimeout(() => void loadProjects(), 0);
    return () => clearTimeout(timer);
  }, [loadProjects]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowFormModal(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        title: form.title,
        description: form.description || null,
        technologies: form.technologies || null,
        projectUrl: form.projectUrl || null,
        gitHubUrl: form.gitHubUrl || null,
        startDate: form.startDate ? `${form.startDate}-01-01T00:00:00` : null,
        endDate: form.endDate ? `${form.endDate}-01-01T00:00:00` : null,
      };

      if (editingId) {
        await projectsApi.updateProject(editingId, payload);
      } else {
        await projectsApi.addProject(payload);
      }

      resetForm();
      await loadProjects();
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
        return;
      }

      console.error(err);
      alert("Failed to save project.");
    } finally {
      setSaving(false);
    }
  }

  function editProject(project) {
    setEditingId(project.id);
    setForm({
      title: project.title || "",
      description: project.description || "",
      technologies: project.technologies || "",
      projectUrl: project.projectUrl || "",
      gitHubUrl: project.gitHubUrl || "",
      startDate: project.startDate?.slice(0, 10) || "",
      endDate: project.endDate?.slice(0, 10) || "",
    });
    setShowFormModal(true);
  }

  async function deleteProject(id) {
    if (!confirm("Delete this project?")) return;

    try {
      await projectsApi.deleteProject(id);
      await loadProjects();
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
        return;
      }

      console.error(err);
      alert("Delete failed.");
    }
  }

  // Filter and Sort logic
  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.technologies?.toLowerCase().includes(q),
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.startDate || a.createdAt || 0);
      const dateB = new Date(b.startDate || b.createdAt || 0);
      if (sortBy === "Oldest First") {
        return dateA - dateB;
      }
      return dateB - dateA;
    });

    return result;
  }, [projects, searchQuery, sortBy]);

  // Calculate dynamic stats
  const totalProjects = projects.length;
  const allTechsSet = new Set();
  projects.forEach((p) => {
    if (p.technologies) {
      p.technologies.split(",").forEach((t) => {
        if (t.trim()) allTechsSet.add(t.trim().toLowerCase());
      });
    }
  });
  const totalTechsCount = allTechsSet.size;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-slate-300">
        Loading Projects...
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
          {/* =========================
              Phase 1: Premium Projects Hero
          ========================= */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] border border-purple-500/20 bg-gradient-to-r from-[#0B1021] via-[#11162F] to-[#050816] p-6 sm:p-8 lg:p-10 shadow-[0_15px_45px_rgba(124,58,237,.18)]"
          >
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative flex items-center justify-between flex-wrap gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-semibold text-purple-300 mb-3">
                  💻 Portfolio Overview
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white flex items-center gap-2 tracking-tight">
                  Projects
                  <span className="text-purple-400 text-2xl sm:text-3xl">
                    •
                  </span>
                </h1>

                <p className="mt-3 max-w-xl text-slate-400 text-sm sm:text-base leading-relaxed">
                  Showcase your work, personal projects, and technical
                  achievements.
                </p>
              </div>

              <button
                onClick={() => {
                  resetForm();
                  setShowFormModal(true);
                }}
                className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-6 sm:px-7 py-3.5 sm:py-4 text-white text-sm sm:text-base font-bold shadow-[0_10px_35px_rgba(139,92,246,.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                <FiPlus size={18} />
                Add Project
              </button>
            </div>
          </motion.section>

          {/* ADD / EDIT PROJECT MODAL FORM */}
          {showFormModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0b1021]/95 backdrop-blur-2xl rounded-3xl border border-purple-500/40 shadow-2xl p-6 sm:p-8 relative"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editingId ? "Edit Project" : "Add New Project"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-slate-400 hover:text-white p-2"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <Input
                    label="Project Title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g. CareerLens AI Platform"
                  />

                  <Input
                    label="Technologies"
                    name="technologies"
                    value={form.technologies}
                    onChange={handleChange}
                    placeholder="React, .NET, PostgreSQL"
                  />

                  <Input
                    label="GitHub URL"
                    name="gitHubUrl"
                    value={form.gitHubUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                  />

                  <Input
                    label="Live Project URL"
                    name="projectUrl"
                    value={form.projectUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                  />

                  <Input
                    label="Start Year"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    placeholder="e.g. 2025"
                  />

                  <Input
                    label="End Year"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    placeholder="e.g. 2026"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-slate-300 text-xs uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="3"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe your project, features, and architecture..."
                    className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl p-3.5 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition text-sm"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-purple-600/30 hover:opacity-95 disabled:opacity-50 flex items-center gap-2 transition cursor-pointer text-sm"
                  >
                    <FiCheck />
                    {saving
                      ? "Saving..."
                      : editingId
                        ? "Update Project"
                        : "Save Project"}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-slate-800 text-slate-200 border border-slate-700 px-6 py-3.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-700 transition cursor-pointer text-sm"
                  >
                    <FiX />
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* =========================
              Phase 2: Statistics Grid Cards with Skills Hover Style
          ========================= */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div className="group bg-[#0B1021]/80 border border-purple-500/20 shadow-[0_8px_35px_rgba(124,58,237,.08)] hover:shadow-[0_20px_60px_rgba(139,92,246,.15)] p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40">
              <div className="absolute top-4 right-4 p-2.5 sm:p-3 bg-purple-600/20 text-purple-400 rounded-2xl">
                <FiFolder size={18} />
              </div>
              <div>
                <p className="text-slate-400 text-xs sm:text-sm font-medium">
                  Total Projects
                </p>
                <h3 className="text-3xl sm:text-4xl font-black text-white mt-1">
                  {totalProjects}
                </h3>
              </div>
              <p className="text-xs text-purple-400 mt-4 font-semibold flex items-center gap-1">
                <FiTrendingUp size={12} /> Active Portfolio
              </p>
            </div>

            <div className="group bg-[#0B1021]/80 border border-purple-500/20 shadow-[0_8px_35px_rgba(124,58,237,.08)] hover:shadow-[0_20px_60px_rgba(139,92,246,.15)] p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40">
              <div className="absolute top-4 right-4 p-2.5 sm:p-3 bg-blue-600/20 text-blue-400 rounded-2xl">
                <FiStar size={18} />
              </div>
              <div>
                <p className="text-slate-400 text-xs sm:text-sm font-medium">
                  Best Match Score
                </p>
                <h3 className="text-3xl sm:text-4xl font-black text-white mt-1">
                  {totalProjects > 0 ? "92%" : "0%"}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-4">AI Match</p>
            </div>

            <div className="group bg-[#0B1021]/80 border border-purple-500/20 shadow-[0_8px_35px_rgba(124,58,237,.08)] hover:shadow-[0_20px_60px_rgba(139,92,246,.15)] p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40">
              <div className="absolute top-4 right-4 p-2.5 sm:p-3 bg-emerald-600/20 text-emerald-400 rounded-2xl">
                <FiCode size={18} />
              </div>
              <div>
                <p className="text-slate-400 text-xs sm:text-sm font-medium">
                  Technologies Used
                </p>
                <h3 className="text-3xl sm:text-4xl font-black text-white mt-1">
                  {totalTechsCount}
                </h3>
              </div>
              <p className="text-xs text-emerald-400 mt-4 font-semibold">
                Across all projects
              </p>
            </div>

            <div className="group bg-[#0B1021]/80 border border-purple-500/20 shadow-[0_8px_35px_rgba(124,58,237,.08)] hover:shadow-[0_20px_60px_rgba(139,92,246,.15)] p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40">
              <div className="absolute top-4 right-4 p-2.5 sm:p-3 bg-amber-600/20 text-amber-400 rounded-2xl">
                <FiEye size={18} />
              </div>
              <div>
                <p className="text-slate-400 text-xs sm:text-sm font-medium">
                  Profile Impact
                </p>
                <h3 className="text-3xl sm:text-4xl font-black text-white mt-1">
                  {totalProjects > 0 ? "High" : "Low"}
                </h3>
              </div>
              <p className="text-xs text-amber-400 mt-4 font-semibold">
                Very Strong
              </p>
            </div>
          </motion.section>

          {/* =========================
              Phase 3: Portfolio Showcase Banner
          ========================= */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="group relative overflow-hidden rounded-[24px] sm:rounded-[30px] border border-purple-500/20 bg-[#0B1021]/80 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-[0_15px_40px_rgba(124,58,237,.12)] hover:border-purple-500/40 transition-all duration-300 flex flex-col lg:flex-row items-center justify-between gap-8"
          >
            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-purple-500 via-indigo-500 to-blue-500 rounded-full" />
            <div className="space-y-3 flex-1 text-center lg:text-left">
              <span className="inline-block px-3 py-1 bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[10px] font-extrabold uppercase tracking-widest rounded-full">
                AI INSIGHT
              </span>
              <h2 className="text-2xl font-black text-white">
                Portfolio Showcase
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed mx-auto lg:mx-0">
                Highlight your best projects to boost your developer match
                rating across AI recruitment scans.
              </p>
              <div className="flex flex-wrap gap-3 pt-2 justify-center lg:justify-start">
                <div className="bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <FiFolder className="text-purple-400 shrink-0" /> Better
                  visibility • Attract top recruiters
                </div>
                <div className="bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <FiStar className="text-amber-400 shrink-0" /> Higher match
                  score • Showcase impactful work
                </div>
              </div>
            </div>

            {/* Circular Progress Meter Badge */}
            <div className="flex items-center gap-6 bg-slate-900/60 border border-slate-800 p-5 sm:p-6 rounded-3xl shrink-0 w-full sm:w-auto justify-center">
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-slate-800"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-purple-500"
                    fill="transparent"
                    strokeDasharray="213.6"
                    strokeDashoffset={213.6 * (1 - 0.78)}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-sm font-extrabold text-white">
                  78%
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Portfolio Strength
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Optimized for AI matching
                </p>
                <button
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="mt-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md hover:opacity-95 transition cursor-pointer"
                >
                  Improve Portfolio
                </button>
              </div>
            </div>
          </motion.section>

          {/* =========================
              Phase 4: Search & Interactive Controls Header
          ========================= */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-4 gap-4">
            <h2 className="text-xl font-bold text-white">
              All Projects ({filteredAndSortedProjects.length})
            </h2>

            <div className="flex items-center flex-wrap gap-3 w-full md:w-auto">
              {/* Search filter input */}
              <div className="relative flex-1 md:w-60">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiSearch size={14} />
                </span>
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/70 text-slate-200 text-xs pl-9 pr-3 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-purple-500 transition placeholder-slate-500"
                />
              </div>

              {/* Sorting Selection */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-900 border border-slate-700/70 text-slate-200 text-xs px-3 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
              >
                <option value="Newest First">Newest First</option>
                <option value="Oldest First">Oldest First</option>
              </select>

              {/* Grid / List Layout Switcher */}
              <div className="flex items-center bg-slate-900 border border-slate-700/70 rounded-xl p-0.5">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition cursor-pointer ${viewMode === "grid" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"}`}
                  title="Grid View"
                >
                  <FiGrid size={14} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition cursor-pointer ${viewMode === "list" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"}`}
                  title="List View"
                >
                  <FiList size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* =========================
              Phase 5: Projects Grid / List View Container with Skills Hover & Glow States
          ========================= */}
          {filteredAndSortedProjects.length === 0 ? (
            <div className="bg-[#0b1021]/80 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-12 text-center text-slate-400 shadow-2xl">
              {projects.length === 0
                ? 'No projects added yet. Click "+ Add Project" to showcase your work.'
                : "No projects match your search query."}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredAndSortedProjects.map((project, index) => {
                const techList = project.technologies
                  ? project.technologies.split(",").map((t) => t.trim())
                  : [];

                const matchScores = [
                  "92% Match",
                  "85% Match",
                  "75% Match",
                  "70% Match",
                ];
                const matchBadgeText = matchScores[index % matchScores.length];

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-gradient-to-r from-[#0B1021] via-[#11162F] to-[#050816] border border-purple-500/20 shadow-[0_8px_35px_rgba(124,58,237,.08)] hover:shadow-[0_20px_60px_rgba(139,92,246,.18)] rounded-[28px] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/50 flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      {/* Top Match Badge and Icon */}
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                          {matchBadgeText}
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold group-hover:scale-110 transition-transform duration-300 shrink-0">
                          <FiFolder size={18} />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-extrabold text-white group-hover:text-purple-300 transition-colors truncate">
                          {project.title}
                        </h3>
                        <p className="text-slate-400 text-xs mt-1 line-clamp-3 leading-relaxed">
                          {project.description || "No description provided."}
                        </p>
                      </div>

                      {/* Tech Tag Badges */}
                      {techList.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {techList.slice(0, 3).map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 bg-purple-950/70 border border-purple-500/40 text-purple-300 text-[10px] font-bold rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                          {techList.length > 3 && (
                            <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-bold rounded-full">
                              +{techList.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Dates / Visibility footer info */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                        <span className="flex items-center gap-1">
                          <FiCalendar size={12} />{" "}
                          {project.startDate
                            ? project.startDate.slice(0, 4)
                            : "Recent"}
                        </span>
                        <span>{project.projectUrl ? "Public" : "Private"}</span>
                      </div>
                    </div>

                    {/* Action Bar at Bottom */}
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800 text-slate-400">
                      <div className="flex items-center gap-3">
                        {project.projectUrl && (
                          <a
                            href={project.projectUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-white transition p-1.5 bg-slate-900 rounded-lg border border-slate-800"
                            title="Live Demo"
                          >
                            <FiExternalLink size={16} />
                          </a>
                        )}
                        {project.gitHubUrl && (
                          <a
                            href={project.gitHubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-white transition p-1.5 bg-slate-900 rounded-lg border border-slate-800"
                            title="GitHub Repo"
                          >
                            <FiGithub size={16} />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => editProject(project)}
                          className="p-2 bg-slate-900/70 hover:bg-blue-500/20 hover:text-blue-300 border border-slate-800 rounded-xl transition-all duration-300 hover:scale-110 cursor-pointer"
                          title="Edit"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 text-red-400 border border-red-500/20 rounded-xl transition-all duration-300 hover:scale-110 cursor-pointer"
                          title="Delete"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* List View Mode with Hover & Translate Transitions */
            <div className="space-y-4">
              {filteredAndSortedProjects.map((project, index) => {
                const techList = project.technologies
                  ? project.technologies.split(",").map((t) => t.trim())
                  : [];

                const matchScores = [
                  "92% Match",
                  "85% Match",
                  "75% Match",
                  "70% Match",
                ];
                const matchBadgeText = matchScores[index % matchScores.length];

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group bg-gradient-to-r from-[#0B1021] via-[#11162F] to-[#050816] border border-purple-500/20 rounded-[24px] p-5 transition-all duration-300 hover:border-purple-500/40 hover:translate-x-1 hover:shadow-[0_18px_45px_rgba(59,130,246,.08)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                          {matchBadgeText}
                        </span>
                        <h3 className="text-lg font-extrabold text-white group-hover:text-purple-300 transition-colors truncate">
                          {project.title}
                        </h3>
                        <span className="text-[11px] text-slate-400">
                          (
                          {project.startDate
                            ? project.startDate.slice(0, 4)
                            : "Recent"}
                          )
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                        {project.description || "No description provided."}
                      </p>
                      {techList.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {techList.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-purple-950/70 border border-purple-500/40 text-purple-300 text-[10px] font-bold rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end">
                      <div className="flex items-center gap-3 text-slate-400">
                        {project.projectUrl && (
                          <a
                            href={project.projectUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-white transition p-2.5 bg-slate-900/70 rounded-xl border border-slate-800"
                            title="Live Demo"
                          >
                            <FiExternalLink size={16} />
                          </a>
                        )}
                        {project.gitHubUrl && (
                          <a
                            href={project.gitHubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-white transition p-2.5 bg-slate-900/70 rounded-xl border border-slate-800"
                            title="GitHub Repo"
                          >
                            <FiGithub size={16} />
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
                        <button
                          onClick={() => editProject(project)}
                          className="p-2.5 bg-slate-800/70 hover:bg-blue-500/20 hover:text-blue-300 rounded-xl transition-all duration-300 hover:scale-110 cursor-pointer"
                          title="Edit"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="p-2.5 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 text-red-400 rounded-xl transition-all duration-300 hover:scale-110 cursor-pointer"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* =========================
              Phase 6: Bottom Callout Card with Glow Effect
          ========================= */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative overflow-hidden bg-gradient-to-r from-[#0B1021] via-[#11162F] to-[#050816] backdrop-blur-3xl rounded-[24px] sm:rounded-[30px] border border-purple-500/20 shadow-[0_25px_80px_rgba(99,102,241,.18)] p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 bg-purple-600/20 border border-purple-500/40 rounded-2xl flex items-center justify-center text-purple-400 shrink-0 mx-auto sm:mx-0">
                <FiPlus size={22} />
              </div>
              <div>
                <h3 className="font-bold text-white text-base sm:text-lg">
                  Add more projects
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  Keep showcasing your work to improve your AI match score.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowFormModal(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-purple-600/30 hover:opacity-95 transition flex items-center gap-2 cursor-pointer shrink-0"
            >
              <FiPlus /> Add New Project
            </button>
          </motion.section>
        </div>
      </main>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block mb-2 font-semibold text-slate-300 text-xs uppercase tracking-wider">
        {label}
      </label>
      <input
        {...props}
        className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl p-3.5 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition text-sm"
      />
    </div>
  );
}
