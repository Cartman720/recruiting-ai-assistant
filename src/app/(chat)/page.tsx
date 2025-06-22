"use client";

import cuid from "cuid";
import { useRef, useEffect } from "react";
import { Chatbar } from "@/components/elements/chatbar";
import {
  ChatMessage,
  ChatMessageType,
} from "@/components/elements/chat-message";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useChat } from "./hooks";

const exampleSearch =
  "Retrieve Human Resource Manager in the San Francisco Bay Area";

export default function ChatClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");

  const { messages, threadState, input, setInput, handleSubmit, loading, id } =
    useChat({
      api: "/api/chat",
      id: () => chatId ?? cuid(),
    });

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const hasStarted = messages.length > 0;

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

  console.log(threadState, messages);

  return (
    <div className="bg-base-200 py-12 flex flex-col min-h-screen">
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
              "w-full max-w-2xl mx-auto rounded-lg p-4 overflow-y-auto mb-4",
              "max-w-[912px] border border-gray-200 bg-base-100",
              "transition-all duration-500",
              hasStarted ? "flex-1" : "max-h-[60vh]"
            )}
          >
            {messages.length === 0 && !hasStarted && (
              <div className="text-center text-base-content/60 py-8">
                <div className="space-y-2">
                  <p className="text-lg font-roboto-condensed">
                    Start a conversation to search for candidates.
                  </p>
                  <p className="text-base-content/70">
                    <strong className="font-roboto-condensed">
                      For example:{" "}
                    </strong>
                    <a
                      href="#"
                      className="bg-primary text-primary-content py-0.5 px-1 text-sm rounded-sm hover:underline"
                      onClick={() => setInput(exampleSearch)}
                    >
                      {exampleSearch}
                    </a>
                  </p>
                </div>
              </div>
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
                <p className="font-roboto-condensed">Loading...</p>
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
  );
}
