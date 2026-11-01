import { Priority, Status } from "@/types/task";

export interface TrashTask {
  task_id: number;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  due_date: string;
  assignee?: string | null;
  workspace?: string | null;
}

export interface TrashTasksResponse {
  message: string;
  data?: TrashTask[];
}

export interface RecoverTaskResponse {
  message: string;
  data: TrashTask;
}

export interface TrashTableProps {
  data: TrashTask[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onRestore: (task: TrashTask) => void;
}

export interface RestoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: TrashTask;
  onConfirm: () => Promise<void> | void;
  isPending?: boolean;
}

export interface TrashHeaderProps {
  totalCount?: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export interface searchProps {
  searchQuery: string;
  searchChange: (value: string) => void;
}
