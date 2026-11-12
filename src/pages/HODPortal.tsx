import { useMemo, useState } from 'react';
import {
  Activity, Bell, BookOpen, Building2, CalendarDays, CheckSquare, ClipboardCheck, FileBarChart,
  FileText, GraduationCap, Layers3, Megaphone, Settings, Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PortalSidebar, { type PortalNavItem } from '@/components/PortalSidebar';
import HODViews from '@/components/hod/HODViews';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRole } from '@/context/RoleContext';
import { romanSemester } from '@/context/SemesterContext';
import universityLogo from '@/assets/chaitanya-university-logo.webp';
import {
  hodDemoAnnouncements, hodDemoAssignments, hodDemoAttendance, hodDemoExams, hodDemoFaculty,
  hodDemoLeaves, hodDemoNotifications, hodDemoSections, hodDemoStudents, hodDemoSubjects,
  hodNavigation, type HODAnnouncement, type HODFaculty, type HODLeaveRequest, type HODNotification,
  type HODStudent,
} from '@/data/hodDemoData';

const iconMap = {
  dashboard: GraduationCap,
  overview: Building2,
  students: Users,
  faculty: Activity,
  subjects: BookOpen,
  attendance: ClipboardCheck,
  performance: FileBarChart,
  assignments: FileText,
  exams: CalendarDays,
  leaves: CheckSquare,
  announcements: Megaphone,
  reports: Layers3,
  notifications: Bell,
  settings: Settings,
};

const navItems: PortalNavItem[] = hodNavigation.map((item) => ({
  key: item.key,
  title: item.title,
  icon: iconMap[item.key],
}));

const HODPortal = () => {
  const navigate = useNavigate();
  const { clearRole } = useRole();
  const [active, setActive] = useState('dashboard');
  const [semester, setSemester] = useState(7);
  const [students, setStudents] = useState<HODStudent[]>(hodDemoStudents);
  const [faculty, setFaculty] = useState<HODFaculty[]>(hodDemoFaculty);
  const [leaves, setLeaves] = useState<HODLeaveRequest[]>(hodDemoLeaves);
  const [announcements, setAnnouncements] = useState<HODAnnouncement[]>(hodDemoAnnouncements);
  const [notifications, setNotifications] = useState<HODNotification[]>(hodDemoNotifications);
  const [threshold, setThreshold] = useState(75);
  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

  const signOut = () => {
    clearRole();
    navigate('/');
  };

  return (
    <SidebarProvider className="h-screen min-h-0 overflow-hidden">
      <div className="flex h-screen min-h-0 w-full flex-col overflow-hidden bg-background">
        <header className="relative z-40 shrink-0 border-b border-border bg-card shadow-sm">
          <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-2">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="md:hidden" aria-label="Open HOD menu" />
              <img src={universityLogo} alt="Chaitanya (Deemed to be University)" className="h-16 w-52 object-contain object-left sm:h-20 sm:w-72 lg:h-24 lg:w-[21rem]" />
              <div className="hidden sm:block">
                <p className="font-semibold leading-tight text-foreground">HOD Portal</p>
                <p className="text-xs text-muted-foreground">CSE (AI&ML) · Demo workspace</p>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none sm:gap-3">
              {active === 'notifications' && <span className="text-sm text-muted-foreground">{unreadCount} unread</span>}
              <Select value={String(semester)} onValueChange={(value) => setSemester(Number(value))}>
                <SelectTrigger aria-label="Select semester" className="w-[150px] bg-card sm:w-[170px]">
                  <GraduationCap className="mr-2 h-4 w-4 shrink-0" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>{[1, 3, 5, 7].map((number) => <SelectItem key={number} value={String(number)}>Semester {romanSemester(number)}</SelectItem>)}</SelectContent>
              </Select>
              <Button variant="outline" className="shrink-0" onClick={signOut}>
                <span>Sign out</span>
              </Button>
            </div>
          </div>
        </header>
        <div className="flex min-h-0 w-full flex-1 overflow-hidden">
          <PortalSidebar label="HOD workspace" items={navItems} activeKey={active} onSelect={setActive} simplifiedStyle scrollable />
          <main className="min-w-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-6 sm:py-8">
            <div className="container mx-auto max-w-7xl">
              <HODViews
                active={active}
                semester={semester}
                onNavigate={setActive}
                students={students}
                setStudents={setStudents}
                faculty={faculty}
                setFaculty={setFaculty}
                subjects={hodDemoSubjects}
                sections={hodDemoSections}
                attendance={hodDemoAttendance}
                assignments={hodDemoAssignments}
                exams={hodDemoExams}
                leaves={leaves}
                setLeaves={setLeaves}
                announcements={announcements}
                setAnnouncements={setAnnouncements}
                notifications={notifications}
                setNotifications={setNotifications}
                threshold={threshold}
                setThreshold={setThreshold}
              />
              <p className="mt-8 border-t pt-4 text-xs text-muted-foreground">Demonstration workspace · No official student or staff records are changed.</p>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default HODPortal;