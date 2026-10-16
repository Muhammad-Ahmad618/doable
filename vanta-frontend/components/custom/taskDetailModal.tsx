"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Tasks, Priority, Status } from "@/types/task";
import {
  Send,
  Calendar,
  User,
  Briefcase,
  MessageSquare,
  AlertCircle,
  InboxIcon,
} from "lucide-react";
import { TaskDetailModalProps } from "@/types/task";
import { getPriorityColor } from "./priority-color";
import { getStatusIcon } from "./status-icon";
import { NoDataBlock } from "../shared/no-data-block";
import { AiTaskBreakDown } from "./task-break-down";
import {
  useUpdateTaskStatus,
  useUpdateTaskDueDate,
  useUpdatePriority,
} from "@/hooks/user/tasks";
import {
  useCreateTaskComment,
  useGetTaskComments,
} from "@/hooks/user/task-comments";
import { formatDate } from "@/lib/dateFormater";

export function TaskDetailModal({
  open,
  onOpenChange,
  task,
}: TaskDetailModalProps) {
  // Local task state to enable editing
  const [localTask, setLocalTask] = useState<Tasks | undefined>(task);
  const [newComment, setNewComment] = useState("");

  const { mutateAsync: updateTaskStatus } = useUpdateTaskStatus();
  const { mutate: updateTaskDueDate } = useUpdateTaskDueDate();
  const { mutateAsync: updateTaskPriority } = useUpdatePriority();
  const { mutateAsync: createTaskComment } = useCreateTaskComment();
  const {
    data: comments,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
  } = useGetTaskComments(localTask?.task_id);

  if (!localTask) return null;

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await createTaskComment({
        task_id: localTask?.task_id,
        content: newComment.trim(),
      });
      setNewComment("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusUpdate = async (status: Status) => {
    if (localTask) {
      // Optimistically update local state so the dropdown reflects the change immediately
      setLocalTask((prev) => (prev ? { ...prev, status } : prev));
      try {
        await updateTaskStatus({
          task_id: localTask.task_id,
          status,
        });
      } catch {
        // Revert optimistic update on failure
        setLocalTask((prev) =>
          prev ? { ...prev, status: localTask.status } : prev,
        );
      }
    }
  };

  const handleDueDate = (due_date: string) => {
    setLocalTask((prev) => (prev ? { ...prev, due_date } : prev));
    try {
      updateTaskDueDate({
        task_id: localTask.task_id,
        due_date: due_date,
      });
    } catch {
      setLocalTask((prev) =>
        prev ? { ...prev, due_date: localTask.due_date } : prev,
      );
    }
  };

  const handleUpdatePriority = (priority: Priority) => {
    setLocalTask((prev) => (prev ? { ...prev, priority } : prev));

    try {
      updateTaskPriority({
        task_id: localTask.task_id,
        priority: priority,
      });
    } catch {
      setLocalTask((prev) =>
        prev ? { ...prev, priority: localTask.priority } : prev,
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-7xl h-[90vh] p-0 flex flex-col rounded-xl overflow-hidden border border-border">
        {/* Main Header / Topbar */}
        <DialogTitle>
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
            <div className="flex items-center gap-2.5">
              <Badge
                variant="outline"
                className="font-mono text-xs px-2 py-0.5 border-primary/20 text-primary bg-primary/5 rounded-md"
              >
                {localTask.task_id}
              </Badge>
              <span className="text-xs text-muted-foreground">/</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground/70" />
                {localTask.workspace || "General Tasks"}
              </span>
            </div>
          </div>
        </DialogTitle>
        {/* Modal Columns Grid */}
        <div className="grid grid-cols-10 flex-1 overflow-hidden">
          {/* Left Panel: 70% (col-span-7) */}
          <div className="col-span-7 p-6 overflow-y-auto flex flex-col gap-6 border-r border-border h-full bg-card">
            {/* Title Section */}
            <div className="space-y-1">
              <h1 className="text-2xl font-bold border-none outline-none focus:ring-0 w-full bg-transparent p-0 font-heading text-foreground">
                {localTask.title}
              </h1>
            </div>

            {/* Description Section */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                Description
              </label>
              <div className="text-sm bg-muted/20 hover:bg-muted/30 focus:bg-background border border-border/40 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 w-full min-h-[90px] rounded-lg p-3 text-foreground transition-all outline-none">
                {localTask.description}
              </div>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-4 border-y border-border/60">
              {/* Status */}
              <div className="flex items-center gap-4">
                <span className="w-20 text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  Status
                </span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="relative flex-1">
                    <select
                      name="status"
                      value={localTask?.status || "pending"}
                      onChange={(e) =>
                        handleStatusUpdate(e.target.value as Status)
                      }
                      className="w-full h-9 rounded-md border border-border/80 px-2.5 bg-background text-xs font-medium focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none cursor-pointer appearance-none transition"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1.5">
                      {getStatusIcon(localTask.status || "pending")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Due Date */}
              <div className="flex items-center gap-4">
                <span className="w-20 text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" />
                  Due Date
                </span>
                <div className="flex-1">
                  <input
                    name="due_date"
                    type="date"
                    value={localTask?.due_date?.slice(0, 10) ?? ""}
                    onChange={(e) => handleDueDate(e.target.value)}
                    className="w-full h-9 rounded-md border border-border/80 px-2.5 bg-background text-xs focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none cursor-pointer transition"
                  />
                </div>
              </div>

              {/* Priority */}
              <div className="flex items-center gap-4">
                <span className="w-20 text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  Priority
                </span>
                <div className="flex-1">
                  <select
                    value={localTask.priority}
                    onChange={(e) =>
                      handleUpdatePriority(e.target.value as Priority)
                    }
                    className={`w-full h-9 rounded-md border px-2.5 bg-background text-xs font-semibold focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none cursor-pointer transition  ${getPriorityColor(localTask.priority)}`}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Assignee */}
              <div className="flex items-center gap-4">
                <span className="w-20 text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground/60" />
                  Assignee
                </span>
                <div className="flex-1">
                  <select
                    defaultValue={localTask.assignee || ""}
                    disabled
                    className="w-full h-9 rounded-md border border-border/80 px-2.5 bg-background text-xs focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none cursor-pointer transition disabled:cursor-not-allowed disabled:bg-muted-foreground/5 text-muted-foreground/60"
                  >
                    <option value="">Unassigned</option>
                    <option value="James Smith">James Smith</option>
                    <option value="Eddie Lake">Eddie Lake</option>
                    <option value="Sarah Chen">Sarah Chen</option>
                  </select>
                </div>
              </div>

              {/* Workspace Selector */}
              <div className="flex items-center gap-4 col-span-2">
                <span className="w-20 text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  Workspace
                </span>
                <div className="flex-1">
                  <select
                    defaultValue={localTask.workspace || ""}
                    disabled
                    className="w-full h-9 rounded-md border border-border/80 px-2.5 bg-background text-xs focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none cursor-pointer transition disabled:cursor-not-allowed disabled:bg-muted-foreground/5 text-muted-foreground/60"
                  >
                    <option value="">No Workspace</option>
                    <option value="Workspace 1">Workspace 1</option>
                    <option value="Workspace 2">Workspace 2</option>
                  </select>
                </div>
              </div>
            </div>

            {/* AI Task Breakdown Section */}
            <AiTaskBreakDown task_id={localTask?.task_id || 0} />
          </div>

          {/* Right Panel: 30% Comment Section (col-span-3) */}
          <div className="col-span-3 bg-muted/15 flex flex-col h-full overflow-hidden">
            {/* Comments Header */}
            <div className="px-5 py-4 border-b border-border bg-muted/20 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Comments
              </h3>
              <Badge
                variant="secondary"
                className="h-5 min-w-5 flex items-center justify-center p-0 text-[10px] rounded-full"
              >
                {comments?.length || 0}
              </Badge>
            </div>

            {/* Scrollable Comment List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Loading skeleton */}
              {isCommentsLoading && (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-card border border-border/50 rounded-xl p-3 space-y-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-7 w-7 rounded-full shrink-0" />
                        <div className="flex-1 space-y-1.5">
                          <Skeleton className="h-2.5 w-24 rounded-full" />
                        </div>
                        <Skeleton className="h-2 w-10 rounded-full" />
                      </div>
                      <div className="pl-9 space-y-1.5">
                        <Skeleton className="h-2 w-full rounded-full" />
                        <Skeleton className="h-2 w-4/5 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Error state */}
              {!isCommentsLoading && isCommentsError && (
                <div className="flex flex-col items-center justify-center h-full gap-3 py-10 text-center">
                  <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Failed to load comments
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Please try again later.
                    </p>
                  </div>
                </div>
              )}
              {/* Empty state */}
              {!isCommentsLoading &&
                !isCommentsError &&
                comments?.length === 0 && (
                  <NoDataBlock
                    heading="No comments yet"
                    subtext=" Be the first to leave a comment."
                  />
                )}
              {/* Comment list — oldest first */}
              {!isCommentsLoading &&
                !isCommentsError &&
                comments?.map((comment) => (
                  <div
                    key={comment.id}
                    className="space-y-1 bg-card border border-border/50 rounded-xl p-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                          {comment.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-foreground truncate">
                          {comment?.name}
                        </h4>
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0 font-medium">
                        {formatDate(comment?.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground/90 pl-8 leading-relaxed whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                ))}
            </div>

            {/* Comment Form Pinned at the bottom */}
            <div className="p-4 border-t border-border bg-card">
              <form onSubmit={handleAddComment} className="space-y-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full text-xs p-2.5 rounded-lg border border-border/80 bg-background resize-none h-18 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none text-foreground"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment(e);
                    }
                  }}
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    className="h-8 px-3 rounded-lg text-xs font-semibold gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Send className="h-3 w-3" />
                    Comment
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
