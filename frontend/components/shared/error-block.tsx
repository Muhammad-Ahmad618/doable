import { AlertCircle, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SectionError({
  message = "Failed to load data.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-destructive/10 bg-linear-to-b from-destructive/[0.035] via-background to-background px-6 py-12 text-center dark:border-destructive/15 dark:from-destructive/[0.07]">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -top-16 h-36 w-36 rounded-full bg-destructive/10 blur-3xl" />

      {/* Icon */}
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-2xl bg-destructive/15 blur-xl" />

        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-destructive/15 bg-linear-to-br from-destructive/15 via-destructive/5 to-transparent shadow-sm">
          <AlertCircle className="h-8 w-8 text-destructive" strokeWidth={1.7} />
        </div>

        <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-[3px] border-background bg-destructive text-white shadow-sm">
          <WifiOff size={11} strokeWidth={2.5} />
        </span>
      </div>

      {/* Message */}
      <div className="relative max-w-sm space-y-1.5">
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          Something went wrong
        </h3>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {message}
        </p>

        <p className="pt-1 text-xs text-muted-foreground/70">
          Don&apos;t worry, your data is safe. You can try loading this section
          again.
        </p>
      </div>

      {/* Retry */}
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="cursor-pointer relative mt-6 h-9 gap-2 rounded-xl border-destructive/20 bg-background/80 px-5 text-xs font-semibold shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive hover:shadow-md active:translate-y-0"
        >
          <RefreshCw
            size={14}
            className="transition-transform duration-500 group-hover:rotate-180"
          />
          Try again
        </Button>
      )}
    </div>
  );
}
