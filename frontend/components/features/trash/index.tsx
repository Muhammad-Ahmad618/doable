"use client";

import { useState, useMemo } from "react";
import { TrashHeader } from "./header";
import { TrashTable } from "./trashTable";
import { RestoreDialog } from "./restoreDialog";
import { Tasks } from "@/types/task";
import { toast } from "sonner";

// Initial mock deleted tasks for UI display
const initialTrashTasks: Tasks[] = [
  {
    task_id: 104,
    title: "Update security compliance documentation",
    description:
      "Review and update our ISO 27001 compliance checklist. Ensure all cloud policies and data encryption standards are documented before the upcoming audit.",
    priority: "high",
    status: "in_progress",
    due_date: "2026-11-04T12:00:00Z",
    assignee: "Alex Rivera",
    workspace: "Engineering",
  },
  {
    task_id: 109,
    title: "Refactor legacy authentication token refresh logic",
    description:
      "Clean up the Axios interceptors, streamline error propagation on 401 statuses, and unify logout redirect flows across concurrent requests.",
    priority: "medium",
    status: "pending",
    due_date: "2026-11-08T18:00:00Z",
    assignee: "Sarah Chen",
    workspace: "Core Team",
  },
  {
    task_id: 112,
    title: "Quarterly marketing assets cleanup",
    description:
      "Archive obsolete banner assets, campaign collateral from Q2, and compress remaining high-res images in CDN storage.",
    priority: "low",
    status: "completed",
    due_date: "2026-10-28T09:30:00Z",
    assignee: "Marcus Vance",
    workspace: "Design & Marketing",
  },
  {
    task_id: 115,
    title: "Database index optimization for task search queries",
    description:
      "Add composite indexes on tasks(user_id, deleted_at, status) to improve pagination speed when users filter across large workspaces.",
    priority: "high",
    status: "pending",
    due_date: "2026-11-12T15:00:00Z",
    assignee: "David Kim",
    workspace: "Infrastructure",
  },
];

export function TrashFeature() {
  const [tasks, setTasks] = useState<Tasks[]>(initialTrashTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // View Modal state (strictly read-only)
  const [viewTask, setViewTask] = useState<Tasks | undefined>(undefined);
  const [openViewModal, setOpenViewModal] = useState(false);

  // Restore Dialog state
  const [restoreTarget, setRestoreTarget] = useState<Tasks | undefined>(
    undefined,
  );
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Filter tasks by search query
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const query = searchQuery.toLowerCase();
    return tasks.filter(
      (task) =>
        task.title?.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.workspace?.toLowerCase().includes(query) ||
        task.assignee?.toLowerCase().includes(query),
    );
  }, [tasks, searchQuery]);

  // Paginate filtered results
  const paginatedTasks = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredTasks.slice(start, start + limit);
  }, [filteredTasks, page, limit]);

  const handleOpenView = (task: Tasks) => {
    setViewTask(task);
    setOpenViewModal(true);
  };

  const handleRequestRestore = (task: Tasks) => {
    setRestoreTarget(task);
    setOpenRestoreDialog(true);
  };

  const handleConfirmRestore = () => {
    if (!restoreTarget) return;
    setIsRestoring(true);

    setTimeout(() => {
      setTasks((prev) =>
        prev.filter((t) => t.task_id !== restoreTarget.task_id),
      );
      toast.success(`"${restoreTarget.title}" restored successfully`);
      setIsRestoring(false);
      setOpenRestoreDialog(false);
      setOpenViewModal(false);
      setRestoreTarget(undefined);
      setViewTask(undefined);
    }, 400);
  };

  return (
    <div className="space-y-6">
      <TrashHeader
        totalCount={filteredTasks.length}
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setPage(1);
        }}
      />

      <TrashTable
        data={paginatedTasks}
        pagination={{
          page,
          limit,
          total: filteredTasks.length,
          totalPages: Math.max(1, Math.ceil(filteredTasks.length / limit)),
        }}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        onView={handleOpenView}
        onRestore={handleRequestRestore}
      />

      {/* Restore Confirmation Dialog */}
      <RestoreDialog
        open={openRestoreDialog}
        onOpenChange={setOpenRestoreDialog}
        task={restoreTarget}
        onConfirm={handleConfirmRestore}
        isPending={isRestoring}
      />
    </div>
  );
}

export default TrashFeature;
