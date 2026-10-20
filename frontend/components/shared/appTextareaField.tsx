"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AppTextareaFieldProps extends React.ComponentProps<"textarea"> {
  label?: string;
  error?: string;
  requiredAsterisk?: boolean;
  containerClassName?: string;
  labelClassName?: string;
}

export function AppTextareaField({
  label,
  error,
  requiredAsterisk,
  containerClassName,
  labelClassName,
  className,
  id,
  ...props
}: AppTextareaFieldProps) {
  const generatedId = React.useId();
  const textareaId = id || generatedId;

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", containerClassName)}>
      {label && (
        <Label
          htmlFor={textareaId}
          className={cn(
            "font-medium text-gray-700 dark:text-gray-300",
            labelClassName,
          )}
        >
          {label}
          {requiredAsterisk && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <div
        className={cn(
          "flex border border-gray-300 dark:border-gray-800 rounded-md p-3 bg-white dark:bg-zinc-950 transition-all duration-200 focus-within:ring-2 focus-within:ring-ring/20 focus-within:border-ring",
          error && "border-destructive focus-within:border-destructive",
          props.disabled &&
            "opacity-50 bg-gray-50 dark:bg-zinc-900 cursor-not-allowed",
        )}
      >
        <textarea
          id={textareaId}
          className={cn(
            "text-[13px]! text-foreground border-none bg-transparent w-full min-h-[80px] p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus-visible:border-none focus:outline-none resize-y aria-invalid:border-none aria-invalid:ring-0 dark:aria-invalid:border-none dark:aria-invalid:ring-0",
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...props}
        />
      </div>

      {error && (
        <p
          id={`${textareaId}-error`}
          className="text-xs text-destructive font-medium mt-0.5"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
