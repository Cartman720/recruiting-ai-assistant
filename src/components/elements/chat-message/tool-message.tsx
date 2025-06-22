import { capitalize } from "inflection";

interface ToolCall {
  id: string;
  name: string;
  type: string;
  args: Record<string, any>;
}

export interface ToolMessageProps {
  toolCalls?: ToolCall[];
  artifact?: any;
}

export function ToolMessage({ toolCalls, artifact }: ToolMessageProps) {
  const renderToolCalls = () => {
    if (!toolCalls) return null;

    return toolCalls.map((toolCall) => {
      switch (toolCall.name) {
        case "candidateSearch":
          return <CandidateSearchToolCall toolCall={toolCall} />;
        default:
          return null;
      }
    });
  };

  const renderArtifacts = () => {
    if (!artifact) return null;

    switch (artifact.type) {
      case "candidates_search_results":
        return <CandidateSearchResults items={artifact.data} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="flex flex-col gap-2">
      {renderToolCalls()}
      {renderArtifacts()}
    </div>
  );
}

export function CandidateSearchToolCall({ toolCall }: { toolCall: ToolCall }) {
  return (
    <div key={toolCall.id} className="bg-gray-100 p-2 rounded-md max-w-sm">
      <p className="font-roboto-condensed font-medium">
        Searching candidates with the following criteria:
      </p>
      <table className="mt-2 text-sm w-full">
        <tbody>
          {Object.entries(toolCall.args)
            .filter(([_, value]) => {
              if (Array.isArray(value)) return value.length > 0;
              if (value == null) return false;
              return true;
            })
            .map(([key, value]) => (
              <tr
                key={key}
                className="border-b last:border-b-0 border-gray-200"
              >
                <td className="font-bold font-roboto-condensed pr-4 py-1">
                  {capitalize(key)}:
                </td>
                <td className="py-1">{String(value)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export function CandidateSearchResults({ items }: { items: any[] }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <div key={item.id} className="rounded-md border border-gray-200 p-2">
          <div className="font-roboto-condensed font-medium">{item.title}</div>
          <div className="text-sm text-gray-500">{item.name}</div>
        </div>
      ))}
    </div>
  );
} 