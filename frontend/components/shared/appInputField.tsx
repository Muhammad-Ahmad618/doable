"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AppInputFieldProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: string;
  requiredAsterisk?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
}

export function AppInputField({
  label,
  error,
  requiredAsterisk,
  leftIcon,
  rightIcon,
  containerClassName,
  labelClassName,
  className,
  id,
  type,
  ...props
}: AppInputFieldProps) {
  const generatedId = React.useId();
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || generatedId;

  const isPassword = type === "password";

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", containerClassName)}>
      {label && (
        <Label
          htmlFor={inputId}
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
          "flex items-center gap-2 border border-gray-300 dark:border-gray-800 rounded-md px-3 bg-white dark:bg-zinc-950 transition-all duration-200 focus-within:ring-2 focus-within:ring-ring/20 focus-within:border-ring ",
          error && "border-destructive focus-within:border-destructive",
          props.disabled &&
            "opacity-50 bg-gray-50 dark:bg-zinc-900 cursor-not-allowed",
        )}
      >
        {leftIcon && (
          <span className="text-gray-400 dark:text-gray-500 flex items-center justify-center shrink-0">
            {leftIcon}
          </span>
        )}

        <Input
          id={inputId}
          type={isPassword && showPassword ? "text" : type}
          className={cn(
            "text-[13px]! text-foreground border-none bg-transparent h-10 w-full p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus-visible:border-none aria-invalid:border-none aria-invalid:ring-0 dark:aria-invalid:border-none dark:aria-invalid:ring-0",
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="cursor-pointer text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none flex items-center justify-center shrink-0"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        ) : (
          rightIcon && (
            <span className="text-gray-400 dark:text-gray-500 flex items-center justify-center shrink-0">
              {rightIcon}
            </span>
          )
        )}
      </div>

      {error && (
        <p
          id={`${inputId}-error`}
          className="text-xs text-destructive font-medium mt-0.5"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
