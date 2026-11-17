import dynamic from "next/dynamic";
import { TableSkeleton } from "@/components/custom/table-skeleton";
const PersonalTasks = dynamic(
  () => import("@/components/features/tasks").then((m) => m.PersonalTasks),
  { loading: () => <TableSkeleton /> }
);

export const metadata = {
  title: "Tasks | Doable",
  description: "Create, organize, assign, and track your tasks.",
};

function TasksPage() {
  return (
    <div className="p-6 ">
      <PersonalTasks />
    </div>
  );
}

export default TasksPage;
