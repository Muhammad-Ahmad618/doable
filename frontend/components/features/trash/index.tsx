"use client";

import { useState, useMemo } from "react";
import { TrashHeader } from "./header";
import { TrashTable } from "./trashTable";
import { RestoreDialog } from "./restoreDialog";
import { TrashTask } from "@/types/trash";
import { useGetTrashTasks, useRecoverTask } from "@/hooks/user/trash";
import { TableSkeleton } from "@/components/custom/table-skeleton";
import { SectionError } from "@/components/shared/error-block";

export function TrashFeature() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Restore Dialog state
  const [restoreTarget, setRestoreTarget] = useState<TrashTask | undefined>(
    undefined,
  );
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);

  // TanStack Query & Mutation hooks
  const { data: tasks = [], isLoading, isError, refetch } = useGetTrashTasks();
  const { mutateAsync: recoverTask, isPending: isRestoring } = useRecoverTask();

  // Filter tasks by search query
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const query = searchQuery.toLowerCase();
    return tasks.filter(
      (task) =>
        task.title?.toLowerCase().includes(query) ||
        task.workspace?.toLowerCase().includes(query) ||
        task.assignee?.toLowerCase().includes(query),
    );
  }, [tasks, searchQuery]);

  // Paginate filtered results
  const paginatedTasks = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredTasks.slice(start, start + limit);
  }, [filteredTasks, page, limit]);

  const handleRequestRestore = (task: TrashTask) => {
    setRestoreTarget(task);
    setOpenRestoreDialog(true);
  };

  const handleConfirmRestore = async () => {
    if (!restoreTarget) return;

    try {
      await recoverTask(restoreTarget.task_id);
      setOpenRestoreDialog(false);
      setRestoreTarget(undefined);
    } catch (error) {
      console.error("Failed to restore task:", error);
    }
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

      {isLoading ? (
        <TableSkeleton />
      ) : isError ? (
        <SectionError onRetry={refetch} />
      ) : (
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
          onRestore={handleRequestRestore}
        />
      )}

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
