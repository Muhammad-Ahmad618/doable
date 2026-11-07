import { generateReply } from "@/services/chat_service.js";
import { ChatMessage } from "@/Types/chats.js";
import { Request, Response } from "express";

function cleanMessage(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) return [];
  const filtered = raw
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-10)
    .map((m) => ({
      role: m.role as ChatMessage["role"],
      content: m.content.slice(0, 2000),
    }));

  // Ensure conversation starts with 'user'
  while (filtered.length > 0 && filtered[0].role !== "user") {
    filtered.shift();
  }

  return filtered;
}

export const Chat = async (req: Request, res: Response) => {
  const user_id = Number(req.user?.id);

  if (!user_id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const messages = cleanMessage(req.body?.messages);
  const timezone =
    typeof req.body?.timezone === "string" ? req.body.timezone : "UTC";
  const page = typeof req.body?.page === "string" ? req.body.page : "";

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return res.status(400).json({ error: "Bad Request" });
  }

  try {
    const reply = await generateReply({
      user: { id: user_id, name: req.user?.username ?? "User" },
      messages,
      timezone,
      page,
    });
    return res.json({ reply });
  } catch (err: any) {
    console.error("Chat error:", err?.message || err);
    return res.status(500).json({ error: "Failed to generate reply" });
  }
};
