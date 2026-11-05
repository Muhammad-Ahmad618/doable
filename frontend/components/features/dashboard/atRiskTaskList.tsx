"use client";

import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { AtriskTaskItem } from "@/types/dashboard";
import { formatDate } from "@/lib/dateFormater";

/* ---------- helpers ---------- */

function riskStyle(score: number) {
  if (score >= 70)
    return {
      label: "High",
      text: "text-red-600 dark:text-red-400",
      stripe: "bg-red-500 dark:bg-red-400",
      glow: "group-hover:shadow-[0_0_0_1px_rgba(239,68,68,0.25)]",
    };
  if (score >= 40)
    return {
      label: "Medium",
      text: "text-amber-600 dark:text-amber-400",
      stripe: "bg-amber-500 dark:bg-amber-400",
      glow: "group-hover:shadow-[0_0_0_1px_rgba(245,158,11,0.25)]",
    };
  return {
    label: "Low",
    text: "text-emerald-600 dark:text-emerald-400",
    stripe: "bg-emerald-500 dark:bg-emerald-400",
    glow: "group-hover:shadow-[0_0_0_1px_rgba(16,185,129,0.25)]",
  };
}

function dueInfo(task: AtriskTaskItem) {
  const d = task.daysUntilDue;
  if (typeof d !== "number") {
    return { label: formatDate(task.due_date), overdue: false };
  }
  if (d < 0) {
    const n = Math.abs(d);
    return { label: `${n} day${n > 1 ? "s" : ""} overdue`, overdue: true };
  }
  if (d === 0) return { label: "Due today", overdue: false };
  if (d === 1) return { label: "Due tomorrow", overdue: false };
  return { label: `Due in ${d} days`, overdue: false };
}

const priorityDot: Record<string, string> = {
  high: "bg-red-500 dark:bg-red-400",
  medium: "bg-amber-500 dark:bg-amber-400",
  low: "bg-slate-400 dark:bg-slate-500",
};

/* ---------- circular risk gauge ---------- */

function RiskRing({ score, className }: { score: number; className: string }) {
  const size = 44;
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const value = Math.min(100, Math.max(0, score));
  const offset = c - (value / 100) * c;

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.15"
          strokeWidth={stroke}
        />
        {/* progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold tabular-nums">
        {value}
      </span>
    </div>
  );
}

/* ---------- main component ---------- */

export function AtRiskTaskList({
  atRiskTasks,
}: {
  atRiskTasks: AtriskTaskItem[];
}) {
  const tasks = [...atRiskTasks].sort((a, b) => b.risk_score - a.risk_score);

  return (
    <div
      className="group/card relative col-span-full xl:col-span-1 flex flex-col overflow-hidden rounded-2xl border border-border/50
        bg-linear-to-b from-card to-muted/30
        shadow-[0_1px_2px_rgba(15,23,42,0.06),0_4px_12px_rgba(15,23,42,0.06),0_12px_28px_-8px_rgba(15,23,42,0.10)]
        dark:from-card dark:to-card/60
        dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_8px_24px_rgba(0,0,0,0.35)]"
    >
      {/* thin light line on the top edge */}
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-white/70 to-transparent dark:via-white/15" />

      {/* soft red glow in the corner */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-red-500 opacity-[0.06] blur-3xl dark:opacity-[0.12]" />

      {/* Header */}
      <div className="relative flex items-center gap-3 border-b border-border/50 px-5 py-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10 ring-1 ring-inset ring-red-500/20">
          <AlertTriangle className="size-4 text-red-600 dark:text-red-400" />
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-tight">At-Risk Tasks</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Needs your attention
          </p>
        </div>

        {tasks.length > 0 && (
          <span className="ml-auto rounded-full bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-red-600 ring-1 ring-inset ring-red-500/20 dark:text-red-400">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </span>
        )}
      </div>

      {/* Empty state */}
      {tasks.length === 0 ? (
        <div className="relative flex flex-1 flex-col items-center justify-center gap-3 px-5 py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-inset ring-emerald-500/20">
            <CheckCircle2 className="size-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-medium">Nothing at risk</p>
            <p className="mt-1 text-xs text-muted-foreground">
              All your tasks are on track.
            </p>
          </div>
        </div>
      ) : (
        <ul className="relative max-h-[47vh] flex-1 space-y-1.5 overflow-auto p-2.5 [scrollbar-width:thin]">
          {tasks.map((task) => {
            const risk = riskStyle(task.risk_score);
            const due = dueInfo(task);

            return (
              <li
                key={task.task_id}
                className={`group relative cursor-pointer overflow-hidden rounded-xl border border-border/40
                  bg-background/60 py-3 pl-5 pr-3.5
                  transition-all duration-200
                  hover:-translate-y-px hover:border-border hover:bg-muted/50
                  dark:bg-white/[0.02] dark:hover:bg-white/[0.05] ${risk.glow}`}
              >
                {/* colored stripe on the left */}
                <span
                  className={`absolute inset-y-2.5 left-0 w-1 rounded-r-full ${risk.stripe}`}
                />

                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    {/* title */}
                    <div className="flex items-center gap-2">
                      <span
                        title={`${task.priority} priority`}
                        className={`size-1.5 shrink-0 rounded-full ${
                          priorityDot[task.priority] ?? "bg-slate-400"
                        }`}
                      />
                      <p className="truncate text-sm font-medium text-foreground">
                        {task.title}
                      </p>
                    </div>

                    {/* due + assignee */}
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                      {due.overdue && (
                        <Clock className="size-3 shrink-0 text-red-600 dark:text-red-400" />
                      )}
                      <span
                        className={
                          due.overdue
                            ? "font-medium text-red-600 dark:text-red-400"
                            : "text-muted-foreground"
                        }
                      >
                        {due.label}
                      </span>
                      <span className="text-muted-foreground/60">·</span>
                      <span className="truncate text-muted-foreground">
                        {task.assigned_to || "me"}
                      </span>
                    </div>
                  </div>

                  {/* risk ring */}
                  <div className="flex flex-col items-center gap-0.5">
                    <RiskRing score={task.risk_score} className={risk.text} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
