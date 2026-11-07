export interface task {
  task_id: number;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  due_date: Date;
  status: "pending" | "in_progress" | "completed";
  assigned_to?: number;
  workspace_id?: number;
}

export type PromptTask = {
  title: string;
  priority: string;
  status: string;
  due_date: string | null;
  assignee?: string | null;
  workspace_name?: string | null;
};

export interface taskbreakDownProps {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
}

export interface taskRiskReport {
  high_risk: task[];
  medium_risk: task[];
  ontrack: task[];
  assessment: string;
}
