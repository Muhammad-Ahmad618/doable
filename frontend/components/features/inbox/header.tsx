"use client";

import { CheckCheck, Inbox, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InboxHeaderProps } from "@/types/inbox";

export function InboxHeader({
  totalCount,
  unreadCount,
  searchQuery,
  onSearchChange,
  onMarkAllAsRead,
  onClearAll,
  hasUnread,
  hasNotifications,
}: InboxHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
            <Inbox className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                Inbox
              </h1>
              {unreadCount > 0 ? (
                <Badge
                  variant="default"
                  className="rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 hover:bg-blue-500/25 px-2.5 py-0.5 text-xs font-medium border border-blue-500/20 shadow-none"
                >
                  {unreadCount} unread
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="rounded-full px-2.5 py-0.5 text-xs font-normal"
                >
                  All read
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Stay updated with assignments, mentions, and workspace activities
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onMarkAllAsRead}
            disabled={!hasUnread}
            className="h-9 gap-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors"
          >
            <CheckCheck className="size-3.5 text-blue-500" />
            Mark all read
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            disabled={!hasNotifications}
            className="h-9 gap-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10 cursor-pointer transition-colors"
          >
            <Trash2 className="size-3.5" />
            Clear all
          </Button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search notifications, tasks, or teammates..."
          className="h-10 pl-9 rounded-xl text-sm bg-card border-border/80 shadow-xs placeholder:text-muted-foreground/60"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

