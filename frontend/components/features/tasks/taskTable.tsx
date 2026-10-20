"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/dateFormater";
import {
  EllipsisVertical,
  ChevronLeft,
  ChevronRight,
  Trash,
  Info,
  SquarePen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tasks, TaskTableProps } from "@/types/task";
import { StatusLabel } from "@/components/shared/status-label";

const columns = [
  "id",
  "Title",
  "Priority",
  "Assignee",
  "Workspace",
  "Due Date",
  "Status",
  "Actions",
] as const;

interface TaskRowProps {
  task: Tasks;
  onView?: (task: Tasks) => void;
  onEdit?: (id: Tasks) => void;
  onDelete?: (id: Tasks) => void;
}

function TaskRow({ task, onView, onEdit, onDelete }: TaskRowProps) {
  return (
    <TableRow
      className="hover:bg-muted/20 text-[13px] overflow-hidden
    "
    >
      <TableCell className="py-3 px-5 whitespace-nowrap">
        {task?.task_id}
      </TableCell>
      <TableCell className="py-3 px-5 whitespace-nowrap">
        {task.title}
      </TableCell>
      <TableCell className="py-3 px-5 whitespace-nowrap">
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
          {task?.priority}
        </Badge>
      </TableCell>
      <TableCell className="py-3 px-5 whitespace-nowrap">
        {task?.assignee || "-"}
      </TableCell>
      <TableCell className="py-3 px-5 whitespace-nowrap">
        {task?.workspace || "-"}
      </TableCell>
      <TableCell className="py-3 px-5 whitespace-nowrap">
        {formatDate(task?.due_date)}
      </TableCell>
      <TableCell className="py-3 px-5 whitespace-nowrap">
        <StatusLabel status={task?.status || "Pending"} />
      </TableCell>
      <TableCell className="py-3 px-5 whitespace-nowrap">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-lg">
              <EllipsisVertical className="h-4 w-4 " />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-md p-2 w-40">
            <DropdownMenuItem
              onClick={() => onView?.(task)}
              className="cursor-pointer h-8 rounded-sm"
            >
              <Info className="h-4 w-4 mr-2" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onEdit?.(task)}
              className="cursor-pointer h-8 rounded-sm"
            >
              <SquarePen className="h-4 w-4 mr-2" /> Edit Task
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete?.(task)}
              variant="destructive"
              className="cursor-pointer h-8 rounded-sm"
            >
              <Trash className="h-4 w-4 mr-2" /> Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export function TaskTable({
  data,
  pagination,
  onPageChange,
  onLimitChange,
  onView,
  onEdit,
  onDelete,
}: TaskTableProps) {
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10;
  const total = pagination?.total || 0;
  const totalPages = pagination?.totalPages || 1;

  // Calculate row boundaries for display (e.g. "1-10 of 45")
  const startResult = total === 0 ? 0 : (page - 1) * limit + 1;
  const endResult = Math.min(page * limit, total);

  return (
    <div className="mt-5 rounded-md border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
      <Table className="w-full">
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent text-[13px]">
            {columns.map((col) => (
              <TableHead
                key={col}
                className="p-5 font-semibold whitespace-nowrap"
              >
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((task) => (
            <TaskRow
              key={task.task_id}
              task={task}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-col gap-4 border-t border-border/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Rows per page + result count */}
        <div className="flex items-center justify-between gap-4 sm:justify-start">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="hidden sm:inline text-xs">Rows per page</span>
            <span className="sm:hidden">Show</span>

            <Select
              value={limit.toString()}
              onValueChange={(val) => onLimitChange?.(Number(val))}
            >
              <SelectTrigger className="h-8 w-[68px] rounded-md text-xs">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-xs text-muted-foreground sm:hidden">
            {startResult}–{endResult} of {total}
          </div>
        </div>

        {/* Desktop result count */}
        <div className="hidden text-xs text-muted-foreground sm:block">
          Showing{" "}
          <span className="font-medium text-foreground">{startResult}</span> to{" "}
          <span className="font-medium text-foreground">{endResult}</span> of{" "}
          <span className="font-medium text-foreground">{total}</span> results
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            disabled={page <= 1}
            onClick={() => onPageChange?.(page - 1)}
            className="h-8 w-8 rounded-md text-muted-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            className="h-8 min-w-8 rounded-md px-2 text-xs"
          >
            {page}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            disabled={page >= totalPages}
            onClick={() => onPageChange?.(page + 1)}
            className="h-8 w-8 rounded-md text-muted-foreground"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
