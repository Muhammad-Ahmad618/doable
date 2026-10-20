"use client";

import { ChartAreaInteractive } from "@/components/features/dashboard/taskCompletionChaart";
import { StatCard } from "@/components/features/dashboard/statsCards";
import { RecentTaskTable } from "@/components/features/dashboard/recentTaskTable";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AtRiskTaskList } from "./atRiskTaskList";
import { TaskDetailModal } from "@/components/custom/taskDetailModal";
import { useState } from "react";
import {
  useGetDashboardStats,
  useGetAtRiskTasks,
  useGetTaskTrends,
  useGetRecentTasks,
  useGetDailyFocus,
} from "@/hooks/user/dashboard";
import { recentTasks } from "@/types/dashboard";
import { Card } from "@/components/ui/card";
import { StatCardSkeleton } from "@/components/custom/stat-card-skeleton";
import { ChartSkeleton } from "@/components/custom/chart-skeleton";
import { AtRiskSkeleton } from "@/components/custom/atrisk-list-skeleton";
import { TableSkeleton } from "@/components/custom/table-skeleton";
import { SectionError } from "@/components/shared/error-block";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from "react-markdown";

// ── Dashboard ─────────────────────────────────────────────────────────────────
export function Dashboard() {
  const [selectedTask, setSelectedTask] = useState<recentTasks | null>(null);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [timeRange, setTimeRange] = useState<"6w" | "6m">("6w");
  const trendMode = timeRange === "6m" ? "monthly" : "weekly";

  const {
    data: dashboardStats,
    isLoading,
    isError,
    refetch: refetchStats,
  } = useGetDashboardStats();

  const {
    data: atriskTasks,
    isLoading: isAtRiskLoading,
    isError: isAtRiskError,
    refetch: refetchAtRisk,
  } = useGetAtRiskTasks();

  const {
    data: taskTrends,
    isLoading: isTaskTrendsLoading,
    isError: isTaskTrendsError,
    refetch: refetchTrends,
  } = useGetTaskTrends(trendMode);

  const {
    data: recentTasks,
    isLoading: isRecentTasksLoading,
    isError: isRecentTasksError,
    refetch: refetchRecentTasks,
  } = useGetRecentTasks();

  const {
    data: dailyFocus,
    isLoading: isDailyFocusLoading,
    isError: isDailyFocusError,
    error: dailyFocusError,
    refetch: refetchDailyFocus,
  } = useGetDailyFocus();

  return (
    <>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Daily Focus Banner */}
          <div className="p-4 lg:p-6 mx-6 rounded-xl border border-zinc-300 space-y-3">
            <div className="flex items-center gap-1.5 justify-start">
              <Sparkles className="text-primary size-4" />
              <p className="font-semibold text-sm text-primary">
                Daily Focus Assistant
              </p>
            </div>
            <h2 className="font-semibold text-xl">
              You have {dailyFocus?.task_analyzed || 0} high-priority tasks
              requiring attention
            </h2>
            <div className="text-zinc-500 text-xs lg:text-sm space-y-2 [&>p]:mb-2 [&>h3]:font-semibold [&>h3]:text-zinc-800 dark:[&>h3]:text-zinc-200 [&>h3]:mt-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mb-1 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol>li]:mb-1">
              {isDailyFocusLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[80%]" />
                </div>
              ) : isDailyFocusError ? (
                <span className="text-destructive">
                  Failed to load focus.{dailyFocusError.message}
                </span>
              ) : (
                <ReactMarkdown>{dailyFocus?.data}</ReactMarkdown>
              )}
            </div>
            <Button
              className="rounded-full text-sm p-5 cursor-pointer"
              size={"lg"}
              onClick={() => refetchDailyFocus()}
              disabled={isDailyFocusLoading}
            >
              {isDailyFocusLoading ? "Generating..." : "Generate Focus"}
            </Button>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-5 dark:*:data-[slot=card]:bg-card">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <StatCardSkeleton key={i} />
              ))
            ) : isError ? (
              <div className="col-span-full">
                <Card className="p-2 rounded-lg">
                  <SectionError
                    message="Could not load dashboard statistics."
                    onRetry={refetchStats}
                  />
                </Card>
              </div>
            ) : (
              <>
                <StatCard
                  title="Total Tasks"
                  value={dashboardStats?.data?.total || 0}
                />
                <StatCard
                  title="Completed"
                  value={dashboardStats?.data?.completed || 0}
                />
                <StatCard
                  title="In Progress"
                  value={dashboardStats?.data?.in_progress || 0}
                />
                <StatCard
                  title="Pending"
                  value={dashboardStats?.data?.pending || 0}
                />
                <StatCard
                  title="Overdue"
                  value={dashboardStats?.data?.overdue || 0}
                />
              </>
            )}
          </div>

          {/* Chart + At-Risk Tasks */}
          <div className="grid grid-cols-3 gap-3 px-4 lg:px-6">
            <div className="col-span-2">
              {isTaskTrendsLoading ? (
                <ChartSkeleton />
              ) : isTaskTrendsError ? (
                <Card className="rounded-lg h-full">
                  <SectionError
                    message="Could not load task trend data."
                    onRetry={refetchTrends}
                  />
                </Card>
              ) : (
                <ChartAreaInteractive
                  chartData={taskTrends || []}
                  timeRange={timeRange}
                  onTimeRangeChange={(v) => setTimeRange(v as "6w" | "6m")}
                />
              )}
            </div>

            {/* At-Risk Tasks Panel */}
            {isAtRiskLoading ? (
              <AtRiskSkeleton />
            ) : isAtRiskError ? (
              <div className="col-span-1 border border-border rounded-lg bg-card shadow-sm">
                <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-border">
                  <span className="font-semibold text-sm">At-Risk Tasks</span>
                </div>
                <SectionError
                  message="Could not load at-risk tasks."
                  onRetry={refetchAtRisk}
                />
              </div>
            ) : (
              <AtRiskTaskList atRiskTasks={atriskTasks || []} />
            )}
          </div>

          {/* Recent Tasks Table */}
          <div className="px-4 lg:px-6">
            {isRecentTasksLoading ? (
              <TableSkeleton />
            ) : isRecentTasksError ? (
              <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="px-5 py-3 border-b border-border">
                  <h2 className="text-base font-semibold tracking-tight">
                    Recent Tasks
                  </h2>
                </div>
                <SectionError
                  message="Could not load recent tasks."
                  onRetry={refetchRecentTasks}
                />
              </div>
            ) : (
              <RecentTaskTable
                tasks={recentTasks || []}
                onView={(task) => {
                  setSelectedTask(task);
                  setOpenDetail(true);
                }}
              />
            )}
          </div>
        </div>
      </div>
      <TaskDetailModal
        key={selectedTask?.task_id}
        task={selectedTask || undefined}
        open={openDetail}
        onOpenChange={setOpenDetail}
      />
    </>
  );
}
