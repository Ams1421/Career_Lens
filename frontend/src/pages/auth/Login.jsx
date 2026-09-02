import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import Logo from "../../components/common/Logo";
import loginHeroImg from "../../assets/login-hero.svg";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/Auth/login", form);
      login(response.data);

      navigate(
        response.data.role === 2
          ? "/employer/dashboard"
          : response.data.role === 3
            ? "/admin/dashboard"
            : "/dashboard",
        { replace: true },
      );
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#030712] text-slate-100 overflow-x-hidden font-sans">
      {/* Left Side: Futuristic Cyberpunk Hero Visual Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-8 xl:p-12 border-r border-slate-800/60 bg-[#030712] overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/3 left-1/4 w-[300px] xl:w-[400px] h-[300px] xl:h-[400px] bg-purple-600/20 blur-[140px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-[250px] xl:w-[300px] h-[250px] xl:h-[300px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Brand Logo Header */}
        <div className="relative z-10">
          <Logo />
        </div>

        {/* Central Graphic Container with Custom Illustration */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center">
          <div className="w-full max-w-md xl:max-w-lg h-[420px] xl:h-[460px] rounded-3xl overflow-hidden border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.25)] relative bg-slate-950 flex flex-col items-center justify-between p-6 text-center group">
            {/* Custom SVG Hero Illustration Asset */}
            <img
              src={loginHeroImg}
              alt="AI Career Intelligence Portal"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Top Badge matching red circle location */}
            <div className="relative z-10 pt-2">
              <span className="inline-block px-4 py-1.5 bg-slate-900/80 backdrop-blur-md border border-purple-500/40 text-purple-300 text-xs font-extrabold uppercase tracking-widest rounded-full shadow-lg">
                Candidate Login
              </span>
            </div>

            {/* Card Text Content Overlay at bottom */}
            <div className="relative z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 px-5 xl:px-6 py-4 rounded-2xl w-full shadow-xl">
              <h3 className="text-base xl:text-lg font-bold text-white tracking-wide">
                AI-Powered Career Intelligence
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Step into the future of job matching and professional growth.
              </p>
            </div>
          </div>
        </div>

        {/* Footer copyright */}
        <div className="text-xs text-slate-500 relative z-10 font-medium">
          &copy; {new Date().getFullYear()} CareerLens. All rights reserved.
        </div>
      </div>

      {/* Right Side: Glassmorphism Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative bg-[#030712] min-h-screen lg:min-h-0 py-8 lg:py-0">
        {/* Subtle background glow for form side */}
        <div className="absolute right-10 top-1/4 w-60 sm:w-80 h-60 sm:h-80 bg-blue-600/10 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="w-full max-w-md bg-[#0b1021]/90 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-slate-700/50 p-6 sm:p-10 relative z-10 my-auto">
          {/* Mobile Logo View */}
          <div className="flex lg:hidden justify-center mb-6">
            <Logo size="small" />
          </div>

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome Back!
            </h1>
            <p className="text-slate-400 mt-2 text-xs sm:text-sm">
              Login to your account
            </p>
          </div>

          {/* Error Alert Box */}
          {error && (
            <div className="mb-6 bg-red-950/70 border border-red-500/50 text-red-300 text-xs sm:text-sm p-3.5 sm:p-4 rounded-xl flex items-center gap-3 shadow-[0_0_15px_rgba(239,68,68,0.25)]">
              <svg
                className="w-5 h-5 text-red-400 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="22u11a6708@gmail.com"
                required
                className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl px-4 py-3 sm:py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-inner"
              />
            </div>

            <div>
              <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl px-4 py-3 sm:py-3.5 pr-12 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-inner"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {showPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-slate-900 cursor-pointer"
                />
                <span className="text-slate-300 font-semibold">
                  Remember me
                </span>
              </label>

              <Link
                to="/forgot-password"
                className="font-semibold text-purple-400 hover:text-purple-300 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-purple-600/30 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Footer Sign up link */}
          <p className="text-center mt-6 sm:mt-8 text-slate-400 text-xs sm:text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-purple-400 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
