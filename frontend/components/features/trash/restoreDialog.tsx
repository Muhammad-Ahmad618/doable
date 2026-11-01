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
import { RotateCcw, Loader2 } from "lucide-react";
import { RestoreDialogProps } from "@/types/trash";

export function RestoreDialog({
  open,
  onOpenChange,
  task,
  onConfirm,
  isPending = false,
}: RestoreDialogProps) {
  if (!task) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md rounded-2xl border border-border/70 shadow-2xl p-0 overflow-hidden">
        <div className="p-6 pb-5">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-8 ring-primary/5">
            <RotateCcw className="h-5 w-5" />
          </div>

          <AlertDialogHeader className="space-y-1 text-left">
            <AlertDialogTitle className="text-xl font-semibold tracking-tight text-foreground">
              Restore task?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground leading-normal">
              This task will be restored to your active task list with all its original details preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {task.title && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 p-3">
              <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
              <span className="text-sm font-medium text-foreground truncate">
                {task.title}
              </span>
            </div>
          )}
        </div>

        <AlertDialogFooter className="border-t border-border/50 bg-muted/20 px-6 py-4 gap-2 sm:gap-2.5">
          <AlertDialogCancel
            className="h-9 rounded-xl font-medium cursor-pointer"
            disabled={isPending}
          >
            Cancel
          </AlertDialogCancel>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="h-9 min-w-[110px] rounded-xl font-medium cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Restoring...
              </>
            ) : (
              <>
                <RotateCcw className="mr-2 h-4 w-4" />
                Restore task
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

