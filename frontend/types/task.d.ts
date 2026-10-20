import { taskStatus } from "@/types/dashboard";

export type Priority = "high" | "medium" | "low";
export type Status = taskStatus;

export interface TaskSheetProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmitHandler: (values: Tasks) => Promise<void> | void;
  task?: Tasks;
  isPending?: boolean;
}

export interface Tasks {
  task_id: number;
  title: string;
  description: string;
  priority: Priority;
  status: taskStatus;
  due_date: string;
  assignee?: string | null;
  workspace?: string | null;
}

export type ApiSubTask = {
  id?: string | number;
  task_id?: string | number;
  title?: string;
  description?: string | null;
  priority?: Priority;
  status?: Status;
  completed?: boolean;
};

export interface GeneratedSubTask {
  task_id?: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
}

export interface TaskDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  onUpdateTask?: (updatedTask: Task) => void;
}

export interface TaskTableProps {
  data?: Tasks[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onView?: (task: Task) => void;
  onEdit?: (id: Task) => void;
  onDelete?: (id: Task) => void;
}

export interface TasksResponse {
  data: Tasks[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  priority: Priority;
  status: taskStatus;
  due_date: string;
}

export interface UpdateTaskPayload {
  task_id: number;
  title: string;
  description: string;
  priority: Priority;
  status: taskStatus;
  due_date: string;
}
