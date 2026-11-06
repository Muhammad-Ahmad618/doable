"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  EllipsisVertical,
  Info,
  CalendarDays,
  Inbox,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusLabel } from "@/components/shared/status-label";
import { recentTasks } from "@/types/dashboard";
import { formatDate } from "@/lib/dateFormater";
import { useRemoveTask } from "@/hooks/user/tasks";
import { DeleteTaskDialog } from "@/components/shared/delete-task-dialog";

/* ---------- small helpers ---------- */

const priorityStyle: Record<string, { pill: string; dot: string }> = {
  high: {
    pill: "bg-red-500/10 text-red-600 ring-red-500/20 dark:text-red-400",
    dot: "bg-red-500 dark:bg-red-400",
  },
  medium: {
    pill: "bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400",
    dot: "bg-amber-500 dark:bg-amber-400",
  },
  low: {
    pill: "bg-slate-500/10 text-slate-600 ring-slate-500/20 dark:text-slate-400",
    dot: "bg-slate-400 dark:bg-slate-500",
  },
};

function PriorityPill({ priority }: { priority: string }) {
  const s = priorityStyle[priority] ?? priorityStyle.low;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ring-1 ring-inset ${s.pill}`}
    >
      <span className={`size-1.5 rounded-full ${s.dot}`} />
      {priority}
    </span>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

function Assignee({ name }: { name?: string | null }) {
  if (!name) {
    return <span className="text-xs text-muted-foreground/70">Unassigned</span>;
  }
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary ring-1 ring-inset ring-primary/20">
        {getInitials(name)}
      </span>
      <span className="truncate text-sm">{name}</span>
    </div>
  );
}

/* ---------- main component ---------- */

export function RecentTaskTable({
  tasks,
  onView,
}: {
  tasks: recentTasks[];
  onView: (task: recentTasks) => void;
}) {
  const { mutateAsync: deleteTask, isPending: isPendingDelete } =
    useRemoveTask();

  const [openDialog, setOpenDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<recentTasks | undefined>(
    undefined,
  );

  const handleDelete = async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete.task_id);
        setOpenDialog(false);
        setTaskToDelete(undefined);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border/50 bg-linear-to-b from-card to-muted/20
        shadow-[0_1px_2px_rgba(15,23,42,0.06),0_4px_12px_rgba(15,23,42,0.06),0_12px_28px_-8px_rgba(15,23,42,0.10)]
        dark:to-card/60
        dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_8px_24px_rgba(0,0,0,0.35)]"
    >
      {/* thin light line on the top edge */}
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-white/70 to-transparent dark:via-white/15" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-6 py-5">
        <div>
          <h2 className="text-base text-foreground font-semibold tracking-tight">
            Recent Tasks
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Latest activity across your workspaces
          </p>
        </div>

        {tasks.length > 0 && (
          <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold tabular-nums text-muted-foreground ring-1 ring-inset ring-border/60">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </span>
        )}
      </div>

      {tasks.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center gap-3 border-t border-border/50 px-6 py-14 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-muted ring-1 ring-inset ring-border/60">
            <Inbox className="size-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">No recent tasks</p>
            <p className="mt-1 text-xs text-muted-foreground">
              New tasks will show up here.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto border-t border-border/50">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 bg-muted/30 hover:bg-muted/30">
                {[
                  ["Id", "px-6 w-16"],
                  ["Title", "px-4"],
                  ["Priority", "px-4"],
                  ["Due Date", "px-4"],
                  ["Assignee", "px-4"],
                  ["Workspace", "px-4"],
                  ["Status", "px-4"],
                ].map(([label, cls]) => (
                  <TableHead
                    key={label}
                    className={`h-10 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground ${cls}`}
                  >
                    {label}
                  </TableHead>
                ))}
                <TableHead className="h-10 pr-6 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {tasks.map((task, idx) => (
                <TableRow
                  key={idx}
                  onClick={() => onView(task)}
                  className="group cursor-pointer border-border/40 transition-colors hover:bg-muted/40 dark:hover:bg-white/4"
                >
                  <TableCell className="px-6 py-4 text-xs font-medium tabular-nums text-muted-foreground">
                    {String(idx + 1).padStart(2, "0")}
                  </TableCell>

                  <TableCell className="max-w-65 px-4 py-4">
                    <p className="truncate text-sm font-medium text-foreground">
                      {task.title}
                    </p>
                  </TableCell>

                  <TableCell className="px-4 py-4">
                    <PriorityPill priority={task.priority} />
                  </TableCell>

                  <TableCell className="px-4 py-4">
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <CalendarDays className="size-3.5 shrink-0" />
                      {formatDate(task.due_date)}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-4">
                    <Assignee name={task.assignee_name} />
                  </TableCell>

                  <TableCell className="px-4 py-4">
                    {task.workspace_name ? (
                      <span className="inline-flex max-w-40 items-center rounded-md bg-muted/60 px-2 py-1 text-xs font-medium text-foreground/80 ring-1 ring-inset ring-border/60">
                        <span className="truncate">{task.workspace_name}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground/70">
                        No workspace
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="px-4 py-4 text-foreground">
                    <StatusLabel status={task?.status || "pending"} />
                  </TableCell>

                  <TableCell
                    className="py-4 pr-6 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-muted-foreground opacity-60 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100 data-[state=open]:bg-muted data-[state=open]:opacity-100"
                        >
                          <EllipsisVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-44 max-w-full rounded-xl p-1.5 shadow-lg"
                      >
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => onView(task)}
                            className="rounded-lg"
                          >
                            <Info className="mr-2 size-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setTaskToDelete(task);
                              setOpenDialog(true);
                            }}
                            variant="destructive"
                            className="rounded-lg"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Task
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

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
