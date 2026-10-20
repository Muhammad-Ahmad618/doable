"use client";

import { AppInputField } from "@/components/shared/appInputField";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import FormHeader from "@/components/shared/formHeader";
import { loginSchema } from "@/schemas/authSchema";
import { useFormik } from "formik";
import { useLogin } from "@/hooks/auth/auth";

export function LoginForm() {
  const { mutate: loginUser, isPending } = useLogin();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      loginUser(values);
    },
  });

  return (
    <div className="w-full">
      {/* Brand Header */}
      <FormHeader
        title="Welcome back"
        description="Sign in to pick up where you left off"
      />

      {/* Main Login Form */}
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <AppInputField
          label="Email"
          type="email"
          id="email"
          placeholder="name@example.com"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email ? formik.errors.email : undefined}
          leftIcon={
            <Mail className="text-zinc-400 dark:text-zinc-500 w-4 h-4" />
          }
          required
        />

        <AppInputField
          label="Password"
          type="password"
          id="password"
          placeholder="••••••••"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password ? formik.errors.password : undefined}
          leftIcon={
            <Lock className="text-zinc-400 dark:text-zinc-500 w-4 h-4" />
          }
          required
        />

        {/* Options Row */}
        <div className="flex items-center justify-between text-sm pt-1">
          <label className="flex items-center gap-2 text-muted-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              className="rounded border-border text-primary focus:ring-primary w-4 h-4"
            />
            <span>Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-primary hover:underline font-medium"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          className="group w-full h-11 rounded-xl font-semibold text-sm mt-2 cursor-pointer shadow-lg shadow-primary/25 transition hover:shadow-xl hover:shadow-primary/30 active:scale-[0.99]"
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Signing In...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Sign In
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          )}
        </Button>
      </form>

      {/* Bottom links */}
      <p className="text-center text-sm text-muted-foreground mt-8">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-primary font-semibold hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
