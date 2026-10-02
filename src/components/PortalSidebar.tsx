import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { LogOut } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useStudentProfile, initials } from '@/hooks/useStudentProfile';
import { romanSemester, useSemester } from '@/context/SemesterContext';

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
  studentStyle?: boolean;
}

const PortalSidebar = ({ label, items, activeKey, onSelect, studentStyle = false }: PortalSidebarProps) => {
  const { isMobile, setOpenMobile, state } = useSidebar();
  const { profile } = useStudentProfile();
  const { branch, semester } = useSemester();
  const collapsed = state === 'collapsed' && !isMobile;

  const select = (key: string) => {
    onSelect(key);
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar
      collapsible="icon"
      desktopHeaderOffset={studentStyle}
      className={studentStyle ? 'student-portal-sidebar' : undefined}
    >
      <SidebarContent className={studentStyle ? 'px-2 py-4' : undefined}>
        <SidebarGroup className={studentStyle ? 'p-0' : undefined}>
          <SidebarGroupLabel className={studentStyle ? 'mb-2 px-3 text-[11px] font-semibold uppercase text-sidebar-foreground/60' : undefined}>
            {studentStyle ? 'Student workspace' : label}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className={studentStyle ? 'gap-2' : undefined}>
              {items.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={activeKey === item.key}
                    tooltip={item.title}
                    size={studentStyle ? 'lg' : 'default'}
                    className={studentStyle ? 'h-12 gap-3 rounded-md px-3 text-[15px] font-semibold data-[active=true]:shadow-sm [&>svg]:h-5 [&>svg]:w-5' : undefined}
                    onClick={() => select(item.key)}
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

      {studentStyle && (
        <SidebarFooter className="border-t border-sidebar-border p-3">
          <button
            type="button"
            onClick={() => select('/profile')}
            className="flex w-full items-center gap-3 rounded-md p-2 text-left outline-none ring-sidebar-ring hover:bg-sidebar-accent focus-visible:ring-2"
            aria-label="Open student profile"
          >
            <Avatar className="h-9 w-9 shrink-0 border border-sidebar-border">
              <AvatarImage src={profile.avatar || undefined} alt="Profile photo" />
              <AvatarFallback>{initials(profile.name)}</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-sidebar-primary">{profile.name}</span>
                <span className="block truncate text-xs text-sidebar-foreground/70">
                  {branch || 'B.Tech'}{semester ? ` · Semester ${romanSemester(semester)}` : ''}
                </span>
              </span>
            )}
          </button>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Sign out / Switch module"
                className="mt-1 h-10 gap-3 px-3 font-semibold text-destructive hover:text-destructive"
                onClick={() => select('/')}
              >
                <LogOut className="h-5 w-5" />
                <span>Sign out / Switch module</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};

export default PortalSidebar;
