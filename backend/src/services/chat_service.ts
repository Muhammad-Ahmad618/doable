import { getOpenTasks } from "@/models/tasks_model.js";
import { GenerateReplyInput } from "@/Types/chats.js";
import { getToday } from "@/utils/date.js";
import { PromptTask } from "@/Types/tasks.js";
import { callGemini } from "./gemini.client.js";

function buildSystemPrompt(
  input: GenerateReplyInput,
  tasks: PromptTask[],
): string {
  const { user, timezone, page } = input;

  const taskLines = tasks.length
    ? tasks
        .map(
          (t) =>
            `- ${t.title} | priority: ${t.priority} | status: ${t.status} | due: ${t.due_date ?? "none"}${
              t.workspace_name ? ` | workspace: ${t.workspace_name}` : ""
            }`,
        )
        .join("\n")
    : "(no tasks)";

  return `You are the assistant inside a task management app called Doable.
The user's name is ${user.name}. Today's date is ${getToday(timezone)} (timezone ${timezone}).
${page ? `The user is currently on this page: ${page}.` : ""}

Rules:
- Use simple, friendly language. Keep answers short.
- When asked to plan the day, give 3 to 5 tasks in the best order, each with a one-line reason.
- Only talk about the tasks listed below. Never invent tasks.
- If there is nothing relevant, say so honestly.

The user's tasks:
${taskLines}`;
}

export const generateReply = async (input: GenerateReplyInput) => {
  const tasks = await getOpenTasks(Number(input?.user?.id), 40);
  const systemPrompt = buildSystemPrompt(input, tasks);
  return callGemini(systemPrompt, input.messages);
};
