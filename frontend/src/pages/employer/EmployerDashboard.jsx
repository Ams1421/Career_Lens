import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBriefcase,
  FiUsers,
  FiCalendar,
  FiAward,
  FiClock,
  FiTrendingUp,
  FiStar,
  FiCheckCircle,
  FiArrowRight,
  FiActivity,
  FiTarget,
} from "react-icons/fi";

import "./EmployerDashboard.css";

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { title: "Active Jobs", value: 5, icon: <FiBriefcase />, color: "blue" },
    { title: "Applicants", value: 128, icon: <FiUsers />, color: "purple" },
    { title: "Interviews", value: 18, icon: <FiCalendar />, color: "green" },
    { title: "Hired", value: 7, icon: <FiAward />, color: "orange" },
  ];

  const applicants = [
    { name: "Rahul Sharma", role: "React Developer", status: "Applied" },
    { name: "Priya Singh", role: ".NET Developer", status: "Interview Scheduled" },
    { name: "Arjun Patel", role: "Full Stack Developer", status: "AI Recommended" },
  ];

  const insights = [
    "Full Stack Developer receives the highest match scores.",
    "React candidates increased by 24% this week.",
    "Hyderabad has the strongest applicant pool.",
  ];

  const analytics = [
    { title: "Applications This Week", value: "+24%", icon: <FiTrendingUp /> },
    { title: "Average Match Score", value: "87%", icon: <FiTarget /> },
    { title: "Time-to-Hire", value: "9 Days", icon: <FiClock /> },
    { title: "Offer Acceptance", value: "92%", icon: <FiCheckCircle /> },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Hero */}
        <div className="bg-cardBg/85 backdrop-blur-2xl rounded-3xl border border-slate-700/50 shadow-2xl p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Employer Dashboard</h1>
            <p className="text-slate-400 mt-1">Manage jobs, applicants and AI hiring insights.</p>

            <div className="flex items-center gap-2 mt-3 text-slate-400 text-sm">
              <FiClock className="text-purple-400" />
              {currentTime.toLocaleDateString()} ·{" "}
              {currentTime.toLocaleTimeString()}
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="bg-slate-900/80 border border-slate-700/70 p-4 rounded-2xl flex items-center gap-3 shadow-lg">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center font-bold text-white shadow">CL</div>
              <div>
                <strong className="text-white text-sm">CareerLens Pvt Ltd</strong>
                <p className="text-slate-400 text-xs">Technology Recruitment</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-3 rounded-2xl font-bold shadow-lg shadow-purple-600/30 text-sm">
              Hiring Active
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item) => (
            <div key={item.title} className="bg-cardBg/85 backdrop-blur-2xl rounded-3xl border border-slate-700/50 shadow-xl p-6 flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg ${
                item.color === "blue" ? "bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-blue-600/30" :
                item.color === "purple" ? "bg-gradient-to-tr from-purple-600 to-pink-600 shadow-purple-600/30" :
                item.color === "green" ? "bg-gradient-to-tr from-emerald-600 to-teal-600 shadow-emerald-600/30" :
                "bg-gradient-to-tr from-orange-600 to-amber-600 shadow-orange-600/30"
              }`}>
                {item.icon}
              </div>

              <div>
                <p className="text-slate-400 text-xs uppercase font-semibold">{item.title}</p>
                <h2 className="text-3xl font-extrabold text-white mt-1">{item.value}</h2>
              </div>
            </div>
          ))}
        </div>

        {/* AI Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-cardBg/85 backdrop-blur-2xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
            <h3 className="text-lg font-bold text-white mb-4">⚡ AI Hiring Score</h3>

            <div className="flex items-center gap-6 my-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center text-2xl font-extrabold shadow-lg shadow-purple-600/30">
                91%
              </div>

              <div>
                <strong className="text-white text-base">Excellent Hiring Health</strong>
                <p className="text-slate-400 text-sm mt-1">Your listings are attracting qualified candidates.</p>
              </div>
            </div>

            <button className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-purple-600/30 hover:opacity-95 transition">
              View Recommendations
            </button>
          </div>

          <div className="bg-cardBg/85 backdrop-blur-2xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
            <h3 className="text-lg font-bold text-white mb-4">📈 AI Insights</h3>

            <div className="space-y-3">
              {insights.map((item) => (
                <div key={item} className="flex items-center gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-slate-300 text-sm">
                  <FiStar className="text-yellow-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-cardBg/85 backdrop-blur-2xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
          <h3 className="text-lg font-bold text-white mb-6">Quick Actions</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickAction title="Create Job" onClick={() => navigate("/employer/jobs/create")} />
            <QuickAction title="View Applicants" onClick={() => navigate("/employer/applicants")} />
            <QuickAction title="Schedule Interviews" onClick={() => navigate("/employer/interviews")} />
            <QuickAction title="Manage Jobs" onClick={() => navigate("/employer/jobs")} />
          </div>
        </div>

        {/* Hiring Analytics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {analytics.map((item) => (
            <div key={item.title} className="bg-cardBg/85 backdrop-blur-2xl rounded-3xl border border-slate-700/50 shadow-xl p-6 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-blue-600/30">
                {item.icon}
              </div>

              <div>
                <p className="text-slate-400 text-xs uppercase font-semibold">{item.title}</p>
                <h2 className="text-2xl font-extrabold text-white mt-1">{item.value}</h2>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Applications */}
        <div className="bg-cardBg/85 backdrop-blur-2xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
          <h3 className="text-lg font-bold text-white mb-6">Recent Applications</h3>

          <div className="space-y-4">
            {applicants.map((a) => (
              <div key={a.name} className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex justify-between items-center hover:border-purple-500/40 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 text-white flex items-center justify-center font-bold shadow">
                    {a.name.split(" ").map(n => n[0]).join("")}
                  </div>

                  <div>
                    <strong className="text-white text-base">{a.name}</strong>
                    <p className="text-slate-400 text-sm">{a.role}</p>
                  </div>
                </div>

                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                    a.status === "AI Recommended"
                      ? "bg-purple-950/70 border border-purple-500/40 text-purple-300"
                      : a.status === "Interview Scheduled"
                      ? "bg-emerald-950/70 border border-emerald-500/40 text-emerald-300"
                      : "bg-blue-950/70 border border-blue-500/40 text-blue-300"
                  }`}
                >
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity + Trend */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-cardBg/85 backdrop-blur-2xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
            <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>

            <div className="space-y-4">
              {[
                "Job posted successfully",
                "Interview scheduled",
                "Candidate shortlisted",
                "AI recommendation generated",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-800 text-slate-300 text-sm">
                  <FiActivity className="text-blue-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-cardBg/85 backdrop-blur-2xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
            <h3 className="text-lg font-bold text-white mb-4">Hiring Trend</h3>

            <div className="flex items-center gap-6 p-6 bg-slate-900/60 rounded-2xl border border-slate-800 mt-2">
              <FiTrendingUp className="text-purple-400 shrink-0" size={56} />
              <div>
                <h2 className="text-3xl font-extrabold text-white">+34%</h2>
                <p className="text-slate-400 text-sm mt-1">Applicant growth this month.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function QuickAction({ title, onClick }) {
  return (
    <button
      className="w-full flex justify-between items-center p-5 rounded-2xl border border-slate-700/70 bg-slate-900/80 text-slate-200 font-semibold hover:border-purple-500/50 hover:bg-slate-900 transition shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <span>{title}</span>
      <FiArrowRight className="text-purple-400" />
    </button>
  );
}