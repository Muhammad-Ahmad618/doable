"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { DashboardTrends } from "@/types/dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartConfig = {
  completed: {
    label: "Completed",
    color: "hsl(142 71% 45%)",
  },
  in_progress: {
    label: "In Progress",
    color: "hsl(217 91% 60%)",
  },
  pending: {
    label: "Pending",
    color: "hsl(43 96% 56%)",
  },
  overdue: {
    label: "Overdue",
    color: "hsl(0 72% 55%)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({
  chartData,
  timeRange,
  onTimeRangeChange,
}: {
  chartData: DashboardTrends[];
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
}) {
  return (
    <Card className="@container/card h-full overflow-visible rounded-xl shadow-[0_1px_2px_rgba(15,23,42,0.06),0_4px_12px_rgba(15,23,42,0.06),0_12px_28px_-8px_rgba(15,23,42,0.10)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_8px_24px_rgba(0,0,0,0.35)]">
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">
            Task Completion
          </CardTitle>
          <CardDescription className="text-xs">
            Track your workspace activity over time
          </CardDescription>
        </div>

        <Select value={timeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger
            className="h-9 w-36.25 shrink-0 rounded-lg bg-muted/40 text-xs"
            size="sm"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Select range" />
          </SelectTrigger>

          <SelectContent
            position="popper"
            side="bottom"
            align="end"
            sideOffset={6}
            className="min-w-36.25 rounded-lg"
          >
            <SelectItem value="6w" className="rounded-md text-xs">
              Last 6 weeks
            </SelectItem>
            <SelectItem value="6m" className="rounded-md text-xs">
              Last 6 months
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pb-4 pt-4 sm:px-5">
        <ChartContainer
          config={chartConfig}
          className="h-65 w-full
    [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground
    [&_.recharts-cartesian-grid_line]:stroke-border"
        >
          <BarChart
            accessibilityLayer
            data={chartData ?? []}
            margin={{ top: 12, right: 8, left: 8, bottom: 0 }}
            barCategoryGap="30%"
            barGap={4}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              opacity={0.6}
            />

            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fontSize: 11 }}
              minTickGap={12}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fontSize: 11 }}
              width={45}
              allowDecimals={false}
            />

            <ChartTooltip
              cursor={{ className: "fill-muted/40" }}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  className="rounded-xl shadow-lg"
                />
              }
            />

            <ChartLegend
              verticalAlign="bottom"
              content={<ChartLegendContent className="pt-4 text-xs" />}
            />

            <Bar
              dataKey="completed"
              fill="var(--color-completed)"
              radius={[5, 5, 0, 0]}
              maxBarSize={36}
            />

            <Bar
              dataKey="in_progress"
              fill="var(--color-in_progress)"
              radius={[5, 5, 0, 0]}
              maxBarSize={36}
            />

            <Bar
              dataKey="pending"
              fill="var(--color-pending)"
              radius={[5, 5, 0, 0]}
              maxBarSize={36}
            />

            <Bar
              dataKey="overdue"
              fill="var(--color-overdue)"
              radius={[5, 5, 0, 0]}
              maxBarSize={36}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
