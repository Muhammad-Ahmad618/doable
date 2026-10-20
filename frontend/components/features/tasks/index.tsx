"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { TaskHeader } from "@/components/features/tasks/header";
import { TaskTable } from "@/components/features/tasks/taskTable";
import { TaskSheet } from "./taskSheet";
import { TaskDetailModal } from "../../custom/taskDetailModal";
import { Tasks } from "@/types/task";
import { Button } from "@/components/ui/button";
import {
  useGetAllTasks,
  useUpdateTask,
  useRemoveTask,
} from "@/hooks/user/tasks";
import { TableSkeleton } from "@/components/custom/table-skeleton";
import { SectionError } from "@/components/shared/error-block";
import { Loader2, Trash2 } from "lucide-react";

export function PersonalTasks() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

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

  return (
    <div>
      <TaskHeader />

      {isLoading ? (
        <TableSkeleton />
      ) : isError ? (
        <div className="mt-5 border rounded-xl p-2">
          <SectionError onRetry={refetch} />
        </div>
      ) : (
        <TaskTable
          data={tasks?.data || []}
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
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent className="max-w-md rounded-2xl border border-border/45 shadow-2xl shadow-black/5 p-0 overflow-hidden">
          <div className="p-6 pb-5">
            {/* Icon with a subtle ring container */}
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive ring-8 ring-destructive/5">
              <Trash2 className="h-5 w-5" />
            </div>

            <AlertDialogHeader className="space-y-1 text-left">
              <AlertDialogTitle className="text-xl font-semibold tracking-tight text-foreground">
                Delete task?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground leading-normal">
                Are you sure you want to delete this task? This action is
                permanent and cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            {/* Task Preview Card - Prevents overflow and frames the target */}
            {taskToDelete?.title && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 p-3">
                <div className="h-2 w-2 rounded-full bg-destructive shrink-0" />
                <span className="text-sm font-medium text-foreground truncate">
                  {taskToDelete.title}
                </span>
              </div>
            )}
          </div>

          <AlertDialogFooter className=" space-x-3 border-t border-border/50 bg-muted/20 px-6 py-4 gap-2 sm:gap-0">
            <AlertDialogCancel
              className="h-10 rounded-xl font-medium cursor-pointer transition-colors"
              disabled={isPendingDelete}
            >
              Cancel
            </AlertDialogCancel>

            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPendingDelete}
              className="h-10 min-w-[100px] rounded-xl font-medium cursor-pointer  transition-all"
            >
              {isPendingDelete ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete task
                </>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
