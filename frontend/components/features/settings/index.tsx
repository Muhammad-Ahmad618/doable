"use client";
import { Suspense } from "react";
import { Header } from "./header";
import { SettingTabs } from "./tabs/settingTabs";

export function SettingsLayout() {
  return (
    <div className="space-y-5">
      <Header />
      <Suspense fallback={null}>
        <SettingTabs />
      </Suspense>
    </div>
  );
}
