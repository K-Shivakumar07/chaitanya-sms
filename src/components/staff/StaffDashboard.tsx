import React from 'react';
import {
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Clock3,
  FileText,
  GraduationCap,
  Library,
  Megaphone,
  NotebookTabs,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CrudPanel from '@/components/staff/CrudPanel';
import type { PanelEntry } from '@/components/staff/panels';
import { useTableRows } from '@/hooks/useStaffData';

interface StaffDashboardProps {
  role: 'Faculty' | 'Admin';
  semester: number;
  panels: PanelEntry[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

const panelIcons = {
  subjects: GraduationCap,
  syllabus: BookOpen,
  timetable: CalendarDays,
  faculty: Users,
  materials: Library,
  notes: NotebookTabs,
  assignments: FileText,
  deadlines: Clock3,
  announcements: Megaphone,
  activities: Bell,
  attendance: ClipboardCheck,
};

const panelStyles = [
  'bg-primary text-primary-foreground',
  'bg-portal-cyan text-portal-ink',
  'bg-destructive text-destructive-foreground',
  'bg-secondary text-secondary-foreground',
];

const StaffDashboard = ({ role, semester, panels, activeTab, onTabChange }: StaffDashboardProps) => {
  const dataSemester = semester === 0 ? null : semester;
  const { data: materials } = useTableRows('materials', { semester: dataSemester, scoped: semester !== 0 });
  const { data: notes } = useTableRows('notes', { semester: dataSemester, scoped: semester !== 0 });
  const { data: assignments } = useTableRows<{ status?: string }>('assignments', {
    semester: dataSemester,
    scoped: semester !== 0,
  });
  const { data: attendance } = useTableRows('attendance_records', {
    semester: dataSemester,
    scoped: semester !== 0,
    orderBy: 'roll_no',
    ascending: true,
  });

  const pending = (assignments ?? []).filter((item) => item.status !== 'submitted' && item.status !== 'completed');
  const summary = [
    { label: 'Study Materials', value: materials?.length ?? 0, detail: 'Resources available', icon: Library },
    { label: 'Notes & PDFs', value: notes?.length ?? 0, detail: 'Notes published', icon: NotebookTabs },
    { label: 'Pending Assignments', value: pending.length, detail: 'Awaiting completion', icon: FileText },
    { label: 'Attendance Records', value: attendance?.length ?? 0, detail: 'Student records entered', icon: ClipboardCheck },
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-foreground">
          {role} Management Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage student resources and academic updates from one place.
        </p>
      </div>

      <section aria-label="Portal summary" className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item, index) => (
          <Card key={item.label} className="transition-shadow duration-300 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
              <span className={`rounded-lg p-2 ${panelStyles[index]}`}>
                <item.icon className="h-4 w-4" aria-hidden="true" />
              </span>
            </CardHeader>
            <CardContent>
              <p className="mb-1 text-2xl font-bold text-foreground">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.detail}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <TabsList className="mb-8 grid h-auto w-full grid-cols-1 gap-4 bg-transparent p-0 sm:grid-cols-2 lg:grid-cols-3">
        {panels.map((entry, index) => {
          const Icon = panelIcons[entry.value as keyof typeof panelIcons] ?? FileText;
          const config = entry.panel(semester);
          return (
            <TabsTrigger
              key={entry.value}
              value={entry.value}
              className="group h-full min-h-28 justify-start whitespace-normal rounded-lg border border-border bg-card p-0 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg data-[state=active]:border-primary data-[state=active]:bg-card data-[state=active]:shadow-md"
            >
              <span className="flex w-full items-start gap-3 p-5">
                <span className={`shrink-0 rounded-lg p-3 ${panelStyles[index % panelStyles.length]}`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="min-w-0 pt-1">
                  <span className="block text-base font-semibold text-foreground group-data-[state=active]:text-primary">
                    {entry.label}
                  </span>
                  <span className="mt-1 block text-sm font-normal leading-5 text-muted-foreground">
                    {config.description}
                  </span>
                </span>
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {panels.map((entry) => (
        <TabsContent key={entry.value} value={entry.value} className="mt-0 focus-visible:outline-none">
          <CrudPanel {...entry.panel(semester)} />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default StaffDashboard;