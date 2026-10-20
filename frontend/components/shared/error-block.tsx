import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SectionError({
  message = "Failed to load data.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center text-muted-foreground">
      <div className="flex items-center justify-center size-10 rounded-full bg-destructive/10">
        <AlertCircle className="size-5 text-destructive" />
      </div>
      <p className="text-sm font-medium">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={onRetry}
        >
          <RefreshCw className="size-3" />
          Retry
        </Button>
      )}
    </div>
  );
}
