import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Book, BookOpen, Calendar, Download, FileText, LayoutDashboard, User, UserCheck } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import PortalSidebar, { type PortalNavItem } from '@/components/PortalSidebar';

const items: PortalNavItem[] = [
  { key: '/dashboard', title: 'Dashboard', icon: LayoutDashboard },
  { key: '/syllabus', title: 'Syllabus', icon: BookOpen },
  { key: '/timetable', title: 'Timetable', icon: Calendar },
  { key: '/materials', title: 'Study Materials', icon: Book },
  { key: '/notes', title: 'Notes & PDFs', icon: FileText },
  { key: '/assignments', title: 'Assignments', icon: Download },
  { key: '/announcements', title: 'Announcements', icon: Bell },
  { key: '/attendance', title: 'Attendance', icon: UserCheck },
  { key: '/profile', title: 'Profile', icon: User },
];

const StudentLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <PortalSidebar
          label="Student Portal"
          items={items}
          activeKey={pathname}
          onSelect={(k) => navigate(k)}
          studentStyle
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-10 items-center gap-2 border-b border-border bg-card px-2">
            <SidebarTrigger aria-label="Toggle menu" />
            <span className="text-sm text-muted-foreground">Menu</span>
          </div>
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default StudentLayout;
