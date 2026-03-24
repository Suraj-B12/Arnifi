import { useState } from "react";
import { useGetJobsQuery, useDeleteJobMutation, useUpdateJobMutation } from "../jobs/jobsApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../auth/authSlice";
import JobFormModal from "./JobFormModal";
import ApplicantsModal from "./ApplicantsModal";

const typeBadge = {
  FULL_TIME: { label: "Full-time", cls: "bg-primary-light text-primary border border-primary-ring/40" },
  PART_TIME: { label: "Part-time", cls: "bg-amber-50 text-amber-700 border border-amber-200" },
  CONTRACT: { label: "Contract", cls: "bg-purple-50 text-purple-700 border border-purple-200" },
  INTERNSHIP: { label: "Internship", cls: "bg-indigo-50 text-indigo-700 border border-indigo-200" },
  REMOTE: { label: "Remote", cls: "bg-cyan-50 text-cyan-700 border border-cyan-200" },
  HYBRID: { label: "Hybrid", cls: "bg-violet-50 text-violet-700 border border-violet-200" },
};

export default function AdminDashboard() {
  const user = useSelector(selectCurrentUser);
  const { data, isLoading } = useGetJobsQuery();
  const allJobs = data?.jobs || [];
  const [deleteJob] = useDeleteJobMutation();
  const [updateJob] = useUpdateJobMutation();

  const [editingJob, setEditingJob] = useState(null);
  const [viewingApplicants, setViewingApplicants] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const myJobs = allJobs.filter((j) => j.postedById === user?.id);
  const totalApplications = myJobs.reduce((sum, j) => sum + (j._count?.applications || 0), 0);

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
          className="rounded-xl bg-cta px-5 py-2.5 text-sm font-semibold text-white
                     shadow-sm hover:bg-cta-hover active:scale-[0.98] transition-all duration-150"
        >
          + Post Job
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Total Postings</p>
          <p className="mt-1 text-2xl font-bold font-heading text-gray-900">
            {isLoading ? "—" : myJobs.length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Applications</p>
          <p className="mt-1 text-2xl font-bold font-heading text-gray-900">
            {isLoading ? "—" : totalApplications}
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
          <a
            href="/admin/post-job"
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-cta px-5 py-2.5
                       text-sm font-semibold text-cta-text shadow-sm
                       hover:bg-cta-hover active:scale-[0.98] transition-all duration-150"
          >
            + Post Job
          </a>
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
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Applicants</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {myJobs.map((job) => {
                const badge = typeBadge[job.type] || typeBadge.FULL_TIME;
                const appCount = job._count?.applications || 0;
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
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setViewingApplicants(job)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-primary-ring/50 bg-primary-light
                                   px-3 py-1.5 text-xs font-semibold text-primary
                                   hover:bg-primary hover:text-white hover:border-primary
                                   active:scale-[0.97] transition-all duration-150"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-1.053M18 7.5a3 3 0 11-6 0 3 3 0 016 0zm-8.25 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                        </svg>
                        {appCount} Applicants
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingJob(job)}
                          className="inline-flex items-center gap-1 rounded-full border border-gray-300
                                     px-3 py-1.5 text-xs font-medium text-gray-700
                                     hover:bg-gray-100 hover:border-gray-400
                                     active:scale-[0.97] transition-all duration-150"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          disabled={deletingId === job.id}
                          className="inline-flex items-center gap-1 rounded-full border border-red-200
                                     px-3 py-1.5 text-xs font-medium text-red-600
                                     hover:bg-red-50 hover:border-red-400
                                     active:scale-[0.97] transition-all duration-150
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                          {deletingId === job.id ? "..." : "Delete"}
                        </button>
                      </div>
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

      {/* Applicants Modal */}
      {viewingApplicants && (
        <ApplicantsModal
          job={viewingApplicants}
          onClose={() => setViewingApplicants(null)}
        />
      )}
    </div>
  );
}
