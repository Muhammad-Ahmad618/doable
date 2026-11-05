"use client";

import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface SectionCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  accentColor?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  accentColor = "text-primary",
}: SectionCardProps) {
  return (
    <Card
      className="group relative overflow-hidden rounded-2xl border border-border/50
        bg-gradient-to-br from-card via-card to-muted/40 p-6
        shadow-[0_1px_2px_rgba(15,23,42,0.06),0_4px_12px_rgba(15,23,42,0.06),0_12px_28px_-8px_rgba(15,23,42,0.10)]
        transition-all duration-300 ease-out
        hover:-translate-y-1
        hover:shadow-[0_2px_4px_rgba(15,23,42,0.08),0_10px_24px_rgba(15,23,42,0.10),0_20px_40px_-12px_rgba(15,23,42,0.16)]
        dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_8px_24px_rgba(0,0,0,0.35)]"
    >
      {/* Thin light line on top edge for a glassy look */}
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/15" />

      {/* Soft colored glow in the corner */}
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-current opacity-[0.07] blur-3xl transition-opacity duration-500 group-hover:opacity-[0.14] ${accentColor}`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {title}
        </p>

        {Icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background shadow-[0_1px_2px_rgba(15,23,42,0.08),inset_0_0_0_1px_rgba(15,23,42,0.06)] transition-transform duration-300 group-hover:scale-105 dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
            <Icon className={`h-5 w-5 ${accentColor}`} strokeWidth={2} />
          </div>
        )}
      </div>

      <div className="relative mt-5">
        <p className="text-4xl font-semibold tracking-tight tabular-nums text-foreground">
          {value}
        </p>

        {description && (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {/* Accent line that grows on hover */}
      <div
        className={`absolute bottom-0 left-0 h-[3px] w-10 rounded-r-full bg-current opacity-80 transition-all duration-500 group-hover:w-full ${accentColor}`}
      />
    </Card>
  );
}
