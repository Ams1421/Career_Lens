export default function GlassCard({ children, className = "" }) {
  return (
    <div className={`relative bg-cardBg/80 backdrop-blur-xl border border-slate-700/40 rounded-2xl p-6 shadow-xl shadow-black/40 ${className}`}>
      {children}
    </div>
  );
}