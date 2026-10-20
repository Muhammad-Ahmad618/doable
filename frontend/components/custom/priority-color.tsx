import { Priority } from "@/types/task";

export const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case "high":
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50";
    case "medium":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800/50";
  }
};
