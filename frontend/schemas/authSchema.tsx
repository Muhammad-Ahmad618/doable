import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Enter a valid email address"),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export const signupSchema = yup.object({
  name: yup.string().required("Full Name is Required"),

  email: yup
    .string()
    .email("Invalid email address")
    .required("Email address is required"),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password should be atleast 8 characters"),

  confirmPassword: yup
    .string()
    .required("Re-enter you password")
    .oneOf([yup.ref("password")], "Password must match"),
});

export const forgotPassword = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email address is required"),
});

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),

  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});
