import { Workspace } from "@/components/features/workspace";

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
