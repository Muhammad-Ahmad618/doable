"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import type { Workspace } from "@/types/workspace";
import { WorkspaceCard } from "./workspaceCard";
import { Button } from "@/components/ui/button";
import { useGetMyWorkspaces, useLeaveWorkspace } from "@/hooks/user/workspace";
import { WorkspaceCardSkeleton } from "@/components/custom/workspace-card-skeleton";
import { SectionError } from "@/components/shared/error-block";
import { InviteMemberModal } from "./inviteMemberModal";
import {
  AlertCircle,
  BriefcaseBusiness,
  Loader2,
  LogOut,
  TriangleAlert,
} from "lucide-react";
import { getApiErrorMessage } from "@/lib/api-error";

export function WorkspaceList() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [workspaceToLeave, setWorkspaceToLeave] = useState<Workspace | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [workspaceToInvite, setWorkspaceToInvite] = useState<Workspace | null>(
    null,
  );

  const {
    data: workspaces,
    isLoading,
    isError,
    refetch,
  } = useGetMyWorkspaces();
  const { mutateAsync: leaveWorkspace, isPending } = useLeaveWorkspace();

  // The API rejects the request for owners: they have to transfer
  // ownership (or delete the workspace) before they can leave.
  const isOwner = workspaceToLeave?.role === "owner";

  const handleLeaveClick = (workspace: Workspace) => {
    setErrorMessage(null);
    setWorkspaceToLeave(workspace);
    setOpenDialog(true);
  };

  const handleInviteClick = (workspace: Workspace) => {
    setWorkspaceToInvite(workspace);
  };

  const handleInviteOpenChange = (open: boolean) => {
    if (!open) setWorkspaceToInvite(null);
  };

  const handleOpenChange = (open: boolean) => {
    setOpenDialog(open);
    if (!open) {
      setErrorMessage(null);
      setWorkspaceToLeave(null);
    }
  };

  const handleLeave = async () => {
    if (!workspaceToLeave) return;

    setErrorMessage(null);

    try {
      await leaveWorkspace(workspaceToLeave.id);
      setOpenDialog(false);
      setWorkspaceToLeave(null);
    } catch (error) {
      // Show the API's message inside the dialog, e.g.
      // "You are the owner. Transfer ownership or delete the workspace before leaving."
      setErrorMessage(
        getApiErrorMessage(error, "Failed to leave the workspace."),
      );
    }
  };

  return (
    <>
      <div className="my-5">
        {isLoading ? (
          <WorkspaceCardSkeleton />
        ) : isError ? (
          <div className="rounded-xl border p-2">
            <SectionError onRetry={refetch} />
          </div>
        ) : workspaces && workspaces.length > 0 ? (
          <div className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {workspaces.map((workspace) => (
              <WorkspaceCard
                key={workspace.id}
                workspace={workspace}
                onLeave={handleLeaveClick}
                onInvite={handleInviteClick}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <BriefcaseBusiness className="size-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">No workspaces yet</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Create a workspace to start organizing your tasks with your team.
            </p>
          </div>
        )}
      </div>

      <AlertDialog open={openDialog} onOpenChange={handleOpenChange}>
        <AlertDialogContent className="rounded-xl sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogMedia className="rounded-full bg-destructive/10 text-destructive">
              <LogOut className="size-5" />
            </AlertDialogMedia>
            <AlertDialogTitle>Leave {workspaceToLeave?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              You will immediately lose access to this workspace&apos;s tasks
              and members. You&apos;ll need a new invite to join it again.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Shown only for the owner: the API rejects the leave request */}
          {isOwner && (
            <div className="flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                  You are the owner of this workspace
                </p>
                <p className="text-xs leading-relaxed text-amber-600/90 dark:text-amber-400/90">
                  Owners can&apos;t leave directly. Transfer ownership to
                  another member or delete the workspace before leaving.
                </p>
              </div>
            </div>
          )}

          {/* The exact message returned by the API */}
          {errorMessage && (
            <div
              role="alert"
              className="flex gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
              <p className="text-xs leading-relaxed text-destructive">
                {errorMessage}
              </p>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isPending}
              className="rounded-md cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleLeave}
              disabled={isPending}
              className="rounded-md cursor-pointer"
            >
              {isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 size-4" />
              )}
              Leave workspace
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <InviteMemberModal
        open={Boolean(workspaceToInvite)}
        setOpen={handleInviteOpenChange}
        workspaceId={workspaceToInvite?.id ?? 0}
        workspaceName={workspaceToInvite?.name ?? ""}
        mode="invite"
      />
    </>
  );
}
