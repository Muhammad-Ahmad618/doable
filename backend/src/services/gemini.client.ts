import { GenerateReplyInput } from "@/Types/chats.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { withRetry } from "@/utils/retry.js";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_AI!);
const modelName = "gemini-3.5-flash-lite";

export const callGemini = async (
  systemPrompt: string,
  messages: GenerateReplyInput["messages"],
): Promise<string> => {
  const model = genAi.getGenerativeModel({
    model: modelName,
    systemInstruction: systemPrompt,
  });

  const sanitizedMessages = messages.filter(
    (m, i, arr) => i === 0 || m.role !== arr[i - 1].role,
  );
  // Drop leading assistant messages if any
  while (sanitizedMessages.length > 0 && sanitizedMessages[0].role !== "user") {
    sanitizedMessages.shift();
  }

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  try {
    const result = await withRetry(() => model.generateContent({ contents }));
    return (
      result.response.text() || "Sorry I counldn't come up with your answer"
    );
  } catch (error) {
    console.error("Gemini error:", error);
    throw new Error("AI request failed");
  }
};
