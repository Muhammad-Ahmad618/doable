import { LucideIcon, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title = "Nothing here yet",
  description,
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={`relative mt-5 flex min-h-[240px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border/70 bg-gradient-to-b from-muted/40 via-background to-background px-6 py-10 text-center ${className ?? ""}`}
    >
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -top-16 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />

      {/* Icon */}
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-2xl bg-primary/15 blur-xl" />

        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent shadow-sm">
          <Icon size={26} strokeWidth={1.7} className="text-primary" />
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-sm space-y-1.5">
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          {title}
        </h3>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      {/* Optional action */}
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          size="sm"
          className="relative mt-5 h-9 gap-2 rounded-xl px-5 text-xs font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
