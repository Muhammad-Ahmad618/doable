import * as Yup from "yup";

export const taskSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required("Task title is required")
    .min(10, "Title must be at least 6 characters"),

  description: Yup.string()
    .trim()
    .required("Task description is required")
    .min(10, "Description must be at least 40 characters"),
  priority: Yup.string().required("Task Priority is required"),
  due_date: Yup.string().required("Task Due Date is required"),
});
