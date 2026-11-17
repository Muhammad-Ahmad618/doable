import dynamic from "next/dynamic";
const SettingsLayout = dynamic(
  () => import("@/components/features/settings").then((m) => m.SettingsLayout),
  { loading: () => <div className="p-6 animate-pulse" /> }
);

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
