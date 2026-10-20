"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

// ── Workspace card skeleton ───────────────────────────────────────────────────
export function WorkspaceCardSkeleton() {
  return (
    <div className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-full">
          <Card className="h-full gap-0 overflow-hidden rounded-xl p-0">
            <div className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-3 p-4 sm:p-5">
                <div className="flex min-w-0 items-center gap-3">
                  <Skeleton className="size-11 shrink-0 rounded-lg" />
                  <div className="min-w-0 space-y-2">
                    <Skeleton className="h-4 w-32 rounded" />
                    <Skeleton className="h-3 w-20 rounded" />
                  </div>
                </div>
                <Skeleton className="size-7 rounded-md" />
              </div>

              <div className="flex flex-1 flex-col gap-4 px-4 pb-4 sm:px-5 sm:pb-5">
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-full rounded" />
                  <Skeleton className="h-3.5 w-full rounded" />
                  <Skeleton className="h-3.5 w-2/3 rounded" />
                </div>
                <div className="mt-auto">
                  <Skeleton className="h-7 w-24 rounded-full" />
                </div>
              </div>

              <div className="space-y-2 border-t border-border/70 bg-muted/30 px-4 py-3 sm:px-5">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20 rounded" />
                  <Skeleton className="h-3 w-12 rounded" />
                </div>
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
