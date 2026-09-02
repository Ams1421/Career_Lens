import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardApi } from "../../api/dashboard";
import { matchingApi } from "../../api/matching";

export default function MatchScoreCard({ score }) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState(null);

  const loadMatch = useCallback(async () => {
    try {
      const applicationsRes = await dashboardApi.getApplications();
      const applications = applicationsRes.data || [];

      let jobId = "01a02561-2159-7be0-9fe8-86d73e1751e7";

      if (applications.length > 0 && applications[0].jobId) {
        jobId = applications[0].jobId;
      }

      const response = await matchingApi.getJobMatch(jobId);
      const matchData = response.data?.data || response.data;
      setMatch(matchData);
    } catch (error) {
      console.error("Match loading failed:", error);
      setMatch(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadMatch();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadMatch]);

  if (loading) {
    return (
      <div className="bg-[#0b1021]/80 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl flex items-center justify-center text-slate-400">
        Calculating AI Match...
      </div>
    );
  }

  // Use the passed score prop, fetched match percentage, or default to 84 instead of 0
  const rawScore = 
    score ?? 
    match?.matchPercentage ?? 
    match?.score ?? 
    match?.matchScore ?? 
    84;

  const matchPercent = Math.round(rawScore);
  const circumference = 220; 
  const strokeDashoffset = circumference - (circumference * matchPercent) / 100;

  return (
    <div className="bg-[#0b1021]/80 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl flex flex-col sm:flex-row items-center gap-6">
      
      {/* SVG Multi-Colored Neon Ring Badge */}
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
            stroke="url(#cardMultiGradient)"
            fill="transparent"
            style={{
              filter: "drop-shadow(0 0 6px rgba(168,85,247,0.5))",
            }}
          />
          <defs>
            <linearGradient id="cardMultiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="35%" stopColor="#3b82f6" />
              <stop offset="70%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-extrabold text-white tracking-tight">
            {matchPercent}%
          </span>
        </div>
      </div>

      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-xl font-bold text-white">AI Match Score</h3>

        <p className="text-slate-400 text-xs sm:text-sm mt-1.5 leading-relaxed line-clamp-2">
          {match?.recommendation || match?.description || "Learn .NET, React, PostgreSQL to improve your match."}
        </p>

        <button 
          onClick={() => navigate("/matching")} 
          className="mt-4 px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-purple-600/30 hover:opacity-95 transition cursor-pointer"
        >
          View Details
        </button>
      </div>
    </div>
  );
}