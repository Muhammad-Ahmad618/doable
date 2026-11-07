export type ChatMessage = { role: "user" | "assistant"; content: string };

export type GenerateReplyInput = {
  user: { id: number; name: string };
  messages: ChatMessage[];
  timezone: string;
  page: string;
};
