"use client";

import { useState } from "react";
import { AppInputField } from "@/components/shared/appInputField";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import FormHeader from "@/components/shared/formHeader";
import { useFormik } from "formik";
import { forgotPassword } from "@/schemas/authSchema";
import { useForgotPassword } from "@/hooks/auth/forgotPassword";

function ForgotPasswordForm() {
  const [emailSent, setEmailSent] = useState(false);

  const { mutate: forgotPasswordHook, isPending: isForgotPasswordLoading } =
    useForgotPassword();

  const formik = useFormik({
    initialValues: {
      email: "",
    },

    validationSchema: forgotPassword,

    onSubmit: (values) => {
      forgotPasswordHook(values, {
        onSuccess: () => {
          setEmailSent(true);
        },
      });
    },
  });

  return (
    <div className="w-full">
      <FormHeader
        title="Forgot Password"
        description={
          emailSent
            ? "A reset link has been sent to your email address"
            : "Enter your email to receive a reset link"
        }
      />

      {!emailSent && (
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <AppInputField
            type="email"
            id="email"
            placeholder="name@example.com"
            leftIcon={
              <Mail className="text-zinc-400 dark:text-zinc-500 w-4 h-4" />
            }
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email ? formik.errors.email : undefined}
            required
          />

          <Button
            type="submit"
            variant="default"
            disabled={isForgotPasswordLoading}
            className="w-full h-10 rounded-md font-semibold text-sm mt-2 shadow-sm cursor-pointer"
          >
            {isForgotPasswordLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending Reset Link...
              </span>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
      )}

      {emailSent && (
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Please check your inbox and follow the instructions to reset your
          password.
        </p>
      )}

      <div className="border-t border-gray-200 my-5" />

      <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-4">
        <Link
          href="/login"
          className="group flex items-center justify-center gap-1 font-medium dark:text-zinc-50 hover:text-zinc-900"
        >
          <ArrowLeft className="text-zinc-400 transition-all duration-200 group-hover:translate-x-[-4px] dark:text-zinc-500 w-4 h-4 group-hover:text-zinc-900 dark:group-hover:text-zinc-50" />
          Return to Sign In
        </Link>
      </p>
    </div>
  );
}

export default ForgotPasswordForm;
