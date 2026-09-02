import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import EmployerLogin from "./pages/employer/Login";
import EmployerRegister from "./pages/employer/Register";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import CreateJob from "./pages/employer/CreateJob";
import ManageJobs from "./pages/employer/ManageJobs";
import Applicants from "./pages/employer/Applicants";
import Interviews from "./pages/employer/Interviews";

import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/profile/Profile";
import Education from "./pages/education/Education";
import Skills from "./pages/skills/Skills";
import Projects from "./pages/projects/Projects";
import Jobs from "./pages/jobs/Jobs";
import JobDetails from "./pages/jobs/JobDetails";
import Applications from "./pages/applications/Applications";
import Matching from "./pages/matching/Matching";
import Resume from "./pages/resume/Resume";

import useAuth from "./hooks/useAuth";
import Logo from "./components/common/Logo";
import loginHeroImg from "./assets/hero-illustration.svg"; // Replace with your actual image filename in your assets folder

/* ---------------- Candidate Protected Route ---------------- */

function CandidateRoute({ children }) {
  const { token, role } = useAuth();

  return token && role === "Candidate" ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}

/* ---------------- Employer Protected Route ---------------- */

function EmployerRoute({ children }) {
  const { token, role } = useAuth();

  return token && role === "Employer" ? (
    children
  ) : (
    <Navigate to="/employer/login" replace />
  );
}

/* ---------------- Candidate Public Route ---------------- */

function CandidatePublicRoute({ children }) {
  const { token, role } = useAuth();

  if (token && role === "Candidate") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

/* ---------------- Employer Public Route ---------------- */

function EmployerPublicRoute({ children }) {
  const { token, role } = useAuth();

  if (token && role === "Employer") {
    return <Navigate to="/employer/dashboard" replace />;
  }

  return children;
}

/* ---------------- Unknown Route Redirect ---------------- */

function NotFoundRedirect() {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return role === "Employer" ? (
    <Navigate to="/employer/dashboard" replace />
  ) : (
    <Navigate to="/dashboard" replace />
  );
}

/* ---------------- Home (Landing Page Upgrade) ---------------- */

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const features = [
    {
      icon: "🤖",
      title: "AI Resume Analysis",
      desc: "Analyze resumes instantly with ATS scoring and personalized improvements.",
    },
    {
      icon: "🎯",
      title: "Smart Job Matching",
      desc: "Find relevant opportunities using skills, experience, and career goals.",
    },
    {
      icon: "⚡",
      title: "ATS Optimization",
      desc: "Optimize resumes before applying to improve recruiter visibility.",
    },
    {
      icon: "📊",
      title: "Career Insights",
      desc: "Visualize strengths, gaps, and growth opportunities.",
    },
    {
      icon: "💬",
      title: "Interview Preparation",
      desc: "Practice with AI-generated interview questions.",
    },
    {
      icon: "🔒",
      title: "Secure Profiles",
      desc: "Protected authentication and employer verification.",
    },
  ];
  const steps = [
    {
      n: "01",
      t: "Create Your Profile",
      d: "Sign up and complete your profile.",
    },
    { n: "02", t: "Upload Resume", d: "Get AI feedback and ATS optimization." },
    {
      n: "03",
      t: "Discover Matches",
      d: "Receive personalized job recommendations.",
    },
    { n: "04", t: "Apply Faster", d: "Track applications and interviews." },
  ];
  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Software Engineer",
      text: "CareerLens helped me land interviews within a week.",
    },
    {
      name: "Priya Nair",
      role: "UI/UX Designer",
      text: "The AI suggestions improved my resume dramatically.",
    },
    {
      name: "Arjun Kumar",
      role: "Data Analyst",
      text: "The matching engine found jobs I would have missed.",
    },
  ];
  const companies = [
    "Microsoft",
    "Google",
    "IBM",
    "TCS",
    "Infosys",
    "Accenture",
    "Deloitte",
    "Amazon",
  ];
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 relative overflow-x-hidden">
      <style>{`
      @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
      @keyframes glow{0%,100%{box-shadow:0 0 30px rgba(168,85,247,.25)}50%{box-shadow:0 0 60px rgba(168,85,247,.55)}}
      @keyframes pulseRing{0%{transform:scale(.95);opacity:.8}100%{transform:scale(1.08);opacity:.1}}
      @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
      .float{animation:float 6s ease-in-out infinite}.glow{animation:glow 4s infinite}
      .marquee{display:flex;width:max-content;animation:marquee 20s linear infinite}
    `}</style>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,.15),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,.18),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(6,182,212,.08),transparent_35%)]"></div>
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] bg-[size:42px_42px]"></div>

      <header className="sticky top-0 z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link to="/">
            <Logo />
          </Link>
          <nav className="hidden md:flex gap-6 lg:gap-8 text-sm">
            <Link to="/" className="hover:text-purple-400 transition">
              Home
            </Link>
            <Link to="/jobs" className="hover:text-purple-400 transition">
              Find Jobs
            </Link>
            <Link
              to="/employer/login"
              className="hover:text-purple-400 transition"
            >
              For Employers
            </Link>
            <Link to="/" className="hover:text-purple-400 transition">
              About Us
            </Link>
          </nav>
          <div className="hidden lg:flex gap-3 items-center">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-900/50 text-sm hover:border-slate-500 transition"
            >
              Candidate Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-900/50 text-sm hover:border-slate-500 transition"
            >
              Candidate Register
            </Link>
            <Link
              to="/employer/login"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 glow text-sm font-medium"
            >
              Employer Portal
            </Link>
          </div>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950/95 border-b border-slate-800 px-6 py-6 space-y-4 backdrop-blur-2xl">
            <nav className="flex flex-col space-y-3 text-base">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-purple-400"
              >
                Home
              </Link>
              <Link
                to="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-purple-400"
              >
                Find Jobs
              </Link>
              <Link
                to="/employer/login"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-purple-400"
              >
                For Employers
              </Link>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-purple-400"
              >
                About Us
              </Link>
            </nav>
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/50 text-sm"
              >
                Candidate Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/50 text-sm"
              >
                Candidate Register
              </Link>
              <Link
                to="/employer/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-sm font-medium"
              >
                Employer Portal
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
        <section className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6 lg:space-y-8">
            <div className="inline-flex px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs sm:text-sm">
              ✨ AI Career Intelligence Platform
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.08]">
              Your Career,
              <br />
              <span className="bg-gradient-to-r from-white via-blue-300 to-purple-400 bg-clip-text text-transparent">
                Our Mission
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-400 max-w-xl">
              AI-powered job matching, ATS optimization, interview preparation,
              and career intelligence designed for candidates and employers.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 font-bold glow text-sm sm:text-base text-center"
              >
                Get Started
              </Link>
              <Link
                to="/jobs"
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl border border-slate-700 bg-slate-900/60 text-sm sm:text-base text-center"
              >
                Explore Jobs
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {["98% AI Match", "ATS Optimized", "24h Hiring"].map((x) => (
                <div
                  key={x}
                  className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 sm:p-4"
                >
                  <div className="font-bold text-purple-300 text-sm sm:text-base">
                    {x.split(" ")[0]}
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-400">
                    {x}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative float mt-6 lg:mt-0">
            <div className="absolute -inset-4 sm:-inset-8 rounded-[40px] bg-purple-600/20 blur-3xl"></div>
            <div className="relative rounded-3xl border border-purple-500/30 bg-slate-900/90 overflow-hidden glow">
              <div className="flex justify-between p-4 sm:p-5 border-b border-slate-800 text-xs">
                <span className="text-emerald-400">● AI Match 98%</span>
                <span className="text-blue-400">ATS Optimized</span>
              </div>
              <div className="p-4 sm:p-6 relative">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-purple-500/20 animate-pulse"></div>
                </div>
                <img
                  src={loginHeroImg}
                  alt="AI Platform"
                  className="w-full rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 lg:mt-20 overflow-hidden border-y border-slate-800 py-5">
          <div className="marquee gap-12 sm:gap-16 text-slate-500 uppercase text-xs sm:text-sm tracking-[0.2em]">
            {companies.concat(companies).map((c, i) => (
              <span key={i}>{c}</span>
            ))}
          </div>
        </section>

        <section className="mt-16 lg:mt-20">
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-block px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs sm:text-sm">
              Platform Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4">
              Everything You Need to Get Hired
            </h2>
            <p className="text-slate-400 mt-3 max-w-2xl mx-auto text-sm sm:text-base px-2">
              Built for candidates and employers with AI-driven automation and
              premium workflows.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-7 hover:border-purple-500/40 hover:-translate-y-1 transition"
              >
                <div className="text-3xl sm:text-4xl mb-4 sm:mb-5">
                  {f.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                  {f.title}
                </h3>
                <p className="text-slate-400 text-sm sm:text-base">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 lg:mt-24">
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-block px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs sm:text-sm">
              How It Works
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4">
              From Profile to Placement
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div
                key={s.n}
                className="relative rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-7"
              >
                <div className="absolute -top-4 left-6 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center font-bold text-sm">
                  {s.n}
                </div>
                <div className="pt-4 sm:pt-6">
                  <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3">
                    {s.t}
                  </h3>
                  <p className="text-slate-400 text-sm sm:text-base">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 lg:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            ["500+", "Active Jobs", "💼"],
            ["200+", "Companies", "🏢"],
            ["1500+", "Candidates", "👥"],
            ["98%", "Success Rate", "🏆"],
          ].map(([v, l, i]) => (
            <div
              key={l}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 hover:border-purple-500/40 hover:-translate-y-1 transition text-center sm:text-left"
            >
              <div className="text-3xl mb-3 sm:mb-4">{i}</div>
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {v}
              </div>
              <div className="text-xs uppercase tracking-wider text-slate-400 mt-2">
                {l}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-20 lg:mt-24">
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-block px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs sm:text-sm">
              Success Stories
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4">
              Loved by Candidates
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-7"
              >
                <div className="text-yellow-400 mb-3 sm:mb-4">★★★★★</div>
                <p className="text-slate-300 mb-5 sm:mb-6 text-sm sm:text-base">
                  “{t.text}”
                </p>
                <div className="font-bold text-sm sm:text-base">{t.name}</div>
                <div className="text-xs sm:text-sm text-slate-400">
                  {t.role}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 lg:mt-24 rounded-[30px] sm:rounded-[36px] border border-purple-500/30 bg-gradient-to-br from-blue-900/30 via-slate-900 to-purple-900/30 p-8 sm:p-10 lg:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(168,85,247,.12),transparent_60%)]"></div>
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black">
              Start Your AI-Powered Career Journey Today
            </h2>
            <p className="text-slate-300 mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base px-2">
              Join thousands of candidates and employers using CareerLens to
              make smarter hiring decisions.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6 sm:mt-8">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 font-bold glow text-sm sm:text-base text-center"
              >
                Create Free Account
              </Link>
              <Link
                to="/employer/register"
                className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-2xl border border-slate-600 bg-slate-900/60 font-bold text-sm sm:text-base text-center"
              >
                Hire Talent
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-20 lg:mt-24">
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-block px-4 py-2 rounded-full border border-slate-700 bg-slate-900/50 text-slate-300 text-xs sm:text-sm">
              FAQ
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4 max-w-4xl mx-auto px-2 sm:px-0">
            {[
              [
                "Is CareerLens free?",
                "Yes, candidates can create an account and explore opportunities.",
              ],
              [
                "How does AI matching work?",
                "The platform compares your profile with job requirements to surface relevant opportunities.",
              ],
              [
                "Can employers post jobs?",
                "Yes, employers can register, create jobs, and manage applicants.",
              ],
              [
                "Is my data secure?",
                "Your existing authentication and backend security remain unchanged.",
              ],
            ].map(([q, a]) => (
              <details
                key={q}
                className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5"
              >
                <summary className="cursor-pointer font-semibold flex justify-between text-sm sm:text-base">
                  {q}
                  <span>+</span>
                </summary>
                <p className="text-slate-400 mt-3 sm:mt-4 text-sm sm:text-base">
                  {a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-xs sm:text-sm px-4">
        © {new Date().getFullYear()} CareerLens. All rights reserved.
      </footer>
    </div>
  );
}

/* ---------------- App ---------------- */

export default function App() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Candidate Authentication */}
      <Route
        path="/login"
        element={
          <CandidatePublicRoute>
            <Login />
          </CandidatePublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <CandidatePublicRoute>
            <Register />
          </CandidatePublicRoute>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <CandidatePublicRoute>
            <ForgotPassword />
          </CandidatePublicRoute>
        }
      />

      <Route
        path="/reset-password"
        element={
          <CandidatePublicRoute>
            <ResetPassword />
          </CandidatePublicRoute>
        }
      />

      {/* Employer Authentication */}
      <Route
        path="/employer/login"
        element={
          <EmployerPublicRoute>
            <EmployerLogin />
          </EmployerPublicRoute>
        }
      />

      <Route
        path="/employer/register"
        element={
          <EmployerPublicRoute>
            <EmployerRegister />
          </EmployerPublicRoute>
        }
      />

      {/* Candidate Portal */}
      <Route
        path="/dashboard"
        element={
          <CandidateRoute>
            <Dashboard />
          </CandidateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <CandidateRoute>
            <Profile />
          </CandidateRoute>
        }
      />

      <Route
        path="/education"
        element={
          <CandidateRoute>
            <Education />
          </CandidateRoute>
        }
      />

      <Route
        path="/skills"
        element={
          <CandidateRoute>
            <Skills />
          </CandidateRoute>
        }
      />

      <Route
        path="/projects"
        element={
          <CandidateRoute>
            <Projects />
          </CandidateRoute>
        }
      />

      <Route
        path="/resume"
        element={
          <CandidateRoute>
            <Resume />
          </CandidateRoute>
        }
      />

      <Route
        path="/jobs"
        element={
          <CandidateRoute>
            <Jobs />
          </CandidateRoute>
        }
      />

      <Route
        path="/jobs/:id"
        element={
          <CandidateRoute>
            <JobDetails />
          </CandidateRoute>
        }
      />

      <Route
        path="/applications"
        element={
          <CandidateRoute>
            <Applications />
          </CandidateRoute>
        }
      />

      <Route
        path="/matching/:jobId"
        element={
          <CandidateRoute>
            <Matching />
          </CandidateRoute>
        }
      />

      {/* Employer Portal */}
      <Route
        path="/employer/dashboard"
        element={
          <EmployerRoute>
            <EmployerDashboard />
          </EmployerRoute>
        }
      />

      <Route
        path="/employer/jobs/create"
        element={
          <EmployerRoute>
            <CreateJob />
          </EmployerRoute>
        }
      />

      <Route
        path="/employer/jobs"
        element={
          <EmployerRoute>
            <ManageJobs />
          </EmployerRoute>
        }
      />

      <Route
        path="/employer/applicants"
        element={
          <EmployerRoute>
            <Applicants />
          </EmployerRoute>
        }
      />

      <Route
        path="/employer/interviews"
        element={
          <EmployerRoute>
            <Interviews />
          </EmployerRoute>
        }
      />

      {/* Catch-All */}
      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  );
}
