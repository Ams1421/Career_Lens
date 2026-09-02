import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";

import { skillsApi } from "../../api/skills";
import Sidebar from "../../components/layout/Sidebar";
import TopNavbar from "../../components/layout/TopNavbar";
import { dashboardApi } from "../../api/dashboard";
import useAuth from "../../hooks/useAuth";

export default function Skills() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState(null);

  const [skills, setSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");

  const [selectedLevel, setSelectedLevel] = useState(3);
  const [yearsExperience, setYearsExperience] = useState("");
  const [editingSkill, setEditingSkill] = useState(null);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/", { replace: true });
  }, [logout, navigate]);

  const loadSkills = useCallback(async () => {
    try {
      const [profileRes, userSkills, allSkills] = await Promise.all([
        dashboardApi.getProfile(),
        skillsApi.getSkills(),
        skillsApi.getAvailableSkills(),
      ]);

      setProfile(profileRes.data);
      setSkills(userSkills.data ?? []);
      setAvailableSkills(allSkills.data ?? []);
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
        return;
      }
      console.error("Failed to load skills:", error);
      setSkills([]);
      setAvailableSkills([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadSkills();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadSkills]);

  async function addSkill() {
    if (!selectedSkill) return;

    try {
      if (editingSkill) {
        await skillsApi.updateSkill(editingSkill.id, {
          skillId: selectedSkill,
          proficiencyLevel: selectedLevel,
          yearsOfExperience: yearsExperience || null,
        });
      } else {
        await skillsApi.addSkill({
          skillId: selectedSkill,
          proficiencyLevel: selectedLevel,
          yearsOfExperience: yearsExperience || null,
        });
      }

      await loadSkills();

      setEditingSkill(null);
      setSelectedSkill("");
      setSelectedLevel(3);
      setYearsExperience("");
    } catch (error) {
      console.error(error);
      alert("Failed to add skill.");
    }
  }

  async function deleteSkill(id) {
    try {
      await skillsApi.deleteSkill(id);
      await loadSkills();
    } catch (error) {
      console.error(error);
      alert("Failed to delete skill.");
    }
  }

  function editSkill(skill) {
    setEditingSkill(skill);
    setSelectedSkill(skill.skillId);
    setSelectedLevel(skill.proficiencyLevel || 3);
    setYearsExperience(skill.yearsOfExperience ?? "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-lg font-medium text-slate-300">
        Loading Skills...
      </div>
    );
  }

  const totalSkillsCount = skills.length;

  // Technical skills detected from the actual added skill names
  const technicalKeywords = [
    ".net",
    "asp.net",
    "react",
    "javascript",
    "typescript",
    "html",
    "css",
    "sql",
    "postgresql",
    "mysql",
    "mongodb",
    "python",
    "java",
    "c#",
    "c++",
    "docker",
    "aws",
    "azure",
    "git",
    "linux",
    "ubuntu",
    "apache",
    "node",
    "express",
  ];

  const technicalSkillsCount = skills.filter((skill) => {
    const name = (skill.skillName || skill.name || "").toLowerCase();

    return (
      skill.isTechnical === true ||
      technicalKeywords.some((tech) => name.includes(tech))
    );
  }).length;

  // Only use real proficiency values from the backend
  const validProficiencies = skills.filter(
    (skill) => typeof skill.proficiencyLevel === "number",
  );

  const avgProficiency =
    validProficiencies.length > 0
      ? Math.round(
          (validProficiencies.reduce(
            (sum, skill) => sum + skill.proficiencyLevel,
            0,
          ) /
            validProficiencies.length) *
            20,
        )
      : null;

  const ratedSkills = skills.filter(
    (skill) => typeof skill.proficiencyLevel === "number",
  );

  const topSkill =
    ratedSkills.length > 0
      ? ratedSkills.reduce((prev, current) =>
          prev.proficiencyLevel > current.proficiencyLevel ? prev : current,
        )
      : skills[0] || null;

  const filteredAvailableSkills = availableSkills.filter(
    (skill) =>
      !skills.some(
        (userSkill) =>
          String(userSkill.skillId).toLowerCase() ===
          String(skill.id).toLowerCase(),
      ),
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
        {/* Maximum width container utilizing nearly full screen space */}
        <div className="w-full max-w-[98%] mx-auto space-y-6 sm:space-y-8">
          {/* Header & Add Skill Card */}
          <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] border border-purple-500/20 bg-gradient-to-r from-[#0B1021] via-[#11162F] to-[#050816] p-6 sm:p-8 lg:p-10 shadow-[0_15px_45px_rgba(124,58,237,.18)]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
              My Skills
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mb-6">
              Manage and track your technical and professional skills.
            </p>

            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="flex-1 bg-slate-900/80 border border-slate-700/70 rounded-2xl p-3.5 text-slate-100 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition text-sm"
              >
                <option value="" className="bg-slate-900">
                  Select or search a skill
                </option>

                {filteredAvailableSkills.length > 0 ? (
                  filteredAvailableSkills.map((skill) => (
                    <option
                      key={skill.id}
                      value={skill.id}
                      className="bg-slate-900"
                    >
                      {skill.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No skills available</option>
                )}
              </select>

              <button
                onClick={addSkill}
                disabled={!selectedSkill}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3.5 rounded-2xl font-bold shadow-[0_10px_35px_rgba(139,92,246,.45)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 transition-all duration-300 text-sm cursor-pointer"
              >
                <FiPlus />
                {editingSkill ? <FaEdit /> : <FiPlus />}
                {editingSkill ? "Update Skill" : "Add Skill"}
              </button>

              {editingSkill && (
                <button
                  onClick={() => {
                    setEditingSkill(null);
                    setSelectedSkill("");
                    setSelectedLevel(3);
                    setYearsExperience("");
                  }}
                  className="px-6 py-3.5 rounded-2xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all duration-300 text-sm cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>

            {/* Popular Skills Quick Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-xs sm:text-sm text-slate-400 font-medium">
                Popular skills:
              </span>
              {[
                ".NET",
                "React",
                "SQL",
                "JavaScript",
                "Python",
                "AWS",
                "Docker",
              ].map((popSkill) => (
                <button
                  key={popSkill}
                  onClick={() => {
                    const found = filteredAvailableSkills.find(
                      (s) =>
                        s.name?.trim().toLowerCase() ===
                        popSkill.trim().toLowerCase(),
                    );

                    if (found) {
                      setSelectedSkill(found.id);
                    }
                  }}
                  className="text-xs bg-slate-800/60 hover:bg-purple-500/20 hover:border-purple-500/60 border border-slate-700/50 text-slate-300 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer"
                >
                  {popSkill}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="text-xs sm:text-sm text-slate-400 mb-2 block font-semibold uppercase tracking-wider">
                  Proficiency Level
                </label>

                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(Number(e.target.value))}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-2xl p-3.5 text-white text-sm outline-none focus:border-purple-500"
                >
                  <option value={1}>Beginner (20%)</option>
                  <option value={2}>Basic (40%)</option>
                  <option value={3}>Intermediate (60%)</option>
                  <option value={4}>Advanced (80%)</option>
                  <option value={5}>Expert (100%)</option>
                </select>
              </div>

              <div>
                <label className="text-xs sm:text-sm text-slate-400 mb-2 block font-semibold uppercase tracking-wider">
                  Years of Experience
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-2xl p-3.5 text-white text-sm outline-none focus:border-purple-500 placeholder-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Skills */}
            <div className="group bg-[#0B1021]/80 border border-purple-500/20 shadow-[0_8px_35px_rgba(124,58,237,.08)] hover:shadow-[0_12px_45px_rgba(124,58,237,.15)] p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40">
              <div className="absolute top-4 right-4 p-2.5 sm:p-3 bg-purple-600/20 text-purple-400 rounded-2xl">
                <FiPlus size={18} />
              </div>
              <div>
                <p className="text-slate-400 text-xs sm:text-sm font-medium">
                  Total Skills
                </p>
                <h3 className="text-3xl sm:text-4xl font-black text-white mt-1">
                  {totalSkillsCount}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-4">Added</p>
            </div>

            {/* Technical Skills */}
            <div className="group bg-[#0B1021]/80 border border-purple-500/20 shadow-[0_8px_35px_rgba(124,58,237,.08)] hover:shadow-[0_12px_45px_rgba(124,58,237,.15)] p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40">
              <div className="absolute top-4 right-4 p-2.5 sm:p-3 bg-blue-600/20 text-blue-400 rounded-2xl">
                <FiPlus size={18} />
              </div>

              <div>
                <p className="text-slate-400 text-xs sm:text-sm font-medium">
                  Technical Skills
                </p>

                <h3 className="text-3xl sm:text-4xl font-black text-white mt-1">
                  {technicalSkillsCount}
                </h3>

                <p className="text-xs text-blue-400 mt-4 font-semibold">
                  {totalSkillsCount > 0
                    ? `${Math.round((technicalSkillsCount / totalSkillsCount) * 100)}% of skills`
                    : "No skills"}
                </p>
              </div>
            </div>

            {/* Proficiency Avg */}
            <div className="group bg-[#0B1021]/80 border border-purple-500/20 shadow-[0_8px_35px_rgba(124,58,237,.08)] hover:shadow-[0_12px_45px_rgba(124,58,237,.15)] p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40">
              <div className="absolute top-4 right-4 p-2.5 sm:p-3 bg-emerald-600/20 text-emerald-400 rounded-2xl">
                <FiPlus size={18} />
              </div>
              <div>
                <p className="text-slate-400 text-xs sm:text-sm font-medium">
                  Proficiency Avg.
                </p>
                <h3 className="text-3xl sm:text-4xl font-black text-white mt-1">
                  {avgProficiency !== null ? `${avgProficiency}%` : "—"}
                </h3>
              </div>
              <p className="text-xs text-emerald-400 mt-4 font-semibold">
                {avgProficiency !== null
                  ? `${validProficiencies.length} rated skills`
                  : "No proficiency ratings"}
              </p>
            </div>

            {/* Top Skill */}
            <div className="group bg-[#0B1021]/80 border border-purple-500/20 shadow-[0_8px_35px_rgba(124,58,237,.08)] hover:shadow-[0_12px_45px_rgba(124,58,237,.15)] p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40">
              <div className="absolute top-4 right-4 p-2.5 sm:p-3 bg-amber-600/20 text-amber-400 rounded-2xl">
                <FiPlus size={18} />
              </div>
              <div>
                <p className="text-slate-400 text-xs sm:text-sm font-medium">
                  Top Skill
                </p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1 truncate">
                  {topSkill ? topSkill.skillName || topSkill.name : "None"}
                </h3>
              </div>
              <p className="text-xs text-amber-400 mt-4 font-semibold">
                {topSkill?.proficiencyLevel
                  ? `${topSkill.proficiencyLevel * 20}%`
                  : "Awaiting rating"}
              </p>
            </div>
          </div>

          {/* Added Skills Highlight Section */}
          {skills.length > 0 && (
            <div className="bg-[#0B1021]/80 backdrop-blur-2xl rounded-3xl border border-purple-500/20 shadow-[0_12px_45px_rgba(124,58,237,.12)] p-6">
              <h2 className="text-lg font-bold text-white mb-4">
                Added Skills ({skills.length})
              </h2>

              {skills.slice(0, 1).map((skill) => (
                <div
                  key={skill.id}
                  className="group relative overflow-hidden bg-gradient-to-r from-[#0B1021] via-[#11162F] to-[#050816] border border-purple-500/30 shadow-[0_0_25px_rgba(124,58,237,.12)] rounded-[22px] sm:rounded-[26px] p-5 sm:p-6 transition-all duration-300 hover:border-purple-400/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold shrink-0">
                      {(skill.skillName || skill.name)
                        ?.substring(0, 3)
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-white text-base sm:text-lg truncate">
                          {skill.skillName || skill.name}
                        </h4>
                        {skill.isPrimary && (
                          <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 rounded-full font-medium border border-purple-500/30">
                            Primary
                          </span>
                        )}
                      </div>
                      {skill.description && (
                        <p className="text-slate-400 text-xs sm:text-sm mt-0.5 truncate">
                          {skill.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-8 w-full md:w-auto justify-between md:justify-end flex-wrap">
                    {skill.proficiencyLevel !== undefined &&
                      skill.proficiencyLevel !== null && (
                        <div>
                          <p className="text-xs text-slate-400">Proficiency</p>
                          <p className="text-purple-400 font-bold text-sm sm:text-base">
                            {skill.proficiencyLevel * 20}%
                          </p>
                        </div>
                      )}
                    {skill.yearsOfExperience != null && (
                      <div>
                        <p className="text-xs text-slate-400">Experience</p>
                        <p className="text-slate-200 font-medium text-sm sm:text-base">
                          {skill.yearsOfExperience} yrs
                        </p>
                      </div>
                    )}
                    {skill.lastUsed && (
                      <div>
                        <p className="text-xs text-slate-400">Last Used</p>
                        <p className="text-slate-200 font-medium text-sm sm:text-base">
                          {skill.lastUsed}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => editSkill(skill)}
                        className="p-2.5 bg-slate-800/70 hover:bg-blue-500/20 hover:text-blue-300 rounded-xl transition-all duration-300 hover:scale-110 cursor-pointer"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => deleteSkill(skill.id)}
                        className="p-2.5 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 text-red-400 rounded-xl transition-all duration-300 hover:scale-110 cursor-pointer"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* All Skills List Section */}
          <div className="bg-[#0B1021]/80 backdrop-blur-2xl rounded-3xl border border-purple-500/20 shadow-[0_12px_45px_rgba(124,58,237,.12)] p-6">
            <h2 className="text-xl font-bold text-white mb-6">All Skills</h2>

            {skills.length === 0 ? (
              <p className="text-slate-400">No skills added yet.</p>
            ) : (
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="group bg-gradient-to-r from-[#0B1021] via-[#11162F] to-[#050816] border border-purple-500/20 rounded-[22px] p-4 sm:p-5 transition-all duration-300 hover:border-purple-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-sm shrink-0">
                        {(skill.skillName || skill.name)
                          ?.substring(0, 2)
                          .toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-white text-base truncate">
                          {skill.skillName || skill.name}
                        </h4>
                        {skill.description && (
                          <p className="text-slate-400 text-xs truncate">
                            {skill.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto justify-between md:justify-end flex-wrap">
                      {skill.proficiencyLevel !== undefined &&
                        skill.proficiencyLevel !== null && (
                          <div className="w-28 sm:w-32">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-400">
                                Proficiency
                              </span>
                              <span className="text-purple-400 font-bold">
                                {skill.proficiencyLevel * 20}%
                              </span>
                            </div>

                            <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 h-full rounded-full shadow-[0_0_18px_rgba(168,85,247,.45)] transition-all duration-500"
                                style={{
                                  width: `${skill.proficiencyLevel * 20}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}

                      {skill.yearsOfExperience != null && (
                        <div>
                          <p className="text-xs text-slate-400">Experience</p>
                          <p className="text-slate-200 text-sm font-medium">
                            {skill.yearsOfExperience} yrs
                          </p>
                        </div>
                      )}

                      {skill.lastUsed && (
                        <div>
                          <p className="text-xs text-slate-400">Last Used</p>
                          <p className="text-slate-200 text-sm font-medium">
                            {skill.lastUsed}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => editSkill(skill)}
                          className="p-2.5 bg-slate-800/70 hover:bg-blue-500/20 hover:text-blue-300 rounded-xl transition-all duration-300 hover:scale-110 cursor-pointer"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => deleteSkill(skill.id)}
                          className="p-2.5 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 text-red-400 rounded-xl transition-all duration-300 hover:scale-110 cursor-pointer"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Callout Card */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#0B1021] via-[#11162F] to-[#050816] backdrop-blur-3xl rounded-[24px] sm:rounded-[30px] border border-purple-500/20 shadow-[0_25px_80px_rgba(99,102,241,.18)] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 bg-purple-600/20 border border-purple-500/40 rounded-2xl flex items-center justify-center text-purple-400 shrink-0 mx-auto sm:mx-0">
                <FiPlus size={22} />
              </div>
              <div>
                <h3 className="font-bold text-white text-base sm:text-lg">
                  Add more skills
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  Keep adding skills to improve your AI match score.
                </p>
              </div>
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-purple-600/30 hover:opacity-95 transition flex items-center gap-2 cursor-pointer shrink-0"
            >
              <FiPlus /> Add New Skill
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
