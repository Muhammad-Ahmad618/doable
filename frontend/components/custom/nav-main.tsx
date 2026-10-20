"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ReactNode;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu className="space-y-1">
          {items.map((item) => (
            <SidebarMenuItem key={item?.title}>
              <SidebarMenuButton
                asChild
                tooltip={item?.title}
                className="py-5 px-4 rounded-md hover:bg-primary dark:hover:bg-secondary-foreground transition-all duration-200 font-medium text-zinc-600 dark:text-zinc-400 hover:text-white dark:hover:text-white group border border-transparent dark:hover:border-zinc-700 [&_svg]:size-4.5"
                isActive={pathname === item.url}
              >
                <Link href={item.url}>
                  <div>{item?.icon}</div>
                  <span className="text-sm ml-2">{item?.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
