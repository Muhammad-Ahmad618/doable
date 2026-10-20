export type taskStatus = "pending" | "in_progress" | "completed";

export interface AtriskTaskItem {
  task_id: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: taskStatus;
  due_date: string;
  assigned_to: string | null;
  workspace_id: string | null;
  risk_score: number;
  risk_level: "critical" | "high" | "medium";
  daysUntilDue: number;
}

export interface DashboardTrends {
  period: "weekly" | "monthly";
  completed: number;
  in_progress: number;
  overdue: number;
}

export interface DashboardStatsResponse {
  data: {
    total: number;
    completed: number;
    in_progress: number;
    pending: number;
    overdue: number;
  };
}

export interface recentTasks {
  task_id: number;
  title: string;
  description: string;
  priority: string;
  status: taskStatus;
  due_date: string;
  assignee_name: string | null;
  workspace_name: string | null;
}
