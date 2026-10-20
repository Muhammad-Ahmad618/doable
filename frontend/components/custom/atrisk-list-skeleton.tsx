"use client";
import { Skeleton } from "@/components/ui/skeleton";

// ── At-risk list skeleton ─────────────────────────────────────────────────────
export function AtRiskSkeleton() {
  return (
    <div className="col-span-1 border border-border rounded-lg bg-card shadow-sm flex flex-col">
      <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-border">
        <Skeleton className="size-4 rounded-full" />
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-4 w-14 rounded-full ml-1" />
      </div>
      <div className="flex flex-col divide-y divide-border">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-2 px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-4 w-10 rounded" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
