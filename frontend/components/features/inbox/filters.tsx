"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CheckCheck, Trash2 } from "lucide-react";
import { InboxFiltersProps, NotificationCategory } from "@/types/inbox";
import { cn } from "@/lib/utils";

const TABS: { id: NotificationCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "tasks", label: "Tasks" },
  { id: "mentions", label: "Mentions" },
  { id: "system", label: "System" },
];

export function InboxFilters({
  activeTab,
  onTabChange,
  counts,
  selectedCount,
  allSelected,
  onSelectAllToggle,
  onBulkMarkAsRead,
  onBulkDelete,
  hasItems,
}: InboxFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-3">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = counts[tab.id] ?? 0;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "group flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer select-none shrink-0",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/80 hover:text-foreground",
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.2 text-[10px] font-semibold tabular-nums",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground group-hover:text-foreground",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bulk selection tools */}
      {hasItems && (
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Checkbox
              id="select-all"
              checked={allSelected}
              onCheckedChange={onSelectAllToggle}
              className="size-4 rounded-sm"
              aria-label="Select all notifications"
            />
            <label
              htmlFor="select-all"
              className="cursor-pointer select-none font-medium hover:text-foreground"
            >
              {selectedCount > 0 ? `${selectedCount} selected` : "Select all"}
            </label>
          </div>

          {selectedCount > 0 && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-border/60">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBulkMarkAsRead}
                className="h-7 px-2.5 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 cursor-pointer"
              >
                <CheckCheck className="size-3 mr-1" />
                Mark read
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onBulkDelete}
                className="h-7 px-2.5 text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
              >
                <Trash2 className="size-3 mr-1" />
                Delete
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

