import cn from "@/lib/utils";
import { ChatMessageProps } from "./types";

export function HumanMessage({ content }: ChatMessageProps) {
  return (
    <div className="max-w-fit">
      <div
        className={cn(
          "rounded-xl p-2 text-sm",
          "border-indigo-400 border bg-indigo-200",
          "whitespace-pre-line"
        )}
      >
        {content}
      </div>
    </div>
  );
}
