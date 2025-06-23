import cn from "@/lib/utils";
import { ChatMessageProps } from "./types";

export function HumanMessage({ content }: ChatMessageProps) {
  return (
    <div className="max-w-fit">
      <div
        className={cn(
          "rounded-lg py-2 px-4 text-base",
          "border border-neutral-300 bg-neutral-100",
          "whitespace-pre-line"
        )}
      >
        {content}
      </div>
    </div>
  );
}
