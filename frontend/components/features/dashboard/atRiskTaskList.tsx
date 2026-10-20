"use client";

import { AlertTriangle, CalendarDays, TrendingUp, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AtriskTaskItem } from "@/types/dashboard";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/dateFormater";

export function AtRiskTaskList({
  atRiskTasks,
}: {
  atRiskTasks: AtriskTaskItem[];
}) {
  return (
    <div className="col-span-1 border border-border rounded-lg bg-card shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-border">
        <AlertTriangle className="size-4 text-destructive shrink-0" />
        <h3 className="font-semibold text-sm">At-Risk Tasks</h3>
        <Badge
          variant="destructive"
          className="rounded-full text-[10px] px-2 py-0.5 font-semibold tracking-wide uppercase"
        >
          Critical
        </Badge>
      </div>
      {/* Task List */}
      <div className="flex flex-col gap-0 flex-1 divide-y divide-border max-h-[47vh] overflow-auto">
        {atRiskTasks.map((task) => (
          <div
            key={task.task_id}
            className="flex flex-col gap-2 px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer "
          >
            {/* Title row */}
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium leading-snug line-clamp-2">
                {task.title}
              </p>
              <Badge
                variant={task.priority === "high" ? "destructive" : "secondary"}
                className="rounded-md text-[10px] px-1.5 py-0.5 shrink-0"
              >
                {task.priority}
              </Badge>
            </div>
            {/* Meta row */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="size-3" />
                {task.assigned_to || "me"}
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays className="size-3" />
                {formatDate(task.due_date)}
              </span>
            </div>
            {/* Risk bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <TrendingUp className="size-3" />
                  Risk Score
                </span>
                <span
                  className={`text-[11px] font-semibold ${
                    task.risk_score >= 80
                      ? "text-destructive"
                      : task.risk_score >= 60
                        ? "text-amber-500"
                        : "text-emerald-500"
                  }`}
                >
                  {task.risk_score}%
                </span>
              </div>

              <Progress
                value={task.risk_score}
                className="h-1.5 w-full rounded-full bg-muted overflow-hidden"
                indicatorClassName={`${
                  task.risk_score >= 80
                    ? "bg-red-500"
                    : task.risk_score >= 60
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
              />
              {/* 
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    task.riskLevel >= 80
                      ? "bg-destructive"
                      : task.riskLevel >= 60
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                  }`}
                  style={{ width: `${task.riskLevel}%` }}
                />
              </div> */}
            </div>
            {task.daysUntilDue < 0 && (
              <p className="text-[11px] font-medium text-destructive">
                ⚠ {task.daysUntilDue} day{task.daysUntilDue > 1 ? "s" : ""}{" "}
                overdue
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
