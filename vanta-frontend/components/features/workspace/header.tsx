"use client";

import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { WorkspaceSheet } from "./workspaceSheet";
import { useState } from "react";

export function Header() {
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 max-w-2xl">
        <h1 className="text-xl font-semibold">Workspaces</h1>
        <p className="text-sm text-muted-foreground/70">
          View and manage your created and joined workspaces. Click a workspace
          to open it and continue your work.
        </p>
      </div>
      <div className="w-full sm:w-auto">
        <Button
          onClick={() => {
            setOpenSheet(true);
          }}
          className="w-full cursor-pointer rounded-lg p-4 text-sm sm:w-auto"
          size={"lg"}
        >
          <CirclePlus /> Create Workspace
        </Button>
      </div>

      <WorkspaceSheet open={openSheet} setOpen={setOpenSheet} />
    </div>
  );
}
