"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Profile } from "../tabs/profile";
import { AccountSecurity } from "../tabs/accountSecurity";
import { Notifications } from "../tabs/notifications";
import { Appearance } from "../tabs/appearance";
import { DangerZone } from "../tabs/dangerZone";
import { Feedback } from "../tabs/help-feedback";
import {
  User,
  ShieldCheck,
  Bell,
  Palette,
  TriangleAlert,
  MessageCircleQuestionMark,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const tabs = [
  { value: "profile", label: "Profile", icon: User },
  { value: "account-security", label: "Account & Security", icon: ShieldCheck },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "appearance", label: "Appearance", icon: Palette },
  {
    value: "help-feedback",
    label: "Help & Feedback",
    icon: MessageCircleQuestionMark,
  },
  { value: "danger-zone", label: "Danger Zone", icon: TriangleAlert },
] as const;

type TabValue = (typeof tabs)[number]["value"];
const TAB_VALUES = tabs.map((t) => t.value) as string[];

export function SettingTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
    "vertical",
  );
  const tabParam = searchParams.get("tab") ?? "";
  const activeTab: TabValue = TAB_VALUES.includes(tabParam)
    ? (tabParam as TabValue)
    : "profile";

  const handleScreenSize = () => {
    if (screen.width < 1024) {
      setOrientation("horizontal");
    } else {
      setOrientation("vertical");
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleScreenSize);
  }, [orientation]);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`/settings?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      orientation={orientation}
      className=" gap-5 xl:gap-x-10"
    >
      <div className="basis-full lg:basis-[25%]">
        <TabsList
          className={cn(
            "h-auto w-full bg-transparent p-0",
            "flex flex-nowrap items-center justify-start gap-2",
            "overflow-x-auto overflow-y-hidden",
            "scrollbar-none",
            "xl:flex-col xl:items-stretch xl:gap-2 xl:overflow-visible",
          )}
        >
          {tabs.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className={cn(
                "text-sm font-medium cursor-pointer rounded-md hover:bg-primary-light px-2 transition-colors hover:text-primary ",
                "data-[state=active]:bg-primary-light data-[state=active]:text-primary",
                value === "danger-zone"
                  ? "hover:text-destructive hover:bg-destructive/10 data-[state=active]:text-destructive data-[state=active]:bg-destructive/10"
                  : "",
              )}
              style={{
                padding: "0.7rem 0.8rem",
              }}
            >
              <Icon />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <div className="basis-[75%] rounded-xl xl:px-5">
        <TabsContent value="profile">
          <Profile />
        </TabsContent>
        <TabsContent value="account-security">
          <AccountSecurity />
        </TabsContent>
        <TabsContent value="notifications">
          <Notifications />
        </TabsContent>
        <TabsContent value="appearance">
          <Appearance />
        </TabsContent>
        <TabsContent value="help-feedback">
          <Feedback />
        </TabsContent>
        <TabsContent value="danger-zone">
          <DangerZone />
        </TabsContent>
      </div>
    </Tabs>
  );
}
