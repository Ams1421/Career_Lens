/**
 * ==========================================================
 * CareerLens - Profile.jsx (Premium UI Version)
 * ----------------------------------------------------------
 * UI upgraded with Dashboard-consistent premium styling.
 *
 * Completed Phases:
 * 1. Premium Profile Hero
 * 2. Premium Avatar Card
 * 3. Personal Information Card
 * 4. About Me Section
 * 5. Professional Links
 * 6. Resume Intelligence
 *
 * Notes:
 * - Business logic, APIs, routes, and state management remain unchanged.
 * - Added developer comments for maintainability.
 * ==========================================================
 */

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import profileApi from "../../api/profile";
import {
  FiCamera,
  FiMail,
  FiPhone,
  FiEdit2,
  FiFileText,
  FiDownload,
  FiExternalLink,
  FiCheck,
  FiMapPin,
  FiUser,
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiLinkedin,
  FiGithub,
  FiGlobe,
} from "react-icons/fi";
import Sidebar from "../../components/layout/Sidebar";
import TopNavbar from "../../components/layout/TopNavbar";
import { dashboardApi } from "../../api/dashboard";
import { resumeApi } from "../../api/resume";
import useAuth from "../../hooks/useAuth";

export default function Profile() {
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [dashboardProfile, setDashboardProfile] = useState(null);
  const [primaryResume, setPrimaryResume] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    location: "",
    headline: "",
    bio: "",
    graduationYear: "",
    cgpa: "",
    linkedInUrl: "",
    gitHubUrl: "",
    portfolioUrl: "",
    profileImageUrl: "",
  });

  const loadProfile = useCallback(async () => {
    try {
      const [response, profileRes, resumeRes] = await Promise.all([
        profileApi.getProfile(),
        dashboardApi.getProfile(),
        resumeApi.getMyResumes().catch(() => ({ data: [] })),
      ]);

      setPrimaryResume(
        resumeRes.data.find((r) => r.isPrimary) || resumeRes.data[0] || null,
      );
      setForm({
        ...response.data,
        profileImageUrl: response.data.profileImageUrl || "",
      });
      setDashboardProfile(profileRes.data);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadProfile();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadProfile]);

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    try {
      const response = await profileApi.uploadProfileImage(file);
      setForm((prev) => ({
        ...prev,
        profileImageUrl: response.data.profileImageUrl,
      }));
    } catch (error) {
      console.error(error);
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      await profileApi.updateProfile(form);
      setIsEditing(false);
      await loadProfile();
      alert("Profile updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  if (loading) {
    return (
      <div className="h-screen bg-[#030712] flex flex-col items-center justify-center text-slate-200">
        <div className="w-16 h-16 border-4 border-slate-800 border-t-purple-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-medium">Loading Profile...</p>
      </div>
    );
  }

  const fullName =
    `${form.firstName || ""} ${form.lastName || ""}`.trim() || "User";

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-20 right-10 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <TopNavbar
        profile={dashboardProfile}
        logout={logout}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <main
        className={`transition-all duration-300 ml-0 ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        } mt-20 sm:mt-24 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 relative z-10 overflow-x-hidden`}
      >
        {/* Main Content Container */}
        <div className="max-w-[1650px] mx-auto w-full space-y-6 sm:space-y-8">
          
          {/* =========================
             Phase 1: Premium Profile Hero
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
                  👤 Profile Overview
                </div>

                <h1 className="mt-4 sm:mt-5 text-3xl sm:text-4xl lg:text-5xl font-black text-white flex items-center gap-2">
                  My Profile
                  <span className="text-purple-400 text-2xl sm:text-3xl">•</span>
                </h1>

                <p className="mt-3 max-w-xl text-slate-400 text-sm sm:text-base leading-relaxed">
                  Your personal information and career summary.
                </p>
              </div>

              {/* Right CTA */}
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-5 sm:px-7 py-3 sm:py-4 text-white text-sm sm:text-base font-semibold shadow-[0_0_25px_rgba(124,58,237,.35)] hover:brightness-110 transition cursor-pointer"
              >
                <FiEdit2 size={18} />
                Edit Profile
              </button>
            </div>
          </motion.section>

          {/* EDIT FORM MODAL / PANEL */}
          {isEditing && (
            <div className="bg-[#0b1021]/95 backdrop-blur-2xl rounded-3xl border border-purple-500/40 shadow-2xl p-6 sm:p-8 animate-fadeIn">
              <h2 className="text-xl font-bold text-white mb-6">
                Update Profile Information
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-5">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                  <Input
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                  <Input
                    label="Phone Number"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                  />
                  <Input
                    label="Location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                  />
                  <Input
                    label="Graduation Year"
                    name="graduationYear"
                    value={form.graduationYear}
                    onChange={handleChange}
                  />
                  <Input
                    label="CGPA"
                    name="cgpa"
                    value={form.cgpa}
                    onChange={handleChange}
                  />
                  <Input
                    label="Headline"
                    name="headline"
                    value={form.headline}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-slate-300 text-xs uppercase tracking-wider">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    rows="3"
                    value={form.bio}
                    onChange={handleChange}
                    className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl p-3.5 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition text-sm"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-5">
                  <Input
                    label="LinkedIn URL"
                    name="linkedInUrl"
                    value={form.linkedInUrl}
                    onChange={handleChange}
                  />
                  <Input
                    label="GitHub URL"
                    name="gitHubUrl"
                    value={form.gitHubUrl}
                    onChange={handleChange}
                  />
                  <Input
                    label="Portfolio URL"
                    name="portfolioUrl"
                    value={form.portfolioUrl}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-purple-600/30 hover:opacity-95 disabled:opacity-50 transition cursor-pointer flex items-center gap-2"
                >
                  <FiCheck size={18} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}

          {/* TOP GRID: Avatar Card + Details Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Avatar Card */}
            <div className="lg:col-span-4 bg-[#0b1021]/80 backdrop-blur-2xl border border-slate-700/50 rounded-[24px] sm:rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
              {/* Premium Profile Avatar */}
              <div className="relative mb-6 group">
                {/* Ambient Glow */}
                <div className="absolute inset-0 rounded-full bg-purple-500/25 blur-2xl group-hover:bg-purple-500/35 transition duration-300"></div>

                {/* Gradient Ring */}
                <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1.5 shadow-[0_0_35px_rgba(168,85,247,0.45)]">
                  <img
                    src={
                      form.profileImageUrl
                        ? form.profileImageUrl.startsWith("http")
                          ? form.profileImageUrl
                          : `http://localhost:5149${form.profileImageUrl}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0b1021&color=fff&size=256`
                    }
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover border-2 border-[#0B1021]"
                  />
                </div>

                {/* Floating Camera Button */}
                <label className="absolute bottom-2 right-2 flex h-12 w-12 sm:h-14 sm:w-14 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_0_25px_rgba(168,85,247,.45)] hover:scale-105 transition border border-purple-400/40">
                  <FiCamera size={18} />
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {/* Verified Badge */}
                <div className="absolute -top-2 -right-2 rounded-full border border-purple-500/40 bg-[#11162F]/90 px-3 py-1 text-xs font-semibold text-purple-300 shadow-[0_0_15px_rgba(168,85,247,.25)] backdrop-blur-xl">
                  ✓ Verified
                </div>
              </div>

              <h2 className="text-xl font-extrabold text-white mt-2">
                {fullName}
              </h2>
              <p className="text-purple-400 text-xs font-bold uppercase tracking-wider mt-0.5">
                {form.headline || "Candidate"}
              </p>

              <span className="mt-4 px-4 py-1.5 bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-semibold rounded-full">
                {uploading ? "Uploading..." : "Edit Photo"}
              </span>
            </div>

            {/* =========================
               Phase 3: Premium Information Card
            ========================= */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
              className="lg:col-span-8 relative overflow-hidden rounded-[24px] sm:rounded-[30px] border border-purple-500/20 bg-[#0B1021]/80 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(124,58,237,.12)]"
            >
              {/* Background Glow */}
              <div className="absolute -top-12 right-0 h-40 w-40 rounded-full bg-blue-500/10 blur-[90px]"></div>

              <div className="relative">
                {/* Header */}
                <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">
                  📋 Personal Information
                </div>

                <h3 className="mt-4 text-xl sm:text-2xl font-black text-white">
                  Profile Details
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-slate-400">
                  Your personal and academic information.
                </p>

                {/* Information Grid */}
                <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <ProfileInfoField
                    icon={<FiUser />}
                    label="Full Name"
                    value={fullName}
                  />

                  <ProfileInfoField
                    icon={<FiBriefcase />}
                    label="Headline"
                    value={form.headline || "Full Stack Developer"}
                  />

                  <ProfileInfoField
                    icon={<FiMail />}
                    label="Email"
                    value={form.email}
                  />

                  <ProfileInfoField
                    icon={<FiBriefcase />}
                    label="Current Role"
                    value="Not specified"
                  />

                  <ProfileInfoField
                    icon={<FiPhone />}
                    label="Phone"
                    value={form.phoneNumber || "Not specified"}
                  />

                  <ProfileInfoField
                    icon={<FiBookOpen />}
                    label="Graduation Year"
                    value={form.graduationYear || "Not specified"}
                  />

                  <ProfileInfoField
                    icon={<FiMapPin />}
                    label="Location"
                    value={form.location || "Hyderabad, India"}
                  />

                  <ProfileInfoField
                    icon={<FiAward />}
                    label="CGPA"
                    value={form.cgpa || "Not specified"}
                  />
                </div>
              </div>
            </motion.section>
          </div>

          {/* BOTTOM GRID: About Me, Resume, & Links */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: About Me & Resume Card */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* =========================
                 Phase 4: Premium About Me
              ========================= */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="relative overflow-hidden rounded-[24px] sm:rounded-[30px] border border-purple-500/20 bg-[#0B1021]/80 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(124,58,237,.12)]"
              >
                {/* Ambient Glow */}
                <div className="absolute -top-10 -right-10 h-44 w-44 rounded-full bg-purple-500/10 blur-[90px]"></div>

                <div className="relative">
                  {/* Section Badge */}
                  <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">
                    ✨ Career Summary
                  </div>

                  {/* Heading */}
                  <h3 className="mt-4 text-xl sm:text-2xl font-black text-white">
                    About Me
                  </h3>

                  <div className="mt-6 rounded-3xl border border-slate-700 bg-slate-900/50 p-5 sm:p-6 relative overflow-hidden">
                    {/* Decorative Quote */}
                    <div className="absolute top-4 right-5 text-6xl text-purple-500/10 font-black select-none">
                      “
                    </div>

                    <p className="relative text-slate-300 leading-7 sm:leading-8 text-xs sm:text-[15px]">
                      {form.bio ||
                        "Passionate software developer with an interest in full-stack development, AI-powered applications, and modern web technologies. Focused on building scalable solutions and continuously improving technical skills."}
                    </p>
                  </div>

                  {/* Quick Highlights */}
                  <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3">
                    <div className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-purple-300">
                      🚀 Full Stack
                    </div>

                    <div className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-blue-300">
                      🤖 AI Enthusiast
                    </div>

                    <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-emerald-300">
                      💻 Problem Solver
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* =========================
                 Phase 6: Premium Resume Intelligence
              ========================= */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="relative overflow-hidden rounded-[24px] sm:rounded-[30px] border border-purple-500/20 bg-[#0B1021]/80 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(124,58,237,.12)]"
              >
                {/* Ambient Glow */}
                <div className="absolute -top-12 right-0 h-44 w-44 rounded-full bg-purple-500/10 blur-[90px]"></div>

                <div className="relative">
                  {/* Header */}
                  <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">
                    📄 Resume Intelligence
                  </div>

                  <h3 className="mt-4 text-xl sm:text-2xl font-black text-white">
                    Resume Analysis
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-400">
                    AI-powered ATS evaluation and optimization insights.
                  </p>

                  {primaryResume ? (
                    <>
                      {/* Resume Header */}
                      <div className="mt-6 sm:mt-8 flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-purple-950/80 border border-purple-500/40 text-purple-300 shadow-[0_0_18px_rgba(168,85,247,.25)] shrink-0">
                            <FiFileText size={20} />
                          </div>

                          <div className="min-w-0">
                            <h4 className="font-bold text-white text-sm sm:text-base truncate max-w-[200px] sm:max-w-xs">
                              {primaryResume.fileName}
                            </h4>

                            <p className="text-slate-400 text-[11px] sm:text-xs mt-0.5">
                              {(primaryResume.fileSizeBytes / 1024).toFixed(0)}{" "}
                              KB •{" "}
                              {new Date(
                                primaryResume.createdAtUtc,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <a
                          href={`http://localhost:5149${primaryResume.fileUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition shrink-0"
                        >
                          <FiDownload size={18} />
                        </a>
                      </div>

                      {/* ATS Ring */}
                      <div className="mt-8 flex justify-center">
                        <div className="relative h-40 w-40 sm:h-44 sm:w-44">
                          <div className="absolute inset-4 rounded-full bg-purple-500/15 blur-3xl"></div>

                          <svg
                            className="relative h-full w-full -rotate-90"
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
                              stroke="url(#resumeGradient)"
                              strokeWidth="12"
                              fill="none"
                              strokeLinecap="round"
                              strokeDasharray={314}
                              initial={{ strokeDashoffset: 314 }}
                              whileInView={{
                                strokeDashoffset:
                                  314 - (314 * primaryResume.atsScore) / 100,
                              }}
                              transition={{ duration: 1 }}
                            />

                            <defs>
                              <linearGradient id="resumeGradient">
                                <stop offset="0%" stopColor="#2563EB" />
                                <stop offset="100%" stopColor="#8B5CF6" />
                              </linearGradient>
                            </defs>
                          </svg>

                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <p className="text-4xl sm:text-5xl font-black text-white">
                              {primaryResume.atsScore}
                            </p>

                            <p className="text-xs sm:text-sm font-semibold text-purple-300">
                              ATS Score
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* AI Analysis */}
                      <div className="mt-6 sm:mt-8 rounded-2xl border border-slate-700 bg-slate-900/60 p-4 sm:p-5">
                        <div className="flex items-center gap-2 text-emerald-300 text-xs sm:text-sm font-semibold">
                          <FiCheck />
                          AI Resume Analysis
                        </div>

                        <p className="mt-2.5 sm:mt-3 text-slate-400 text-xs sm:text-sm leading-relaxed">
                          {primaryResume.atsSuggestions ||
                            "Your resume has been analyzed successfully and is ATS-friendly."}
                        </p>
                      </div>

                      {/* Status Chips */}
                      <div className="mt-5 sm:mt-6 grid grid-cols-3 gap-2.5 sm:gap-3">
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-2.5 sm:px-3 py-2.5 sm:py-3 text-center text-[11px] sm:text-xs text-emerald-300 font-medium">
                          ✓ Uploaded
                        </div>

                        <div className="rounded-xl border border-blue-500/30 bg-blue-500/15 px-2.5 sm:px-3 py-2.5 sm:py-3 text-center text-[11px] sm:text-xs text-blue-300 font-medium">
                          🤖 AI Ready
                        </div>

                        <div
                          className={`rounded-xl px-2.5 sm:px-3 py-2.5 sm:py-3 text-center text-[11px] sm:text-xs font-medium border ${
                            primaryResume.atsScore >= 85
                              ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                              : primaryResume.atsScore >= 70
                                ? "border-amber-500/30 bg-amber-500/15 text-amber-300"
                                : "border-red-500/30 bg-red-500/15 text-red-300"
                          }`}
                        >
                          {primaryResume.atsScore >= 85
                            ? "Excellent"
                            : primaryResume.atsScore >= 70
                              ? "Good"
                              : "Improve"}
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Premium Empty State */
                    <div className="mt-6 sm:mt-8 py-8 text-center">
                      <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/10 text-2xl sm:text-3xl">
                        📄
                      </div>

                      <h4 className="mt-4 sm:mt-5 text-lg sm:text-xl font-bold text-white">
                        No Resume Uploaded
                      </h4>

                      <p className="mx-auto mt-2 max-w-sm text-slate-400 text-xs sm:text-sm">
                        Upload your resume to unlock AI-powered ATS analysis and
                        personalized optimization suggestions.
                      </p>

                      <button
                        onClick={() => setIsEditing(true)}
                        className="mt-5 sm:mt-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-6 sm:px-7 py-3 text-white text-sm font-semibold shadow-[0_0_20px_rgba(124,58,237,.35)] hover:brightness-110 transition cursor-pointer"
                      >
                        Upload Resume
                      </button>
                    </div>
                  )}
                </div>
              </motion.section>
            </div>

            {/* Right Column: Social Links & Achievement Stats Cards */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* =========================
                 Phase 5: Premium Professional Links
              ========================= */}
              <motion.section
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45 }}
                className="relative overflow-hidden rounded-[24px] sm:rounded-[30px] border border-purple-500/20 bg-[#0B1021]/80 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(124,58,237,.12)]"
              >
                {/* Ambient Glow */}
                <div className="absolute -bottom-10 right-0 h-40 w-40 rounded-full bg-purple-500/10 blur-[90px]"></div>

                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">
                    🌐 Professional Links
                  </div>

                  <h3 className="mt-4 text-xl sm:text-2xl font-black text-white">
                    Connect With Me
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-400">
                    Your professional profiles and portfolio.
                  </p>

                  <div className="mt-6 sm:mt-8 space-y-3.5 sm:space-y-4">
                    <SocialCard
                      icon={<FiLinkedin />}
                      title="LinkedIn"
                      value={form.linkedInUrl}
                      color="blue"
                    />

                    <SocialCard
                      icon={<FiGithub />}
                      title="GitHub"
                      value={form.gitHubUrl}
                      color="purple"
                    />

                    <SocialCard
                      icon={<FiGlobe />}
                      title="Portfolio"
                      value={form.portfolioUrl}
                      color="emerald"
                    />
                  </div>
                </div>
              </motion.section>

              {/* =========================
                 Phase 7: Career Achievement Stats
              ========================= */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="relative overflow-hidden rounded-[24px] sm:rounded-[30px] border border-purple-500/20 bg-[#0B1021]/80 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(124,58,237,.12)]"
              >
                {/* Ambient Glow */}
                <div className="absolute -bottom-8 left-10 h-36 w-36 rounded-full bg-purple-500/10 blur-[80px]"></div>

                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">
                    📊 Career Metrics
                  </div>

                  <h3 className="mt-4 text-xl sm:text-2xl font-black text-white">
                    Achievement Stats
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-400">
                    A quick overview of your career progress.
                  </p>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AchievementCard
                      icon="📁"
                      title="Projects"
                      value={dashboardProfile?.projectCount ?? "—"}
                      subtitle={
                        dashboardProfile?.projectCount
                          ? "Completed"
                          : "Your Projects"
                      }
                    />

                    <AchievementCard
                      icon="💡"
                      title="Skills"
                      value={dashboardProfile?.skillCount ?? "—"}
                      subtitle={
                        dashboardProfile?.skillCount ? "Added" : "Your Skills"
                      }
                    />

                    <AchievementCard
                      icon="🏆"
                      title="Certifications"
                      value={dashboardProfile?.certificationCount ?? "—"}
                      subtitle={
                        dashboardProfile?.certificationCount
                          ? "Earned"
                          : "Your Certifications"
                      }
                    />

                    <AchievementCard
                      icon="⭐"
                      title="Achievements"
                      value={dashboardProfile?.achievementCount ?? "—"}
                      subtitle={
                        dashboardProfile?.achievementCount
                          ? "Unlocked"
                          : "Your Achievements"
                      }
                    />
                  </div>
                </div>
              </motion.section>
            </div>
          </div>

          {/* =========================
             Phase 8: AI Career Intelligence
          ========================= */}
          <motion.section
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] border border-purple-500/20 bg-gradient-to-br from-[#0B1021] via-[#11162F] to-[#050816] p-6 sm:p-8 lg:p-10 shadow-[0_0_45px_rgba(124,58,237,.18)]"
          >
            {/* Ambient Glow */}
            <div className="absolute -top-20 right-0 h-64 w-64 rounded-full bg-purple-500/15 blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-blue-500/10 blur-[80px]"></div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] bg-[size:42px_42px]"></div>

            <div className="relative">
              {/* Header */}
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-semibold text-purple-300">
                🤖 AI Career Intelligence
              </div>

              <h2 className="mt-4 sm:mt-5 text-2xl sm:text-3xl lg:text-4xl font-black text-white">
                Keep Growing Every Week
              </h2>

              <p className="mt-2.5 sm:mt-3 max-w-2xl text-slate-400 text-xs sm:text-base leading-relaxed">
                Your profile is becoming stronger with every update. Continue
                improving your resume, skills, and portfolio to unlock better AI
                career matches.
              </p>

              {/* Insight Cards */}
              <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 sm:p-5 hover:border-purple-500/40 transition">
                  <div className="text-2xl mb-3">🎯</div>
                  <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 font-medium">
                    Next Goal
                  </p>
                  <p className="mt-1.5 sm:mt-2 font-bold text-white text-sm sm:text-base">
                    {primaryResume
                      ? `Reach ${Math.min(100, primaryResume.atsScore + 6)}% ATS Score`
                      : "Upload Your Resume"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 sm:p-5 hover:border-blue-500/40 transition">
                  <div className="text-2xl mb-3">📈</div>
                  <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 font-medium">
                    Profile Status
                  </p>
                  <p className="mt-1.5 sm:mt-2 font-bold text-white text-sm sm:text-base">AI Ready</p>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 sm:p-5 hover:border-emerald-500/40 transition">
                  <div className="text-2xl mb-3">🚀</div>
                  <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 font-medium">
                    Recommendation
                  </p>
                  <p className="mt-1.5 sm:mt-2 font-bold text-white text-sm sm:text-base">Add More Projects</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-5 sm:px-6 py-2.5 sm:py-3 text-white text-xs sm:text-sm font-semibold shadow-[0_0_20px_rgba(124,58,237,.35)] hover:brightness-110 transition cursor-pointer"
                >
                  Update Profile
                </button>

                <button
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="rounded-2xl border border-slate-700 bg-slate-900/60 px-5 sm:px-6 py-2.5 sm:py-3 text-slate-300 text-xs sm:text-sm hover:border-purple-500/40 hover:text-white transition cursor-pointer"
                >
                  Back to Top
                </button>
              </div>
            </div>
          </motion.section>

          {/* =========================
             Phase 9: AI Career Journey
          ========================= */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] border border-purple-500/20 bg-[#0B1021]/80 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_15px_45px_rgba(124,58,237,.15)]"
          >
            {/* Ambient Glow */}
            <div className="absolute -top-16 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-purple-500/10 blur-[90px]"></div>

            <div className="relative">
              {/* Header */}
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-semibold text-purple-300">
                🚀 Career Journey
              </div>

              <h2 className="mt-4 sm:mt-5 text-2xl sm:text-3xl font-black text-white">
                Your AI Progress Timeline
              </h2>

              <p className="mt-2.5 sm:mt-3 text-slate-400 max-w-2xl text-xs sm:text-base">
                Track how your CareerLens profile is evolving and what AI
                recommends next.
              </p>

              {/* Profile Completion */}
              <div className="mt-6 sm:mt-8 rounded-2xl border border-slate-700 bg-slate-900/60 p-4 sm:p-5">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-white font-semibold text-sm sm:text-base">
                    Profile Completion
                  </span>

                  <span className="text-purple-300 font-bold text-sm sm:text-base">
                    {dashboardProfile?.profileStrength ?? 0}%
                  </span>
                </div>

                <div className="h-2.5 sm:h-3 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dashboardProfile?.profileStrength ?? 0}%` }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                  />
                </div>

                <p className="mt-2.5 text-[11px] sm:text-xs text-slate-400">
                  Complete your profile to unlock stronger AI recommendations.
                </p>
              </div>

              {/* Timeline */}
              <div className="mt-6 sm:mt-8 space-y-6">
                <TimelineItem
                  status={form.firstName ? "completed" : "upcoming"}
                  title="Profile Created"
                  description="Your CareerLens profile is active."
                />

                <TimelineItem
                  status={primaryResume ? "completed" : "upcoming"}
                  title="Resume Uploaded"
                  description={
                    primaryResume
                      ? `ATS Score: ${primaryResume.atsScore}%`
                      : "Upload your first resume."
                  }
                />

                <TimelineItem
                  status={form.bio ? "active" : "upcoming"}
                  title="Build Your Portfolio"
                  description="Add projects and certifications."
                />

                <TimelineItem
                  status="upcoming"
                  title={`Reach ${Math.max(90, dashboardProfile?.profileStrength ?? 0)}% Profile Completion`}
                  description="Improve your resume and skills."
                  isLast
                />
              </div>

              {/* Next Recommendation */}
              <div className="mt-6 sm:mt-8 rounded-2xl border border-purple-500/30 bg-purple-500/10 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="text-xl sm:text-2xl">🤖</div>

                  <div>
                    <h4 className="font-bold text-white text-sm sm:text-base">AI Recommendation</h4>

                    <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-purple-200 leading-relaxed">
                      Your next highest-impact improvement is adding more
                      projects and strengthening your ATS score for better job
                      matching.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}

function ProfileInfoField({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-3.5 sm:p-4 hover:border-purple-500/40 hover:bg-slate-900/80 transition">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 shrink-0">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 font-medium">
            {label}
          </p>

          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-semibold text-white break-words">
            {value || "-"}
          </p>
        </div>
      </div>
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

function AchievementCard({ icon, title, value, subtitle }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 sm:p-5 hover:border-purple-500/40 transition">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-lg sm:text-xl shrink-0">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 font-medium truncate">
            {title}
          </p>

          <h4 className="text-xl sm:text-2xl font-black text-white">{value}</h4>

          <p className="text-[11px] sm:text-xs text-slate-400 truncate">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Phase 9 Helper
   Timeline Item
========================= */

function TimelineItem({ status, title, description, isLast = false }) {
  const colors = {
    completed: "bg-emerald-500 border-emerald-400",
    active: "bg-purple-500 border-purple-400",
    upcoming: "bg-slate-700 border-slate-500",
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`h-4 w-4 sm:h-5 sm:w-5 rounded-full border-2 ${colors[status]} shrink-0`} />
        {!isLast && <div className="mt-1 h-full w-px bg-slate-700" />}
      </div>

      <div className="pb-4 min-w-0">
        <h4 className="font-bold text-white text-sm sm:text-base">{title}</h4>

        <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function SocialCard({ icon, title, value, color }) {
  const colors = {
    blue: "bg-blue-500/10 border-blue-500/30 text-blue-300",
    purple: "bg-purple-500/10 border-purple-500/30 text-purple-300",
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
  };

  return (
    <a
      href={value || "#"}
      target={value ? "_blank" : undefined}
      rel="noreferrer"
      className={`group flex items-center justify-between gap-3 rounded-2xl border border-slate-700 bg-slate-900/60 p-3.5 sm:p-4 transition hover:border-purple-500/40 hover:bg-slate-900/80 ${
        !value ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
        <div
          className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl border ${colors[color]} shrink-0 text-lg`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-white text-sm sm:text-base">{title}</p>
          <p className="text-[11px] sm:text-xs text-slate-400 truncate max-w-[160px] sm:max-w-xs">
            {value || "Not added yet"}
          </p>
        </div>
      </div>

      <FiExternalLink className="text-slate-500 transition group-hover:text-purple-300 group-hover:translate-x-1 shrink-0" />
    </a>
  );
}