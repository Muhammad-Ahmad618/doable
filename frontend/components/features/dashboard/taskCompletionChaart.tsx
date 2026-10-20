"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { DashboardTrends } from "@/types/dashboard";
import {
  Card,
  CardAction,
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

export const description = "A bar chart showing task completion";

const weeklyData = [
  { week: "Week 1", completed: 12, inProgress: 5, overdue: 2 },
  { week: "Week 2", completed: 18, inProgress: 7, overdue: 1 },
  { week: "Week 3", completed: 9, inProgress: 10, overdue: 3 },
  { week: "Week 4", completed: 22, inProgress: 4, overdue: 0 },
  { week: "Week 5", completed: 15, inProgress: 8, overdue: 2 },
  { week: "Week 6", completed: 27, inProgress: 6, overdue: 1 },
];

const monthlyData = [
  { week: "Jan", completed: 48, inProgress: 15, overdue: 5 },
  { week: "Feb", completed: 62, inProgress: 20, overdue: 3 },
  { week: "Mar", completed: 55, inProgress: 18, overdue: 7 },
  { week: "Apr", completed: 70, inProgress: 12, overdue: 2 },
  { week: "May", completed: 83, inProgress: 10, overdue: 4 },
  { week: "Jun", completed: 91, inProgress: 8, overdue: 1 },
];

const chartConfig = {
  completed: {
    label: "Completed",
    color: "var(--primary)",
  },
  in_progress: {
    label: "In Progress",
    color: "hsl(210 80% 60%)",
  },
  overdue: {
    label: "Overdue",
    color: "hsl(0 72% 60%)",
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
    <Card className="@container/card rounded-lg h-full">
      <CardHeader>
        <CardTitle>Task Completion</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Overview of task completion, in-progress, and overdue tasks
          </span>
          <span className="@[540px]/card:hidden">Task breakdown</span>
        </CardDescription>
        <CardAction>
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger
              className="w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              size="sm"
              aria-label="Select time range"
            >
              <SelectValue placeholder="Last 6 weeks" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="6w" className="rounded-lg">
                Last 6 weeks
              </SelectItem>
              <SelectItem value="6m" className="rounded-lg">
                Last 6 months
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-2 sm:px-6 sm:pt-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart data={chartData ?? []} barCategoryGap="30%" barGap={3}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
              width={30}
            />
            <ChartTooltip
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="completed"
              fill="var(--color-completed)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="in_progress"
              fill="var(--color-inProgress)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="overdue"
              fill="var(--color-overdue)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
