import { motion } from "framer-motion";
import {
  FiUser,
  FiFileText,
  FiCode,
  FiBriefcase,
  FiArrowRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Update Profile",
      desc: "Improve your AI career profile",
      icon: FiUser,
      color: "from-purple-600 to-indigo-500",
      path: "/profile",
    },
    {
      title: "Build Resume",
      desc: "Optimize for ATS scoring",
      icon: FiFileText,
      color: "from-blue-600 to-cyan-500",
      path: "/resume",
    },
    {
      title: "Manage Skills",
      desc: "Add certifications & skills",
      icon: FiCode,
      color: "from-pink-600 to-purple-500",
      path: "/skills",
    },
    {
      title: "Browse Jobs",
      desc: "Discover AI-matched jobs",
      icon: FiBriefcase,
      color: "from-emerald-600 to-teal-500",
      path: "/jobs",
    },
  ];

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
        <p className="text-slate-400 text-sm mt-1">
          Jump into the next step of your career journey.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {actions.map((action, index) => {
          const Icon = action.icon;

          return (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{
                duration: 0.35,
                delay: index * 0.08,
              }}
              onClick={() => navigate(action.path)}
              className="group relative overflow-hidden rounded-[26px] border border-slate-700/50 bg-[#0B1021]/80 backdrop-blur-2xl p-6 text-left shadow-[0_15px_35px_rgba(124,58,237,.12)] hover:border-purple-500/40 hover:shadow-[0_25px_50px_rgba(124,58,237,.25)]"
            >
              {/* Glow */}
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-purple-500/10 blur-3xl group-hover:bg-purple-500/20 transition"></div>

              <div
                className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white text-2xl shadow-[0_0_18px_rgba(168,85,247,.35)] group-hover:rotate-6 transition`}
              >
                <Icon />
              </div>

              <h3 className="relative mt-5 text-lg font-bold text-white">
                {action.title}
              </h3>

              <p className="relative mt-2 text-sm text-slate-400 leading-relaxed">
                {action.desc}
              </p>

              <div className="relative mt-6 flex items-center justify-between">
                <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                  Open
                </span>

                <FiArrowRight className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}