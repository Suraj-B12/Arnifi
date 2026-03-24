import { useState, useEffect, useRef } from "react";
import { useGetJobApplicationsQuery, useUpdateApplicationStatusMutation } from "../jobs/jobsApi";
import ApplicantProfileModal from "./ApplicantProfileModal";

const statusOptions = [
  { value: "PENDING", label: "● Pending", cls: "bg-gray-800 text-white" },
  { value: "REVIEWED", label: "○ Reviewed", cls: "bg-blue-600 text-white" },
  { value: "INTERVIEW", label: "◇ Interview", cls: "bg-amber-500 text-white" },
  { value: "OFFER", label: "✓ Offer", cls: "bg-emerald-600 text-white" },
  { value: "REJECTED", label: "✕ Rejected", cls: "bg-gray-400 text-white" },
  { value: "WITHDRAWN", label: "↩ Withdrawn", cls: "bg-orange-500 text-white" },
];

export default function ApplicantsModal({ job, onClose }) {
  const { data: applicants = [], isLoading } = useGetJobApplicationsQuery(job.id);
  const [updateStatus, { isLoading: isUpdating }] = useUpdateApplicationStatusMutation();
  const [notes, setNotes] = useState({});
  const [viewingProfile, setViewingProfile] = useState(null);
  const [toast, setToast] = useState(null); // { type: "success" | "error", message: string }
  const closeTimerRef = useRef(null);
  const toastTimerRef = useRef(null);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      clearTimeout(closeTimerRef.current);
      clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 2000);
  };

  const getNote = (appId, field) => notes[appId]?.[field] ?? "";
  const setNote = (appId, field, value) =>
    setNotes((prev) => ({ ...prev, [appId]: { ...prev[appId], [field]: value } }));

  const handleStatusChange = async (appId, status) => {
    try {
      await updateStatus({
        jobId: job.id,
        appId,
        status,
        statusNote: notes[appId]?.statusNote,
        adminNotes: notes[appId]?.adminNotes,
      }).unwrap();
      showToast("success", "Changes saved successfully");
      closeTimerRef.current = setTimeout(() => onClose(), 1500);
    } catch {
      showToast("error", "Failed to save changes");
    }
  };

  const handleSaveNotes = async (appId, currentStatus) => {
    try {
      await updateStatus({
        jobId: job.id,
        appId,
        status: currentStatus,
        statusNote: notes[appId]?.statusNote,
        adminNotes: notes[appId]?.adminNotes,
      }).unwrap();
      showToast("success", "Changes saved successfully");
      closeTimerRef.current = setTimeout(() => onClose(), 1500);
    } catch {
      showToast("error", "Failed to save changes");
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
        <div className="relative flex-1 overflow-y-auto p-6">
          {/* Toast notification */}
          {toast && (
            <div
              className={`sticky top-0 z-10 mb-4 rounded-xl px-4 py-2.5 text-sm font-medium text-white text-center shadow-lg transition-all duration-300 ${
                toast.type === "success"
                  ? "bg-emerald-500"
                  : "bg-red-500"
              }`}
            >
              {toast.message}
            </div>
          )}
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
                const isWithdrawn = app.status === "WITHDRAWN";
                return (
                  <div
                    key={app.id}
                    className="rounded-xl border border-gray-200 bg-white p-4
                               hover:border-gray-300 transition"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <button
                          onClick={() => setViewingProfile(app.user)}
                          className="text-sm font-medium text-primary hover:text-primary-hover transition cursor-pointer truncate"
                        >
                          {app.user.name}
                        </button>
                        <p className="text-xs text-gray-500">{app.user.email}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Applied {new Date(app.createdAt).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })}
                        </p>
                      </div>
                      {isWithdrawn ? (
                        <span className={`rounded-full px-3 py-1.5 text-xs font-medium ${current.cls}`}>
                          {current.label}
                        </span>
                      ) : (
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className={`rounded-full border-0 px-3 py-1.5 text-xs font-medium cursor-pointer
                                      focus:outline-none focus:ring-2 focus:ring-primary-ring transition ${current.cls}`}
                        >
                          {statusOptions
                            .filter((opt) => opt.value !== "WITHDRAWN")
                            .map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                      )}
                    </div>

                    {/* Notes section */}
                    <div className="mt-3 space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Note for applicant — they will see this
                        </label>
                        <textarea
                          rows={2}
                          value={getNote(app.id, "statusNote") || app.statusNote || ""}
                          onChange={(e) => setNote(app.id, "statusNote", e.target.value)}
                          placeholder="e.g. We'd like to schedule an interview next week..."
                          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700
                                     placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-ring
                                     focus:border-transparent resize-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Private notes — admin only
                        </label>
                        <textarea
                          rows={2}
                          value={getNote(app.id, "adminNotes") || app.adminNotes || ""}
                          onChange={(e) => setNote(app.id, "adminNotes", e.target.value)}
                          placeholder="Internal notes about this applicant..."
                          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700
                                     placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-ring
                                     focus:border-transparent resize-none transition"
                        />
                      </div>
                      {(notes[app.id]?.statusNote !== undefined || notes[app.id]?.adminNotes !== undefined) && (
                        <button
                          onClick={() => handleSaveNotes(app.id, app.status)}
                          disabled={isUpdating}
                          className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white
                                     hover:bg-primary-hover active:scale-[0.97] transition-all duration-150
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUpdating ? "Saving..." : "Save Notes"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {viewingProfile && (
        <ApplicantProfileModal
          applicant={viewingProfile}
          onClose={() => setViewingProfile(null)}
        />
      )}
    </div>
  );
}
