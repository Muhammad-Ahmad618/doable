import { Status } from "@/types/task";
import { CheckCircle2, CircleDot, Clock } from "lucide-react";
export const getStatusIcon = (status: Status) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
    case "in_progress":
      return (
        <CircleDot className="h-4 w-4 text-blue-500 animate-pulse shrink-0" />
      );
    default:
      return <Clock className="h-4 w-4 text-amber-500 shrink-0" />;
  }
};
