"use client";

import { JoinWorkspaceView } from "@/components/features/invite/joinWorkspaceView";
import {
  useIsLoggedIn,
  useGetWorkspacePreview,
  useJoinWorkspace,
} from "@/hooks/user/workspace-invite";
import { useParams, useRouter } from "next/navigation";
import { getApiErrorMessage } from "@/lib/api-error";
import useAuthStore from "@/context/authStore";

export default function JoinPage() {
  const router = useRouter();
  const params = useParams();
  const token = (params?.token as string) ?? "";

  const user = useAuthStore((state) => state.user);
  const { data: loggedInUser } = useIsLoggedIn();
  const isLoggedIn = Boolean(user || loggedInUser);

  const {
    data: workspacePreview,
    isError: isPreviewError,
    isLoading: isPreviewLoading,
    error: previewError,
    refetch: refetchPreview,
  } = useGetWorkspacePreview(token);

  const {
    mutateAsync: joinWorkspace,
    isPending: isJoining,
    isError: isJoinError,
    isSuccess: isJoinSuccess,
    error: joinError,
    reset: resetJoin,
  } = useJoinWorkspace();

  const handleJoinWorkspace = async (tokenToJoin?: string) => {
    const targetToken = tokenToJoin || token;
    if (!targetToken) return;
    await joinWorkspace(targetToken);
  };

  const handleRetry = () => {
    if (isJoinError) {
      resetJoin();
      handleJoinWorkspace(token);
    } else {
      refetchPreview();
    }
  };

  const redirect = encodeURIComponent(`/join/${token}`);
  const errorMessage = isJoinError
    ? getApiErrorMessage(
        joinError,
        "Failed to join workspace. Please try again.",
      )
    : getApiErrorMessage(
        previewError,
        "This invite link is invalid, expired, or has already been used.",
      );

  return (
    <JoinWorkspaceView
      isJoining={isJoining}
      isSuccess={isJoinSuccess}
      joinError={isJoinError}
      invite={workspacePreview}
      isLoggedIn={isLoggedIn}
      errorMessage={errorMessage}
      previewError={isPreviewError}
      previewLoading={isPreviewLoading}
      onRetry={handleRetry}
      onJoin={(targetToken) => handleJoinWorkspace(targetToken)}
      onSignUp={() => router.push(`/register?redirect=${redirect}`)}
      onLogin={() => router.push(`/login?redirect=${redirect}`)}
      onDecline={() => router.push("/")}
      onContinue={() => router.push("/workspace")}
    />
  );
}
