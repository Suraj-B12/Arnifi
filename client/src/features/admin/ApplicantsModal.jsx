import { useGetJobApplicationsQuery, useUpdateApplicationStatusMutation } from "../jobs/jobsApi";

const statusOptions = [
  { value: "PENDING", label: "Pending", cls: "bg-gray-100 text-gray-700" },
  { value: "REVIEWED", label: "Reviewed", cls: "bg-blue-100 text-blue-700" },
  { value: "INTERVIEW", label: "Interview", cls: "bg-amber-100 text-amber-800" },
  { value: "OFFER", label: "Offer", cls: "bg-green-100 text-green-700" },
  { value: "REJECTED", label: "Rejected", cls: "bg-red-100 text-red-700" },
];

export default function ApplicantsModal({ job, onClose }) {
  const { data: applicants = [], isLoading } = useGetJobApplicationsQuery(job.id);
  const [updateStatus] = useUpdateApplicationStatusMutation();

  const handleStatusChange = async (appId, status) => {
    try {
      await updateStatus({ jobId: job.id, appId, status }).unwrap();
    } catch {
      // handled by RTK Query
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[80vh] rounded-2xl bg-white shadow-xl border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold font-heading text-gray-900">Applicants</h2>
            <p className="text-sm text-gray-500">{job.position} at {job.companyName}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : applicants.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No applicants yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {applicants.map((app) => {
                const current = statusOptions.find((s) => s.value === app.status) || statusOptions[0];
                return (
                  <div
                    key={app.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4
                               hover:border-gray-300 transition"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{app.user.name}</p>
                      <p className="text-xs text-gray-500">{app.user.email}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Applied {new Date(app.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </p>
                    </div>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className={`rounded-lg border-0 px-3 py-1.5 text-xs font-medium cursor-pointer
                                  focus:outline-none focus:ring-2 focus:ring-primary-ring transition ${current.cls}`}
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
