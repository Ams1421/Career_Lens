import { useCallback, useEffect, useState } from "react";
import { employerApi } from "../../api/employer";

export default function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadApplicants = useCallback(async () => {
    try {
      const jobsRes = await employerApi.getJobs();
      const jobs = jobsRes.data || [];

      if (jobs.length === 0) {
        setApplicants([]);
        return;
      }

      const applicantsRes = await employerApi.getApplicants(jobs[0].id);
      setApplicants(applicantsRes.data || []);
    } catch (error) {
      console.error("Failed to load applicants:", error);
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void loadApplicants();
    });
  }, [loadApplicants]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-slate-300">
        Loading applicants...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-white mb-8">Applicants</h1>

        <div className="space-y-4">
          {applicants.length === 0 ? (
            <div className="bg-cardBg/85 backdrop-blur-2xl rounded-3xl border border-slate-700/50 p-8 text-center shadow-xl text-slate-400">
              No applicants found.
            </div>
          ) : (
            applicants.map((app) => (
              <div
                key={app.id}
                className="bg-cardBg/85 backdrop-blur-2xl rounded-3xl border border-slate-700/50 p-6 shadow-xl flex justify-between items-center hover:border-purple-500/40 transition"
              >
                <div>
                  <h3 className="font-bold text-lg text-white">
                    {app.firstName} {app.lastName}
                  </h3>

                  <p className="text-slate-300 text-sm mt-1">{app.email}</p>

                  <p className="text-xs text-purple-400 font-semibold mt-2">
                    {app.jobTitle || "Applicant"}
                  </p>
                </div>

                <span className="px-4 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/40 text-blue-300 text-xs font-semibold">
                  Applied
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}