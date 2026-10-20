"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { TaskSheet } from "./taskSheet";
import { Tasks } from "@/types/task";
import { useCreateTask } from "@/hooks/user/tasks";

export function TaskHeader() {
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
  );
}
