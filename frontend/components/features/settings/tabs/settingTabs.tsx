"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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

const Profile = dynamic(
  () => import("../tabs/profile").then((m) => m.Profile),
  { loading: () => <div className="h-48 rounded-xl bg-muted/30 animate-pulse" /> },
);
const AccountSecurity = dynamic(
  () => import("../tabs/accountSecurity").then((m) => m.AccountSecurity),
  { loading: () => <div className="h-48 rounded-xl bg-muted/30 animate-pulse" /> },
);
const Notifications = dynamic(
  () => import("../tabs/notifications").then((m) => m.Notifications),
  { loading: () => <div className="h-48 rounded-xl bg-muted/30 animate-pulse" /> },
);
const Appearance = dynamic(
  () => import("../tabs/appearance").then((m) => m.Appearance),
  { loading: () => <div className="h-48 rounded-xl bg-muted/30 animate-pulse" /> },
);
const Feedback = dynamic(
  () => import("../tabs/help-feedback").then((m) => m.Feedback),
  { loading: () => <div className="h-48 rounded-xl bg-muted/30 animate-pulse" /> },
);
const DangerZone = dynamic(
  () => import("../tabs/dangerZone").then((m) => m.DangerZone),
  { loading: () => <div className="h-48 rounded-xl bg-muted/30 animate-pulse" /> },
);

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

  const handleScreenSize = useCallback(() => {
    if (window.innerWidth < 1024) {
      setOrientation("horizontal");
    } else {
      setOrientation("vertical");
    }
  }, []);

  useEffect(() => {
    handleScreenSize();
    window.addEventListener("resize", handleScreenSize);
    return () => window.removeEventListener("resize", handleScreenSize);
  }, [handleScreenSize]);

  const handleTabChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", value);
      router.replace(`/settings?${params.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

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
