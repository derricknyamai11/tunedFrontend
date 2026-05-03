"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar, SidebarContent, SidebarFooter,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon, Folder01Icon, Wallet01Icon,
  Calendar01Icon, UserIcon, Settings05Icon, CommandIcon, GiftIcon,
} from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import type { AuthUser } from "@/lib/types/auth.type";
import { useNavStats } from "../_hooks/useNavStats";

interface ClientSidebarProps extends React.ComponentProps<typeof Sidebar> {
  readonly user: AuthUser | null;
}

export function ClientSidebar({ user, ...props }: ClientSidebarProps) {
  const pathname = usePathname();
  const { activeOrdersCount, balance } = useNavStats();

  const navItems = [
    { title: "Dashboard", url: "/client/dashboard", icon: DashboardSquare01Icon, badge: undefined, label: undefined },
    { title: "My Orders", url: "/client/orders", icon: Folder01Icon, badge: activeOrdersCount > 0 ? activeOrdersCount : undefined, label: undefined },
    { title: "My Balance", url: "/client/balance", icon: Wallet01Icon, badge: undefined, label: `$${balance.toFixed(2)}` },
    { title: "Planner", url: "/client/planner", icon: Calendar01Icon, badge: undefined, label: undefined },
    { title: "Profile", url: "/client/profile", icon: UserIcon, badge: undefined, label: undefined },
    { title: "Referrals", url: "/client/referrals", icon: GiftIcon, badge: undefined, label: undefined },
    { title: "Settings", url: "/client/settings", icon: Settings05Icon, badge: undefined, label: undefined },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link href={{pathname: "/client/dashboard"}}>
                <HugeiconsIcon icon={CommandIcon} strokeWidth={2} className="size-5!" />
                <span className="text-base font-semibold">TunedEssays</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="mt-4 px-2">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                <Link href={{pathname: item.url}} className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                    <span>{item.title}</span>
                  </div>
                  {item.badge !== undefined && <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">{item.badge}</Badge>}
                  {item.label !== undefined && <span className="ml-auto text-xs font-medium text-emerald-600">{item.label}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user ? { name: user.name, email: user.email, avatar: user.avatar_url ?? "" } : { name: "Guest", email: "", avatar: "" }} />
      </SidebarFooter>
    </Sidebar>
  );
}
