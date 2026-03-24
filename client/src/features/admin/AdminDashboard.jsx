import { useState } from "react";
import { useGetJobsQuery, useDeleteJobMutation, useUpdateJobMutation } from "../jobs/jobsApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../auth/authSlice";
import JobFormModal from "./JobFormModal";

const typeBadge = {
  FULL_TIME: { label: "Full-time", cls: "bg-blue-100 text-blue-800" },
  PART_TIME: { label: "Part-time", cls: "bg-purple-100 text-purple-800" },
};

export default function AdminDashboard() {
  const user = useSelector(selectCurrentUser);
  const { data: allJobs = [], isLoading } = useGetJobsQuery();
  const [deleteJob] = useDeleteJobMutation();
  const [updateJob] = useUpdateJobMutation();

  const [editingJob, setEditingJob] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Only show jobs posted by this admin
  const myJobs = allJobs.filter((j) => j.postedById === user?.id);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;
    setDeletingId(id);
    try {
      await deleteJob(id).unwrap();
    } catch {
      // handled by RTK Query
    }
    setDeletingId(null);
  };

  const handleUpdate = async (data) => {
    await updateJob({ id: editingJob.id, ...data }).unwrap();
    setEditingJob(null);
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-500">Manage your job postings</p>
        </div>
        <a
          href="/admin/post-job"
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white
                     shadow-sm hover:bg-primary-hover active:scale-[0.98] transition-all duration-150"
        >
          + Post Job
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Total Postings</p>
          <p className="mt-1 text-2xl font-bold font-heading text-gray-900">
            {isLoading ? "—" : myJobs.length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Full-time</p>
          <p className="mt-1 text-2xl font-bold font-heading text-gray-900">
            {isLoading ? "—" : myJobs.filter((j) => j.type === "FULL_TIME").length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Part-time</p>
          <p className="mt-1 text-2xl font-bold font-heading text-gray-900">
            {isLoading ? "—" : myJobs.filter((j) => j.type === "PART_TIME").length}
          </p>
        </div>
      </div>

      {/* Jobs Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : myJobs.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-gray-300 bg-white">
          <h3 className="text-lg font-semibold font-heading text-gray-900">No postings yet</h3>
          <p className="mt-1 text-sm text-gray-500">Create your first job listing to get started</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {myJobs.map((job) => {
                const badge = typeBadge[job.type] || typeBadge.FULL_TIME;
                return (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{job.position}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{job.companyName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{job.location}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => setEditingJob(job)}
                        className="text-sm font-medium text-primary hover:text-primary-hover transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        disabled={deletingId === job.id}
                        className="text-sm font-medium text-red-600 hover:text-red-700 transition
                                   disabled:opacity-50"
                      >
                        {deletingId === job.id ? "..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingJob && (
        <JobFormModal
          job={editingJob}
          onSubmit={handleUpdate}
          onClose={() => setEditingJob(null)}
          title="Edit Job"
        />
      )}
    </div>
  );
}
