export type JoinStatus = "ready" | "joining" | "success" | "error";

export type InvitePreview = {
  workspaceName: string;
  logo_url?: string | null;
  member_count: number;
  member_avatars?: (string | null)[];
};

export type JoinViewProps = {
  status: JoinStatus;
  invite?: InvitePreview | null;
  isLoggedIn?: boolean;
  errorMessage?: string;
  previewError?: boolean;
  previewLoading?: boolean;
  onJoin: () => void;
  onSignUp: () => void;
  onLogin: () => void;
  onDecline: () => void;
  onContinue: () => void;
  onRetry?: () => void;
};
