import { cn } from "@/lib/utils";
import React from "react";

type ChatbarProps = {
  value: string;
  onChange: (v: string) => void;
  onSend: (e: React.FormEvent) => void;
  onClear: () => void;
  isLoading: boolean;
  hasStarted: boolean;
};

export const Chatbar: React.FC<ChatbarProps> = ({
  value,
  onChange,
  onSend,
  onClear,
  isLoading,
  hasStarted,
}) => {
  return (
    <form
      onSubmit={onSend}
      data-attach={hasStarted === true ? "true" : null}
      className={cn(
        "w-full mx-auto flex items-center gap-4 transition-bottom duration-500",
        "p-4 bg-white rounded-xl border border-neutral-300",
        "data-attach:bottom-5"
      )}
    >
      <div className="flex-1">
        <input
          type="text"
          className="flex-1 outline-none w-full"
          placeholder="Type your search..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
          autoFocus
        />
      </div>

      <button
        type="button"
        onClick={onClear}
        className={cn(
          "cursor-pointer text-sm transition-colors transition-discrete inline-block hover:text-blue-400",
          value.length > 0 ? "block" : "hidden"
        )}
      >
        Clear
      </button>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={isLoading || !value.trim()}
      >
        {isLoading ? <span className="loading loading-spinner"></span> : "Send"}
      </button>
    </form>
  );
};

export default Chatbar;
