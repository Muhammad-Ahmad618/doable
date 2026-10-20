import * as Yup from "yup";

export const workspaceSchema = Yup.object({
  name: Yup.string().required("Workspace name is required"),
  description: Yup.string().required("Workspace description is required"),
});
