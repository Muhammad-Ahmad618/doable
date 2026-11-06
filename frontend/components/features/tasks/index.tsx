"use client";

import { useMemo, useState } from "react";
import { TaskHeader } from "@/components/features/tasks/header";
import { TaskTable } from "@/components/features/tasks/taskTable";
import { TaskSheet } from "./taskSheet";
import { TaskDetailModal } from "../../custom/taskDetailModal";
import { Tasks } from "@/types/task";
import {
  useGetAllTasks,
  useUpdateTask,
  useRemoveTask,
} from "@/hooks/user/tasks";
import { TableSkeleton } from "@/components/custom/table-skeleton";
import { SectionError } from "@/components/shared/error-block";
import { EmptyState } from "@/components/shared/empty-state";
import { DeleteTaskDialog } from "@/components/shared/delete-task-dialog";

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

  const onSubmitHandler = async (values: Tasks) => {
    try {
      await updateTask(values);
      setOpenSheet(false);
      setSelectedTask(undefined);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpenSheet(isOpen);
    if (!isOpen) {
      setSelectedTask(undefined);
    }
  };

  const handleDelete = async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete?.task_id);
        setOpenDialog(false);
        setTaskToDelete(undefined);
      } catch (error) {
        console.log(error);
      }
    }
  };

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
        searchChange={(val) => {
          setSearchQuery(val);
        }}
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
          onView={(task) => {
            setSelectedDetailTask(task);
            setOpenDetail(true);
          }}
          onEdit={(task) => {
            setSelectedTask(task);
            setOpenSheet(true);
          }}
          onDelete={(task) => {
            setTaskToDelete(task);
            setOpenDialog(true);
          }}
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
