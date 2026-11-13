"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavUser } from "../custom/nav-user";
import { Bell, CheckCheck, Circle, Moon, Sun } from "lucide-react";
import { useGetCurrentUser } from "@/hooks/user/settings";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  useFetchAllNotifications,
  useMarkAllRead,
  useMarkAsRead,
} from "@/hooks/notifications";
import { useNotificationSocket } from "@/hooks/notificationSocket";

function formatRelativeTime(date: Date | string): string {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

export function SiteHeader() {
  const [isNotificationOpen, setNotificatioOpen] = useState(false);
  useNotificationSocket();
  const { data: notificationsData } = useFetchAllNotifications();
  const { mutate: markAllReadMutate } = useMarkAllRead();
  const { mutate: markAsReadMutate } = useMarkAsRead();
  const { data: user } = useGetCurrentUser();
  const { resolvedTheme, setTheme } = useTheme();

  const items = notificationsData?.data?.Notification ?? [];
  const unreadCount = notificationsData?.data?.unread ?? 0;

  const markAllRead = () => markAllReadMutate();

  return (
    <header className="flex h-16 shrink-0 items-center border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 dark:bg-header dark:supports-backdrop-filter:bg-header sticky top-0 z-10 px-4 lg:px-6 transition-all">
      <div className="flex w-full items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-2 w-full">
          <SidebarTrigger className="-ml-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white" />
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-end min-w-fit gap-x-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="cursor-pointer group relative h-10 w-10 rounded-full border border-blue-400/20 bg-linear-to-br from-blue-400/15 via-blue-500/10 to-indigo-500/20 text-blue-600 shadow-[0_2px_12px_rgba(59,130,246,0.12)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-blue-400/40 hover:from-blue-400/25 hover:via-blue-500/20 hover:to-indigo-500/30 hover:text-blue-700 hover:shadow-[0_4px_20px_rgba(59,130,246,0.25)] active:scale-95 dark:from-blue-400/20 dark:via-blue-500/15 dark:to-indigo-500/25 dark:text-blue-300 dark:hover:text-blue-200"
            aria-label="Toggle theme"
          >
            <Sun
              size={18}
              strokeWidth={2}
              className="transition-all duration-300 scale-100 rotate-0 dark:scale-0 dark:-rotate-90 absolute"
            />
            <Moon
              size={18}
              strokeWidth={2}
              className="transition-all duration-300 scale-0 rotate-90 dark:scale-100 dark:rotate-0 absolute"
            />
          </Button>

          <DropdownMenu
            open={isNotificationOpen}
            onOpenChange={setNotificatioOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer group relative h-10 w-10 rounded-full border border-blue-400/20 bg-linear-to-br from-blue-400/15 via-blue-500/10 to-indigo-500/20 text-blue-600 shadow-[0_2px_12px_rgba(59,130,246,0.12)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-blue-400/40 hover:from-blue-400/25 hover:via-blue-500/20 hover:to-indigo-500/30 hover:text-blue-700 hover:shadow-[0_4px_20px_rgba(59,130,246,0.25)] active:scale-95 dark:from-blue-400/20 dark:via-blue-500/15 dark:to-indigo-500/25 dark:text-blue-300 dark:hover:text-blue-200"
                aria-label={
                  unreadCount > 0
                    ? `Notifications, ${unreadCount} unread`
                    : "Notifications"
                }
              >
                <Bell
                  size={20}
                  strokeWidth={2}
                  className="transition-transform duration-300 group-hover:-rotate-12"
                />

                {unreadCount > 0 && (
                  <span
                    className={cn(
                      "absolute -right-0.5 -top-0.5 flex items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-[0_2px_8px_rgba(59,130,246,0.4)] ring-2 ring-background",
                      unreadCount > 9
                        ? "h-4 min-w-4 px-1 text-[8px] font-semibold"
                        : "h-4 w-4 text-[10px] font-semibold",
                    )}
                  >
                    {unreadCount > 9
                      ? "9+"
                      : unreadCount > 1
                        ? unreadCount
                        : null}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={12}
              className="z-50 flex w-[22rem] flex-col rounded-2xl border border-white/50 bg-white/85 p-0 shadow-[0_12px_50px_rgba(0,0,0,0.12),0_2px_8px_rgba(59,130,246,0.08)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-zinc-900/85 dark:shadow-[0_12px_50px_rgba(0,0,0,0.45)]"
            >
              {/* Header */}
              <div className="relative flex shrink-0 items-center justify-between border-b border-zinc-200/60 bg-linear-to-r from-blue-50/70 via-white/40 to-indigo-50/70 px-5 py-4 dark:border-white/10 dark:from-blue-500/10 dark:via-zinc-900/40 dark:to-indigo-500/10">
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">
                    Notifications
                  </h3>
                  <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                    Stay updated with what&apos;s happening
                  </p>
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1.5 rounded-full border border-blue-500/15 bg-blue-500/10 px-3 py-1.5 text-[11px] font-medium text-blue-600 transition-all hover:border-blue-500/30 hover:bg-blue-500/15 dark:text-blue-400"
                  >
                    <CheckCheck size={13} />
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notifications list */}
              <ScrollArea className="h-80">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-blue-500/15 bg-linear-to-br from-blue-400/15 to-indigo-500/15 text-blue-500">
                      <Bell size={21} />
                    </div>
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                      You&apos;re all caught up!
                    </p>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      No new notifications at the moment.
                    </p>
                  </div>
                ) : (
                  <div className="p-2">
                    {items.map((n) => {
                      const isUnread = !n.read_at;
                      return (
                        <div
                          key={n.id}
                          onClick={() => {
                            if (isUnread) markAsReadMutate(n.id);
                          }}
                          className={cn(
                            "group flex cursor-pointer gap-3 rounded-xl px-3 py-3 transition-all duration-200 hover:bg-blue-50/70 dark:hover:bg-white/6",
                            isUnread && "bg-blue-50/40 dark:bg-blue-500/6",
                          )}
                        >
                          <div className="shrink-0 pt-1.5">
                            <Circle
                              size={8}
                              className={cn(
                                "fill-current",
                                isUnread ? "text-blue-500" : "text-transparent",
                              )}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p
                              className={cn(
                                "line-clamp-2 text-sm leading-snug",
                                isUnread
                                  ? "font-semibold text-zinc-900 dark:text-zinc-100"
                                  : "font-medium text-zinc-600 dark:text-zinc-300",
                              )}
                            >
                              {n.message}
                            </p>

                            {n.task_title && (
                              <p className="mt-1 line-clamp-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                                {n.task_title}
                              </p>
                            )}

                            <p className="mt-1.5 text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                              {formatRelativeTime(n.created_at)}
                            </p>
                          </div>

                          {isUnread && (
                            <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>

              {/* Footer */}
              <div className="shrink-0 border-t border-zinc-200/60 bg-zinc-50/50 p-2 dark:border-white/10 dark:bg-white/2">
                <Link
                  href="/inbox"
                  onClick={() => setNotificatioOpen(false)}
                  className="block w-full rounded-xl py-2.5 text-center text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/10"
                >
                  View all notifications
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <NavUser
            user={{
              name: user?.username || "",
              email: user?.email || "",
              avatar: user?.avatar_url || "U",
            }}
          />
        </div>
      </div>
    </header>
  );
}
