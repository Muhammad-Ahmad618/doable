import { GoogleGenerativeAI } from "@google/generative-ai";
import { task, taskRiskReport } from "@/Types/tasks.js";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_AI || "");
const model = genAi.getGenerativeModel(
  { model: "gemini-3.5-flash-lite" },
  { apiVersion: "v1beta" },
);

/** Retry a Gemini API call up to `maxAttempts` times on 503 Service Unavailable. */
const withRetry = async <T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 1000,
): Promise<T> => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const is503 = error?.status === 503;
      if (!is503 || attempt === maxAttempts) throw error;
      const delay = baseDelayMs * 2 ** (attempt - 1);
      console.warn(
        `Gemini 503 – retrying in ${delay}ms (attempt ${attempt}/${maxAttempts})...`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Unreachable");
};

export const generateDailyFocus = async (tasks: task[]): Promise<string> => {
  if (tasks.length === 0) {
    return "You have no Task for today";
  }

  const taskList = tasks
    .map(
      (t, i) => `${i + 1}. 
    Title: ${t.title},
    Description: ${t.description},
    Priority: ${t.priority},
    Status: ${t.status}
    Due: ${new Date(t.due_date).toDateString()}
    `,
    )
    .join("\n\n");

  const prompt = `You are a Productivity assitance for a task management app.
    
    The User has the following pending or In-progress due today or overdue:${taskList}
    
    Generate a focused daily briefing for the user and include:
    - A one sentence motivational opener (keep it short genuine, not cheesy)
    - A prioritized list of what they should focus on today and why
    - A short closing note if any tasks are overdue

    Keep the tone professional and friendly. Be concise and actionable.`;

  try {
    const result = await withRetry(() => model.generateContent(prompt));
    return result.response.text();
  } catch (error) {
    console.log("Error generating daily focus", error);
    throw error;
  }
};

export const generateTaskBreakDown = async (
  title: string,
  description: string,
): Promise<
  { title: string; description: string; priority: "low" | "medium" | "high" }[]
> => {
  const prompt = `You are a project planning assistant. A user has a task they want broken down into smaller subtasks.

    Task Title: ${title}
    Task Description: ${description}

    Break this task down into 4-6 concrete, actionable subtasks. Each subtask should be a clear unit of work.

    First assess if this task actually needs breaking down. If it is already a small, atomic task (like "fix a typo" or "create a button"), respond with an empty array.

    Respond ONLY with a valid JSON array, no explanation, no markdown, no backticks. Example format:
    [
    {
        "title": "subtask title",
        "description": "clear description of what needs to be done",
        "priority": "high"
    }
    ]

    Priority must be one of: high, medium, low.`;

  try {
    const result = await withRetry(() => model.generateContent(prompt));
    const text = result.response.text().trim();
    const parsed = JSON.parse(text);
    return parsed;
  } catch (error) {
    console.error("Error generating task breakdown", error);
    throw error;
  }
};

export const generateRiskReport = async (
  tasks: task[],
): Promise<taskRiskReport> => {
  if (tasks.length === 0) {
    return {
      high_risk: [],
      medium_risk: [],
      ontrack: [],
      assessment: "No Tasks pending",
    };
  }
  const today = new Date();

  const taskList = tasks
    .map(
      (t, i) =>
        `${i + 1}.
    TaskID:${t.task_id}
    Title:${t.title}
    Description:${t.description}
    Priority:${t.priority}
    Status:${t.status}
    DueDate:${new Date(t.due_date).toDateString()}
    Days until due: ${Math.ceil((new Date(t.due_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))}
    `,
    )
    .join("\n\n");

  const prompt = `You are a productivity risk analyst for a task management app.

The user has the following active tasks:

${taskList}

Total active tasks: ${tasks.length}

Analyze each task and classify it into one of three risk levels based on:
- Days remaining until due date (negative means overdue)
- Task priority (high priority tasks near deadline = higher risk)
- Status (pending tasks closer to due date = higher risk than in-progress)
- Overall workload (more tasks = higher risk across the board)

Risk level definitions:
- high_risk: overdue tasks, high priority tasks due within 2 days still pending, or tasks that are very unlikely to be completed on time
- medium_risk: tasks due within 3-5 days with no progress, medium priority tasks that are pending with little time left
- on_track: tasks with comfortable time remaining or already in progress with enough time

Respond ONLY with a valid JSON object, no explanation, no markdown, no backticks. Format:
{
  "high_risk": [<task_ids>],
  "medium_risk": [<task_ids>],
  "on_track": [<task_ids>],
  "assessment": "one paragraph overall assessment of the user's workload and risk"
}

Only include task_id numbers in the arrays.`;

  try {
    const result = await withRetry(() => model.generateContent(prompt));
    const text = result.response.text().trim();
    const parsed = JSON.parse(text);

    const taskMap = new Map(tasks.map((t) => [t.task_id, t]));

    return {
      high_risk: parsed.high_risk
        .map((id: number) => taskMap.get(id))
        .filter(Boolean),
      medium_risk: parsed.medium_risk
        .map((id: number) => taskMap.get(id))
        .filter(Boolean),
      ontrack: parsed.ontrack
        .map((id: number) => taskMap.get(id))
        .filter(Boolean),
      assessment: parsed.assessment,
    };
  } catch (error) {
    console.error("Error generating risk report", error);
    throw error;
  }
};
