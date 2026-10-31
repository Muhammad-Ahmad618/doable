import { TrashFeature } from "@/components/features/trash";

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
