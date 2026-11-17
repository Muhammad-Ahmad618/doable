"use client";

import dynamic from "next/dynamic";
import { useMemo, useState, useCallback } from "react";
import { TaskHeader } from "@/components/features/tasks/header";
import { TaskTable } from "@/components/features/tasks/taskTable";
import { Tasks } from "@/types/task";
import {
  useGetAllTasks,
  useUpdateTask,
  useRemoveTask,
} from "@/hooks/user/tasks";
import { TableSkeleton } from "@/components/custom/table-skeleton";
import { SectionError } from "@/components/shared/error-block";
import { EmptyState } from "@/components/shared/empty-state";

const TaskSheet = dynamic(
  () => import("./taskSheet").then((m) => m.TaskSheet),
  { ssr: false },
);

const TaskDetailModal = dynamic(
  () => import("../../custom/taskDetailModal").then((m) => m.TaskDetailModal),
  { ssr: false },
);

const DeleteTaskDialog = dynamic(
  () =>
    import("@/components/shared/delete-task-dialog").then(
      (m) => m.DeleteTaskDialog,
    ),
  { ssr: false },
);

export function PersonalTasks() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [searchQuery, setSearchQuery] = useState("");
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Tasks | undefined>(
    undefined,
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<Tasks | undefined>(
    undefined,
  );
  // Task Detail Modal states
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [selectedDetailTask, setSelectedDetailTask] = useState<
    Tasks | undefined
  >(undefined);

  //hooks
  const {
    data: tasks,
    isLoading,
    isError,
    refetch,
  } = useGetAllTasks(page, limit);
  const { mutateAsync: updateTask, isPending } = useUpdateTask();
  const { mutateAsync: deleteTask, isPending: isPendingDelete } =
    useRemoveTask();

  const onSubmitHandler = useCallback(
    async (values: Tasks) => {
      try {
        await updateTask(values);
        setOpenSheet(false);
        setSelectedTask(undefined);
      } catch (error) {
        console.log(error);
      }
    },
    [updateTask],
  );

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpenSheet(isOpen);
    if (!isOpen) {
      setSelectedTask(undefined);
    }
  }, []);

  const handleDelete = useCallback(async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete?.task_id);
        setOpenDialog(false);
        setTaskToDelete(undefined);
      } catch (error) {
        console.log(error);
      }
    }
  }, [taskToDelete, deleteTask]);

  const handleView = useCallback((task: Tasks) => {
    setSelectedDetailTask(task);
    setOpenDetail(true);
  }, []);

  const handleEdit = useCallback((task: Tasks) => {
    setSelectedTask(task);
    setOpenSheet(true);
  }, []);

  const handleDeleteRequest = useCallback((task: Tasks) => {
    setTaskToDelete(task);
    setOpenDialog(true);
  }, []);

  const handleSearchChange = useCallback((val: string) => {
    setSearchQuery(val);
  }, []);

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks?.data;
    const query = searchQuery.toLowerCase();
    return tasks?.data.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.status.toLowerCase().includes(query) ||
        task.assignee?.toLowerCase().includes(query),
    );
  }, [tasks, searchQuery]);

  return (
    <div>
      <TaskHeader
        searchQuery={searchQuery}
        searchChange={handleSearchChange}
      />

      {isLoading ? (
        <TableSkeleton />
      ) : isError ? (
        <div className="mt-5">
          <SectionError onRetry={refetch} />
        </div>
      ) : filteredTasks?.length == 0 ? (
        <EmptyState
          title="No Task Found"
          description={
            searchQuery.trim()
              ? "try a different search"
              : "Create one to get started"
          }
        />
      ) : (
        <TaskTable
          data={filteredTasks || []}
          pagination={tasks?.pagination}
          onPageChange={setPage}
          onLimitChange={setLimit}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />
      )}

      <TaskSheet
        open={openSheet}
        setOpen={handleOpenChange}
        onSubmitHandler={onSubmitHandler}
        task={selectedTask}
        isPending={isPending}
      />
      <TaskDetailModal
        key={selectedDetailTask?.task_id}
        open={openDetail}
        onOpenChange={setOpenDetail}
        task={selectedDetailTask}
      />
      <DeleteTaskDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        taskTitle={taskToDelete?.title}
        isPending={isPendingDelete}
        onConfirm={handleDelete}
      />
    </div>
  );
}
