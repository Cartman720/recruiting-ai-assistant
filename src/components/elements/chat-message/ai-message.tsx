import { capitalize } from "inflection";
import Markdown from "markdown-to-jsx";
import styles from "./chat-message.module.css";
import cn from "@/lib/utils";

interface ToolCall {
  id: string;
  name: string;
  type: string;
  args: Record<string, any>;
}

export interface AIMessageProps {
  content: string;
  toolCalls?: ToolCall[];
}

export function AIMessage({ content, toolCalls }: AIMessageProps) {
  const renderToolCalls = () => {
    if (!toolCalls) return null;

    return toolCalls.map((toolCall, index) => {
      switch (toolCall.name) {
        case "candidateSearch":
          return <CandidateSearchToolCall key={index} toolCall={toolCall} />;
        default:
          return null;
      }
    });
  };

  const toolCallsContent = renderToolCalls();

  if (!content && !toolCallsContent) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2" data-type="ai">
      {content && (
        <div className="max-w-full">
          <Markdown
            className={styles.content}
            options={{
              overrides: {
                table: {
                  component: ({ children }) => (
                    <div
                      className={cn(
                        "overflow-x-auto mb-4 rounded-xl",
                        "border border-gray-200 table-zebra"
                      )}
                    >
                      <table className="table">{children}</table>
                    </div>
                  ),
                },
              },
            }}
          >
            {content}
          </Markdown>
        </div>
      )}
      {toolCallsContent}
    </div>
  );
}

export function CandidateSearchToolCall({ toolCall }: { toolCall: ToolCall }) {
  return (
    <div key={toolCall.id} className="bg-gray-100 p-2 rounded-md max-w-sm">
      <p className="font-exo font-medium">
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
                <td className="font-bold font-exo pr-4 py-1">
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
