import dynamic from "next/dynamic";
import { AppSidebar } from "@/components/custom/app-sidebar";
import { SiteHeader } from "@/components/shared/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const ChatWidget = dynamic(
  () => import("@/components/shared/chat-widget").then((m) => m.ChatWidget),
);

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
      <AppSidebar />
      <SidebarInset className="min-w-0 overflow-hidden">
        <SiteHeader />
        <div className="protected-layout">{children}</div>
        <ChatWidget />
      </SidebarInset>
    </SidebarProvider>
  );
}
