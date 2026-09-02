import { useNavigate } from "react-router-dom";

export default function MatchScoreCard({ score, matchData }) {
  const navigate = useNavigate();

  const matchPercent = Math.round(
    score ??
      matchData?.matchPercentage ??
      matchData?.score ??
      matchData?.matchScore ??
      0
  );

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (circumference * matchPercent) / 100;

  return (
    <div className="bg-[#0b1021]/80 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl flex flex-col sm:flex-row items-center gap-6">

      {/* Dynamic Circular Progress */}
      <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 90 90">
          {/* Background Ring */}
          <circle
            cx="45"
            cy="45"
            r={radius}
            strokeWidth="7"
            stroke="#1E293B"
            fill="transparent"
          />

          {/* Progress Ring */}
          <circle
            cx="45"
            cy="45"
            r={radius}
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="url(#cardMultiGradient)"
            fill="transparent"
            style={{
              transition: "stroke-dashoffset 0.8s ease",
              filter: "drop-shadow(0 0 6px rgba(168,85,247,0.5))",
            }}
          />

          <defs>
            <linearGradient
              id="cardMultiGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="35%" stopColor="#3b82f6" />
              <stop offset="70%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-extrabold text-white">
            {matchPercent}%
          </span>
        </div>
      </div>

      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-xl font-bold text-white">AI Match Score</h3>

        <p className="text-slate-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
          {matchData?.recommendation ||
            (matchData?.missingSkills?.length
              ? `Learn ${matchData.missingSkills
                  .slice(0, 3)
                  .join(", ")} to improve your match.`
              : "Complete your profile to improve your match.")}
        </p>

        <button
          onClick={() =>
            navigate(matchData?.jobId ? `/matching/${matchData.jobId}` : "/matching")
          }
          className="mt-4 px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-purple-600/30 hover:opacity-95 transition cursor-pointer"
        >
          View Details
        </button>
      </div>
    </div>
  );
}