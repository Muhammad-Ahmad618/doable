"use client";

import { Header } from "./header";
import { WorkspaceList } from "./workspaceList";

export function Workspace() {
  return (
    <>
      <div>
        <Header />
        <WorkspaceList />
      </div>
    </>
  );
}
