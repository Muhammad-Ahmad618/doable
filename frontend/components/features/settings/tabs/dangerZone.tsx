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
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const CONFIRMATION_TEXT = "delete account";

export function DeleteAccountModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [value, setValue] = useState("");

  const isMatch = value.toLowerCase() === CONFIRMATION_TEXT;

  const handleClose = () => {
    setValue("");
    setOpen(false);
  };

  const handleDelete = () => {
    if (!isMatch) return;
    // call DELETE /api/users/me here
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm! gap-0 p-0 overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-destructive/60 via-destructive to-destructive/60" />

        <div className="p-6 space-y-5">
          {/* Header */}
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <TriangleAlert className="w-4 h-4 text-destructive" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold leading-snug">
                  Delete account
                </DialogTitle>
                <p className="text-[13px] text-muted-foreground mt-0.5 font-normal">
                  This action is permanent and cannot be undone.
                </p>
              </div>
            </div>
            <DialogDescription className="text-[13px] leading-relaxed">
              All your tasks, workspaces, and settings will be permanently
              deleted. Workspaces you own will also be removed for all members.
            </DialogDescription>
          </DialogHeader>

          {/* Confirmation input */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Type{" "}
              <span className="font-mono text-foreground">
                {CONFIRMATION_TEXT}
              </span>{" "}
              to confirm
            </Label>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={CONFIRMATION_TEXT}
              className={`h-10 rounded-lg text-sm transition-colors ${
                value && !isMatch
                  ? "border-destructive/50 focus-visible:ring-destructive/30"
                  : ""
              }`}
            />
            {value && !isMatch && (
              <p className="text-xs text-destructive">Text does not match</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-1">
            <Button
              variant="destructive"
              disabled={!isMatch}
              onClick={handleDelete}
              className="w-full h-9 rounded-lg text-sm font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Permanently delete account
            </Button>
            <button
              type="button"
              onClick={handleClose}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 py-1 cursor-pointer"
            >
              Cancel, keep my account
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DangerZone() {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="px-6 py-5 border-b border-destructive/20">
          <h3 className="text-base font-semibold text-destructive">
            Danger zone
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            These actions are permanent and cannot be undone.
          </p>
        </div>

        <div className="flex items-center justify-between gap-6 px-6 py-5">
          <div>
            <p className="text-sm font-medium text-foreground">
              Delete account
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Permanently delete your account and all associated data including
              tasks, workspaces, and settings.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="rounded-md cursor-pointer shrink-0 text-destructive border-destructive/40 hover:bg-destructive hover:text-white"
            onClick={handleDelete}
          >
            Delete account
          </Button>
        </div>
      </div>

      <DeleteAccountModal open={isOpen} setOpen={setIsOpen} />
    </>
  );
}
