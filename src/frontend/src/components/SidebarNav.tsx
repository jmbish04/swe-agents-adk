import {
  BotMessageSquareIcon,
  ClipboardListIcon,
  GaugeIcon,
  KanbanIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  LightbulbIcon,
  MessageSquareIcon,
  ParkingSquareIcon,
  RadioIcon,
  SquareKanbanIcon,
} from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type NavSection = {
  label: string;
  items: NavItem[];
};

export type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
};

// -------------------------------------------------------
// Top-level app nav (dashboard, applications)
// -------------------------------------------------------
export const appNav: NavSection[] = [
  {
    label: "Workspace",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboardIcon className="size-4" /> },
      { href: "/applications", label: "Applications", icon: <LayoutGridIcon className="size-4" /> },
    ],
  },
];

// -------------------------------------------------------
// Application-viewport sub-nav (scoped to `/application-viewport/[id]/…`)
// -------------------------------------------------------
export function applicationViewportNav(appId: string): NavSection[] {
  return [
    {
      label: "Application",
      items: [
        {
          href: `/application-viewport/${appId}/landing`,
          label: "Overview",
          icon: <GaugeIcon className="size-4" />,
        },
        {
          href: `/application-viewport/${appId}/projects`,
          label: "Projects",
          icon: <SquareKanbanIcon className="size-4" />,
        },
      ],
    },
  ];
}

// -------------------------------------------------------
// Project-viewport sub-nav (scoped to `/project-viewport/[id]/…`)
// -------------------------------------------------------
export function projectViewportNav(projectId: string): NavSection[] {
  return [
    {
      label: "Project",
      items: [
        {
          href: `/project-viewport/${projectId}/insights`,
          label: "Insights",
          icon: <LightbulbIcon className="size-4" />,
        },
        {
          href: `/project-viewport/${projectId}/backlog`,
          label: "Backlog",
          icon: <ClipboardListIcon className="size-4" />,
        },
        {
          href: `/project-viewport/${projectId}/parking-lot`,
          label: "Parking Lot",
          icon: <ParkingSquareIcon className="size-4" />,
        },
        {
          href: `/project-viewport/${projectId}/kanban`,
          label: "Kanban",
          icon: <KanbanIcon className="size-4" />,
        },
        {
          href: `/project-viewport/${projectId}/realtime-progress`,
          label: "Realtime Progress",
          icon: <RadioIcon className="size-4" />,
        },
      ],
    },
    {
      label: "Chatroom",
      items: [
        {
          href: `/project-viewport/${projectId}/chatroom/agent`,
          label: "By Agent",
          icon: <BotMessageSquareIcon className="size-4" />,
        },
        {
          href: `/project-viewport/${projectId}/chatroom/phase`,
          label: "By Phase / Story",
          icon: <MessageSquareIcon className="size-4" />,
        },
      ],
    },
  ];
}

// -------------------------------------------------------
// Rendered sidebar component
// -------------------------------------------------------
interface SidebarNavProps {
  sections: NavSection[];
  currentPath: string;
  className?: string;
}

export function SidebarNav({ sections, currentPath, className }: SidebarNavProps) {
  return (
    <nav className={cn("flex flex-col gap-6 px-2 py-4", className)}>
      {sections.map((section) => (
        <div key={section.label} className="flex flex-col gap-1">
          <p className="px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {section.label}
          </p>
          {section.items.map((item) => {
            const isActive = currentPath === item.href || currentPath.startsWith(item.href + "/");
            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.icon}
                {item.label}
              </a>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
