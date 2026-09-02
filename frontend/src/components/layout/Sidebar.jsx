import {
  FiHome,
  FiUser,
  FiBook,
  FiCode,
  FiBriefcase,
  FiFileText,
  FiTarget,
  FiMenu,
  FiSettings,
  FiHelpCircle,
  FiMic,
  FiAward,
  FiCpu,
  FiChevronRight,
} from "react-icons/fi";

import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../common/Logo";

export default function Sidebar({ collapsed, setCollapsed }) {
  const sections = [
    {
      title: "MAIN",
      items: [
        { icon: <FiHome />, label: "Dashboard", path: "/dashboard" },
        { icon: <FiUser />, label: "Profile", path: "/profile" },
        { icon: <FiBook />, label: "Education", path: "/education" },
        { icon: <FiCode />, label: "Skills", path: "/skills" },
        { icon: <FiBriefcase />, label: "Projects", path: "/projects" },
        { icon: <FiFileText />, label: "Resume", path: "/resume" },
        { icon: <FiBriefcase />, label: "Browse Jobs", path: "/jobs" },
        { icon: <FiFileText />, label: "Applications", path: "/applications" },
        { icon: <FiTarget />, label: "AI Match", path: "/matching" },
      ],
    },
    {
      title: "TOOLS",
      items: [
        { icon: <FiCpu />, label: "AI Career Coach", badge: "New" },
        { icon: <FiMic />, label: "Mock Interview" },
        { icon: <FiAward />, label: "Skill Assessment" },
      ],
    },
    {
      title: "SETTINGS",
      items: [
        { icon: <FiSettings />, label: "Settings" },
        { icon: <FiHelpCircle />, label: "Help & Support" },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop overlay when sidebar is open on small screens */}
      {!collapsed && (
        <div 
          onClick={() => setCollapsed(true)} 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        ></div>
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen transition-all duration-300
        ${collapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "translate-x-0 w-64"}
        bg-[#050816]/95 backdrop-blur-2xl border-r border-purple-500/15
        shadow-[0_0_60px_rgba(76,29,149,.12)] flex flex-col`}
      >
        {/* Background Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#4c1d95_0%,transparent_35%)] opacity-40 pointer-events-none"></div>

        {/* Logo & Toggle Header */}
        <div className={`relative flex items-center ${collapsed ? "flex-col gap-3 py-4 px-2" : "justify-between px-5 py-5"} border-b border-slate-800/70`}>
          {!collapsed ? (
            <Logo />
          ) : (
            <div className="mx-auto hidden lg:block">
              <Logo size="small" />
            </div>
          )}

          {/* Desktop & Mobile Menu Toggle Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition cursor-pointer flex items-center justify-center"
            aria-label="Toggle Menu"
          >
            <FiMenu size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 overflow-y-auto px-4 py-5 space-y-6 sidebar-scroll">
          {sections.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-3 px-2 font-semibold">
                  {section.title}
                </p>
              )}

              <div className="space-y-1.5">
                {section.items.map((item) =>
                  item.path ? (
                    <NavLink
                      key={item.label}
                      to={item.path}
                      onClick={() => {
                        // Automatically collapse sidebar on mobile devices after clicking a link
                        if (window.innerWidth < 1024) {
                          setCollapsed(true);
                        }
                      }}
                      className={({ isActive }) =>
                        `group relative flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300
                        ${
                          isActive
                            ? "bg-gradient-to-r from-[#5B2EFF] via-[#7C3AED] to-[#2563EB] text-white shadow-[0_0_25px_rgba(124,58,237,.45)] border border-purple-400/30"
                            : "text-slate-400 hover:bg-slate-900/80 hover:text-white hover:border hover:border-slate-700/60 hover:translate-x-1"
                        }`
                      }
                    >
                      <span className="text-xl shrink-0">{item.icon}</span>

                      {!collapsed && (
                        <>
                          <span className="flex-1 text-sm font-medium">
                            {item.label}
                          </span>
                          <FiChevronRight className="opacity-0 group-hover:opacity-100 transition" />
                        </>
                      )}
                    </NavLink>
                  ) : (
                    <motion.button
                      whileHover={{ x: 4 }}
                      key={item.label}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-slate-400 hover:bg-slate-900/80 hover:text-white transition cursor-pointer"
                    >
                      <span className="text-xl">{item.icon}</span>

                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left text-sm font-medium">
                            {item.label}
                          </span>

                          {item.badge && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </motion.button>
                  ),
                )}
              </div>
            </div>
          ))}
        </nav>

        {/* Premium Card */}
        {!collapsed && (
          <div className="relative p-4">
            <div className="rounded-3xl p-4 border border-purple-500/25 bg-gradient-to-br from-[#171F4A] via-[#141A38] to-[#0A0F22] shadow-[0_0_30px_rgba(124,58,237,.18)]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,.35)]">
                  <FiCpu className="text-white" />
                </div>

                <div>
                  <p className="text-white text-sm font-semibold">
                    Unlock Premium
                  </p>
                  <p className="text-slate-400 text-xs">AI Career Coaching</p>
                </div>
              </div>

              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Get AI-powered career insights, resume optimization and exclusive
                job recommendations.
              </p>

              <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold hover:brightness-110 transition cursor-pointer">
                Upgrade Now
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}