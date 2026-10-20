"use client";

import * as React from "react";

import { NavMain } from "@/components/custom/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  Clipboard,
  Folder,
  Settings,
  MessageSquare,
} from "lucide-react";

const data = {
  user: {
    name: "Doable",
    email: "admin@doable.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboard />,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: <Clipboard />,
    },
    {
      title: "Workspace",
      url: "/workspace",
      icon: <Folder />,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: <Settings />,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: <MessageSquare />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-2! hover:bg-transparent! h-auto"
            >
              <a href="#" className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-linear-to-br from-[#4e85fa] to-[#2e1dea]   text-white dark:bg-white dark:text-zinc-950 font-black text-lg tracking-wider">
                  D
                </div>
                <span className="text-xl font-bold tracking-tight">Doable</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
