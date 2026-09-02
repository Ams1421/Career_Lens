import { useEffect, useState, useCallback } from "react";
import { FiMapPin, FiBriefcase, FiArrowRight } from "react-icons/fi";
import { dashboardApi } from "../../api/dashboard";

export default function RecentJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = useCallback(async () => {
    try {
      const response = await dashboardApi.getJobs();
      setJobs((response.data || []).slice(0, 4));
    } catch (error) {
      console.error("Failed to load jobs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadJobs();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadJobs]);

  if (loading) {
    return (
      <div className="bg-[#0b1021]/80 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl text-slate-300">
        Loading jobs...
      </div>
    );
  }

  return (
    <div className="bg-[#0b1021]/80 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl text-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Recent Jobs</h2>

        <button className="text-purple-400 text-sm hover:underline font-semibold">
          View All
        </button>
      </div>

      {jobs.length === 0 ? (
        <p className="text-slate-400 text-sm">No jobs available.</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-purple-500/40 transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-white">
                    {job.title}
                  </h3>

                  <p className="text-purple-400 font-semibold text-sm mt-0.5">
                    {job.companyName}
                  </p>
                </div>

                <button className="text-purple-400 hover:text-purple-300 p-2 bg-slate-800/80 rounded-xl">
                  <FiArrowRight size={18} />
                </button>
              </div>

              <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <FiMapPin className="text-purple-400" />
                  {job.location || "Remote"}
                </span>

                <span className="flex items-center gap-1.5">
                  <FiBriefcase className="text-blue-400" />
                  {job.employmentType || "Full-Time"}
                </span>
              </div>

              <div className="mt-3 text-emerald-400 font-bold text-sm">
                ₹{job.minimumSalary?.toLocaleString() || "N/A"} - ₹
                {job.maximumSalary?.toLocaleString() || "N/A"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}