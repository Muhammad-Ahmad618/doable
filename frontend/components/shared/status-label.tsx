import { CheckCircle2, CircleDot, Clock } from "lucide-react";
import { taskStatus } from "@/types/dashboard";

export function StatusLabel({ status }: { status: taskStatus }) {
  return (
    <div className="flex items-center gap-1.5">
      {status === "completed" ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
      ) : status === "in_progress" ? (
        <CircleDot className="h-4 w-4 text-blue-500 animate-pulse shrink-0" />
      ) : (
        <Clock className="h-4 w-4 text-amber-500 shrink-0" />
      )}
      <span className="text-xs font-medium">{status}</span>
    </div>
  );
}
