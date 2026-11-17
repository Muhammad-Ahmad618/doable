import dynamic from "next/dynamic";
import { TableSkeleton } from "@/components/custom/table-skeleton";
const TrashFeature = dynamic(
  () => import("@/components/features/trash").then((m) => m.TrashFeature),
  { loading: () => <TableSkeleton /> }
);

export const metadata = {
  title: "Trash | Doable",
  description: "View and restore deleted tasks",
};

export default function TrashPage() {
  return (
    <div className="p-6">
      <TrashFeature />
    </div>
  );
}
