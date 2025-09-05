import * as React from "react";
import { Minus, Plus } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
    },
    {
      title: "Latest Content",
      url: "/newlyadded",
    },
    {
      title: "CA-Inter",
      url: "CAInter",
    },
    {
      title: "CA-Final",
      url: "CAFinal",
    },
    {
      title: "Notes",
      url: "#",
      items: [
        {
          title: "CA-Inter",
          url: "/Notes/CAInter",
          isActive: false,
        },
        {
          title: "CA-Final",
          url: "/Notes/CAFinal",
          isActive: false,
        },
      ],
    },
    {
      title: "MTP",
      url: "#",
      items: [
        {
          title: "CA-Inter",
          url: "/Video/CAInter/mtp",
          isActive: false,
        },
        {
          title: "CA-Final",
          url: "/Video/CAFinal/mtp",
          isActive: false,
        },
      ],
    },
    {
      title: "RTP",
      url: "#",
      items: [
        {
          title: "CA-Inter",
          url: "/Video/CAInter/rtp",
          isActive: false,
        },
        {
          title: "CA-Final",
          url: "/Video/CAFinal/rtp",
          isActive: false,
        },
      ],
    },
    {
      title: "Revision",
      url: "#",
      items: [
        {
          title: "CA-Inter",
          url: "/Video/CAInter/revision",
          isActive: false,
        },
        {
          title: "CA-Final",
          url: "/Video/CAFinal/revision",
          isActive: false,
        },
      ],
    },
    {
      title: "Other",
      url: "#",
      items: [
        {
          title: "CA-Inter",
          url: "/Video/CAInter/other",
          isActive: false,
        },
        {
          title: "CA-Final",
          url: "/Video/CAFinal/other",
          isActive: false,
        },
      ],
    },
    // {
    //   title: "Settings",
    //   url: "Settings",
    // },
    {
      title: "Trash",
      url: "Trash",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [navData, setNavData] = React.useState(data.navMain);
  const handleActivate = (parentIndex: number, childIndex: number) => {
    setNavData((prev) =>
      prev.map((item, i) => ({
        ...item,
        items: item.items?.map((child, j) => ({
          ...child,
          isActive: i === parentIndex && j === childIndex, // active only if this exact child
        })),
      }))
    );
  };

  return (
    <Sidebar variant="floating" {...props}>
      {/* <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Documentation</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader> */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navData.map((item, index) => (
              <Collapsible
                key={item.title}
                defaultOpen={index === 1}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  {item.items?.length ? (
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        {item.title}{" "}
                        <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                        <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  ) : (
                    <></>
                  )}
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((i, childIndex) => (
                          <SidebarMenuSubItem key={i.title}>
                            <SidebarMenuSubButton
                              asChild
                              onClick={() => handleActivate(index, childIndex)}
                              isActive={i.isActive}
                            >
                              <Link to={i.url}>
                                <span>{i.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : (
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
