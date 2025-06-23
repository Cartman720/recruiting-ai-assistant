import React from "react";
import { ChatMessageProps } from "./types";
import { HumanMessage } from "./human-message";
import { AIMessage } from "./ai-message";
import { ToolMessage } from "./tool-message";

export function ChatMessage({
  type,
  content,
  artifact,
  toolCalls,
}: ChatMessageProps) {
  if (type === "human") {
    return <HumanMessage content={content} />;
  }

  if (type === "tool") {
    return <ToolMessage artifact={artifact} />;
  }

  if (type === "ai") {
    return <AIMessage content={content} toolCalls={toolCalls} />;
  }

  return "Unknown message type: " + type;
}
