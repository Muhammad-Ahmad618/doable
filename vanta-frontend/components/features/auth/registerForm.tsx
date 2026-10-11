"use client";

import { AppInputField } from "@/components/shared/appInputField";
import { Button } from "@/components/ui/button";
import { Mail, User, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import FormHeader from "@/components/shared/formHeader";
import { useFormik } from "formik";
import { signupSchema } from "@/schemas/authSchema";
import { useRegister } from "@/hooks/auth/auth";

export function RegisterForm() {
  const { mutate: registerUser, isPending } = useRegister();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: signupSchema,
    onSubmit: (values) => {
      registerUser(values);
    },
  });

  return (
    <div className="w-full">
      {/* Brand Header */}
      <FormHeader
        title="Get Started"
        description="Create your account to access your workspace"
      />

      {/* Main Form */}
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <AppInputField
          label="Full Name"
          type="text"
          id="name"
          placeholder="John Doe"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name ? formik.errors.name : undefined}
          leftIcon={
            <User className="text-zinc-400 dark:text-zinc-500 w-4 h-4" />
          }
          required
        />

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

        <div>
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
        </div>

        <div>
          <AppInputField
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            placeholder="••••••••"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.confirmPassword
                ? formik.errors.confirmPassword
                : undefined
            }
            leftIcon={
              <Lock className="text-zinc-400 dark:text-zinc-500 w-4 h-4" />
            }
            required
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          className="w-full h-11 rounded-md font-semibold text-sm mt-2 shadow-sm cursor-pointer"
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Creating Account...
            </span>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      {/* Bottom links */}
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-5">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary font-semibold hover:underline dark:text-zinc-50"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
