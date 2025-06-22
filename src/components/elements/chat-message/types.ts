export type ChatMessageType = "human" | "ai" | "tool";

export interface ChatMessageProps {
  id?: string;
  type?: ChatMessageType;
  content: string;
  artifact?: any[];
  toolCalls?: Array<{
    id: string;
    name: string;
    type: string;
    args: Record<string, any>;
  }>;
}
