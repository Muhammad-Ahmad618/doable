import * as Yup from "yup";

export const taskSchema = Yup.object({
  title: Yup.string().required("Task Title is required"),
  description: Yup.string().required("Task Description is required"),
  priority: Yup.string().required("Task Priority is required"),
  due_date: Yup.string().required("Task Due Date is required"),
});
