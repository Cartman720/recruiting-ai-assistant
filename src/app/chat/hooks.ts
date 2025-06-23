"use client";

import cuid from "cuid";
import { FormEvent, useEffect } from "react";
import { useSetState } from "react-use";

interface UseChatState<T, TS> {
  id?: string | null;
  input: string;
  messages: T[];
  threadState: TS;
  loading: boolean;
}

interface UseChatOptions<T = any> {
  id?: string | null;
  api: string;
  initialMessages?: T[];
}

interface UseChatReturn<T, TS> extends UseChatState<T, TS> {
  setInput: (input: string) => void;
  handleSubmit: (e: FormEvent) => void;
}

export function useChat<T = any, TS = any>(
  options: UseChatOptions<T>
): UseChatReturn<T, TS> {
  const [state, setState] = useSetState<UseChatState<T, TS>>({
    id: options.id ?? null,
    input: "",
    messages: options.initialMessages ?? [],
    threadState: {} as TS,
    loading: false,
  });

  const setInput = (input: string) => setState({ ...state, input });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newMessages = [
      ...state.messages,
      {
        type: "human",
        data: {
          id: cuid(),
          content: state.input,
        },
      },
    ] as T[];

    setState({
      ...state,
      loading: true,
      input: "",
      messages: newMessages,
    });

    const response = await fetch(options.api, {
      method: "POST",
      body: JSON.stringify({
        id: state.id,
        message: state.input,
        ...(state.threadState ? { threadState: state.threadState } : {}),
      }),
    });

    const data = await response.json();

    const { threadId, messages, threadState } = data;

    setState((prev) => ({
      ...prev,
      id: threadId,
      messages,
      threadState,
      loading: false,
    }));
  };

  return {
    ...state,
    setInput,
    handleSubmit,
  };
}
