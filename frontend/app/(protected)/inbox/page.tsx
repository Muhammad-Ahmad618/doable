import dynamic from "next/dynamic";
import { TableSkeleton } from "@/components/custom/table-skeleton";
const InboxFeature = dynamic(
  () => import("@/components/features/inbox").then((m) => m.InboxFeature),
  { loading: () => <TableSkeleton /> }
);

export const metadata = {
  title: "Inbox | Doable",
  description: "Manage notifications, assignments, and workspace activities",
};

export default function InboxPage() {
  return (
    <div className="p-6">
      <InboxFeature />
    </div>
  );
}
