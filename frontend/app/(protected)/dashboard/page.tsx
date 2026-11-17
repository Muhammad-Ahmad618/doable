import dynamic from "next/dynamic";
import { TableSkeleton } from "@/components/custom/table-skeleton";
const Dashboard = dynamic(
  () => import("@/components/features/dashboard").then((m) => m.Dashboard),
  { loading: () => <TableSkeleton /> }
);

export const metadata = {
  title: "Dashboard | Doable",
  description: "A Quick Overview of Your Tasks stats",
};

export default function Page() {
  return (
    <div>
      <Dashboard />
    </div>
  );
}
