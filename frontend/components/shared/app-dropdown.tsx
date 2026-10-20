"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface DropdownOption {
  label: string;
  value: string;
}

export interface AppDropdownProps {
  label?: string;
  id?: string;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  options: DropdownOption[];
  error?: string;
  requiredAsterisk?: boolean;
  required?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
}

export function AppDropDown({
  label,
  id,
  placeholder = "Select an option",
  value,
  onValueChange,
  options,
  error,
  requiredAsterisk,
  required,
  containerClassName,
  labelClassName,
  triggerClassName,
  contentClassName,
  disabled,
}: AppDropdownProps) {
  const generatedId = React.useId();
  const dropdownId = id || generatedId;
  const showAsterisk = requiredAsterisk || required;

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", containerClassName)}>
      {label && (
        <Label
          htmlFor={dropdownId}
          className={cn(
            "font-medium text-xs text-gray-700 dark:text-gray-300",
            labelClassName,
          )}
        >
          {label}{" "}
          {showAsterisk && <span className="text-red-500 ml-0.5">*</span>}
        </Label>
      )}
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          id={dropdownId}
          className={cn(
            "w-full h-10 border border-gray-300 dark:border-gray-800 rounded-md px-3 bg-white dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all duration-200",
            error && "border-destructive focus-within:border-destructive",
            disabled &&
              "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-zinc-900",
            triggerClassName,
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={cn("rounded-md top-8", contentClassName)}>
          {options?.map((option) => (
            <SelectItem key={option?.value} value={option?.value}>
              {option?.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-xs text-destructive font-medium mt-0.5">{error}</p>
      )}
    </div>
  );
}
