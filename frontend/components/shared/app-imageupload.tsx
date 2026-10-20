"use client";

import React from "react";
import { useRef } from "react";
import Image from "next/image";
import { Camera, User } from "lucide-react";

export function AppImageupload({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (preview: string | null, file: File | null) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (value && value.startsWith("blob:")) {
        URL.revokeObjectURL(value);
      }
      const previewUrl = URL.createObjectURL(file);
      onChange(previewUrl, file);
    }
  };

  return (
    <div className="flex items-center gap-x-4 pb-6">
      <div className="group relative h-20 w-20 shrink-0">
        <button
          type="button"
          onClick={handleAvatarClick}
          className="relative block h-20 w-20 overflow-hidden rounded-full border border-border bg-muted transition-opacity hover:opacity-90"
        >
          {value ? (
            <Image
              id="profileImage"
              src={value}
              alt="Profile picture"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="h-8 w-8 text-muted-foreground/50" />
            </div>
          )}
        </button>
        <button
          type="button"
          onClick={handleAvatarClick}
          className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105 cursor-pointer"
        >
          <Camera className="h-3 w-3" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="flex flex-col gap-y-1">
        <button
          type="button"
          onClick={handleAvatarClick}
          className="w-fit text-sm font-medium text-foreground underline-offset-2 hover:underline cursor-pointer"
        >
          Change photo
        </button>
        <span className="text-xs text-muted-foreground/70">
          JPG or PNG, at least 200×200px
        </span>
      </div>
    </div>
  );
}
