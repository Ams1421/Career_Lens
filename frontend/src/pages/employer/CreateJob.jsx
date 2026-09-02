import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { employerApi } from "../../api/employer";

export default function CreateJob() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    company: "CareerLens Pvt Ltd",
    location: "Hyderabad",
    type: "Full Time",
    salary: "",
    description: "",
    skills: "",
  });

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await employerApi.createJob({
        ...form,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });

      alert("Job created successfully.");
      navigate("/employer/jobs");
    } catch (err) {
      console.error(err);
      alert("Unable to create job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-8 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-cardBg/85 backdrop-blur-2xl rounded-3xl border border-slate-700/50 shadow-2xl p-8 sm:p-10">

        <h1 className="text-3xl font-extrabold text-white mb-8">Create Job</h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Job Title</label>
            <input
              name="title"
              placeholder="e.g. Senior Full Stack Engineer"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Company</label>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
              />
            </div>
            <div>
              <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Employment Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl px-4 py-3.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
              >
                <option value="Full Time" className="bg-slate-900">Full Time</option>
                <option value="Part Time" className="bg-slate-900">Part Time</option>
                <option value="Internship" className="bg-slate-900">Internship</option>
                <option value="Remote" className="bg-slate-900">Remote</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Salary</label>
              <input
                name="salary"
                placeholder="e.g. ₹15,00,000 - ₹25,00,000"
                value={form.salary}
                onChange={handleChange}
                className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Job Description</label>
            <textarea
              rows="5"
              name="description"
              placeholder="Describe the job role and expectations..."
              value={form.description}
              onChange={handleChange}
              required
              className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
            />
          </div>

          <div>
            <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Required Skills (Comma Separated)</label>
            <input
              name="skills"
              placeholder="React, .NET, PostgreSQL"
              value={form.skills}
              onChange={handleChange}
              className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-600/30 hover:opacity-95 transition"
          >
            {loading ? "Creating..." : "Create Job"}
          </button>

        </form>

      </div>
    </div>
  );
}