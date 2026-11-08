import { InboxFeature } from "@/components/features/inbox";

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
