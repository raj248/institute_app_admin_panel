// src/components/layout.tsx

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Separator } from "./ui/separator";
import { AppBreadcrumbs } from "./app-breadcrumbs";
import { Outlet } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/cn"; // adjust path if needed

export default function MainLayout() {
  const { resolvedTheme } = useTheme();
  console.log(resolvedTheme);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-screen">
        <AppSidebar />
        <main
          className={cn(
            "flex-1 transition-colors",
            resolvedTheme === "dark" ? "bg-neutral-950" : "bg-gray-100"
          )}
        >          {/* header with breadcrumbs */}
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <AppBreadcrumbs />
              <ModeToggle />
            </div>
          </header>
          <Outlet />
          <Toaster />
        </main>
      </div>
    </SidebarProvider>
  );
}
