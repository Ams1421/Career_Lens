import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Logo from "../../components/common/Logo";
import loginHeroImg from "../../assets/login-hero.svg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");
    setResetToken("");

    try {
      const response = await api.post("/Auth/forgot-password", { email });

      setMessage(response.data.message);
      setResetToken(response.data.resetToken);
    } catch (err) {
      setError(err.response?.data?.message || "Request failed.");
    } finally {
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

        {/* Brand Logo Header */}
        <div className="relative z-10">
          <Logo />
        </div>

        {/* Central Graphic Container with Custom Illustration */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center">
          <div className="w-full max-w-lg h-[460px] rounded-3xl overflow-hidden border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.25)] relative bg-slate-950 flex flex-col items-center justify-between p-6 text-center group">
            
            {/* Custom SVG Hero Illustration Asset */}
            <img 
              src={loginHeroImg} 
              alt="Cyberpunk Career Intelligence" 
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Top Badge */}
            <div className="relative z-10 pt-2">
              <span className="inline-block px-4 py-1.5 bg-slate-900/80 backdrop-blur-md border border-purple-500/40 text-purple-300 text-xs font-extrabold uppercase tracking-widest rounded-full shadow-lg">
                Password Recovery
              </span>
            </div>

            {/* Card Text Content Overlay at bottom */}
            <div className="relative z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 px-6 py-4 rounded-2xl w-full shadow-xl">
              <h3 className="text-lg font-bold text-white tracking-wide">AI-Powered Career Intelligence</h3>
              <p className="text-xs text-slate-400 mt-1">Recover secure access to your account instantly.</p>
            </div>
          </div>
        </div>

        {/* Footer copyright */}
        <div className="text-xs text-slate-500 relative z-10 font-medium">
          &copy; {new Date().getFullYear()} CareerLens. All rights reserved.
        </div>
      </div>

      {/* Right Side: Glassmorphism Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-[#030712] overflow-y-auto max-h-screen">
        
        {/* Subtle background glow for form side */}
        <div className="absolute right-10 top-1/4 w-80 h-80 bg-blue-600/10 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="w-full max-w-md bg-[#0b1021]/90 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-slate-700/50 p-8 sm:p-10 relative z-10 my-8">

          {/* Mobile Logo View */}
          <div className="flex lg:hidden justify-center mb-6">
            <Logo size="small" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Forgot Password
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              Enter your email to generate a reset token.
            </p>
          </div>

          {/* Success Message Alert */}
          {message && (
            <div className="mb-6 bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-sm p-4 rounded-xl flex items-center gap-3 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
              <span>{message}</span>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-6 bg-red-950/70 border border-red-500/50 text-red-300 text-sm p-4 rounded-xl flex items-center gap-3 shadow-[0_0_15px_rgba(239,68,68,0.25)]">
              <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <input
                type="email"
                placeholder="22u11a6708@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-purple-600/30 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                "Generate Reset Token"
              )}
            </button>
          </form>

          {/* Development Token Display Box */}
          {resetToken && (
            <div className="mt-6 p-4 bg-slate-900/90 border border-purple-500/40 rounded-2xl shadow-lg">
              <p className="font-bold text-xs uppercase tracking-wider text-purple-400 mb-2">Development Token</p>

              <code className="text-xs break-all text-slate-300 block font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                {resetToken}
              </code>

              <Link
                to={`/reset-password?token=${resetToken}`}
                className="block mt-3 text-purple-400 hover:text-purple-300 font-semibold text-sm transition"
              >
                Continue to Reset Password →
              </Link>
            </div>
          )}

          {/* Back to Login Link */}
          <p className="text-center mt-8 text-slate-400 text-sm">
            <Link to="/login" className="text-purple-400 font-semibold hover:underline">
              Back to Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}