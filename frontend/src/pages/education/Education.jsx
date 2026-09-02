import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiBook,
  FiAward,
  FiCalendar,
} from "react-icons/fi";
import educationApi from "../../api/education";
import Sidebar from "../../components/layout/Sidebar";
import TopNavbar from "../../components/layout/TopNavbar";
import { dashboardApi } from "../../api/dashboard";
import useAuth from "../../hooks/useAuth";

export default function Education() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
    navigate("/", { replace: true });
  }, [logout, navigate]);
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState(null);

  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  const [form, setForm] = useState({
    institutionName: "",
    degree: "",
    fieldOfStudy: "",
    startYear: "",
    graduationYear: "",
    cgpa: "",
    description: "",
    isCurrentlyStudying: false,
  });

  const loadEducation = useCallback(async () => {
    try {
      const [res, profileRes] = await Promise.all([
        educationApi.getEducation(),
        dashboardApi.getProfile(),
      ]);

      setEducation(res.data ?? []);
      setProfile(profileRes.data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
        return;
      }

      console.error(err);
      setEducation([]);
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    const timer = setTimeout(() => void loadEducation(), 0);
    return () => clearTimeout(timer);
  }, [loadEducation]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function resetForm() {
    setEditingId(null);
    setShowFormModal(false);
    setForm({
      institutionName: "",
      degree: "",
      fieldOfStudy: "",
      startYear: "",
      graduationYear: "",
      cgpa: "",
      description: "",
      isCurrentlyStudying: false,
    });
  }

  async function saveEducation() {
    const payload = {
      institutionName: form.institutionName,
      degree: form.degree,
      fieldOfStudy: form.fieldOfStudy || null,
      startDate: form.startYear ? `${form.startYear}-01-01T00:00:00` : null,
      endDate: form.graduationYear
        ? `${form.graduationYear}-01-01T00:00:00`
        : null,
      isCurrentlyStudying: form.isCurrentlyStudying,
      CGPA: form.cgpa ? Number(form.cgpa) : null,
      description: form.description || null,
    };

    try {
      if (editingId) {
        await educationApi.updateEducation(editingId, payload);
      } else {
        await educationApi.addEducation(payload);
      }

      resetForm();
      await loadEducation();
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
        return;
      }

      console.error(err);
      alert("Failed to save education.");
    }
  }

  function editEducation(item) {
    setEditingId(item.id);
    setForm({
      institutionName: item.institutionName ?? "",
      degree: item.degree ?? "",
      fieldOfStudy: item.fieldOfStudy ?? "",
      startYear: item.startDate
        ? new Date(item.startDate).getFullYear().toString()
        : "",
      graduationYear: item.endDate
        ? new Date(item.endDate).getFullYear().toString()
        : "",
      cgpa: item.cgpa ?? "",
      description: item.description ?? "",
      isCurrentlyStudying: item.isCurrentlyStudying ?? false,
    });
    setShowFormModal(true);
  }

  async function deleteEducation(id) {
    if (!window.confirm("Delete this education record?")) return;

    try {
      await educationApi.deleteEducation(id);
      await loadEducation();
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
        return;
      }

      console.error(err);
      alert("Delete failed.");
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-slate-300">
        Loading Education...
      </div>
    );

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
             Phase 1: Premium Education Hero
          ========================= */}

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-[24px] sm:rounded-[30px] border border-purple-500/20 bg-gradient-to-r from-[#0B1021] via-[#11162F] to-[#050816] p-6 sm:p-8 lg:p-10 shadow-[0_0_40px_rgba(124,58,237,.15)]"
          >
            {/* Ambient Glow */}
            <div className="absolute inset-0">
              <div className="absolute -top-12 right-20 h-56 w-56 rounded-full bg-purple-500/10 blur-[100px]" />
              <div className="absolute bottom-0 left-20 h-40 w-40 rounded-full bg-blue-500/10 blur-[80px]" />
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] bg-[size:42px_42px]" />

            <div className="relative flex items-center justify-between flex-wrap gap-6">
              {/* Left Content */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-semibold text-purple-300">
                  🎓 Education Overview
                </div>

                <h1 className="mt-4 sm:mt-5 text-3xl sm:text-4xl lg:text-5xl font-black text-white flex items-center gap-2">
                  Education
                  <span className="text-purple-400 text-2xl sm:text-3xl">
                    •
                  </span>
                </h1>

                <p className="mt-3 max-w-xl text-slate-400 text-sm sm:text-base leading-relaxed">
                  Manage your academic background and track your progress.
                </p>
              </div>

              {/* Right CTA */}
              <button
                onClick={() => {
                  resetForm();
                  setShowFormModal(true);
                }}
                className="flex items-center gap-2.5 sm:gap-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-5 sm:px-7 py-3 sm:py-4 text-white text-sm sm:text-base font-semibold shadow-[0_0_25px_rgba(124,58,237,.35)] hover:brightness-110 transition cursor-pointer"
              >
                <FiPlus size={18} />
                Add Education
              </button>
            </div>
          </motion.section>

          {/* Modal / Inline Form Card when Adding/Editing */}
          {showFormModal && (
            <div className="bg-[#0b1021]/90 backdrop-blur-2xl rounded-3xl border border-purple-500/40 shadow-2xl p-6 sm:p-8 relative animate-fadeIn">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editingId ? "Edit Education Record" : "Add Education Record"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-slate-400 hover:text-white p-2"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Degree / Qualification"
                  name="degree"
                  value={form.degree}
                  onChange={handleChange}
                  placeholder="e.g. Bachelor of Technology (B.Tech)"
                />

                <Input
                  label="Institution Name"
                  name="institutionName"
                  value={form.institutionName}
                  onChange={handleChange}
                  placeholder="e.g. Kakatiya Institute of Technology"
                />

                <Input
                  label="Field of Study"
                  name="fieldOfStudy"
                  value={form.fieldOfStudy}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                />

                <Input
                  label="Start Year"
                  name="startYear"
                  value={form.startYear}
                  onChange={handleChange}
                  placeholder="e.g. 2022"
                />

                <Input
                  label="Graduation Year"
                  name="graduationYear"
                  value={form.graduationYear}
                  onChange={handleChange}
                  placeholder="e.g. 2026"
                />

                <Input
                  label="CGPA / Percentage"
                  name="cgpa"
                  value={form.cgpa}
                  onChange={handleChange}
                  placeholder="e.g. 8.5"
                />
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={saveEducation}
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-purple-600/30 hover:opacity-95 flex items-center gap-2 transition cursor-pointer text-sm"
                >
                  <FiPlus />
                  {editingId ? "Update Record" : "Save Record"}
                </button>

                <button
                  onClick={resetForm}
                  className="bg-slate-800 text-slate-200 border border-slate-700 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-700 transition cursor-pointer text-sm"
                >
                  <FiX />
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* =========================
             Phase 2: Premium Education Cards with Smooth Hover Effects
          ========================= */}

          <div className="space-y-6">
            {education.length === 0 ? (
              <div className="bg-[#0b1021]/80 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-tr from-purple-600 to-blue-600 text-white flex items-center justify-center text-2xl sm:text-3xl shadow-[0_0_25px_rgba(168,85,247,0.35)]">
                  <FiBook />
                </div>

                <h3 className="mt-6 text-xl sm:text-2xl font-bold text-white">
                  No Education Added Yet
                </h3>

                <p className="mt-2 text-slate-400 text-sm sm:text-base">
                  Add your first qualification to strengthen your CareerLens
                  profile.
                </p>

                <button
                  onClick={() => {
                    resetForm();
                    setShowFormModal(true);
                  }}
                  className="mt-6 sm:mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-6 py-3 font-semibold text-white shadow-[0_0_20px_rgba(168,85,247,.35)] hover:brightness-110 transition cursor-pointer text-sm"
                >
                  <FiPlus />
                  Add Education
                </button>
              </div>
            ) : (
              education.map((item) => {
                const startYr = item.startDate
                  ? new Date(item.startDate).getFullYear()
                  : null;

                const endYr = item.endDate
                  ? new Date(item.endDate).getFullYear()
                  : null;

                return (
                  <motion.section
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="group relative overflow-hidden rounded-[24px] sm:rounded-[30px] border border-purple-500/20 bg-gradient-to-r from-[#0B1021] via-[#11162F] to-[#050816] backdrop-blur-2xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(124,58,237,.12)] hover:shadow-[0_20px_60px_rgba(139,92,246,.18)] hover:-translate-y-1 hover:border-purple-400/50 transition-all duration-300"
                  >
                    {/* Left Accent Border */}
                    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-purple-500 via-indigo-500 to-blue-500 rounded-full" />

                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 sm:gap-8">
                      {/* Left Section */}
                      <div className="flex items-start gap-4 sm:gap-6 flex-1 min-w-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-purple-600/25 to-blue-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center text-2xl sm:text-4xl shadow-[0_0_20px_rgba(168,85,247,.18)] group-hover:scale-110 transition-transform duration-300 shrink-0">
                          <FiBook />
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-purple-300 transition-colors truncate">
                            {item.degree || "Degree Not Specified"}
                          </h3>

                          <p className="mt-1.5 sm:mt-2 text-slate-400 text-xs sm:text-base truncate">
                            {item.institutionName ||
                              "Institution Not Specified"}
                            {item.fieldOfStudy ? ` • ${item.fieldOfStudy}` : ""}
                          </p>

                          <span className="inline-flex items-center gap-2 mt-3 sm:mt-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold text-emerald-300">
                            {item.isCurrentlyStudying
                              ? "Currently Studying"
                              : "Completed"}
                          </span>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex flex-wrap xl:flex-nowrap items-center gap-6 sm:gap-8">
                        {/* CGPA */}
                        <div className="text-left xl:text-right min-w-[90px] sm:min-w-[110px]">
                          <p className="text-[10px] sm:text-[11px] uppercase tracking-widest text-slate-500 font-bold">
                            CGPA / Score
                          </p>

                          <p className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-black text-white">
                            {item.cgpa != null
                              ? Number(item.cgpa).toFixed(2)
                              : "N/A"}
                          </p>

                          {(item.cgpa ?? item.CGPA) && (
                            <p className="text-[11px] sm:text-xs text-slate-500">
                              Out of 10
                            </p>
                          )}
                        </div>

                        {/* Divider */}
                        <div className="hidden xl:block w-px h-16 bg-slate-800" />

                        {/* Duration */}
                        <div className="text-left xl:text-right min-w-[120px] sm:min-w-[140px]">
                          <p className="text-[10px] sm:text-[11px] uppercase tracking-widest text-slate-500 font-bold">
                            Duration
                          </p>

                          <p className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold text-white">
                            {startYr ?? "—"} –{" "}
                            {item.isCurrentlyStudying
                              ? "Present"
                              : (endYr ?? "—")}
                          </p>
                        </div>

                        {/* Divider */}
                        <div className="hidden xl:block w-px h-16 bg-slate-800" />

                        {/* Actions */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => editEducation(item)}
                            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer"
                            title="Edit"
                          >
                            <FiEdit2 size={18} />
                          </button>

                          <button
                            onClick={() => deleteEducation(item.id)}
                            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.section>
                );
              })
            )}
          </div>

          {/* =========================
             Phase 3: Education Statistics
          ========================= */}

          {education.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
            >
              {/* Total Qualifications */}
              <div className="group rounded-[24px] sm:rounded-[28px] border border-purple-500/20 bg-[#0B1021]/80 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_15px_35px_rgba(124,58,237,.12)] hover:shadow-[0_20px_60px_rgba(139,92,246,.18)] hover:-translate-y-1 hover:border-purple-400/50 transition-all duration-300">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xl sm:text-2xl shadow-[0_0_18px_rgba(168,85,247,.35)] group-hover:scale-110 transition-transform duration-300">
                  <FiBook />
                </div>

                <p className="mt-4 sm:mt-5 text-slate-400 text-xs sm:text-sm">
                  Total Qualifications
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1.5 sm:mt-2">
                  {education.length}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                  Added
                </p>
              </div>

              {/* Average CGPA */}
              <div className="group rounded-[24px] sm:rounded-[28px] border border-blue-500/20 bg-[#0B1021]/80 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_15px_35px_rgba(59,130,246,.12)] hover:shadow-[0_20px_60px_rgba(59,130,246,.18)] hover:-translate-y-1 hover:border-blue-400/50 transition-all duration-300">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl sm:text-2xl shadow-[0_0_18px_rgba(59,130,246,.35)] group-hover:scale-110 transition-transform duration-300">
                  <FiAward />
                </div>

                <p className="mt-4 sm:mt-5 text-slate-400 text-xs sm:text-sm">
                  Average CGPA
                </p>

                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1.5 sm:mt-2">
                  {(() => {
                    const scores = education
                      .map((e) => Number(e.cgpa ?? e.CGPA))
                      .filter((v) => !Number.isNaN(v));

                    return scores.length
                      ? (
                          scores.reduce((a, b) => a + b, 0) / scores.length
                        ).toFixed(2)
                      : "—";
                  })()}
                </h3>

                <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                  Out of 10
                </p>
              </div>

              {/* Total Duration */}
              <div className="group rounded-[24px] sm:rounded-[28px] border border-emerald-500/20 bg-[#0B1021]/80 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_15px_35px_rgba(16,185,129,.12)] hover:shadow-[0_20px_60px_rgba(16,185,129,.18)] hover:-translate-y-1 hover:border-emerald-400/50 transition-all duration-300">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-600 flex items-center justify-center text-white text-xl sm:text-2xl shadow-[0_0_18px_rgba(16,185,129,.35)] group-hover:scale-110 transition-transform duration-300">
                  <FiCalendar />
                </div>

                <p className="mt-4 sm:mt-5 text-slate-400 text-xs sm:text-sm">
                  Total Duration
                </p>

                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1.5 sm:mt-2">
                  {(() => {
                    const years = education.reduce((total, item) => {
                      if (!item.startDate) return total;

                      const start = new Date(item.startDate).getFullYear();
                      const end = item.isCurrentlyStudying
                        ? new Date().getFullYear()
                        : item.endDate
                          ? new Date(item.endDate).getFullYear()
                          : start;

                      return total + Math.max(end - start, 0);
                    }, 0);

                    return years || "—";
                  })()}
                </h3>

                <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                  Years
                </p>
              </div>

              {/* Academic Status */}
              <div className="group rounded-[24px] sm:rounded-[28px] border border-pink-500/20 bg-[#0B1021]/80 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_15px_35px_rgba(236,72,153,.12)] hover:shadow-[0_20px_60px_rgba(236,72,153,.18)] hover:-translate-y-1 hover:border-pink-400/50 transition-all duration-300">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center text-white text-xl sm:text-2xl shadow-[0_0_18px_rgba(236,72,153,.35)] group-hover:scale-110 transition-transform duration-300">
                  <FiAward />
                </div>

                <p className="mt-4 sm:mt-5 text-slate-400 text-xs sm:text-sm">
                  Academic Status
                </p>

                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1.5 sm:mt-2">
                  {education.some((e) => e.isCurrentlyStudying)
                    ? "Ongoing"
                    : "Completed"}
                </h3>

                <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                  {education.some((e) => e.isCurrentlyStudying)
                    ? "Keep Going!"
                    : "Well Done!"}
                </p>
              </div>
            </motion.section>
          )}

          {/* =========================
             Phase 4: Academic Excellence AI Card
          ========================= */}
          {education.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="group relative overflow-hidden rounded-[24px] sm:rounded-[30px] border border-purple-500/20 bg-gradient-to-r from-[#0B1021] via-[#11162F] to-[#050816] p-6 sm:p-8 shadow-[0_0_35px_rgba(124,58,237,.15)] hover:border-purple-400/50 transition-all duration-300"
            >
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-purple-500/10 blur-[80px]" />
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">
                    🎓 AI Academic Insights
                  </div>
                  <h2 className="mt-4 sm:mt-5 text-2xl sm:text-3xl font-black text-white">
                    Academic Excellence
                  </h2>
                  <p className="mt-2.5 sm:mt-3 text-slate-400 text-sm sm:text-base">
                    Your education profile helps CareerLens generate stronger AI
                    recommendations.
                  </p>
                  <div className="mt-5 sm:mt-6 flex flex-wrap gap-2.5 sm:gap-3">
                    <span className="rounded-full bg-purple-500/10 border border-purple-500/30 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-purple-300">
                      Education Added
                    </span>
                    <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-blue-300">
                      CGPA Recorded
                    </span>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-emerald-300">
                      Career Ready
                    </span>
                  </div>
                </div>
                <div className="text-6xl sm:text-8xl group-hover:scale-110 transition-transform duration-300">
                  🎓
                </div>
              </div>
            </motion.section>
          )}

          {/* =========================
             Phase 5: AI Profile Impact Ring
          ========================= */}
          {education.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="group rounded-[24px] sm:rounded-[30px] border border-purple-500/20 bg-[#0B1021]/80 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_15px_35px_rgba(124,58,237,.12)] hover:border-purple-400/50 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
                <div className="relative w-36 h-36 sm:w-40 sm:h-40 shrink-0">
                  <svg
                    className="w-full h-full -rotate-90"
                    viewBox="0 0 160 160"
                  >
                    <circle
                      cx="80"
                      cy="80"
                      r="68"
                      stroke="rgba(51,65,85,.45)"
                      strokeWidth="10"
                      fill="none"
                    />
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="68"
                      stroke="url(#eduRing)"
                      strokeWidth="10"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="427"
                      initial={{ strokeDashoffset: 427 }}
                      whileInView={{
                        strokeDashoffset:
                          427 - (427 * (profile?.profileStrength ?? 0)) / 100,
                      }}
                      transition={{ duration: 1.2 }}
                    />
                    <defs>
                      <linearGradient id="eduRing">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl sm:text-4xl font-black text-white">
                      {profile?.profileStrength ?? 0}%
                    </div>

                    <div className="text-xs text-purple-300">
                      Profile Strength
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Education Impact on CareerLens AI
                  </h3>
                  <p className="mt-2.5 sm:mt-3 text-slate-400 text-xs sm:text-base">
                    Keeping your academic records complete helps improve
                    AI-powered career recommendations and profile visibility.
                  </p>
                </div>
              </div>
            </motion.section>
          )}

          {/* =========================
             Phase 6: Smart Improvement CTA
          ========================= */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="group rounded-[24px] sm:rounded-[30px] border border-purple-500/20 bg-[#0B1021]/80 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_15px_35px_rgba(124,58,237,.12)] hover:border-purple-400/50 transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Keep Your Education Updated
                </h3>
                <p className="mt-2 text-slate-400 text-xs sm:text-base">
                  Adding new qualifications keeps your CareerLens profile
                  current.
                </p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowFormModal(true);
                }}
                className="rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-6 sm:px-7 py-3.5 text-white text-sm sm:text-base font-semibold shadow-[0_0_25px_rgba(124,58,237,.35)] hover:brightness-110 transition cursor-pointer shrink-0"
              >
                + Add Qualification
              </button>
            </div>
          </motion.section>

          {/* =========================
             Phase 7: Education Timeline Summary
          ========================= */}
          {education.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="group rounded-[24px] sm:rounded-[30px] border border-purple-500/20 bg-[#0B1021]/80 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_15px_35px_rgba(124,58,237,.12)] hover:border-purple-400/50 transition-all duration-300"
            >
              <h3 className="text-xl sm:text-2xl font-black text-white mb-6">
                Academic Journey
              </h3>
              <div className="space-y-5">
                {education.map((item, i) => (
                  <div key={item.id} className="flex gap-4 pb-6 sm:pb-8">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white shrink-0">
                        🎓
                      </div>
                      {i !== education.length - 1 && (
                        <div className="w-px flex-1 bg-slate-700 mt-2" />
                      )}
                    </div>
                    <div className="pb-4 min-w-0">
                      {/* Degree Name */}
                      <h3 className="text-xl sm:text-3xl font-black text-white truncate">
                        {item.degree || "Degree Not Specified"}
                      </h3>

                      {/* Institution + Field */}
                      <p className="mt-1 text-slate-400 text-xs sm:text-sm truncate">
                        {item.institutionName || "Institution Not Specified"}
                        {item.fieldOfStudy ? ` • ${item.fieldOfStudy}` : ""}
                      </p>

                      {/* Duration */}
                      <p className="mt-1.5 sm:mt-2 text-xs text-slate-500">
                        {item.startDate
                          ? new Date(item.startDate).getFullYear()
                          : "—"}{" "}
                        –{" "}
                        {item.isCurrentlyStudying
                          ? "Present"
                          : item.endDate
                            ? new Date(item.endDate).getFullYear()
                            : "—"}
                      </p>

                      {/* Status */}
                      <span
                        className={`inline-flex items-center mt-2.5 sm:mt-3 rounded-full px-3 py-1 text-xs font-semibold border ${
                          item.isCurrentlyStudying
                            ? "bg-blue-500/10 border-blue-500/30 text-blue-300"
                            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                        }`}
                      >
                        {item.isCurrentlyStudying
                          ? "Currently Studying"
                          : "Completed"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* =========================
             Phase 8: Responsive Trust Banner
          ========================= */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="group rounded-[24px] sm:rounded-[30px] border border-slate-700/50 bg-[#0B1021]/80 backdrop-blur-2xl p-6 sm:p-8 text-center shadow-[0_15px_35px_rgba(124,58,237,.08)] hover:border-purple-400/50 transition-all duration-300"
          >
            <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
              🚀
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Build a Strong Academic Profile
            </h3>
            <p className="mt-2.5 sm:mt-3 text-slate-400 text-xs sm:text-base max-w-2xl mx-auto">
              Every qualification you add strengthens your CareerLens profile
              and improves AI-powered recommendations.
            </p>
          </motion.section>

          {/* =========================
             Phase 9: Final Real-Time Audit Footer
          ========================= */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="rounded-[20px] sm:rounded-[24px] border border-purple-500/20 bg-[#0B1021]/70 backdrop-blur-xl p-5 sm:p-6 hover:border-purple-400/50 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
              <div>
                <div className="text-white font-bold text-sm sm:text-base">
                  Education Module Status
                </div>
                <div className="text-slate-400 text-xs sm:text-sm mt-0.5">
                  All cards use your backend education records and profile
                  strength.
                </div>
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs text-emerald-300">
                  Real-time Data
                </span>
                <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-xs text-blue-300">
                  Responsive
                </span>
                <span className="rounded-full bg-purple-500/10 border border-purple-500/30 px-3 py-1 text-xs text-purple-300">
                  AI Ready
                </span>
              </div>
            </div>
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
