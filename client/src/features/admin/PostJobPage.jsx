import { useState } from "react";
import { useNavigate } from "react-router";
import { useCreateJobMutation } from "../jobs/jobsApi";

export default function PostJobPage() {
  const navigate = useNavigate();
  const [createJob, { isLoading }] = useCreateJobMutation();

  const [form, setForm] = useState({
    companyName: "",
    position: "",
    type: "FULL_TIME",
    location: "",
    description: "",
    salary: "",
    requirements: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.companyName || !form.position || !form.location) {
      setError("All fields are required");
      return;
    }

    try {
      await createJob(form).unwrap();
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-gray-900">Post a Job</h1>
        <p className="mt-1 text-gray-500">Create a new job listing</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        {error && (
          <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Position</label>
            <input
              name="position"
              value={form.position}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm
                         placeholder:text-gray-400 focus:border-primary focus:outline-none
                         focus:ring-2 focus:ring-primary-ring transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
            <input
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              placeholder="e.g. Arnifi"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm
                         placeholder:text-gray-400 focus:border-primary focus:outline-none
                         focus:ring-2 focus:ring-primary-ring transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Dubai, UAE"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm
                         placeholder:text-gray-400 focus:border-primary focus:outline-none
                         focus:ring-2 focus:ring-primary-ring transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm
                         focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-ring transition"
            >
              <option value="FULL_TIME">Full-time</option>
              <option value="PART_TIME">Part-time</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the role and responsibilities..."
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm
                         placeholder:text-gray-400 focus:border-primary focus:outline-none
                         focus:ring-2 focus:ring-primary-ring transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Salary Range <span className="text-gray-400 font-normal">(optional)</span></label>
            <input
              name="salary"
              value={form.salary}
              onChange={handleChange}
              placeholder="e.g. 50k-70k AED/year"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm
                         placeholder:text-gray-400 focus:border-primary focus:outline-none
                         focus:ring-2 focus:ring-primary-ring transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Requirements <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea
              name="requirements"
              value={form.requirements}
              onChange={handleChange}
              rows={3}
              placeholder="e.g. React, Node.js, 2+ years experience"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm
                         placeholder:text-gray-400 focus:border-primary focus:outline-none
                         focus:ring-2 focus:ring-primary-ring transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white
                       shadow-sm hover:bg-primary-hover active:scale-[0.98] transition-all duration-150
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
}
