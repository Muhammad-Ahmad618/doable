import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, RotateCcw } from "lucide-react";
import { joinErrorProps } from "@/types/join";

export function JoinErrorState({
  status,
  errorMessage,
  onRetry,
  onContinue,
}: joinErrorProps) {
  return (
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
  );
}
