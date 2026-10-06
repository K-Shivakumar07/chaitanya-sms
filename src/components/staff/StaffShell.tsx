import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { romanSemester } from '@/context/SemesterContext';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import PortalSidebar, { type PortalNavItem } from '@/components/PortalSidebar';
import universityLogo from '@/assets/chaitanya-university-logo.webp';

interface StaffShellProps {
  title: string;
  subtitle: string;
  semester: number;
  onSemesterChange: (n: number) => void;
  allowAllSemesters?: boolean;
  children: React.ReactNode;
  navItems?: PortalNavItem[];
  activeTab?: string;
  onTabChange?: (v: string) => void;
}

const StaffShell = ({
  title,
  subtitle,
  semester,
  onSemesterChange,
  allowAllSemesters = false,
  children,
  navItems = [],
  activeTab = '',
  onTabChange = () => {},
}: StaffShellProps) => (
  <SidebarProvider className="h-screen min-h-0 overflow-hidden">
  <div className="flex h-screen min-h-0 w-full flex-col overflow-hidden bg-background">
    <header className="relative z-40 shrink-0 border-b border-border bg-card shadow-sm">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-2">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden" aria-label="Open portal menu" />
          <img
            src={universityLogo}
            alt="Chaitanya (Deemed to be University)"
            className="h-16 w-52 object-contain object-left sm:h-20 sm:w-72 lg:h-24 lg:w-[21rem]"
          />
          <div className="hidden sm:block">
            <p className="font-semibold leading-tight text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none sm:gap-3">
          <Select value={String(semester)} onValueChange={(v) => onSemesterChange(Number(v))}>
            <SelectTrigger className="w-[150px] bg-card sm:w-[170px]" aria-label="Select semester">
              <GraduationCap className="mr-2 h-4 w-4 shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {allowAllSemesters && <SelectItem value="0">All semesters</SelectItem>}
              {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                <SelectItem key={n} value={String(n)}>
                  Semester {romanSemester(n)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="shrink-0" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </div>
    </header>
    <div className="flex min-h-0 w-full flex-1 overflow-hidden">
      <PortalSidebar
        label={title}
        items={navItems}
        activeKey={activeTab}
        onSelect={(key) => onTabChange(key)}
        simplifiedStyle
      />
      <main className="min-w-0 flex-1 overflow-y-auto overscroll-contain px-4 py-8">
        <div className="container mx-auto">{children}</div>
      </main>
    </div>
  </div>
  </SidebarProvider>
);

export default StaffShell;
