"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavUser } from "../custom/nav-user";
import { SearchInput } from "./search-input";
import { Bell, CheckCheck, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
};

const notifications: Notification[] = [
  {
    id: "1",
    title: "Cloud Infrastructure Audit is 2 days overdue",
    description: "Risk score jumped to 92%. James Smith is assigned.",
    time: "10m ago",
    unread: true,
  },
  {
    id: "2",
    title: "3 tasks unlocked for Engineering",
    description: "Completing your audit will unblock dependent work.",
    time: "1h ago",
    unread: true,
  },
  {
    id: "3",
    title: "Weekly summary ready",
    description: "20 tasks completed, 14 in progress this week.",
    time: "Yesterday",
    unread: false,
  },
];

export function SiteHeader() {
  const [items, setItems] = useState(notifications);
  const unreadCount = items.filter((n) => n.unread).length;

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));

  return (
    <header className="flex h-16 shrink-0 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 px-4 lg:px-6 transition-all">
      <div className="flex w-full items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-2 w-full">
          <SidebarTrigger className="-ml-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white" />
          <Separator orientation="vertical" className="mx-2 h-4" />
          <div className="flex-1 max-w-md hidden md:flex items-center justify-center">
            <SearchInput />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-end min-w-fit gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
                aria-label={
                  unreadCount > 0
                    ? `Notifications, ${unreadCount} unread`
                    : "Notifications"
                }
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span
                    className={cn(
                      "absolute -top-0.5 -right-0.5 flex items-center justify-center rounded-full bg-red-500 text-white ring-2 ring-background",
                      unreadCount > 9
                        ? "h-4 min-w-4 px-1 text-[8px] font-medium"
                        : "h-4 w-4 text-[10px]",
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

            <DropdownMenuContent align="end" className="min-w-fit rounded-lg">
              <div className="flex items-center justify-between p-4">
                <span className="text-sm font-semibold">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center hover:text-primary cursor-pointer gap-1 text-xs transition-colors"
                  >
                    <CheckCheck size={13} />
                    Mark all read
                  </button>
                )}
              </div>
              <Separator />

              <ScrollArea className="max-h-80">
                {items.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    You&apos;re all caught up.
                  </div>
                ) : (
                  items.map((n) => (
                    <div
                      key={n.id}
                      className="flex gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
                    >
                      <div className="pt-1.5 shrink-0">
                        <Circle
                          size={7}
                          className={cn(
                            "fill-current",
                            n.unread ? "text-blue-500" : "text-transparent",
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm leading-snug truncate",
                            n.unread ? "font-medium" : "text-muted-foreground",
                          )}
                        >
                          {n.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {n.description}
                        </p>
                        <p className="text-[11px] text-muted-foreground/70 mt-1">
                          {n.time}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </ScrollArea>

              <Separator />
              <button className="w-full p-4 text-xs text-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                View all notifications
              </button>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-5 mx-1" />

          <NavUser
            user={{
              name: "Admin",
              email: "admin@doable.com",
              avatar: "/avatars/shadcn.jpg",
            }}
          />
        </div>
      </div>
    </header>
  );
}
