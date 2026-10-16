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
import { Loader2 } from "lucide-react";

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
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-full hover:bg-zinc-100 dark:hover:bg-primary/90 transition-colors outline-none cursor-pointer">
          <Avatar className="h-8 w-8 rounded-full">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="rounded-full bg-primary text-white">
              {user?.name.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 rounded-lg"
          side={isMobile ? "bottom" : "bottom"}
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">D</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <UserCircleIcon />
              Profile
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowLogoutModal(true)}
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            <SignOutIcon />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logout confirmation modal */}
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent
          className="sm:max-w-[400px] rounded-2xl p-6 shadow-2xl overflow-hidden"
          showCloseButton={false}
        >
          <DialogHeader className="flex flex-col items-center text-center space-y-3 p-4 border-none">
            {/* Ring-fenced Icon Badge */}
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
                  <Loader2 className="w-4 h-4 animate-spin" /> Signing out ...
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
