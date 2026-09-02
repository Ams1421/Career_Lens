import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../api/axios";
import Logo from "../../components/common/Logo";
import employerRegisterHeroImg from "../../assets/employer-register-hero.svg";

export default function EmployerRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: 2,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("/Auth/register", form);
      navigate("/employer/login");
    } catch {
      setError("Registration failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#030712] text-slate-100 overflow-hidden font-sans">
      
      {/* Left Side: Futuristic Cyberpunk Hero Visual Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 border-r border-slate-800/60 bg-[#030712] overflow-hidden">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-600/20 blur-[140px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Brand Logo Header with Employer Identifier */}
        <div className="flex items-center justify-between relative z-10">
          <Logo />
          <span className="px-3 py-1 bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[10px] font-extrabold uppercase tracking-widest rounded-full shadow-lg">
            Employer Portal
          </span>
        </div>

        {/* Central Graphic Container with Custom Employer Illustration */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center">
          <div className="w-full max-w-lg h-[460px] rounded-3xl overflow-hidden border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.25)] relative bg-slate-950 flex flex-col items-center justify-between p-6 text-center group">
            
            {/* Custom SVG Employer Register Illustration Asset */}
            <img 
              src={employerRegisterHeroImg} 
              alt="Employer Registration Network" 
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Top Badge */}
            <div className="relative z-10 pt-2">
              <span className="inline-block px-4 py-1.5 bg-slate-900/80 backdrop-blur-md border border-purple-500/40 text-purple-300 text-xs font-extrabold uppercase tracking-widest rounded-full shadow-lg">
                Employer Registration
              </span>
            </div>

            {/* Card Text Content Overlay at bottom */}
            <div className="relative z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 px-6 py-4 rounded-2xl w-full shadow-xl">
              <h3 className="text-lg font-bold text-white tracking-wide">AI-Powered Talent Scaling</h3>
              <p className="text-xs text-slate-400 mt-1">Create an employer account to post jobs and find top tier talent.</p>
            </div>
          </div>
        </div>

        {/* Footer copyright */}
        <div className="text-xs text-slate-500 relative z-10 font-medium">
          &copy; {new Date().getFullYear()} CareerLens. All rights reserved.
        </div>
      </div>

      {/* Right Side: Glassmorphism Employer Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-[#030712] overflow-y-auto max-h-screen">
        
        {/* Subtle background glow for form side */}
        <div className="absolute right-10 top-1/4 w-80 h-80 bg-blue-600/10 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="w-full max-w-md bg-cardBg/90 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-slate-700/50 p-8 sm:p-10 relative z-10 my-8">
          
          {/* Mobile Logo View */}
          <div className="flex lg:hidden justify-center mb-6">
            <Logo size="small" />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Employer Register
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              Create an employer account to post jobs and find talent
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-950/70 border border-red-500/50 text-red-300 text-sm p-4 rounded-xl flex items-center gap-3">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">First Name</label>
                <input
                  type="text"
                  placeholder="John"
                  className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition shadow-inner"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">Last Name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition shadow-inner"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
              <input
                type="email"
                placeholder="employer@careerlens.com"
                className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition shadow-inner"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition shadow-inner"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-purple-600/30 hover:opacity-95 transition flex items-center justify-center cursor-pointer"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="text-center mt-6 text-slate-400 text-sm">
            Already have an employer account?{" "}
            <Link
              to="/employer/login"
              className="text-purple-400 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}