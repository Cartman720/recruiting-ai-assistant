import cuid from "cuid";
import { FormEvent } from "react";
import { useSetState } from "react-use";

interface UseChatState<T, TS> {
  id: string;
  input: string;
  messages: T[];
  threadState: TS;
  loading: boolean;
}

interface UseChatOptions {
  id: string | (() => string);
  api: string;
}

interface UseChatReturn<T, TS> extends UseChatState<T, TS> {
  setInput: (input: string) => void;
  handleSubmit: (e: FormEvent) => void;
}

export function useChat<T = any, TS = any>(
  options: UseChatOptions
): UseChatReturn<T, TS> {
  const [state, setState] = useSetState<UseChatState<T, TS>>({
    id: typeof options.id === "function" ? options.id() : options.id,
    input: "",
    messages: [],
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
        messages: newMessages,
        ...(state.threadState ? { threadState: state.threadState } : {}),
      }),
    });

    const data = await response.json();

    const { messages, threadState } = data;

    setState((prev) => ({
      ...prev,
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
