import {
  FiBell,
  FiSearch,
  FiChevronDown,
  FiMenu,
} from "react-icons/fi";
import { motion } from "framer-motion";

export default function TopNavbar({ profile, logout, collapsed, setCollapsed }) {
  return (
    <header
      className={`fixed top-0 right-0 z-40 transition-all duration-300 left-0 ${
        collapsed ? "lg:left-20" : "lg:left-64"
      }`}
    >
      <div className="mx-3 sm:mx-5 mt-3 sm:mt-4 h-[70px] sm:h-[76px] rounded-2xl sm:rounded-3xl bg-[#050816]/85 backdrop-blur-2xl border border-purple-500/15 shadow-[0_10px_40px_rgba(76,29,149,.15)] px-3 sm:px-8 flex items-center justify-between overflow-hidden relative">

        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,#4c1d95_0%,transparent_35%)] opacity-30 pointer-events-none"></div>

        {/* Left: Mobile & Desktop Menu Toggle Button */}
        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => {
              if (typeof setCollapsed === "function") {
                setCollapsed(!collapsed);
              }
            }}
            className="p-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-900/80 border border-slate-700/60 cursor-pointer transition"
            aria-label="Toggle Sidebar Menu"
          >
            <FiMenu size={20} />
          </button>
        </div>

        {/* Right */}
        <div className="relative z-10 flex items-center gap-3 sm:gap-5">

          {/* Search */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="hidden md:block relative"
          >
            <FiSearch className="absolute left-4 top-3.5 text-slate-500" />

            <input
              placeholder="Search anything..."
              className="w-60 lg:w-72 rounded-2xl bg-[#09111F] border border-slate-700/70 pl-11 pr-4 py-2.5 sm:py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition shadow-[0_0_20px_rgba(139,92,246,.08)]"
            />
          </motion.div>

          {/* Notification */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#09111F] border border-slate-700/70 flex items-center justify-center text-slate-300 hover:text-white hover:border-purple-500/40 transition shadow-[0_0_15px_rgba(139,92,246,.08)] cursor-pointer shrink-0"
            aria-label="Notifications"
          >
            <FiBell size={18} />

            <span className="absolute top-2 right-2 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,.8)] animate-pulse"></span>
          </motion.button>

          {/* Profile */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2.5 sm:gap-3 rounded-2xl bg-[#09111F] border border-slate-700/70 px-2 sm:px-3 py-1.5 sm:py-2 shadow-[0_0_20px_rgba(139,92,246,.08)]"
          >
            <img
              src={
                profile?.profileImageUrl
                  ? profile.profileImageUrl.startsWith("http")
                    ? profile.profileImageUrl
                    : `http://localhost:5149${profile.profileImageUrl}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      `${profile?.firstName || "User"} ${
                        profile?.lastName || ""
                      }`
                    )}&background=0b1021&color=fff`
              }
              alt="Profile"
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,.35)] shrink-0"
            />

            <div className="hidden lg:block leading-tight">
              <p className="text-sm font-semibold text-white truncate max-w-[120px]">
                {profile?.firstName || profile?.fullName || "User"} {profile?.lastName || ""}
              </p>

              <p className="text-xs text-slate-400 truncate max-w-[120px]">
                {profile?.headline || "Candidate"}
              </p>
            </div>

            <FiChevronDown className="text-slate-500 hidden lg:block shrink-0" />
          </motion.div>

          {/* Logout */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={logout}
            className="rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-[0_0_20px_rgba(220,38,38,.25)] hover:brightness-110 transition cursor-pointer shrink-0"
          >
            Logout
          </motion.button>

        </div>
      </div>
    </header>
  );
}