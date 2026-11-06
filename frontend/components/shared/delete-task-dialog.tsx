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
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskTitle?: string;
  isPending: boolean;
  onConfirm: () => void;
}

export function DeleteTaskDialog({
  open,
  onOpenChange,
  taskTitle,
  isPending,
  onConfirm,
}: DeleteTaskDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md rounded-2xl border border-border/45 shadow-2xl shadow-black/5 p-0 overflow-hidden">
        <div className="p-6 pb-5">
          {/* Icon */}
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

          {/* Task preview */}
          {taskTitle && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 p-3">
              <div className="h-2 w-2 rounded-full bg-destructive shrink-0" />
              <span className="text-sm font-medium text-foreground truncate">
                {taskTitle}
              </span>
            </div>
          )}
        </div>

        <AlertDialogFooter className="space-x-3 border-t border-border/50 bg-muted/20 px-6 py-4 gap-2 sm:gap-0">
          <AlertDialogCancel
            className="h-10 rounded-xl font-medium cursor-pointer transition-colors"
            disabled={isPending}
          >
            Cancel
          </AlertDialogCancel>

          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
            className="h-10 min-w-[100px] rounded-xl font-medium cursor-pointer transition-all"
          >
            {isPending ? (
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
  );
}

