import { PersonalTasks } from "@/components/features/tasks";

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
