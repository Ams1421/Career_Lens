import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
//import loginHeroImg from "../../assets/login-hero.png"; // Reuses your hero graphic asset

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await api.post("/Auth/reset-password", {
        token,
        newPassword: password
      });

      setMessage("Password reset successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Reset failed.");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#030712] text-slate-100 overflow-hidden font-sans">
      
      {/* Left Side: Futuristic Cyberpunk Hero Visual Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 border-r border-slate-800/60 bg-[#030712] overflow-hidden">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-600/20 blur-[140px] rounded-full pointer-events-none"></div>

        {/* Brand Logo Header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            <span className="text-white font-bold text-base">C</span>
          </div>
          <span className="text-xl font-extrabold text-white tracking-wide">
            CareerLens
          </span>
        </div>

        {/* Central Graphic Container */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center">
          <div className="w-full max-w-lg h-[480px] rounded-3xl overflow-hidden border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.3)] relative bg-slate-950 flex items-center justify-center">
            
            <img 
              //src={loginHeroImg} 
              alt="Cyberpunk Career Intelligence" 
              className="w-full h-full object-cover"
            />
            
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/90 to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* Footer copyright */}
        <div className="text-xs text-slate-500 relative z-10 font-medium">
          &copy; {new Date().getFullYear()} CareerLens. All rights reserved.
        </div>
      </div>

      {/* Right Side: Glassmorphism Reset Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-[#030712] overflow-y-auto max-h-screen">
        
        <div className="w-full max-w-md bg-[#0b1021]/90 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-slate-700/50 p-8 sm:p-10 relative z-10 my-8">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Reset Password
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              Enter your new password.
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
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl px-4 py-3.5 pr-12 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition text-xs font-semibold"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl px-4 py-3.5 pr-12 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition text-xs font-semibold"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-purple-600/30 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all flex items-center justify-center gap-2"
            >
              Reset Password
            </button>

          </form>

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