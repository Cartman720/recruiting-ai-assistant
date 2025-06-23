import Markdown from "markdown-to-jsx";
import styles from "./chat-message.module.css";
import cn from "@/lib/utils";

export interface AIMessageProps {
  content: string;
}

export function AIMessage({ content }: AIMessageProps) {
  if (!content) {
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
    </div>
  );
}
