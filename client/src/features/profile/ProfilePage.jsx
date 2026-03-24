import { useState, useEffect, useRef } from "react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadResumeMutation,
} from "./profileApi";

const INITIAL_FORM = {
  headline: "",
  skills: "",
  phone: "",
  linkedIn: "",
  bio: "",
  experience: "",
  education: "",
};

export default function ProfilePage() {
  const { data: profile, isLoading, isError } = useGetProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const [uploadResume, { isLoading: isUploading }] = useUploadResumeMutation();

  const [form, setForm] = useState(INITIAL_FORM);
  const [toast, setToast] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (profile) {
      setForm({
        headline: profile.headline || "",
        skills: profile.skills || "",
        phone: profile.phone || "",
        linkedIn: profile.linkedIn || "",
        bio: profile.bio || "",
        experience: profile.experience || "",
        education: profile.education || "",
      });
    }
  }, [profile]);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      await updateProfile(form).unwrap();
      showToast("Profile updated successfully");
    } catch {
      showToast("Failed to update profile", "error");
    }
  }

  async function handleResumeUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      showToast("Only PDF files are allowed", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("File must be under 5 MB", "error");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      await uploadResume(formData).unwrap();
      showToast("Resume uploaded successfully");
    } catch {
      showToast("Failed to upload resume", "error");
    }

    // Reset file input
    if (fileRef.current) fileRef.current.value = "";
  }

  const apiBase = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded-lg bg-gray-200" />
        <div className="h-4 w-32 rounded-lg bg-gray-100" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 rounded bg-gray-100" />
            <div className="h-10 rounded-xl bg-gray-100" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Failed to load profile. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 rounded-xl px-5 py-3 text-sm font-medium shadow-lg transition-all duration-300 ${
            toast.type === "error"
              ? "bg-red-600 text-white"
              : "bg-emerald-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-gray-900">
          My Profile
        </h1>
        <p className="mt-1 text-gray-500">
          Keep your profile up to date for better job matches
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Headline */}
        <div>
          <label htmlFor="headline" className="block text-sm font-medium text-gray-700 mb-1">
            Headline
          </label>
          <input
            id="headline"
            name="headline"
            type="text"
            value={form.headline}
            onChange={handleChange}
            placeholder="e.g. Senior Software Engineer"
            maxLength={120}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm
                       placeholder:text-gray-400 focus:border-primary focus:outline-none
                       focus:ring-2 focus:ring-primary-ring transition"
          />
        </div>

        {/* Skills */}
        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
            Skills
          </label>
          <input
            id="skills"
            name="skills"
            type="text"
            value={form.skills}
            onChange={handleChange}
            placeholder="e.g. React, Node.js, TypeScript, PostgreSQL"
            maxLength={500}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm
                       placeholder:text-gray-400 focus:border-primary focus:outline-none
                       focus:ring-2 focus:ring-primary-ring transition"
          />
          <p className="mt-1 text-xs text-gray-400">Comma-separated list of your skills</p>
        </div>

        {/* Phone & LinkedIn row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              maxLength={20}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm
                         placeholder:text-gray-400 focus:border-primary focus:outline-none
                         focus:ring-2 focus:ring-primary-ring transition"
            />
          </div>
          <div>
            <label htmlFor="linkedIn" className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn
            </label>
            <input
              id="linkedIn"
              name="linkedIn"
              type="url"
              value={form.linkedIn}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/yourname"
              maxLength={200}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm
                         placeholder:text-gray-400 focus:border-primary focus:outline-none
                         focus:ring-2 focus:ring-primary-ring transition"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            value={form.bio}
            onChange={handleChange}
            placeholder="A brief introduction about yourself..."
            maxLength={1000}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm
                       placeholder:text-gray-400 focus:border-primary focus:outline-none
                       focus:ring-2 focus:ring-primary-ring transition resize-none"
          />
        </div>

        {/* Experience */}
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
            Experience
          </label>
          <textarea
            id="experience"
            name="experience"
            rows={4}
            value={form.experience}
            onChange={handleChange}
            placeholder="Describe your work experience..."
            maxLength={2000}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm
                       placeholder:text-gray-400 focus:border-primary focus:outline-none
                       focus:ring-2 focus:ring-primary-ring transition resize-none"
          />
        </div>

        {/* Education */}
        <div>
          <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
            Education
          </label>
          <textarea
            id="education"
            name="education"
            rows={3}
            value={form.education}
            onChange={handleChange}
            placeholder="Your educational background..."
            maxLength={2000}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm
                       placeholder:text-gray-400 focus:border-primary focus:outline-none
                       focus:ring-2 focus:ring-primary-ring transition resize-none"
          />
        </div>

        {/* Resume Upload */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="text-sm font-semibold font-heading text-gray-900 mb-3">
            Resume
          </h3>

          {profile?.resumeUrl && (
            <div className="mb-3 flex items-center gap-2">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <a
                href={`${apiBase}${profile.resumeUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:text-primary-hover transition underline"
              >
                View current resume
              </a>
            </div>
          )}

          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed
                            border-gray-300 px-4 py-6 text-sm text-gray-500
                            hover:border-primary hover:text-primary transition">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            {isUploading ? "Uploading..." : "Upload PDF (max 5 MB)"}
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              onChange={handleResumeUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={isSaving}
          className="w-full rounded-xl bg-cta px-5 py-3 text-sm font-semibold text-cta-text
                     shadow-sm hover:bg-cta-hover active:scale-[0.98]
                     transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
