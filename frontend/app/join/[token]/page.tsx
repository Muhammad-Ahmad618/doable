"use client";

import { useState } from "react";
import { JoinStatus } from "@/types/join";
import { JoinWorkspaceView } from "@/components/features/invite/joinWorkspaceView";
import {
  useIsLoggedIn,
  useGetWorkspacePreview,
} from "@/hooks/user/workspace-invite";
import { useParams } from "next/navigation";

export default function JoinPage() {
  const [status, setStatus] = useState<JoinStatus>("ready");

  const params = useParams();
  const token = params.token;
  const { data: isLoggedIn } = useIsLoggedIn();
  const {
    data: workspacePreview,
    isError,
    isLoading,
    error,
    refetch,
  } = useGetWorkspacePreview(token as string);
  return (
    <JoinWorkspaceView
      status={status}
      invite={workspacePreview}
      isLoggedIn={Boolean(isLoggedIn)}
      errorMessage={error?.message}
      previewError={isError}
      previewLoading={isLoading}
      onRetry={() => refetch()}
      onJoin={() => setStatus("joining")}
      onSignUp={() => {}}
      onLogin={() => {}}
      onDecline={() => {}}
      onContinue={() => {}}
    />
  );
}
