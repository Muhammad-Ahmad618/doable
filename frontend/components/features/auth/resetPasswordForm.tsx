"use client";

import { Button } from "@/components/ui/button";
import FormHeader from "@/components/shared/formHeader";
import { AppInputField } from "@/components/shared/appInputField";
import { useFormik } from "formik";
import { resetPasswordSchema } from "@/schemas/authSchema";
import { Loader2, Lock } from "lucide-react";
import { useResetPassword } from "@/hooks/auth/forgotPassword";
import { useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const { mutate: resetPassword, isPending } = useResetPassword();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: (values) => {
      if (!token) return;
      resetPassword({ newPassword: values?.password, token });
    },
  });

  if (!token) {
    return (
      <div className="w-full p-10 border rounded-2xl">
        <FormHeader
          title="Invalid Link"
          description="This password reset link is invalid or missing. Please request a new one."
        />
      </div>
    );
  }

  return (
    <div className="w-full p-10 border rounded-2xl">
      {/* Brand Header */}
      <FormHeader
        title="Reset Password"
        description="Enter a new password to reset your old one"
      />

      {/* Reset Password Form */}
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <AppInputField
          type="password"
          id="password"
          placeholder="Password"
          leftIcon={
            <Lock className="text-zinc-400 dark:text-zinc-500 w-4 h-4" />
          }
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password ? formik.errors.password : undefined}
          required
        />
        <AppInputField
          type="password"
          id="confirmPassword"
          placeholder="Confirm Password"
          className="text-[14px]"
          leftIcon={
            <Lock className="text-zinc-400 dark:text-zinc-500 w-4 h-4" />
          }
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.confirmPassword
              ? formik.errors.confirmPassword
              : undefined
          }
          required
        />

        <Button
          type="submit"
          variant="default"
          className="w-full h-10 rounded-md font-semibold text-sm mt-2 shadow-sm cursor-pointer"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Processing...
            </span>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </div>
  );
}

export default ResetPasswordForm;
