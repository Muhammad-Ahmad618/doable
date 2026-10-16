"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemePreview } from "@/components/custom/appThemePreview";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

const themes: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export function Appearance() {
  const [theme, setTheme] = useState<Theme>("dark");

  const handleSave = () => {
    localStorage.setItem("doable-theme", theme);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="px-6 py-5 border-b border-border">
        <h3 className="text-base font-semibold text-foreground">Appearance</h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Customize how Doable looks for you.
        </p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Theme */}
        <div className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/60">
            Theme
          </p>
          <div className="grid grid-cols-3 gap-3">
            {themes.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                className={cn(
                  "text-left rounded-lg border-[1.5px] overflow-hidden transition-colors",
                  theme === value
                    ? "border-primary"
                    : "border-border hover:border-border/80",
                )}
              >
                <ThemePreview theme={value} />
                <div className="flex items-center gap-2 px-2 py-2">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full border-[1.5px] transition-colors shrink-0",
                      theme === value
                        ? "bg-primary border-primary"
                        : "border-muted-foreground/40",
                    )}
                  />
                  <span className="text-[13px] font-medium text-foreground">
                    {label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-border bg-muted/30">
        <Button
          type="button"
          variant="outline"
          className="rounded-md cursor-pointer"
          onClick={() => {
            setTheme("dark");
          }}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className="rounded-md cursor-pointer"
          onClick={handleSave}
        >
          Save changes
        </Button>
      </div>
    </div>
  );
}
