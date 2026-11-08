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
import { Trash2 } from "lucide-react";

interface DeleteInboxDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  count?: number;
  isAll?: boolean;
  onConfirm: () => void;
}

export function DeleteInboxDialog({
  open,
  onOpenChange,
  title,
  count = 1,
  isAll = false,
  onConfirm,
}: DeleteInboxDialogProps) {
  const dialogTitle = isAll
    ? "Clear all notifications?"
    : count > 1
      ? `Delete ${count} notifications?`
      : "Delete notification?";

  const dialogDescription = isAll
    ? "Are you sure you want to remove all notifications from your inbox? This action cannot be undone."
    : count > 1
      ? `Are you sure you want to delete these ${count} selected notifications? This action cannot be undone.`
      : "Are you sure you want to delete this notification? This action cannot be undone.";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md rounded-2xl border border-border/45 shadow-2xl shadow-black/5 p-0 overflow-hidden">
        <div className="p-6 pb-5">
          {/* Icon */}
          <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive ring-8 ring-destructive/5">
            <Trash2 className="size-5" />
          </div>

          <AlertDialogHeader className="space-y-1 text-left">
            <AlertDialogTitle className="text-xl font-semibold tracking-tight text-foreground">
              {dialogTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground leading-normal">
              {dialogDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Single preview card if applicable */}
          {!isAll && count === 1 && title && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 p-3">
              <div className="size-2 rounded-full bg-destructive shrink-0" />
              <span className="text-sm font-medium text-foreground truncate">
                {title}
              </span>
            </div>
          )}
        </div>

        <AlertDialogFooter className="space-x-3 border-t border-border/50 bg-muted/20 px-6 py-4 gap-2 sm:gap-0">
          <AlertDialogCancel className="h-10 rounded-xl font-medium cursor-pointer transition-colors">
            Cancel
          </AlertDialogCancel>

          <Button
            variant="destructive"
            onClick={onConfirm}
            className="h-10 min-w-28 rounded-xl font-medium cursor-pointer transition-all"
          >
            <Trash2 className="mr-2 size-4" />
            {isAll ? "Clear all" : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

