"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TriangleAlert, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDeleteMyAccount } from "@/hooks/user/settings";

const CONFIRMATION_TEXT = "delete account";

export function DeleteAccountModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [value, setValue] = useState("");
  const deleteAccountMutation = useDeleteMyAccount();

  const isMatch = value.toLowerCase() === CONFIRMATION_TEXT;

  const handleClose = () => {
    if (deleteAccountMutation.isPending) return;
    setValue("");
    setOpen(false);
  };

  const handleDelete = () => {
    if (!isMatch || deleteAccountMutation.isPending) return;

    deleteAccountMutation.mutate(undefined, {
      onSuccess: () => handleClose(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-105! gap-0 overflow-hidden rounded-2xl border-border p-0 shadow-2xl">
        {/* Dialog header */}
        <div className="border-b border-destructive/15 bg-destructive/4 px-6 pb-5 pt-6">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-destructive/15 bg-destructive/10">
            <Trash2 className="h-5 w-5 text-destructive" />
          </div>

          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="text-lg font-semibold tracking-tight">
              Delete your account?
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              This will permanently erase your account and everything associated
              with it. This action cannot be reversed.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 p-6">
          {/* Warning */}
          <div className="flex gap-3 rounded-xl border border-destructive/15 bg-destructive/4 p-3.5">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-foreground">
                What will be deleted?
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Your tasks, workspaces, account settings, and associated data.
                Workspaces you own will also be removed for all members.
              </p>
            </div>
          </div>

          {/* Confirmation */}
          <div className="space-y-2.5">
            <Label className="text-xs font-medium">
              To confirm, type{" "}
              <span className="rounded-md bg-muted px-1.5 py-1 font-mono text-foreground">
                {CONFIRMATION_TEXT}
              </span>
            </Label>

            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter confirmation text"
              disabled={deleteAccountMutation.isPending}
              className={`h-11 rounded-xl bg-muted/30 text-sm ${
                value && !isMatch
                  ? "border-destructive focus-visible:ring-destructive/20"
                  : ""
              }`}
            />

            {value && !isMatch && (
              <p className="text-xs text-destructive">
                The confirmation text doesn&apos;t match.
              </p>
            )}

            {isMatch && (
              <p className="text-xs text-emerald-600 dark:text-emerald-500">
                Confirmation text matches.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 border-t border-border pt-4">
            <Button
              variant="destructive"
              disabled={!isMatch || deleteAccountMutation.isPending}
              onClick={handleDelete}
              className="h-10 w-full cursor-pointer rounded-xl font-medium"
            >
              {deleteAccountMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting account...
                </>
              ) : (
                "Permanently delete account"
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              disabled={deleteAccountMutation.isPending}
              onClick={handleClose}
              className="h-10 w-full cursor-pointer rounded-xl text-muted-foreground"
            >
              Keep my account
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DangerZone() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-destructive/20 bg-card">
        {/* Header */}
        <div className="border-b border-destructive/15 bg-destructive/[0.035] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-destructive">
              Danger zone
            </h3>
            <span className="rounded-full border border-destructive/20 bg-destructive/5 px-2 py-0.5 text-[10px] font-medium text-destructive">
              Irreversible
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Destructive actions that permanently affect your account.
          </p>
        </div>

        {/* Delete account row */}
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
              <Trash2 className="h-4 w-4 text-destructive" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Delete account
              </p>
              <p className="mt-1 max-w-lg text-xs leading-relaxed text-muted-foreground">
                Permanently delete your account, tasks, workspaces, and all
                associated data.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(true)}
            className="h-9 shrink-0 cursor-pointer rounded-lg border-destructive/30 px-4 text-xs font-medium text-destructive hover:border-destructive hover:bg-destructive hover:text-white"
          >
            Delete account
          </Button>
        </div>
      </div>

      <DeleteAccountModal open={isOpen} setOpen={setIsOpen} />
    </>
  );
}
