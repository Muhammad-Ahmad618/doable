"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AppTextareaField } from "@/components/shared/appTextareaField";
import { AppImageupload } from "@/components/shared/app-imageupload";
import { useFormik } from "formik";
import { profileSchema } from "@/schemas/profileSchema";
import { AppInputField } from "@/components/shared/appInputField";
import { useGetCurrentUser, useUpdateUserProfile } from "@/hooks/user/settings";
import { Loader2 } from "lucide-react";

export function Profile() {
  const { data: user, isLoading } = useGetCurrentUser();
  const updateProfileMutation = useUpdateUserProfile();
  const [selectedImagePreview, setSelectedImagePreview] = useState<
    string | null
  >(null);

  const imagePreview = selectedImagePreview ?? user?.avatar_url ?? null;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      profileImage: null as File | null,
      username: user?.username ?? "",
      email: user?.email ?? "",
      bio: user?.bio ?? "",
    },
    validationSchema: profileSchema,
    onSubmit: (values) => {
      updateProfileMutation.mutate({
        username: values.username,
        bio: values.bio,
        avatar: values.profileImage,
      });
    },
  });

  const handleCancel = () => {
    formik.resetForm();
    setSelectedImagePreview(user?.avatar_url ?? null);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="border-b border-border px-6 py-5">
        <h3 className="font-semibold text-lg text-foreground">
          Profile Information
        </h3>
        <p className="text-sm text-muted-foreground/70">
          Manage your profile information here
        </p>
      </div>

      <form
        id="profile-form"
        onSubmit={formik.handleSubmit}
        className="px-6 py-6"
      >
        {/* Identity row: avatar top-left + name/email context */}
        <AppImageupload
          value={imagePreview}
          onChange={(preview, file) => {
            setSelectedImagePreview(preview);
            formik.setFieldValue("profileImage", file);
          }}
        />

        <div className="h-px w-full bg-border" />

        {/* Fields */}
        <div className="grid gap-x-6 gap-y-5 pt-6 sm:grid-cols-2">
          <div className="flex flex-col gap-y-2">
            <AppInputField
              label="Username"
              type="text"
              id="username"
              labelClassName="text-sm"
              placeholder="Enter your name"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading}
              error={
                formik.touched.username ? formik.errors.username : undefined
              }
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <AppInputField
              label="Email Address"
              type="email"
              id="email"
              labelClassName="text-sm"
              placeholder="Enter your email"
              value={formik.values.email}
              disabled
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email ? formik.errors.email : undefined}
            />
          </div>
          <div className="flex flex-col gap-y-2 sm:col-span-2">
            <Label htmlFor="bio" className="text-sm">
              Bio
            </Label>
            <AppTextareaField
              id="bio"
              placeholder="Tell us about yourself"
              className="min-h-28 resize-none"
              value={formik.values.bio}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading}
              error={formik.touched.bio ? formik.errors.bio : undefined}
            />
            <span className="text-xs text-muted-foreground/70">
              Brief description for your profile. URLs are hyperlinked.
            </span>
          </div>
        </div>
      </form>

      {/* Footer */}
      <div className="flex justify-end gap-x-3 border-t border-border bg-muted/30 px-6 py-4">
        <Button
          type="button"
          variant="outline"
          className="rounded-md cursor-pointer"
          onClick={handleCancel}
          disabled={updateProfileMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="profile-form"
          className="rounded-md cursor-pointer"
          disabled={updateProfileMutation.isPending || isLoading}
        >
          {updateProfileMutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
