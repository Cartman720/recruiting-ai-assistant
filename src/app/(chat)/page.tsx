"use client";

import { useRef, useEffect, use } from "react";
import ChatMessage from "@/components/elements/chat-message";
import Chatbar from "@/components/elements/chatbar";
import { cn } from "@/lib/utils";
import { useChat, Message } from "@ai-sdk/react";
import { initSession } from "@/lib/actions/session";
import cuid from "cuid";
import { useRouter, useSearchParams } from "next/navigation";

function mapRole(role: Message["role"]): "user" | "ai" {
  if (role === "user") return "user";
  return "ai"; // treat 'assistant', 'system', 'data' as 'ai'
}

const exampleSearch =
  "Retrieve Human Resource Manager in the San Francisco Bay Area";

export default function ChatClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");

  const { messages, input, setInput, handleSubmit, status, id } = useChat({
    api: "/api/chat",
    generateId: () => chatId ?? cuid(),
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const hasStarted = messages.length > 0;
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    router.push(`?chatId=${id}`);
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
    <div className="bg-base-200 py-12 flex flex-col min-h-screen">
      <div
        className={cn(
          "w-full h-full flex-1 max-w-4xl mx-auto transition-all duration-500",
          "flex flex-col items-center justify-center"
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
            className="w-full max-w-2xl mx-auto bg-base-100 shadow-xl rounded-xl p-4 overflow-y-auto mb-4"
            style={{
              minHeight: hasStarted ? "400px" : "0",
              maxHeight: "60vh",
              maxWidth: "912px",
              border: "1px solid #e5e7eb",
            }}
          >
            {messages.length === 0 && !hasStarted && (
              <div className="text-center text-base-content/60 py-8">
                <div className="space-y-2">
                  <p className="text-lg font-medium">
                    Start a conversation to search for candidates.
                  </p>
                  <p className="text-base-content/70">
                    For example:{" "}
                    <a
                      href="#"
                      className="text-blue-500 hover:underline"
                      onClick={() => setInput(exampleSearch)}
                    >
                      {exampleSearch}
                    </a>
                  </p>
                </div>
              </div>
            )}
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={{ ...msg, role: mapRole(msg.role) }}
              />
            ))}
          </div>
        </div>

        {/* Chatbar */}
        <Chatbar
          value={input}
          onChange={setInput}
          onSend={handleSubmit}
          onClear={handleClear}
          isLoading={isLoading}
          hasStarted={hasStarted}
        />
      </div>
    </div>
  );
}
