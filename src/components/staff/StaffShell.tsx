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
  <SidebarProvider>
  <div className="flex min-h-screen w-full bg-background">
    <PortalSidebar label={title} items={navItems} activeKey={activeTab} onSelect={(k) => { onTabChange(k); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
    <div className="flex min-w-0 flex-1 flex-col">
    <header className="sticky top-0 z-40 border-b border-border bg-card shadow-sm">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <SidebarTrigger aria-label="Toggle menu" />
          <img
            src="/lovable-uploads/63f128ca-12f8-480a-9026-c6299e38a2c2.png"
            alt="Chaitanya College Logo"
            className="h-11 w-auto object-contain"
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
          <Button variant="outline" asChild className="shrink-0">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Switch module</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
    <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  </div>
  </SidebarProvider>
);

export default StaffShell;
