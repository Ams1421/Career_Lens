import { motion } from "framer-motion";
import { FiSparkles } from "react-icons/fi";

export default function AIDashboardHeader({ name }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl p-8 text-white
      bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 border border-slate-700/50 shadow-2xl backdrop-blur-xl"
    >
      <div className="absolute inset-0 bg-white/5 backdrop-blur-xl"></div>

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-blue-400 font-semibold">
            CareerLens AI
          </p>

          <h1 className="mt-2 text-4xl font-extrabold text-white">
            Welcome back, {name}!
          </h1>

          <p className="mt-3 text-slate-300">
            Your AI career intelligence dashboard is ready.
          </p>
        </div>

        <div className="hidden md:flex items-center justify-center w-20 h-20 rounded-full bg-slate-900/60 backdrop-blur-md border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)] text-purple-400">
          <FiSparkles size={36} />
        </div>
      </div>
    </motion.div>
  );
}