import { AppSidebar } from "@/components/custom/app-sidebar";
import { SiteHeader } from "@/components/shared/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="min-w-0 overflow-hidden">
        <SiteHeader />
        <div className="protected-layout">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
