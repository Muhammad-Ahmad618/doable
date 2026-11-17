import dynamic from "next/dynamic";
import { WorkspaceCardSkeleton } from "@/components/custom/workspace-card-skeleton";
const Workspace = dynamic(
  () => import("@/components/features/workspace").then((m) => m.Workspace),
  { loading: () => <WorkspaceCardSkeleton /> }
);

export const metadata = {
  title: "Workspegs | Doable",
  description:
    "Create and manage your own workspaces with customtion settings.",
};

function WorkspacePage() {
  return (
    <div className="p-6">
      <Workspace />
    </div>
  );
}

export default WorkspacePage;
