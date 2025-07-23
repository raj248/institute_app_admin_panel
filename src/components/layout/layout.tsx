// src/components/layout.tsx

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";
import { useTheme } from "../theme/theme-provider";
import { cn } from "@/lib/cn"; // adjust path if needed
import Header from "./header";

export default function MainLayout() {
  const { resolvedTheme } = useTheme();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <div className="flex min-h-screen w-screen">
        <AppSidebar />
        <main
          className={cn(
            "flex-1 transition-colors",
            resolvedTheme === "dark" ? "bg-neutral-950" : "bg-background"
          )}
        >          {/* header with breadcrumbs */}
          <Header />
          <Outlet />
          <Toaster />
        </main>
      </div>
    </SidebarProvider>
  );
}
