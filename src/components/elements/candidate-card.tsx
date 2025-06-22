import { Candidate } from "@/generated/prisma";

type CandidateCardProps = Candidate;

export const SearchResultCard: React.FC<CandidateCardProps> = ({
  id,
  name,
  title,
  skills,
}) => {
  return (
    <div className="mt-2 space-y-3">
      <div
        key={id}
        className="p-3 border border-base-200 rounded-lg bg-base-100"
      >
        <div className="flex flex-wrap gap-2">
          <span className="badge badge-info">{title}</span>
        </div>

        <h2 className="text-lg font-semibold mb-1">{name}</h2>

        <div className="flex flex-wrap gap-2 mb-1">
          {skills.slice(0, 5).map((skill) => (
            <span key={skill} className="badge badge-outline">
              {skill}
            </span>
          ))}

          {skills.length > 5 && (
            <span className="badge badge-outline">
              +{skills.length - 5} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
