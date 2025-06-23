"use client";

import { useRef, useEffect } from "react";
import { Chatbar } from "@/components/elements/chatbar";
import {
  ChatMessage,
  ChatMessageType,
} from "@/components/elements/chat-message";
import { cn } from "@/lib/utils";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useChat } from "../hooks";
import { PlaceholderBanner } from "../components/placeholder-banner";

const actions = [
  "Search for Python Developers",
  "Locate Remote workers in California",
  "What free slots I've tomorrow noon at New York time?",
  "Find Java Developers in US",
];

interface ChatClientPageProps {
  initialState?: {
    messages: any[];
  };
}

export default function ChatClientPage({ initialState }: ChatClientPageProps) {
  const router = useRouter();
  const params = useParams();
  const chatId = params.slugs?.[0];

  const { messages, input, setInput, handleSubmit, loading, id } = useChat({
    api: "/api/chat",
    id: chatId,
    initialMessages: initialState?.messages,
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const hasStarted = messages.length > 0;

  useEffect(() => {
    if (id) {
      router.push(`/chat/${id}`);
    }
  }, [id]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleClear = () => {
    setInput("");
  };

  return (
    <div className="bg-base-200 flex flex-col min-h-screen">
      <div
        className={cn(
          "w-full h-full flex-1 py-10 bg-white rounded-t-3xl border-t border-gray-200",
          "flex flex-col",
          "transition-all duration-500"
        )}
      >
        <div
          className={cn(
            "w-full h-full flex-1 max-w-4xl mx-auto",
            "flex flex-col items-center justify-center",
            "transition-all duration-500"
          )}
        >
          <div
            className={cn(
              "w-full flex flex-col items-center",
              hasStarted ? "flex-1" : "flex-0"
            )}
          >
            <div
              ref={chatContainerRef}
              className={cn(
                "w-full max-w-2xl mx-auto rounded-xl p-4 overflow-y-auto mb-4",
                "max-w-[912px] border border-neutral-300 bg-base-100",
                "transition-all duration-500",
                hasStarted ? "flex-1" : "max-h-[60vh]"
              )}
            >
              {messages.length === 0 && !hasStarted && (
                <PlaceholderBanner
                  actions={actions}
                  onQuickActionClick={setInput}
                />
              )}

              <div className="flex flex-col gap-4">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.data.id}
                    type={msg.type as ChatMessageType}
                    content={msg.data.content}
                    artifact={msg.data.artifact}
                    toolCalls={msg.data.tool_calls}
                  />
                ))}
              </div>

              {loading && (
                <div className="text-center text-base-content/60 my-auto py-8 flex items-center justify-center gap-4">
                  <p className="font-geist-mono">Loading...</p>
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              )}
            </div>
          </div>

          {/* Chatbar */}
          <Chatbar
            value={input}
            onChange={setInput}
            onSend={handleSubmit}
            onClear={handleClear}
            isLoading={loading}
            hasStarted={hasStarted}
          />
        </div>
      </div>
    </div>
  );
}
