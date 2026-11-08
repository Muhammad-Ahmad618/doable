export type JoinStatus = "ready" | "joining" | "success" | "error";

export type InvitePreview = {
  workspaceName: string;
  logo_url?: string | null;
  member_count: number;
  member_avatars?: (string | null)[];
};

export type JoinViewProps = {
  status?: boolean;
  isJoining?: boolean;
  isSuccess?: boolean;
  joinError?: boolean;
  invite?: InvitePreview | null;
  isLoggedIn?: boolean;
  errorMessage?: string;
  previewError?: boolean;
  previewLoading?: boolean;
  onJoin: (token?: string) => void;
  onSignUp: () => void;
  onLogin: () => void;
  onDecline: () => void;
  onContinue: () => void;
  onRetry?: () => void;
};

export interface joinErrorProps {
  joinError: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  onContinue: () => void;
}

export interface joinWorkspaceResponse {
  message: string;
  data: {
    workspace_id: string;
  };
}
