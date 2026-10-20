import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono, DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/providers/queryProvider";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dmsans" });

export const metadata: Metadata = {
  title: "Doable | Task management and Workspace app",
  description: "Smart Ai powered task management and workspace application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        dmSans.variable,
        geistMono.variable,
        "font-sans",
        jetbrainsMono.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <TooltipProvider>
            <Toaster />
            {children}
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
