export const NOTIFICATION_TYPES = {
  TASK_ASSIGNED: "task_assigned",
  TASK_UPDATED: "task_updated",
  TASK_DELETED: "task_deleted",
  WORKSPACE_ADDED: "workspace_added",
  TASK_DUE_SOON: "task_due_soon",
  TASK_OVERDUE: "task_overdue",
  TASK_STATUS_CHANGED: "task_status_changed",
  TASK_PRIORITY_CHANGED: "task_priority_changed",
  TASK_DUE_DATE_CHANGED: "task_due_date_changed",
  TASK_REMOVED: "task_removed",
  TASK_RECOVERED: "task_recovered",
} as const;
