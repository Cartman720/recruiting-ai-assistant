import { Candidate, User } from "@/generated/prisma";
import { Annotation } from "@langchain/langgraph";
import { MessagesAnnotation } from "@langchain/langgraph";

export const StateAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  user: Annotation<User>,
  candidates: Annotation<any[]>,
  selectedCandidate: Annotation<Candidate | null>,
});
