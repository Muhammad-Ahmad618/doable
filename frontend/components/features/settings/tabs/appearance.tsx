"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ThemePreview } from "@/components/custom/appThemePreview";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Monitor, Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

type Theme = "light" | "dark" | "system";

const emptySubscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function Appearance() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const mounted = useMounted();

  const handleSelectTheme = (value: Theme) => {
    setTheme(value);
    if (value === "system") {
      toast.success(
        `Theme set to System (currently matching ${resolvedTheme ?? "system"} mode)`,
      );
    } else {
      toast.success(
        `${value.charAt(0).toUpperCase() + value.slice(1)} theme activated`,
      );
    }
  };

  const currentTheme = mounted ? theme : "dark";

  const themes: {
    value: Theme;
    label: string;
    description: string;
    icon: typeof Sun;
  }[] = [
    {
      value: "light",
      label: "Light",
      description: "Clean, light appearance",
      icon: Sun,
    },
    {
      value: "dark",
      label: "Dark",
      description: "Easy on the eyes in low light",
      icon: Moon,
    },
    {
      value: "system",
      label: "System",
      description: mounted
        ? `Syncs with your device (currently ${resolvedTheme})`
        : "Syncs with your device settings",
      icon: Monitor,
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="px-6 py-5 border-b border-border">
        <h3 className="text-base font-semibold text-foreground">Appearance</h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Customize how Doable looks for you.
        </p>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/60">
            Theme
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {themes.map(({ value, label, description, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleSelectTheme(value)}
                className={cn(
                  "text-left rounded-lg border-[1.5px] p-1 overflow-hidden transition-all cursor-pointer group hover:border-primary/50",
                  currentTheme === value
                    ? "border-primary ring-2 ring-primary/20 bg-primary-light/30"
                    : "border-border hover:border-border/80",
                )}
              >
                <ThemePreview theme={value} />
                <div className="p-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-[13px] font-medium text-foreground">
                        {label}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full border-[1.5px] transition-colors shrink-0",
                        currentTheme === value
                          ? "bg-primary border-primary"
                          : "border-muted-foreground/40",
                      )}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground/75 leading-tight">
                    {description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground/70 pt-2">
            Selecting <b className="pr-1">System</b> will automatically match
            your device&apos;s OS preference (switching between dark and light
            mode when your system theme changes).
          </p>
        </div>
      </div>
    </div>
  );
}
