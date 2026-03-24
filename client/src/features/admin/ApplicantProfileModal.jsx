export default function ApplicantProfileModal({ applicant, onClose }) {
  const apiBase = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";
  const skills = applicant.skills
    ? applicant.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[80vh] rounded-2xl bg-white shadow-xl border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="min-w-0">
            <h2 className="text-xl font-bold font-heading text-gray-900 truncate">
              {applicant.name}
            </h2>
            {applicant.headline && (
              <p className="text-sm text-gray-500 mt-0.5 truncate">{applicant.headline}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition shrink-0"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold font-heading text-gray-700 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-primary-light text-primary border border-primary-ring/40 px-2.5 py-0.5 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {applicant.experience && (
            <div>
              <h3 className="text-sm font-semibold font-heading text-gray-700 mb-2">Experience</h3>
              <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700 whitespace-pre-line">
                {applicant.experience}
              </div>
            </div>
          )}

          {/* Education */}
          {applicant.education && (
            <div>
              <h3 className="text-sm font-semibold font-heading text-gray-700 mb-2">Education</h3>
              <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700 whitespace-pre-line">
                {applicant.education}
              </div>
            </div>
          )}

          {/* Resume */}
          {applicant.resumeUrl && (
            <div>
              <h3 className="text-sm font-semibold font-heading text-gray-700 mb-2">Resume</h3>
              <a
                href={`${apiBase}${applicant.resumeUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-primary-ring/50 bg-primary-light
                           px-4 py-2.5 text-sm font-semibold text-primary
                           hover:bg-primary hover:text-white hover:border-primary
                           active:scale-[0.98] transition-all duration-150 shadow-sm"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                View Resume
              </a>
            </div>
          )}

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold font-heading text-gray-700 mb-2">Contact</h3>
            <p className="text-sm text-gray-600">{applicant.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
