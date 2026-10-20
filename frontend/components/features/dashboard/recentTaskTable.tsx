"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EllipsisVertical, Info, CheckCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusLabel } from "@/components/shared/status-label";
import { recentTasks } from "@/types/dashboard";
import { formatDate } from "@/lib/dateFormater";
import { toast } from "sonner";

function handleMarkAsDone(task: recentTasks) {
  toast.success(`${task?.title} marked as done`);
}

export function RecentTaskTable({
  tasks,
  onView,
}: {
  tasks: recentTasks[];
  onView: (task: recentTasks) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-semibold tracking-tight">Recent Tasks</h2>
      </div>
      <div className="rounded-xl border border-border overflow-hidden bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-5 font-semibold w-14">Id</TableHead>
              <TableHead className="px-5 font-semibold">Title</TableHead>
              <TableHead className="px-4 font-semibold">Priority</TableHead>
              <TableHead className="px-4 font-semibold">Due Date</TableHead>
              <TableHead className="px-4 font-semibold">Assignee</TableHead>
              <TableHead className="px-4 font-semibold">Workspace</TableHead>
              <TableHead className="px-4 font-semibold">Status</TableHead>
              <TableHead className="pr-5 text-right font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task, idx) => (
              <TableRow key={idx} className="hover:bg-muted/20">
                <TableCell className="px-5 py-3 text-muted-foreground font-medium">
                  {idx + 1}
                </TableCell>
                <TableCell className="font-medium px-5 py-3">
                  {task.title}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <Badge
                    variant={
                      task.priority === "high"
                        ? "destructive"
                        : task.priority === "medium"
                          ? "default"
                          : "secondary"
                    }
                    className="rounded-md"
                  >
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-muted-foreground">
                  {formatDate(task.due_date)}
                </TableCell>
                <TableCell className="px-4 py-3">
                  {task.assignee_name || "______"}
                </TableCell>
                <TableCell className="px-4 py-3">
                  {task.workspace_name || "_____"}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <StatusLabel status={task?.status || "pending"} />
                </TableCell>
                <TableCell className="pr-5 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md"
                      >
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="rounded-md p-2 w-40 max-w-full"
                    >
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() => onView(task)}
                          className="rounded-sm"
                        >
                          <Info className="size-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleMarkAsDone(task)}
                          className="rounded-sm"
                        >
                          <CheckCheck className="size-4 mr-2" /> Mark as Done
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
