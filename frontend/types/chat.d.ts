export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatPayload {
  messages: ChatMessage[];
  page?: string;
  timezone?: string;
}

export interface ChatResponse {
  reply: string;
}

