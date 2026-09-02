export default function Logo({ size = "default" }) {
  const isSmall = size === "small";

  return (
    <div className="flex items-center gap-3 select-none group cursor-pointer">
      {/* Neon Lens SVG Icon */}
      <div className={`relative flex items-center justify-center ${isSmall ? "w-9 h-9" : "w-11 h-11"}`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
          <defs>
            <linearGradient id="neonRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="35%" stopColor="#3b82f6" />
              <stop offset="70%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          {/* Outer Ring */}
          <circle cx="50" cy="50" r="42" fill="none" stroke="url(#neonRingGrad)" strokeWidth="8" strokeLinecap="round" />
          {/* Inner Scanner Core */}
          <circle cx="50" cy="50" r="24" fill="#0b1021" stroke="#475569" strokeWidth="3" />
          <circle cx="50" cy="50" r="8" fill="#a855f7" />
          {/* Focus Crosshairs */}
          <line x1="50" y1="4" x2="50" y2="16" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
          <line x1="50" y1="84" x2="50" y2="96" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
          <line x1="4" y1="50" x2="16" y2="50" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
          <line x1="84" y1="50" x2="96" y2="50" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>

      {/* Brand Text */}
      {!isSmall && (
        <div className="flex flex-col">
          <span className="text-xl font-extrabold text-white tracking-tight leading-none">
            Career<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Lens</span>
          </span>
          <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 mt-1">
            AI Intelligence
          </span>
        </div>
      )}
    </div>
  );
}