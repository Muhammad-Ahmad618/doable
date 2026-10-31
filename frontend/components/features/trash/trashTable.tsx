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
  RotateCcw,
  Eye,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tasks } from "@/types/task";
import { StatusLabel } from "@/components/shared/status-label";

const columns = [
  "ID",
  "Title",
  "Priority",
  "Assignee",
  "Workspace",
  "Due Date",
  "Status",
  "Actions",
] as const;

interface TrashTableProps {
  data: Tasks[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onView: (task: Tasks) => void;
  onRestore: (task: Tasks) => void;
}

export function TrashTable({
  data,
  pagination,
  onPageChange,
  onLimitChange,
  onView,
  onRestore,
}: TrashTableProps) {
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10;
  const total = pagination?.total ?? data.length;
  const totalPages =
    pagination?.totalPages || Math.max(1, Math.ceil(total / limit));

  const startResult = total === 0 ? 0 : (page - 1) * limit + 1;
  const endResult = Math.min(page * limit, total);

  if (!data || data.length === 0) {
    return (
      <div className="mt-5 rounded-2xl border border-dashed border-border bg-card/60 p-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground ring-8 ring-muted/20">
          <Trash2 className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">
          Trash is empty
        </h3>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
          Tasks you delete will appear here. You can view their full information
          and restore them at any time.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-xl border border-border bg-card text-card-foreground shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent text-[13px]">
              {columns.map((col) => (
                <TableHead
                  key={col}
                  className="py-3 px-5 font-semibold whitespace-nowrap"
                >
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((task) => (
              <TableRow
                key={task.task_id}
                className="hover:bg-muted/25 text-[13px] transition-colors"
              >
                <TableCell className="py-3 px-5 whitespace-nowrap font-mono text-xs text-muted-foreground">
                  #{task.task_id}
                </TableCell>
                <TableCell className="py-3 px-5 whitespace-nowrap font-medium text-foreground max-w-xs truncate">
                  <button
                    type="button"
                    onClick={() => onView(task)}
                    className="hover:underline text-left cursor-pointer truncate max-w-full block"
                    title={task.title}
                  >
                    {task.title}
                  </button>
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
                    className="rounded-md text-[11px] capitalize"
                  >
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 px-5 whitespace-nowrap text-muted-foreground">
                  {task.assignee || "-"}
                </TableCell>
                <TableCell className="py-3 px-5 whitespace-nowrap text-muted-foreground">
                  {task.workspace || "-"}
                </TableCell>
                <TableCell className="py-3 px-5 whitespace-nowrap text-muted-foreground">
                  {task.due_date ? formatDate(task.due_date) : "-"}
                </TableCell>
                <TableCell className="py-3 px-5 whitespace-nowrap">
                  <StatusLabel status={task.status || "pending"} />
                </TableCell>
                <TableCell className="py-3 px-5 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    {/* Quick inline restore button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onRestore(task)}
                      className="h-8 px-2.5 rounded-lg text-xs gap-1.5 font-medium hover:bg-primary-light hover:text-primary border-border cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Restore</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-col gap-4 border-t border-border/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-4 sm:justify-start">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="hidden sm:inline">Rows per page</span>
            <span className="sm:hidden">Rows</span>
            <Select
              value={String(limit)}
              onValueChange={(val) => onLimitChange?.(Number(val))}
            >
              <SelectTrigger className="h-8 w-16 rounded-md text-xs">
                <SelectValue placeholder={String(limit)} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <span className="text-xs text-muted-foreground">
            {startResult}–{endResult} of {total}
          </span>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2.5 rounded-md text-xs cursor-pointer disabled:opacity-40"
            disabled={page <= 1}
            onClick={() => onPageChange?.(page - 1)}
          >
            <ChevronLeft className="h-3.5 w-3.5 mr-1" />
            Previous
          </Button>
          <span className="text-xs text-muted-foreground px-1">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2.5 rounded-md text-xs cursor-pointer disabled:opacity-40"
            disabled={page >= totalPages}
            onClick={() => onPageChange?.(page + 1)}
          >
            Next
            <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
