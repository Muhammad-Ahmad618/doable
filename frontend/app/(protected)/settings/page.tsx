import { SettingsLayout } from "@/components/features/settings";

export const metadata = {
  title: "Settings | Doable",
  description: "Manage your account preferences and application settings.",
};

function SettingsPage() {
  return (
    <div className="p-6">
      <SettingsLayout />
    </div>
  );
}

export default SettingsPage;
