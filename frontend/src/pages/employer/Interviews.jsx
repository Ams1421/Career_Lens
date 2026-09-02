import { useState } from "react";
import { employerApi } from "../../api/employer";

export default function Interviews() {
  const [form, setForm] = useState({
    applicantId: "",
    interviewDate: "",
    mode: "Online",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await employerApi.scheduleInterview(form);
      alert("Interview scheduled.");
    } catch {
      alert("Scheduling failed.");
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-8 flex items-center justify-center">

      <div className="max-w-2xl w-full bg-cardBg/85 backdrop-blur-2xl rounded-3xl border border-slate-700/50 shadow-2xl p-8 sm:p-10">

        <h1 className="text-3xl font-extrabold text-white mb-8">
          Schedule Interview
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Applicant ID</label>
            <input
              placeholder="e.g. 01a02561-..."
              value={form.applicantId}
              onChange={(e) =>
                setForm({
                  ...form,
                  applicantId: e.target.value,
                })
              }
              required
              className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
            />
          </div>

          <div>
            <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Interview Date & Time</label>
            <input
              type="datetime-local"
              value={form.interviewDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  interviewDate: e.target.value,
                })
              }
              required
              className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl px-4 py-3.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
            />
          </div>

          <div>
            <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Interview Mode</label>
            <select
              value={form.mode}
              onChange={(e) =>
                setForm({
                  ...form,
                  mode: e.target.value,
                })
              }
              className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl px-4 py-3.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
            >
              <option value="Online" className="bg-slate-900">Online</option>
              <option value="Offline" className="bg-slate-900">Offline</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-600/30 hover:opacity-95 transition"
          >
            Schedule
          </button>

        </form>

      </div>

    </div>
  );
}