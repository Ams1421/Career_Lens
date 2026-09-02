import { motion } from "framer-motion";

export default function AIMatchRing({ score }) {
  const circumference = 283;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="120">
        <circle
          cx="60"
          cy="60"
          r="45"
          stroke="#1e293b"
          strokeWidth="10"
          fill="none"
        />

        <motion.circle
          cx="60"
          cy="60"
          r="45"
          stroke="#a855f7"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1 }}
          transform="rotate(-90 60 60)"
        />
      </svg>

      <h2 className="text-3xl font-bold text-white mt-2">{score}%</h2>

      <p className="text-slate-400">AI Match</p>
    </div>
  );
}