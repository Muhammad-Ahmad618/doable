import { Dashboard } from "@/components/features/dashboard";

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
