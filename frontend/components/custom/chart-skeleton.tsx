"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function ChartSkeleton() {
  return (
    <Card className="rounded-lg h-full p-5 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-4 w-36 rounded" />
          <Skeleton className="h-3 w-52 rounded" />
        </div>
        <Skeleton className="h-8 w-32 rounded" />
      </div>
      <div className="flex items-end gap-2 h-[250px] pt-4">
        {[55, 75, 45, 90, 65, 80].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end gap-1">
            <Skeleton
              className="w-full rounded-t"
              style={{ height: `${h}%` }}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
