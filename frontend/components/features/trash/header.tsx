"use client";

import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TrashHeaderProps } from "@/types/trash";

export function TrashHeader({
  totalCount = 0,
  searchQuery,
  onSearchChange,
}: TrashHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                Trash
              </h1>
              <Badge
                variant="secondary"
                className="rounded-full px-2 py-0.5 text-xs font-normal"
              >
                {totalCount} {totalCount === 1 ? "task" : "tasks"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Review soft-deleted tasks or restore them back to your workspace
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search deleted tasks..."
            className="h-9 pl-9 rounded-lg text-sm bg-card border-border/80"
          />
        </div>
      </div>

      {/* Info notice banner */}
      <div className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-muted/30 px-3.5 py-2.5 text-xs text-muted-foreground">
        <RotateCcw className="h-3.5 w-3.5 text-primary shrink-0" />
        <span>
          Items in the trash can be viewed and restored. Editing or
          modifications are disabled until restored.
        </span>
      </div>
    </div>
  );
}
