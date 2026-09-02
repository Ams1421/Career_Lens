import { useCallback, useEffect, useState } from "react";
import { employerApi } from "../../api/employer";

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = useCallback(async () => {
    try {
      const res = await employerApi.getJobs();
      setJobs(res.data || []);
    } catch (error) {
      console.error("Failed to load jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void loadJobs();
    });
  }, [loadJobs]);

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Delete this job?")) return;

      try {
        await employerApi.deleteJob(id);
        await loadJobs();
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Delete failed.");
      }
    },
    [loadJobs]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-slate-300">
        Loading jobs...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-white mb-8">Manage Jobs</h1>

        <div className="space-y-4">
          {jobs.length === 0 ? (
            <div className="bg-cardBg/85 backdrop-blur-2xl rounded-3xl border border-slate-700/50 p-8 text-center shadow-xl text-slate-400">
              No jobs found.
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                className="bg-cardBg/85 backdrop-blur-2xl rounded-3xl border border-slate-700/50 p-6 shadow-xl flex justify-between items-center hover:border-purple-500/40 transition"
              >
                <div>
                  <h3 className="font-bold text-xl text-white">{job.title}</h3>

                  <p className="text-purple-400 mt-1 text-sm">{job.location}</p>

                  <p className="text-xs text-slate-400 mt-2 font-medium">
                    {job.type || job.employmentType}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(job.id)}
                  className="bg-red-600/80 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-red-900/30 transition text-sm"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}