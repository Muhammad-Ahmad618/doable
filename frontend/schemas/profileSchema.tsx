import * as yup from "yup";

export const profileSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  bio: yup.string(),
});
