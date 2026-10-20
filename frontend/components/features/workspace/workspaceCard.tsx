"use client";

import { Card } from "@/components/ui/card";
import type { Workspace } from "@/types/workspace";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreVertical,
  BriefcaseBusiness,
  LogOut,
  UserPlus,
  Users,
  ListChecks,
} from "lucide-react";
import {
  Avatar,
  AvatarGroup,
  AvatarFallback,
  AvatarImage,
  AvatarGroupCount,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const ACTIVE_TASK_GOAL = 75;

// Gradient pairs, one is picked from the workspace name
const GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-orange-400 to-rose-500",
  "from-violet-500 to-purple-600",
  "from-sky-400 to-cyan-600",
  "from-pink-500 to-fuchsia-600",
];

const getGradient = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % 1000;
  }
  return GRADIENTS[hash % GRADIENTS.length];
};

const calculatePercentage = (activeTasks: number) =>
  Math.min(100, Math.round((activeTasks / ACTIVE_TASK_GOAL) * 100));

// Green = light load, amber = busy, red = very busy
const getProgressColor = (percentage: number) => {
  if (percentage >= 80) return "[&>*]:bg-red-500";
  if (percentage >= 50) return "[&>*]:bg-amber-500";
  return "[&>*]:bg-emerald-500";
};

// Works with a plain URL string OR an object { name, avatar_url }
type MemberPreview =
  | string
  | { name?: string; avatar_url?: string | null }
  | null;

const getMemberInfo = (member: MemberPreview) => {
  if (!member) return { src: null, initial: "?" };
  if (typeof member === "string") return { src: member, initial: "?" };
  return {
    src: member.avatar_url ?? null,
    initial: member.name?.charAt(0).toUpperCase() || "?",
  };
};

export function WorkspaceCard({
  workspace,
  onLeave,
  onInvite,
}: {
  workspace: Workspace;
  onLeave: (workspace: Workspace) => void;
  onInvite?: (workspace: Workspace) => void;
}) {
  const title = workspace?.name ?? "";
  const percentage = calculatePercentage(workspace?.active_tasks ?? 0);
  const preview = (workspace?.member_preview ?? []) as MemberPreview[];
  const avatars = preview.length > 0 ? preview : [null];
  const totalMembers = workspace?.member_count ?? 0;
  const remainingMembers = Math.max(totalMembers - avatars.length, 0);
  const description = workspace?.description?.trim();
  const isAdmin = workspace?.role === "owner" || workspace?.role === "admin";

  return (
    <div className="h-full">
      <Card className="group h-full gap-0 overflow-hidden rounded-xl p-0 shadow-xs ring-1 ring-border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:ring-primary/30">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 p-4 sm:p-5">
            <div className="flex min-w-0 items-center gap-3">
              {/* Logo, with colored initials as fallback */}
              <Avatar className="size-12 shrink-0 rounded-xl ring-1 ring-border">
                {workspace?.logo_url ? (
                  <AvatarImage
                    src={workspace.logo_url}
                    alt={`${title} logo`}
                    className="rounded-xl object-cover"
                  />
                ) : null}
                <AvatarFallback
                  className={cn(
                    "rounded-xl bg-gradient-to-br text-sm font-semibold text-white",
                    getGradient(title),
                  )}
                >
                  {title.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="truncate text-sm font-semibold leading-tight">
                    {title}
                  </h3>
                  {isAdmin && (
                    <Badge className="h-4 shrink-0 rounded-full px-1.5 text-[10px] leading-none">
                      Admin
                    </Badge>
                  )}
                </div>
                <p className="mt-1 flex items-center gap-1 truncate text-xs text-muted-foreground">
                  <Users className="size-3" />
                  {totalMembers} {totalMembers === 1 ? "member" : "members"}
                </p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`${title} options`}
                  className="shrink-0 rounded-md text-muted-foreground hover:bg-primary-light hover:text-primary md:opacity-0 md:transition-opacity md:group-hover:opacity-100 data-[state=open]:opacity-100"
                >
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 rounded-md p-1.5"
              >
                <DropdownMenuItem className="cursor-pointer rounded-sm">
                  <BriefcaseBusiness className="mr-2 h-4 w-4" />
                  Enter Workspace
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem
                    className="cursor-pointer rounded-sm"
                    onClick={() => onInvite?.(workspace)}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite Member
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer rounded-sm text-destructive focus:text-destructive"
                  onClick={() => onLeave(workspace)}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Leave Workspace
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col gap-4 px-4 pb-4 sm:px-5 sm:pb-5">
            <p
              className={cn(
                "line-clamp-3 min-h-[60px] break-words text-sm leading-relaxed",
                description ? "text-zinc-500" : "italic text-muted-foreground",
              )}
              title={description}
            >
              {description || "No description added yet."}
            </p>

            <div className="mt-auto flex items-center justify-between gap-2">
              <AvatarGroup>
                {avatars.map((member, index) => {
                  const { src, initial } = getMemberInfo(member);
                  return (
                    <Avatar key={index} className="size-7">
                      {src ? <AvatarImage src={src} alt="" /> : null}
                      <AvatarFallback className="bg-primary-light text-xs text-primary">
                        {initial}
                      </AvatarFallback>
                    </Avatar>
                  );
                })}
                {remainingMembers > 0 && (
                  <AvatarGroupCount className="size-7 text-[11px]">
                    +{remainingMembers}
                  </AvatarGroupCount>
                )}
              </AvatarGroup>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border/70 bg-muted/30 px-4 py-3 sm:px-5">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <ListChecks className="size-3.5" />
                Active tasks
              </span>
              <span className="text-xs tabular-nums">
                <span className="font-semibold">
                  {workspace?.active_tasks ?? 0}
                </span>
                <span className="ml-1.5 text-muted-foreground">
                  {percentage}%
                </span>
              </span>
            </div>
            <Progress
              value={percentage}
              className={cn(
                "h-1.5 rounded-full bg-muted",
                getProgressColor(percentage),
              )}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
