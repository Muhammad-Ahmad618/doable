"use client";

import { Skeleton } from "@/components/ui/skeleton";

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
