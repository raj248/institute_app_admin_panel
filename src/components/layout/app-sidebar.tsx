import * as React from "react"
import {
  // AudioWaveform,
  // BookOpen,
  // Bot,
  // Command,
  Frame,
  // GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  // SquareTerminal,
  Trash2,
} from "lucide-react"

// import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
// import { NavUser } from "@/components/nav-user"
// import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  // SidebarFooter,
  SidebarHeader,
  // SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  navigation: [
    {
      name: "Dashboard",
      url: "/",
      icon: Frame,
    },
    {
      name: "CA-Inter",
      url: "CAInter",
      icon: PieChart,
    },
    {
      name: "CA-Final",
      url: "CAFinal",
      icon: Map,
    },
    {
      name: "Debug",
      url: "Debug",
      icon: PieChart,
    },
    {
      name: "Settings",
      url: "Settings",
      icon: Settings2,
    },
    {
      name: "Trash",
      url: "Trash",
      icon: Trash2,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
        {/* <span className="font-medium text-center">Control Panel</span> */}
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
        <NavProjects projects={data.navigation} />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
      {/* <SidebarRail /> */}
    </Sidebar>
  )
}
