export default function ApplicantProfileModal({ applicant, onClose }) {
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
                href={applicant.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white
                           shadow-sm hover:bg-accent-hover transition"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                View / Download Resume
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
