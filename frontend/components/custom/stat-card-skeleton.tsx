"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

// ── Stat-card skeleton ────────────────────────────────────────────────────────
export function StatCardSkeleton() {
  return (
    <Card className="border-t-4 border-t-muted p-5 shadow-sm rounded-lg space-y-3">
      <Skeleton className="h-3 w-24 rounded" />
      <Skeleton className="h-9 w-16 rounded" />
    </Card>
  );
}
