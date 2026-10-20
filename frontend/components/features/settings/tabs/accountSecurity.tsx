"use client";

import { Button } from "@/components/ui/button";
import { AppInputField } from "@/components/shared/appInputField";
import { PasswordStrength } from "@/components/custom/password-strenght";
import { useFormik } from "formik";
import { resetPasswordSchema } from "@/schemas/resetPasswordSchema";
import { toast } from "sonner";

export function AccountSecurity() {
  const formik = useFormik({
    initialValues: {
      current: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: () => {
      // Handle password reset API call
      formik.resetForm();
      toast.success("Password reset successfully");
    },
  });

  return (
    <div className="space-y-4">
      {/* Change Password */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="px-6 py-5 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">
            Change password
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Make sure your new password is at least 8 characters long.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="px-6 py-6 space-y-5">
            <div className="space-y-2">
              <AppInputField
                label="Current Password"
                type="password"
                id="current"
                placeholder="••••••••"
                value={formik.values.current}
                labelClassName="text-sm"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.current ? formik.errors.current : undefined
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-4">
                <AppInputField
                  label="New Password"
                  type="password"
                  id="newPassword"
                  placeholder="••••••••"
                  value={formik.values.newPassword}
                  labelClassName="text-sm"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.newPassword
                      ? formik.errors.newPassword
                      : undefined
                  }
                  required
                />
                <PasswordStrength password={formik.values.newPassword} />
              </div>

              <div className="space-y-2">
                <AppInputField
                  label="Confirm New Password"
                  type="password"
                  id="confirmPassword"
                  placeholder="••••••••"
                  value={formik.values.confirmPassword}
                  labelClassName="text-sm"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.confirmPassword
                      ? formik.errors.confirmPassword
                      : undefined
                  }
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-border bg-muted/30">
            <Button
              type="button"
              variant="outline"
              className="rounded-md cursor-pointer"
              onClick={() => formik.resetForm()}
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-md cursor-pointer">
              Update password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
