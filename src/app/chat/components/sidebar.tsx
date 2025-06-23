"use client";

import { useState } from "react";
import Link from "next/link";
import cn from "@/lib/utils";
import { formatDate, formatDistanceToNow } from "date-fns";
import { EditIcon, MessageSquare, PanelLeft, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface SidebarProps {
  threads: ThreadProps[];
}

export function Sidebar({ threads = [] }: SidebarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={cn(
        "relative h-full shadow-sm",
        "transition-all transition-discrete",
        isOpen ? "w-72" : "w-16"
      )}
    >
      <div
        className={cn(
          "fixed top-0 left-0 h-full bg-base-200 border-r border-neutral-200 z-10",
          "transition-all transition-discrete",
          isOpen ? "w-72" : "w-16"
        )}
      >
        <div className="flex flex-col">
          <div className="h-14 flex justify-between items-center gap-4 p-4">
            <div
              className={cn(
                "text-base flex-shrink-0 font-exo font-medium",
                isOpen ? "block" : "hidden"
              )}
            >
              SoftGang AI Chat
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="btn btn-circle btn-ghost"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          </div>

          <div
            className={cn(
              "w-72 p-2 border-t border-neutral-200",
              "transition-all transition-discrete",
              isOpen ? "opacity-100 block" : "opacity-0 hidden"
            )}
          >
            <div className="mb-4 flex flex-col">
              <ActionButton onClick={() => router.push("/chat")}>
                <EditIcon className="w-4 h-4" />
                New chat
              </ActionButton>

              <ActionButton onClick={() => {}}>
                <SearchIcon className="w-4 h-4" />
                Search chats
              </ActionButton>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <h2 className="pl-4 text-base font-medium text-neutral-500">
                Recent Searches
              </h2>
            </div>

            <ul className="flex flex-col gap-2">
              {threads.map((thread) => (
                <ThreadItem key={thread.id} {...thread} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ThreadProps {
  id: string;
  title: string | null;
  summary: string | null;
  createdAt: Date;
}

function ThreadItem({ id, title, summary, createdAt }: ThreadProps) {
  const _formatDate = (date: Date) => {
    // Ensure we're working with UTC to avoid hydration issues
    const utcDate = new Date(date.toISOString());
    
    const dateFormat = formatDistanceToNow(utcDate, {
      addSuffix: true,
      includeSeconds: false,
    })
      .replace(/^about /, "")
      .replace(/^less than /, "");

    const displayDate =
      dateFormat.includes("days") && parseInt(dateFormat) > 3
        ? formatDate(utcDate, "MMM d, yyyy")
        : dateFormat;

    return displayDate;
  };

  return (
    <li className="flex items-center gap-2">
      <Link
        href={`/chat/${id}`}
        className={cn(
          "w-full flex items-center gap-2",
          "hover:bg-neutral-200 transition-colors",
          "px-4 py-3 rounded-md"
        )}
      >
        <MessageSquare className="flex-shrink-0w-3 h-3 mb-auto mt-1.5 text-neutral-500" />
        <div>
          <h3 className="font-medium text-base line-clamp-1">{title}</h3>
          <div className="text-xs text-neutral-500 line-clamp-1">{summary}</div>
          <div className="text-xs text-neutral-500">
            {_formatDate(createdAt)}
          </div>
        </div>
      </Link>
    </li>
  );
}

function ActionButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-sm font-medium rounded-xl",
        "flex items-center gap-2",
        "hover:bg-neutral-200 transition-colors",
        "px-3 py-2 cursor-pointer"
      )}
    >
      {children}
    </button>
  );
}
