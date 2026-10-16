"use client";
import { AppInputField } from "@/components/shared/appInputField";
import { AppTextareaField } from "@/components/shared/appTextareaField";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useFormik } from "formik";
import { workspaceSchema } from "@/schemas/workspaceSchema";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { ImagePlus, X, Upload, Loader2 } from "lucide-react";
import { useCreateWorkspace } from "@/hooks/user/workspace";
import { InviteMemberModal } from "./inviteMemberModal";

export function WorkspaceSheet({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [shareLink, setShareLink] = useState<boolean>(false);
  const [createdWorkspaceName, setCreatedWorkspaceName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB.");
      return;
    }
    formik.setFieldValue("logo_url", file);
    const reader = new FileReader();
    reader.onloadend = () => setIconPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFileChange(file ?? null);
  };

  const { mutateAsync: createWorkspace, isPending } = useCreateWorkspace();

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      logo_url: null as File | null,
    },
    validationSchema: workspaceSchema,
    onSubmit: async (values) => {
      try {
        await createWorkspace({
          workspace_name: values.name,
          workspace_description: values.description,
          logo_url: values.logo_url,
        });
      } catch (error) {
        console.log(error);
        return;
      }

      setCreatedWorkspaceName(values.name);
      setOpen(false);
      formik.resetForm();
      setIconPreview(null);
      setTimeout(() => {
        setShareLink(true);
      }, 500);
    },
  });

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="max-w-md! px-2">
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold">
              Create Workspace
            </SheetTitle>
            <SheetDescription>
              Create a new workspace to organize your tasks and projects.
            </SheetDescription>
          </SheetHeader>

          <div className="p-3 mt-4 text-left space-y-4">
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {/* Workspace Icon Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none flex items-center gap-1.5">
                  Workspace Icon
                  <span className="text-[11px] text-muted-foreground font-normal bg-muted px-1.5 py-0.5 rounded-full">
                    optional
                  </span>
                </label>

                {/* Drop zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                  }}
                  onDrop={handleDrop}
                  className={`
                  relative w-full rounded-xl cursor-pointer overflow-hidden
                  border-2 border-dashed transition-all duration-300 ease-out
                  flex flex-col items-center justify-center gap-3
                  ${
                    isDragging
                      ? "border-primary bg-primary/8 scale-[1.01] shadow-lg shadow-primary/10"
                      : iconPreview
                        ? "border-border/60 bg-muted/20 h-auto py-3"
                        : "border-border/70 bg-muted/30 hover:border-primary/50 hover:bg-primary/5 hover:shadow-md h-[120px]"
                  }
                `}
                >
                  {iconPreview ? (
                    /* Preview state — avatar + filename row */
                    <div className="flex items-center gap-4 w-full px-4 py-1">
                      {/* Avatar with gradient ring */}
                      <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 rounded-xl p-[2px] bg-gradient-to-br from-primary/80 via-primary to-primary/60 shadow-md shadow-primary/20">
                          <div className="w-full h-full rounded-[9px] overflow-hidden">
                            <img
                              src={iconPreview}
                              alt="Workspace icon"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        {/* Green check badge */}
                        <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-green-500 border-2 border-background flex items-center justify-center">
                          <svg
                            className="w-2.5 h-2.5 text-white"
                            viewBox="0 0 10 10"
                            fill="none"
                          >
                            <path
                              d="M2 5l2.5 2.5L8 3"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          Icon uploaded
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Click to replace image
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIconPreview(null);
                          formik.setFieldValue("logo_url", null);
                          if (fileInputRef.current)
                            fileInputRef.current.value = "";
                        }}
                        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-150"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : isDragging ? (
                    /* Dragging state */
                    <div className="flex flex-col items-center gap-2 py-2 pointer-events-none select-none">
                      <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center animate-bounce">
                        <Upload className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-primary">
                        Drop it here!
                      </p>
                    </div>
                  ) : (
                    /* Empty state */
                    <div className="flex flex-col items-center gap-2.5 pointer-events-none select-none">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-200">
                        <ImagePlus className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="text-center">
                        <p className="text-[13px] font-medium text-foreground/80">
                          Drop an image, or{" "}
                          <span className="text-primary underline underline-offset-2 decoration-dotted">
                            browse
                          </span>
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          PNG, JPG, GIF · max 5 MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleFileChange(e.target.files?.[0] ?? null)
                  }
                />
              </div>

              <AppInputField
                label="Workspace Name"
                id="name"
                placeholder="Enter workspace name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name ? formik.errors.name : undefined}
                required
              />

              <AppTextareaField
                label="Description"
                id="description"
                placeholder="Describe the workspace..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.description
                    ? formik.errors.description
                    : undefined
                }
                required
              />

              <Button
                type="submit"
                variant="default"
                disabled={isPending}
                className="w-full h-10 rounded-md font-medium text-sm shadow-sm cursor-pointer"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Workspace
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
      <InviteMemberModal
        open={shareLink}
        setOpen={setShareLink}
        workspaceName={createdWorkspaceName}
        mode="created"
      />
    </>
  );
}
