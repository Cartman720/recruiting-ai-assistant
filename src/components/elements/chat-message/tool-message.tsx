export interface ToolMessageProps {
  artifact?: any;
  content?: string;
}

export function ToolMessage({ artifact }: ToolMessageProps) {
  const renderArtifacts = () => {
    if (!artifact) return null;

    switch (artifact.type) {
      case "candidates_search_results":
        return <CandidateSearchResults items={artifact.data} />;
      default:
        return null;
    }
  };

  const artifactContent = renderArtifacts();

  // If there is no tool calls or artifacts, return null
  if (!artifactContent) {
    return null;
  }

  return <div className="flex flex-col gap-2">{artifactContent}</div>;
}

export function CandidateSearchResults({ items }: { items: any[] }) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((candidate, index) => {
        // Compose location string
        const location =
          candidate.city || candidate.state || candidate.country
            ? [candidate.city, candidate.state, candidate.country]
                .filter(Boolean)
                .join(", ")
            : candidate.location;
        // Get company from first experience if available
        const company =
          candidate.experiences && candidate.experiences.length > 0
            ? candidate.experiences[0].company
            : null;
        // Get certifications (show first as badge, rest as list)
        const mainCertification =
          candidate.certifications && candidate.certifications.length > 0
            ? candidate.certifications[0]
            : null;
        return (
          <div
            key={index}
            className="rounded-xl w-full border border-gray-200 bg-white p-4 shadow-sm flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <span className="font-exo font-semibold text-lg">
                {candidate.title || "Candidate"}
              </span>
              {candidate.expertiseLevel && (
                <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full ml-1">
                  {candidate.expertiseLevel}
                </span>
              )}
              <a
                href={"#"}
                className="ml-auto text-blue-600 font-medium hover:underline text-sm"
                tabIndex={0}
              >
                View
              </a>
            </div>
            <div className="text-gray-700 font-medium">{candidate.name}</div>
            <div className="flex flex-wrap gap-4 text-gray-500 text-sm items-center">
              {candidate.yearsOfExperience && (
                <span className="flex items-center gap-1">
                  <span>🗓️</span>
                  {candidate.yearsOfExperience}y exp
                </span>
              )}
              {location && (
                <span className="flex items-center gap-1">
                  <span>📍</span>
                  {location}
                </span>
              )}
              {candidate.educationLevel && (
                <span className="flex items-center gap-1">
                  <span>🎓</span>
                  {candidate.educationLevel}
                </span>
              )}
              {candidate.hasRemoteExperience && (
                <span className="flex items-center gap-1">
                  <span>🌐</span>
                  Remote
                </span>
              )}
            </div>
            {company && (
              <div className="text-sm text-gray-700">
                <span className="font-semibold">at </span>
                <span className="font-semibold">{company}</span>
              </div>
            )}
            <div className="text-gray-600 text-sm">{candidate.summary}</div>
            <div className="flex flex-wrap gap-2 mt-1">
              {candidate.skills &&
                candidate.skills.slice(0, 5).map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-md font-medium"
                  >
                    {skill}
                  </span>
                ))}
              {candidate.skills && candidate.skills.length > 5 && (
                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-md font-medium">
                  +{candidate.skills.length - 5} more
                </span>
              )}
            </div>
            {mainCertification && (
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-700">
                <span>⭐</span>
                <span>{mainCertification}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
