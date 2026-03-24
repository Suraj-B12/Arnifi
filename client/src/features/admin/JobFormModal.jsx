import { useState } from "react";

export default function JobFormModal({ job, onSubmit, onClose, title }) {
  const [form, setForm] = useState({
    companyName: job?.companyName || "",
    position: job?.position || "",
    type: job?.type || "FULL_TIME",
    location: job?.location || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.companyName || !form.position || !form.location) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-gray-100 p-6
                    animate-in fade-in zoom-in-95"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold font-heading text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium
                         text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white
                         shadow-sm hover:bg-primary-hover active:scale-[0.98] transition-all duration-150
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
