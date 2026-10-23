"use client";

import {
  CheckCircle2,
  Loader2,
  ArrowRight,
  UserPlus,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarGroup,
} from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { JoinViewProps } from "@/types/join";

const GRADIENTS = [
  "from-blue-600 via-indigo-600 to-violet-700",
  "from-emerald-500 via-teal-600 to-cyan-700",
  "from-amber-500 via-orange-600 to-rose-600",
  "from-violet-600 via-purple-600 to-fuchsia-700",
  "from-sky-500 via-blue-600 to-indigo-700",
  "from-rose-500 via-pink-600 to-purple-700",
];

const getGradient = (name?: string) => {
  if (!name) return GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % 1000;
  }
  return GRADIENTS[hash % GRADIENTS.length];
};

/**
 * High-fidelity loading skeleton matching the workspace invite card layout.
 */
export function JoinWorkspaceSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-card/90 shadow-2xl backdrop-blur-xl ring-1 ring-border/60 transition-all">
      {/* Workspace Header Banner skeleton */}
      <div className="relative h-28 w-full overflow-hidden bg-muted/40">
        <Skeleton className="size-full rounded-none bg-linear-to-r from-muted/50 via-muted/30 to-muted/60" />
        <div className="absolute bottom-2 right-3">
          <Skeleton className="h-5 w-28 rounded-full bg-card/60 backdrop-blur-sm" />
        </div>
      </div>

      <div className="px-6 pb-6">
        {/* Logo overlapping the banner skeleton */}
        <div className="-mt-12 flex justify-center">
          <div className="rounded-2xl ring-4 ring-card shadow-xl">
            <Skeleton className="size-24 rounded-2xl bg-muted" />
          </div>
        </div>

        {/* Heading & Invitation Note skeleton */}
        <div className="mt-4 flex flex-col items-center text-center">
          <Skeleton className="h-5 w-32 rounded-full bg-muted/80" />
          <Skeleton className="mt-2.5 h-8 w-52 rounded-xl bg-muted sm:w-60" />
        </div>

        {/* Member avatars box skeleton */}
        <div className="mt-6 flex flex-col items-center justify-center gap-2.5 rounded-xl bg-muted/40 p-3 ring-1 ring-border/50">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <Skeleton className="size-8 rounded-full ring-2 ring-card bg-muted/80" />
              <Skeleton className="size-8 rounded-full ring-2 ring-card bg-muted/80" />
              <Skeleton className="size-8 rounded-full ring-2 ring-card bg-muted/80" />
            </div>
            <Skeleton className="h-4 w-28 rounded-md bg-muted/80" />
          </div>
          <Skeleton className="h-3 w-44 rounded-md bg-muted/60" />
        </div>

        {/* Action buttons skeleton */}
        <div className="mt-6 space-y-2.5">
          <Skeleton className="h-12 w-full rounded-xl bg-muted" />
          <Skeleton className="h-10 w-full rounded-xl bg-muted/60" />
        </div>
      </div>
    </div>
  );
}

export function JoinWorkspaceView({
  status,
  invite,
  isLoggedIn = false,
  errorMessage,
  previewError = false,
  previewLoading = false,
  onJoin,
  onSignUp,
  onLogin,
  onDecline,
  onContinue,
  onRetry,
}: JoinViewProps) {
  const isLoadingState =
    previewLoading || (!invite && !previewError && status !== "error");
  const isErrorState =
    previewError ||
    status === "error" ||
    (!isLoadingState && !invite && status !== "success");

  const initials = invite?.workspaceName
    ? invite.workspaceName.slice(0, 2).toUpperCase()
    : "WS";
  const avatars = invite?.member_avatars ?? [];
  const memberCount = invite?.member_count ?? 0;
  const extra = Math.max(memberCount - avatars.length, 0);
  const gradientClass = getGradient(invite?.workspaceName);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-background px-4 py-8">
      {/* Dynamic Background Effects */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-100 w-100 rounded-full bg-indigo-500/10 blur-[100px]" />
        <div className="absolute top-1/2 -left-20 h-87.5 w-87.5 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[24px_24px]" />
      </div>

      {/* Main Card Container */}
      <div className="my-auto w-full max-w-md">
        {/* ---------------- 1. LOADING STATE (SKELETON) ---------------- */}
        {isLoadingState && <JoinWorkspaceSkeleton />}

        {/* ---------------- 2. ERROR STATE ---------------- */}
        {!isLoadingState && isErrorState && (
          <div className="overflow-hidden rounded-3xl bg-card/90 shadow-2xl backdrop-blur-xl ring-1 ring-border/60 transition-all">
            <div className="px-6 py-10 text-center">
              <div className="relative mx-auto flex size-20 items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-destructive/10" />
                <div className="relative flex size-20 items-center justify-center rounded-full bg-destructive/10 ring-1 ring-destructive/25 shadow-sm">
                  <AlertCircle className="size-10 text-destructive" />
                </div>
              </div>

              <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                {status === "error"
                  ? "Failed to Join Workspace"
                  : "Invite Link Expired or Invalid"}
              </h1>

              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {errorMessage ||
                  (status === "error"
                    ? "We encountered an unexpected issue while adding you to this workspace. Please try again."
                    : "This invite link is invalid, expired, or has already been used. Please request a new invite from the workspace administrator.")}
              </p>

              <div className="mt-8 space-y-2.5">
                {onRetry && (
                  <Button
                    onClick={onRetry}
                    className="h-12 w-full cursor-pointer rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.98]"
                  >
                    <RotateCcw className="mr-2 size-4" />
                    Try Again
                  </Button>
                )}
                <Button
                  variant={onRetry ? "outline" : "default"}
                  onClick={onContinue}
                  className={cn(
                    "h-12 w-full cursor-pointer rounded-xl text-sm font-semibold transition-all active:scale-[0.98]",
                    onRetry
                      ? "ring-1 ring-border/80 hover:bg-muted/50"
                      : "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-95",
                  )}
                >
                  Go to My Workspaces
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 3. SUCCESS STATE ---------------- */}
        {!isLoadingState && !isErrorState && status === "success" && (
          <div className="overflow-hidden rounded-3xl bg-card/90 shadow-2xl backdrop-blur-xl ring-1 ring-border/60 transition-all">
            <div className="px-6 py-10 text-center">
              <div className="relative mx-auto flex size-20 items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
                <div className="relative flex size-20 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30">
                  <CheckCircle2 className="size-10 text-emerald-500" />
                </div>
              </div>
              <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                You&apos;re in!
              </h1>
              <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
                You have successfully joined{" "}
                <span className="font-semibold text-foreground">
                  {invite?.workspaceName ?? "the workspace"}
                </span>{" "}
                on Doable.
              </p>
              <Button
                onClick={onContinue}
                className="mt-8 h-12 w-full cursor-pointer rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 active:scale-[0.98]"
              >
                Go to Workspace
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ---------------- 4. READY / JOINING STATE ---------------- */}
        {!isLoadingState &&
          !isErrorState &&
          (status === "ready" || status === "joining") &&
          invite && (
            <div className="overflow-hidden rounded-3xl bg-card/90 shadow-2xl backdrop-blur-xl ring-1 ring-border/60 transition-all">
              {/* Workspace Header Banner */}
              <div
                className={cn(
                  "relative h-28 bg-linear-to-br transition-all duration-500",
                  gradientClass,
                )}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_70%)]" />
                <div className="absolute bottom-2 right-3 flex items-center gap-1 rounded-full bg-black/20 px-2.5 py-1 text-[10px] font-medium text-white/90 backdrop-blur-md">
                  <ShieldCheck className="size-3" />
                  Verified Invitation
                </div>
              </div>

              <div className="px-6 pb-6">
                {/* Logo overlapping the banner */}
                <div className="-mt-12 flex justify-center">
                  <Avatar className="size-24 rounded-2xl ring-4 ring-card shadow-xl transition-transform hover:scale-105">
                    {invite.logo_url ? (
                      <AvatarImage
                        src={invite.logo_url}
                        alt={`${invite.workspaceName} logo`}
                        className="rounded-2xl object-cover"
                      />
                    ) : null}
                    <AvatarFallback
                      className={cn(
                        "rounded-2xl bg-linear-to-br text-3xl font-extrabold text-white shadow-inner",
                        gradientClass,
                      )}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Heading & Invitation Note */}
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <Sparkles className="size-3.5" />
                    You&apos;ve been invited
                  </span>
                  <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                    {invite.workspaceName}
                  </h1>
                </div>

                {/* Member avatars */}
                {memberCount > 0 && (
                  <div className="mt-6 flex flex-col items-center justify-center gap-2 rounded-xl bg-muted/40 p-3 ring-1 ring-border/50">
                    <div className="flex items-center gap-3">
                      <AvatarGroup>
                        {avatars.slice(0, 4).map((src, i) => (
                          <Avatar key={i} className="size-8 ring-2 ring-card">
                            {src ? <AvatarImage src={src} alt="" /> : null}
                            <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                              ?
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </AvatarGroup>
                      {extra > 0 && (
                        <span className="text-xs font-medium text-muted-foreground">
                          +{extra} other member{extra > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Join your teammates collaborating on Doable
                    </p>
                  </div>
                )}

                {/* Actions */}
                {isLoggedIn ? (
                  /* ---- Logged in: join directly ---- */
                  <div className="mt-6 space-y-2.5">
                    <Button
                      onClick={onJoin}
                      disabled={status === "joining"}
                      className="h-12 w-full cursor-pointer rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.98]"
                    >
                      {status === "joining" ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Joining workspace...
                        </>
                      ) : (
                        <>
                          Join Workspace
                          <ArrowRight className="ml-2 size-4" />
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={onDecline}
                      disabled={status === "joining"}
                      className="h-10 w-full cursor-pointer rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/60"
                    >
                      Not now
                    </Button>
                  </div>
                ) : (
                  /* ---- Logged out: sign up or log in first ---- */
                  <div className="mt-6 space-y-3">
                    <Button
                      onClick={onSignUp}
                      className="h-12 w-full cursor-pointer rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.98]"
                    >
                      <UserPlus className="mr-2 size-4" />
                      Sign up with Doable to join
                    </Button>

                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-border/70" />
                      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        or
                      </span>
                      <div className="h-px flex-1 bg-border/70" />
                    </div>

                    <Button
                      variant="outline"
                      onClick={onLogin}
                      className="h-11 w-full cursor-pointer rounded-xl text-sm font-medium ring-1 ring-border/80 hover:bg-muted/50"
                    >
                      I already have an account
                    </Button>

                    <p className="text-center text-[11px] text-muted-foreground">
                      You&apos;ll return automatically after signing in.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
      </div>

      {/* Footer Branding */}
      <footer className="w-full max-w-md py-4 text-center">
        <p className="text-xs text-muted-foreground">
          Powered by{" "}
          <span className="font-semibold text-foreground">Doable</span> &bull;
          Productivity redefined
        </p>
      </footer>
    </main>
  );
}

