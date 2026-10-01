import React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

export interface PortalNavItem {
  key: string;
  title: string;
  icon: LucideIcon;
}

interface PortalSidebarProps {
  label: string;
  items: PortalNavItem[];
  activeKey: string;
  onSelect: (key: string) => void;
}

const PortalSidebar = ({ label, items, activeKey, onSelect }: PortalSidebarProps) => {
  const { isMobile, setOpenMobile } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={activeKey === item.key}
                    tooltip={item.title}
                    onClick={() => {
                      onSelect(item.key);
                      if (isMobile) setOpenMobile(false);
                    }}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default PortalSidebar;
