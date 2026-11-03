"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { UserCircleIcon, SignOutIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useSignOut } from "@/hooks/auth/auth";
import { Loader2, MessageSquare, ChevronRight } from "lucide-react";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { mutate: signOut, isPending } = useSignOut();

  const handleLogout = () => {
    setTimeout(() => {
      setShowLogoutModal(false);
    }, 500);
    signOut();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="group relative flex items-center justify-center rounded-full outline-none ring-offset-background transition-all duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-95"
            aria-label="Open user menu"
          >
            <Avatar className="h-10 w-10 rounded-full border-2 border-blue-500/20 shadow-[0_2px_10px_rgba(59,130,246,0.15)] transition-all duration-300 group-hover:border-blue-500/50 group-hover:shadow-[0_4px_16px_rgba(59,130,246,0.3)]">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="rounded-full bg-linear-to-br from-blue-500 to-indigo-600 font-semibold text-white">
                {user?.name.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="bottom"
          align="end"
          sideOffset={10}
          className="z-50 w-64 overflow-hidden rounded-2xl border border-white/50 bg-white/85 p-1.5 shadow-[0_12px_50px_rgba(0,0,0,0.12),0_2px_8px_rgba(59,130,246,0.08)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-zinc-900/85 dark:shadow-[0_12px_50px_rgba(0,0,0,0.45)]"
        >
          {/* User Profile */}
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="relative flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-br from-blue-50/90 via-indigo-50/60 to-white/50 p-3 dark:from-blue-500/15 dark:via-indigo-500/10 dark:to-zinc-800/40">
              <div className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-blue-400/10 blur-2xl" />

              <Avatar className="relative h-11 w-11 shrink-0 rounded-xl border border-white/70 shadow-sm dark:border-white/10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 font-semibold text-white">
                  {user?.name.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="relative grid min-w-0 flex-1 text-left leading-tight">
                <span className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                  {user.name}
                </span>
                <span className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {user.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>

          {/* Account Options */}
          <div className="px-1 py-2">
            <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Account
            </p>

            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/settings")}
                className="group flex h-10 cursor-pointer gap-3 rounded-lg px-2.5 text-sm transition-colors focus:bg-blue-50 dark:focus:bg-blue-500/10"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 transition-colors group-focus:bg-blue-500/15 dark:text-blue-400">
                  <UserCircleIcon size={17} />
                </div>

                <span className="flex-1 font-medium">Profile & Settings</span>

                <ChevronRight
                  size={14}
                  className="text-zinc-400 transition-transform group-focus:translate-x-0.5"
                />
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => router.push("/feedback")}
                className="group flex h-10 cursor-pointer gap-3 rounded-lg px-2.5 text-sm transition-colors focus:bg-blue-50 dark:focus:bg-blue-500/10"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <MessageSquare size={16} />
                </div>

                <span className="flex-1 font-medium">Help & Feedback</span>

                <ChevronRight
                  size={14}
                  className="text-zinc-400 transition-transform group-focus:translate-x-0.5"
                />
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </div>

          <DropdownMenuSeparator className="mx-1 bg-zinc-200/70 dark:bg-white/10" />

          {/* Logout */}
          <div className="p-1">
            <DropdownMenuItem
              onClick={() => setShowLogoutModal(true)}
              className="group flex h-10 cursor-pointer gap-3 rounded-lg px-2.5 text-sm text-destructive transition-colors focus:bg-destructive/10 focus:text-destructive"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-destructive/10 transition-colors group-focus:bg-destructive/15">
                <SignOutIcon size={17} weight="bold" />
              </div>

              <span className="font-medium">Log out</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logout confirmation modal */}
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent
          className="sm:max-w-100 rounded-2xl p-6 shadow-2xl overflow-hidden"
          showCloseButton={false}
        >
          <DialogHeader className="flex flex-col items-center text-center space-y-3 p-4 border-none">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 ring-8 ring-destructive/5">
              <SignOutIcon className="h-6 w-6 text-destructive" weight="bold" />
            </div>

            <div className="space-y-1.5">
              <DialogTitle className="text-lg font-semibold tracking-tight">
                Sign out of your account?
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                You will be logged out of this session. Make sure to save any
                pending changes before proceeding.
              </DialogDescription>
            </div>
          </DialogHeader>

          <DialogFooter className="grid grid-cols-2 gap-3 sm:space-x-0 border-none p-4">
            <Button
              variant="outline"
              onClick={() => setShowLogoutModal(false)}
              className="w-full rounded-xl h-10 font-medium hover:bg-muted/80 transition-colors"
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full rounded-xl h-10 font-medium"
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing out...
                </span>
              ) : (
                "Sign out"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
