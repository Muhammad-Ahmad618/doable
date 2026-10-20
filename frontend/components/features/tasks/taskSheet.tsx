"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AppInputField } from "@/components/shared/appInputField";
import { AppTextareaField } from "@/components/shared/appTextareaField";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import { Loader2 } from "lucide-react";
import { taskSchema } from "@/schemas/taskSchema";
import { AppDropDown } from "@/components/shared/app-dropdown";
import { TaskSheetProps } from "@/types/task";

export function TaskSheet({
  open,
  setOpen,
  onSubmitHandler,
  task,
  isPending,
}: TaskSheetProps) {
  const isUpdate = !!task;

  const formik = useFormik({
    initialValues: {
      task_id: task?.task_id || 0,
      title: task?.title || "",
      description: task?.description || "",
      priority: task?.priority || "low",
      status: task?.status || "pending",
      due_date: task?.due_date || "",
    },
    validationSchema: taskSchema,
    onSubmit: async (values) => {
      if (onSubmitHandler) {
        await onSubmitHandler(values);
      } else {
        console.log(values);
      }

      formik.resetForm();
      setOpen(false);
    },
    enableReinitialize: true,
  });

  return (
    <div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="max-w-md!">
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold">
              {isUpdate ? "Update Task" : "Create Task"}
            </SheetTitle>
            <SheetDescription>
              {isUpdate
                ? "Update Task Details"
                : "Fill in the details to create your own personal tasks"}
            </SheetDescription>
            <div className="p-2 mt-4 text-left">
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <AppInputField
                  label="Title"
                  type="text"
                  id="title"
                  placeholder="Task Title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title ? formik.errors.title : undefined}
                  required
                />

                <AppTextareaField
                  label="Description"
                  id="description"
                  placeholder="Describe the task details..."
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.description
                      ? formik.errors.description
                      : undefined
                  }
                  required
                />

                <AppInputField
                  label="Due Date"
                  type="date"
                  id="due_date"
                  value={formik.values.due_date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.due_date ? formik.errors.due_date : undefined
                  }
                  required
                />

                <AppDropDown
                  label="Priority"
                  id="priority"
                  placeholder="Select Priority"
                  value={formik.values?.priority || "Low"}
                  onValueChange={(value) =>
                    formik.setFieldValue("priority", value)
                  }
                  options={[
                    { label: "Low", value: "low" },
                    { label: "Medium", value: "medium" },
                    { label: "High", value: "high" },
                  ]}
                  error={
                    formik.touched.priority ? formik.errors.priority : undefined
                  }
                  required
                />
                <AppDropDown
                  label="Status"
                  id="status"
                  placeholder="Select Status"
                  value={formik.values?.status || "pending"}
                  onValueChange={(value) =>
                    formik.setFieldValue("status", value)
                  }
                  options={[
                    { label: "Pending", value: "pending" },
                    { label: "In Progress", value: "in_progress" },
                    { label: "Done", value: "completed" },
                  ]}
                  error={
                    formik.touched.status ? formik.errors.status : undefined
                  }
                  required
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="default"
                    className="w-full h-10 rounded-md font-semibold text-sm shadow-sm cursor-pointer"
                    disabled={isPending}
                  >
                    <span className="flex items-center gap-2">
                      {isPending && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      {isPending
                        ? isUpdate
                          ? "Saving..."
                          : "Creating..."
                        : isUpdate
                          ? "Save Changes"
                          : "Create Task"}
                    </span>
                  </Button>
                </div>
              </form>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}
