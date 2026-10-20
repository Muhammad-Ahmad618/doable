"use client";
import { Skeleton } from "@/components/ui/skeleton";

// ── Recent tasks table skeleton ───────────────────────────────────────────────
export function TableSkeleton() {
  return (
    <div className="space-y-3 mt-5">
      <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
        <div className="bg-muted/40 flex gap-4 px-5 py-3">
          {[14, 28, 40, 16, 20, 20, 20, 16, 12].map((w, i) => (
            <Skeleton
              key={i}
              className="h-3 rounded"
              style={{ width: `${w * 4}px` }}
            />
          ))}
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex gap-4 px-5 py-3.5 border-t border-border items-center"
          >
            <Skeleton className="h-3 w-5 rounded" />
            <Skeleton className="h-3 w-32 rounded" />
            <Skeleton className="h-3 w-48 rounded" />
            <Skeleton className="h-5 w-14 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-5 w-16 rounded" />
            <Skeleton className="h-6 w-6 rounded ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
