"use client";

import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface SectionCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  accentColor?: string; // e.g. "border-t-blue-500"
}

export function StatCard({
  title,
  value,
  icon: Icon,
  accentColor = "border-t-primary",
}: SectionCardProps) {
  return (
    <Card
      className={`@container/card border-t-4 ${accentColor} p-5 shadow-sm transition-shadow hover:shadow rounded-lg`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground/70" />}
      </div>
      <div className="mt-3">
        <span className="text-3xl font-extrabold tracking-tight tabular-nums @[250px]/card:text-4xl">
          {value}
        </span>
      </div>
    </Card>
  );
}
