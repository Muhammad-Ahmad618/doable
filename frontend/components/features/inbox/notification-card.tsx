"use client";

import {
  AlertTriangle,
  AtSign,
  CheckCheck,
  CheckSquare,
  Clock,
  Folder,
  Mail,
  MailOpen,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { InboxNotification, NotificationType } from "@/types/inbox";
import { cn } from "@/lib/utils";

interface NotificationCardProps {
  notification: InboxNotification;
  selected: boolean;
  onSelectToggle: (id: string) => void;
  onToggleRead: (id: string) => void;
  onDeleteRequest: (notification: InboxNotification) => void;
}

function getTypeIcon(type: NotificationType) {
  switch (type) {
    case "alert":
      return {
        icon: AlertTriangle,
        wrapperCls:
          "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      };
    case "assignment":
      return {
        icon: CheckSquare,
        wrapperCls:
          "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      };
    case "mention":
      return {
        icon: AtSign,
        wrapperCls:
          "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      };
    case "completion":
      return {
        icon: CheckCheck,
        wrapperCls:
          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      };
    case "system":
    default:
      return {
        icon: Sparkles,
        wrapperCls:
          "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
      };
  }
}

export function NotificationCard({
  notification,
  selected,
  onSelectToggle,
  onToggleRead,
  onDeleteRequest,
}: NotificationCardProps) {
  const { icon: TypeIcon, wrapperCls } = getTypeIcon(notification.type);

  return (
    <div
      className={cn(
        "group relative flex items-start gap-3.5 rounded-2xl border p-4 transition-all duration-200",
        notification.unread
          ? "border-blue-500/30 bg-blue-50/30 shadow-xs dark:border-blue-500/20 dark:bg-blue-500/5 hover:border-blue-500/50"
          : "border-border/60 bg-card hover:border-border hover:bg-muted/20",
        selected && "ring-2 ring-primary/40 border-primary/50",
      )}
    >
      {/* Checkbox for bulk actions */}
      <div className="pt-1">
        <Checkbox
          checked={selected}
          onCheckedChange={() => onSelectToggle(notification.id)}
          className="size-4 rounded-sm transition-opacity"
          aria-label={`Select ${notification.title}`}
        />
      </div>

      {/* Type Icon */}
      <div
        className={cn(
          "relative flex size-10 shrink-0 items-center justify-center rounded-xl border",
          wrapperCls,
        )}
      >
        <TypeIcon className="size-4.5" />
        {notification.unread && (
          <span className="absolute -top-0.5 -right-0.5 flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-blue-500" />
          </span>
        )}
      </div>

      {/* Main Body */}
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <h3
            className={cn(
              "text-sm tracking-tight leading-snug",
              notification.unread
                ? "font-semibold text-foreground"
                : "font-medium text-foreground/90",
            )}
          >
            {notification.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3 text-muted-foreground/60" />
            <span>{notification.timestamp}</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {notification.description}
        </p>

        {/* Badges / Context row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
          {notification.workspace && (
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 font-medium text-muted-foreground">
              <Folder className="size-3" />
              {notification.workspace}
            </span>
          )}

          {notification.priority && (
            <span
              className={cn(
                "rounded-md px-2 py-0.5 font-medium capitalize",
                notification.priority === "high" &&
                  "bg-red-500/10 text-red-600 dark:text-red-400",
                notification.priority === "medium" &&
                  "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                notification.priority === "low" &&
                  "bg-slate-500/10 text-slate-600 dark:text-slate-400",
              )}
            >
              {notification.priority}
            </span>
          )}

          {notification.sender && (
            <span className="text-muted-foreground/75 font-normal">
              by <strong className="font-medium text-foreground/80">{notification.sender.name}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Hover Action Buttons */}
      <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity self-center sm:self-start">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onToggleRead(notification.id)}
          className="size-8 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
          title={notification.unread ? "Mark as read" : "Mark as unread"}
          aria-label={notification.unread ? "Mark as read" : "Mark as unread"}
        >
          {notification.unread ? (
            <MailOpen className="size-4" />
          ) : (
            <Mail className="size-4" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDeleteRequest(notification)}
          className="size-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
          title="Delete notification"
          aria-label="Delete notification"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}

