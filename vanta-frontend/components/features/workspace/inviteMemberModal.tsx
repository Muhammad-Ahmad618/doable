"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Copy, Link2, PartyPopper, UserPlus } from "lucide-react";
import { useState } from "react";

type InviteModalMode = "created" | "invite";

export function InviteMemberModal({
  open,
  setOpen,
  workspaceName,
  mode,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  workspaceName: string;
  /** "created" = celebration flow after creating a workspace, "invite" = opened from a workspace card */
  mode: InviteModalMode;
}) {
  const [copied, setCopied] = useState(false);
  const isCreatedFlow = mode === "created";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm! gap-0 p-0 overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-linear-to-r from-primary/60 via-primary to-primary/60" />

        <div className="p-6 space-y-5">
          {/* Header */}
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                {isCreatedFlow ? (
                  <PartyPopper className="w-4.5 h-4.5 text-primary" />
                ) : (
                  <UserPlus className="w-4.5 h-4.5 text-primary" />
                )}
              </div>
              <div>
                <DialogTitle className="text-base font-semibold leading-snug">
                  {isCreatedFlow ? "Workspace ready!" : "Invite members"}
                </DialogTitle>
                <p className="text-[13px] text-muted-foreground mt-0.5 font-normal">
                  {isCreatedFlow ? (
                    <>
                      <span className="text-foreground font-medium">
                        {workspaceName || "Your workspace"}
                      </span>{" "}
                      has been created.
                    </>
                  ) : (
                    <>
                      Add people to{" "}
                      <span className="text-foreground font-medium">
                        {workspaceName || "this workspace"}
                      </span>
                      .
                    </>
                  )}
                </p>
              </div>
            </div>
            <DialogDescription className="text-[13px] leading-relaxed">
              {isCreatedFlow
                ? "Invite collaborators by sharing the link below. Anyone with the link can join."
                : "Share the link below with anyone you want in this workspace. Anyone with the link can join."}
            </DialogDescription>
          </DialogHeader>

          {/* Link row */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Invite link
            </p>
            <div className="flex items-center gap-2 p-1 pl-3 rounded-xl border border-border/60 bg-muted/30 group">
              <Link2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="flex-1 text-[13px] text-muted-foreground font-mono truncate select-all">
                doable.app/join/9ABFAjkasbfka67
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    "https://doable.app/join/9ABFAjkasbfka6734JLBSFS343ANF",
                  );
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                    transition-all duration-200 flex-shrink-0
                    ${
                      copied
                        ? "bg-green-500/15 text-green-600 dark:text-green-400"
                        : "bg-primary/10 text-primary hover:bg-primary/20"
                    }
                  `}
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-1">
            <Button
              className="w-full h-9 rounded-lg text-sm font-medium cursor-pointer"
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
            {isCreatedFlow && (
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 py-1"
              >
                Skip for now
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
