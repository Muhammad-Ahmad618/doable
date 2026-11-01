"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CirclePlus, Search } from "lucide-react";
import { TaskSheet } from "./taskSheet";
import { Tasks } from "@/types/task";
import { useCreateTask } from "@/hooks/user/tasks";
import { Input } from "@/components/ui/input";
import { searchProps } from "@/types/trash";

export function TaskHeader({ searchQuery, searchChange }: searchProps) {
  const [open, setOpen] = useState(false);

  const { mutateAsync: createTask, isPending } = useCreateTask();

  const handleSubmit = async (values: Tasks) => {
    try {
      await createTask({
        title: values.title,
        description: values.description,
        priority: values.priority,
        status: values.status,
        due_date: values.due_date,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Tasks</h1>
          <p className="text-sm text-zinc-500">
            Manage your personal tasks, deadlines, and priorities
          </p>
        </div>
        <div>
          <Button
            className="rounded-lg cursor-pointer text-sm px-5 py-4"
            size={"lg"}
            onClick={() => setOpen(true)}
          >
            <CirclePlus /> Add Task
          </Button>
          <TaskSheet
            open={open}
            setOpen={setOpen}
            onSubmitHandler={handleSubmit}
            isPending={isPending}
          />
        </div>
      </div>
      {/* Search */}
      <div className="relative w-full sm:w-64 my-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
        <Input
          value={searchQuery}
          onChange={(e) => searchChange(e.target.value)}
          placeholder="Search deleted tasks..."
          className="h-9 pl-9 rounded-lg text-sm bg-card border-border/80"
        />
      </div>
    </>
  );
}
