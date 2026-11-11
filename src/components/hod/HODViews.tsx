import { useMemo, useState, type Dispatch, type FormEvent, type SetStateAction } from 'react';
import {
  Activity, ArrowDown, ArrowUp, ArrowUpDown, Bell, BookOpen, CalendarDays, Check, CheckCircle2,
  ClipboardCheck, Clock3, Download, FileBarChart, FileText, GraduationCap, Layers3, Plus, Search,
  Send, Users, X,
} from 'lucide-react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  hodAttendanceTrend, hodDemoAttendance, hodDemoFaculty, hodDemoSections, hodDemoStudents,
  hodPerformanceBySemester, hodSubjectPerformance, hodWorkloadByFaculty,
  type HODAnnouncement, type HODAttendance, type HODAssignment, type HODExam, type HODFaculty,
  type HODLeaveRequest, type HODNotification, type HODSection, type HODStudent, type HODSubject,
} from '@/data/hodDemoData';

interface HODViewsProps {
  active: string;
  semester: number;
  onNavigate: (key: string) => void;
  students: HODStudent[];
  setStudents: Dispatch<SetStateAction<HODStudent[]>>;
  faculty: HODFaculty[];
  setFaculty: Dispatch<SetStateAction<HODFaculty[]>>;
  subjects: HODSubject[];
  sections: HODSection[];
  attendance: HODAttendance[];
  assignments: HODAssignment[];
  exams: HODExam[];
  leaves: HODLeaveRequest[];
  setLeaves: Dispatch<SetStateAction<HODLeaveRequest[]>>;
  announcements: HODAnnouncement[];
  setAnnouncements: Dispatch<SetStateAction<HODAnnouncement[]>>;
  notifications: HODNotification[];
  setNotifications: Dispatch<SetStateAction<HODNotification[]>>;
  threshold: number;
  setThreshold: (value: number) => void;
}

const sections = ['All sections', 'CSE-A', 'CSE-B'];
const semesters = [1, 3, 5, 7];
const initials = (name: string) => name.split(' ').map((part) => part[0]).slice(0, 2).join('');
const semesterName = (number: number) => `Semester ${number}`;
const pct = (value: number) => `${Math.round(value)}%`;

const StatusBadge = ({ children }: { children: string }) => {
  const state = children.toLowerCase();
  const style = ['approved', 'published', 'complete', 'good standing', 'active', 'on track'].includes(state)
    ? 'border-portal-cyan/30 bg-portal-soft-cyan text-foreground'
    : ['pending', 'needs support', 'scheduled', 'draft'].includes(state)
      ? 'border-primary/20 bg-portal-soft-blue text-foreground'
      : ['rejected', 'at risk', 'delayed'].includes(state)
        ? 'border-destructive/25 bg-destructive/10 text-destructive'
        : 'border-border bg-muted text-muted-foreground';
  return <Badge variant="outline" className={style}>{children}</Badge>;
};

const PageHeading = ({ eyebrow, title, detail, action }: { eyebrow: string; title: string; detail: string; action?: React.ReactNode }) => (
  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p className="mb-1 text-xs font-bold uppercase text-primary">{eyebrow}</p>
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
    </div>
    {action}
  </div>
);

const DataTable = ({ headers, children, empty = 'No demonstration records match these filters.' }: {
  headers: string[]; children: React.ReactNode; empty?: string;
}) => (
  <div className="overflow-x-auto rounded-md border bg-card">
    <Table>
      <TableHeader><TableRow>{headers.map((heading) => <TableHead key={heading} className="whitespace-nowrap">{heading}</TableHead>)}</TableRow></TableHeader>
      <TableBody>{children}</TableBody>
    </Table>
    {React.Children.count(children) === 0 && <p className="p-8 text-center text-sm text-muted-foreground">{empty}</p>}
  </div>
);

const Panel = ({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) => (
  <Card className="rounded-md shadow-none">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
      <CardTitle className="text-base">{title}</CardTitle>{action}
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const SearchBox = ({ value, onChange, placeholder = 'Search records' }: { value: string; onChange: (value: string) => void; placeholder?: string }) => (
  <div className="relative w-full sm:max-w-xs">
    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    <Input className="pl-9" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-label={placeholder} />
  </div>
);

const EmptyRow = ({ count, text = 'No records found.' }: { count: number; text?: string }) => (
  <TableRow><TableCell colSpan={count} className="h-24 text-center text-muted-foreground">{text}</TableCell></TableRow>
);

const HODViews = ({ active, semester, onNavigate, students, setStudents, faculty, setFaculty, subjects, sections: sectionRows,
  attendance, assignments, exams, leaves, setLeaves, announcements, setAnnouncements, notifications, setNotifications,
  threshold, setThreshold,
}: HODViewsProps) => {
  const currentStudents = students.filter((row) => row.semester === semester);
  const currentAttendance = attendance.filter((row) => row.semester === semester);
  const currentSubjects = subjects.filter((row) => row.semester === semester);
  const attendanceAverage = currentAttendance.length
    ? currentAttendance.reduce((sum, row) => sum + (row.held ? (row.attended / row.held) * 100 : 0), 0) / currentAttendance.length
    : 0;
  const atRisk = students.filter((row) => row.attendance < threshold).length;
  const pendingLeaves = leaves.filter((row) => row.status === 'Pending').length;
  const pendingEvaluations = assignments.filter((row) => row.evaluation === 'Delayed').length;
  const [studentSearch, setStudentSearch] = useState('');
  const [studentStatus, setStudentStatus] = useState('All statuses');
  const [studentSection, setStudentSection] = useState('All sections');
  const [studentSort, setStudentSort] = useState<'name' | 'cgpa' | 'attendance'>('name');
  const [studentPage, setStudentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<HODStudent | null>(null);
  const [facultySearch, setFacultySearch] = useState('');
  const [subjectSearch, setSubjectSearch] = useState('');
  const [attendanceSearch, setAttendanceSearch] = useState('');
  const [assignmentSearch, setAssignmentSearch] = useState('');
  const [leaveFilter, setLeaveFilter] = useState('All requests');
  const [decision, setDecision] = useState<{ item: HODLeaveRequest; status: 'Approved' | 'Rejected' } | null>(null);
  const [decisionReason, setDecisionReason] = useState('');
  const [announcementFormOpen, setAnnouncementFormOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<string | null>(null);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementDescription, setAnnouncementDescription] = useState('');
  const [announcementAudience, setAnnouncementAudience] = useState('All Department Students');
  const [announcementPriority, setAnnouncementPriority] = useState<'Normal' | 'Important'>('Normal');
  const [reportType, setReportType] = useState('Student Information Report');
  const [reportSemester, setReportSemester] = useState(String(semester));
  const [reportPreview, setReportPreview] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState('All notifications');
  const [hodName, setHodName] = useState('Dr. Ananya Rao');
  const [hodEmail, setHodEmail] = useState('ananya.demo@example.edu');
  const [hodPhone, setHodPhone] = useState('+91 90000 00000');
  const [savedProfile, setSavedProfile] = useState(false);
  const [settingsNotice, setSettingsNotice] = useState(true);
  const [settingsAttendance, setSettingsAttendance] = useState(true);
  const [settingsEvaluation, setSettingsEvaluation] = useState(true);

  const filteredStudents = useMemo(() => currentStudents.filter((row) => {
    const q = studentSearch.toLowerCase();
    return (!q || `${row.id} ${row.name} ${row.email}`.toLowerCase().includes(q)) &&
      (studentStatus === 'All statuses' || row.status === studentStatus) &&
      (studentSection === 'All sections' || `${row.branch}-${row.section}` === studentSection);
  }).sort((a, b) => studentSort === 'name' ? a.name.localeCompare(b.name) : b[studentSort] - a[studentSort]),
  [currentStudents, studentSearch, studentStatus, studentSection, studentSort]);
  const pageSize = 5;
  const pageCount = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const pageStudents = filteredStudents.slice((studentPage - 1) * pageSize, studentPage * pageSize);

  const handleStudentSort = () => setStudentSort((sort) => sort === 'name' ? 'cgpa' : sort === 'cgpa' ? 'attendance' : 'name');
  const saveLeaveDecision = () => {
    if (!decision || (decision.status === 'Rejected' && !decisionReason.trim())) return;
    setLeaves((current) => current.map((row) => row.id === decision.item.id
      ? { ...row, status: decision.status, decisionReason: decision.status === 'Rejected' ? decisionReason.trim() : undefined }
      : row));
    setDecision(null);
    setDecisionReason('');
  };
  const openAnnouncementForm = (announcement?: HODAnnouncement) => {
    setEditingAnnouncement(announcement?.id ?? null);
    setAnnouncementTitle(announcement?.title ?? '');
    setAnnouncementDescription(announcement?.description ?? '');
    setAnnouncementAudience(announcement?.audience ?? 'All Department Students');
    setAnnouncementPriority(announcement?.priority ?? 'Normal');
    setAnnouncementFormOpen(true);
  };
  const saveAnnouncement = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prior = announcements.find((row) => row.id === editingAnnouncement);
    const next: HODAnnouncement = {
      id: prior?.id ?? `ANN-DEMO-${Date.now()}`,
      title: announcementTitle.trim(),
      description: announcementDescription.trim(),
      audience: announcementAudience,
      priority: announcementPriority,
      status: 'Published',
      publishedAt: new Date().toISOString().slice(0, 10),
    };
    setAnnouncements((current) => prior ? current.map((row) => row.id === prior.id ? next : row) : [next, ...current]);
    setAnnouncementFormOpen(false);
  };
  const exportCsv = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    if (reportType === 'Faculty Workload Report') {
      headers = ['Faculty ID', 'Name', 'Subjects', 'Sections', 'Weekly Hours'];
      rows = faculty.map((row) => [row.id, row.name, row.subjects.join('; '), String(row.sections), String(row.weeklyHours)]);
    } else if (reportType === 'Attendance Report') {
      headers = ['Student ID', 'Student Name', 'Section', 'Semester', 'Subject', 'Held', 'Attended', 'Percent'];
      rows = attendance.filter((row) => row.semester === Number(reportSemester)).map((row) => [row.studentId, row.studentName, row.section, String(row.semester), row.subject, String(row.held), String(row.attended), pct(row.held ? (row.attended / row.held) * 100 : 0)]);
    } else if (reportType === 'Assignment Submission Report') {
      headers = ['Title', 'Subject', 'Faculty', 'Section', 'Students', 'Submitted', 'Evaluation'];
      rows = assignments.filter((row) => row.semester === Number(reportSemester)).map((row) => [row.title, row.subject, row.faculty, row.section, String(row.students), String(row.submitted), row.evaluation]);
    } else {
      headers = ['Student ID', 'Student Name', 'Email', 'Branch', 'Section', 'Semester', 'CGPA', 'Attendance', 'Status'];
      rows = students.filter((row) => row.semester === Number(reportSemester)).map((row) => [row.id, row.name, row.email, row.branch, row.section, String(row.semester), row.cgpa.toFixed(1), pct(row.attendance), row.status]);
    }
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `hod-${reportType.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}-demo.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (active === 'dashboard') return <>
    <section className="mb-7 rounded-md bg-primary p-6 text-primary-foreground sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-3xl">
          <Badge variant="outline" className="mb-4 border-primary-foreground/30 text-primary-foreground">DEPARTMENT WORKSPACE · DEMO DATA</Badge>
          <h1 className="text-2xl font-bold sm:text-3xl">Good morning, {hodName}</h1>
          <p className="mt-2 text-sm text-primary-foreground/80">CSE (AI&ML) · Academic year 2026–27 · {semesterName(semester)}</p>
          <p className="mt-3 max-w-2xl text-sm text-primary-foreground/80">Monitor department academics, faculty activity, student progress and approvals from one workspace.</p>
        </div>
        <Avatar className="h-16 w-16 border-2 border-primary-foreground/50"><AvatarFallback className="bg-card text-lg font-bold text-primary">AR</AvatarFallback></Avatar>
      </div>
    </section>
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div><p className="text-xs font-bold uppercase text-primary">Department snapshot</p><h2 className="mt-1 text-xl font-bold">Key indicators</h2></div>
      <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
    </div>
    <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Department indicators">
      {[
        { title: 'Total students', value: students.length, detail: `${currentStudents.length} in this semester`, icon: Users, target: 'students' },
        { title: 'Total faculty', value: faculty.length, detail: 'Department team', icon: GraduationCap, target: 'faculty' },
        { title: 'Active subjects', value: currentSubjects.filter((row) => row.status === 'Active').length, detail: `${semesterName(semester)} courses`, icon: BookOpen, target: 'subjects' },
        { title: 'Sections', value: sectionRows.filter((row) => row.semester === semester).length, detail: 'Current semester', icon: Layers3, target: 'subjects' },
        { title: 'Average attendance', value: pct(attendanceAverage), detail: `${atRisk} below ${threshold}% threshold`, icon: ClipboardCheck, target: 'attendance' },
        { title: 'Pending approvals', value: pendingLeaves, detail: `${pendingEvaluations} delayed evaluations`, icon: Clock3, target: 'leaves' },
      ].map((item) => <Card key={item.title} className="cursor-pointer rounded-md shadow-none transition-colors hover:border-primary/40" onClick={() => onNavigate(item.target)}>
        <CardContent className="flex items-start justify-between p-5">
          <div><p className="text-sm text-muted-foreground">{item.title}</p><p className="mt-2 text-3xl font-bold">{item.value}</p><p className="mt-1 text-xs text-muted-foreground">{item.detail}</p></div>
          <span className="rounded-md bg-secondary p-2.5 text-primary"><item.icon className="h-5 w-5" /></span>
        </CardContent>
      </Card>)}
    </section>
    <section className="mb-7 grid gap-5 xl:grid-cols-2">
      <Panel title="Academic performance by semester">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%"><LineChart data={hodPerformanceBySemester} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="semester" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} /><YAxis domain={[0, 10]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            <Tooltip /><Line type="monotone" dataKey="cgpa" name="Average CGPA" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} /><Line type="monotone" dataKey="passRate" name="Pass rate %" stroke="hsl(var(--portal-cyan))" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart></ResponsiveContainer>
        </div>
      </Panel>
      <Panel title="Department attendance trend">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%"><AreaChart data={hodAttendanceTrend} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
            <defs><linearGradient id="hodAttendanceFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--portal-cyan))" stopOpacity={0.35} /><stop offset="95%" stopColor="hsl(var(--portal-cyan))" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} /><YAxis domain={[60, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} /><Tooltip /><Area type="monotone" dataKey="attendance" name="Attendance %" stroke="hsl(var(--portal-cyan))" strokeWidth={3} fill="url(#hodAttendanceFill)" />
          </AreaChart></ResponsiveContainer>
        </div>
      </Panel>
    </section>
    <section className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
      <Panel title="Recent department activity">
        <div className="space-y-4">
          {[
            { icon: ClipboardCheck, title: 'Attendance monitoring', detail: `${atRisk} demo students fall below the ${threshold}% threshold`, time: 'Today' },
            { icon: FileText, title: 'Assessment follow-up', detail: `${pendingEvaluations} assignment evaluation needs attention`, time: 'Today' },
            { icon: CalendarDays, title: 'Mid-term schedule', detail: 'Semester VII examination dates are scheduled', time: 'Nov 8' },
            { icon: CheckCircle2, title: 'Leave requests', detail: `${pendingLeaves} requests await a decision`, time: 'Today' },
          ].map((item) => <div key={item.title} className="flex gap-3 border-b pb-3 last:border-0 last:pb-0">
            <span className="mt-0.5 rounded-md bg-secondary p-2 text-primary"><item.icon className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{item.title}</p><p className="text-sm text-muted-foreground">{item.detail}</p></div><span className="whitespace-nowrap text-xs text-muted-foreground">{item.time}</span>
          </div>)}
        </div>
      </Panel>
      <Panel title="Quick access">
        <div className="grid grid-cols-2 gap-2">
          {[
            ['Students', 'students', Users], ['Faculty', 'faculty', GraduationCap], ['Attendance', 'attendance', ClipboardCheck], ['Performance', 'performance', Activity],
            ['Approvals', 'leaves', CheckCircle2], ['Reports', 'reports', FileBarChart],
          ].map(([label, key, Icon]) => <Button key={String(key)} variant="outline" className="h-auto min-h-14 justify-start whitespace-normal text-left" onClick={() => onNavigate(String(key))}><Icon className="h-4 w-4 shrink-0 text-primary" />{label}</Button>)}
        </div>
      </Panel>
    </section>
  </>;

  if (active === 'overview') return <>
    <PageHeading eyebrow="Department" title="Department overview" detail="CSE (AI&ML) · Department-level academic summary" />
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[['Department code', 'CSE-AIML'], ['Academic year', '2026–27'], ['Current semester', semesterName(semester)], ['Contact', 'hod.aiml.demo@example.edu']].map(([label, value]) => <Card key={label} className="rounded-md shadow-none"><CardContent className="p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-semibold">{value}</p></CardContent></Card>)}
    </div>
    <div className="grid gap-5 xl:grid-cols-2">
      <Panel title="Department profile"><dl className="grid grid-cols-2 gap-x-4 gap-y-5 text-sm"><div><dt className="text-muted-foreground">Head of department</dt><dd className="mt-1 font-semibold">{hodName}</dd></div><div><dt className="text-muted-foreground">Total demonstration students</dt><dd className="mt-1 font-semibold">{students.length}</dd></div><div><dt className="text-muted-foreground">Faculty strength</dt><dd className="mt-1 font-semibold">{faculty.length}</dd></div><div><dt className="text-muted-foreground">Active courses</dt><dd className="mt-1 font-semibold">{subjects.filter((row) => row.status === 'Active').length}</dd></div><div><dt className="text-muted-foreground">Sections</dt><dd className="mt-1 font-semibold">{sectionRows.length}</dd></div><div><dt className="text-muted-foreground">Department attendance</dt><dd className="mt-1 font-semibold">{pct(attendanceAverage)}</dd></div></dl></Panel>
      <Panel title="Semester overview"><div className="space-y-4">{semesters.map((term) => {
        const headcount = students.filter((row) => row.semester === term).length;
        const subjectCount = subjects.filter((row) => row.semester === term).length;
        const attendanceRows = attendance.filter((row) => row.semester === term);
        const average = attendanceRows.length ? attendanceRows.reduce((sum, row) => sum + row.attended / Math.max(row.held, 1) * 100, 0) / attendanceRows.length : 0;
        return <div key={term}><div className="mb-1 flex justify-between text-sm"><span className="font-medium">{semesterName(term)}</span><span className="text-muted-foreground">{headcount} demo profiles · {subjectCount} courses · {pct(average)} attendance</span></div><Progress value={average} className="h-2" /></div>;
      })}</div></Panel>
    </div>
  </>;

  if (active === 'students') return <>
    <PageHeading eyebrow="Academic directory" title="Student monitoring" detail="Search, filter and review demonstration student profiles." />
    <Panel title={`${filteredStudents.length} students in ${semesterName(semester)}`}>
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchBox value={studentSearch} onChange={(value) => { setStudentSearch(value); setStudentPage(1); }} placeholder="Search name, roll number or email" />
        <Select value={studentSection} onValueChange={(value) => { setStudentSection(value); setStudentPage(1); }}><SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger><SelectContent>{sections.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>
        <Select value={studentStatus} onValueChange={(value) => { setStudentStatus(value); setStudentPage(1); }}><SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger><SelectContent>{['All statuses', 'Good standing', 'Needs support', 'At risk'].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>
        <Button variant="outline" onClick={handleStudentSort}><ArrowUpDown className="h-4 w-4" />Sort: {studentSort}</Button>
      </div>
      <DataTable headers={['Student', 'Roll number', 'Section', 'CGPA', 'Attendance', 'Status', 'Profile']}>
        {pageStudents.length ? pageStudents.map((row) => <TableRow key={row.id}><TableCell className="min-w-44"><div className="flex items-center gap-2"><Avatar className="h-8 w-8"><AvatarFallback>{initials(row.name)}</AvatarFallback></Avatar><span className="font-medium">{row.name}</span></div><span className="ml-10 block text-xs text-muted-foreground">{row.email}</span></TableCell><TableCell>{row.id}</TableCell><TableCell>{row.branch}-{row.section}</TableCell><TableCell>{row.cgpa.toFixed(1)}</TableCell><TableCell><span className={row.attendance < threshold ? 'font-semibold text-destructive' : ''}>{pct(row.attendance)}</span></TableCell><TableCell><StatusBadge>{row.status}</StatusBadge></TableCell><TableCell><Button size="sm" variant="outline" onClick={() => setSelectedStudent(row)}>View</Button></TableCell></TableRow>) : <EmptyRow count={7} />}
      </DataTable>
      <div className="mt-4 flex items-center justify-between text-sm"><span className="text-muted-foreground">Page {studentPage} of {pageCount}</span><div className="flex gap-2"><Button size="sm" variant="outline" disabled={studentPage <= 1} onClick={() => setStudentPage((page) => Math.max(1, page - 1))}>Previous</Button><Button size="sm" variant="outline" disabled={studentPage >= pageCount} onClick={() => setStudentPage((page) => Math.min(pageCount, page + 1))}>Next</Button></div></div>
    </Panel>
    <Dialog open={Boolean(selectedStudent)} onOpenChange={(open) => { if (!open) setSelectedStudent(null); }}><DialogContent><DialogHeader><DialogTitle>Student demonstration profile</DialogTitle><DialogDescription>Sample information for interface demonstration only.</DialogDescription></DialogHeader>{selectedStudent && <dl className="grid grid-cols-2 gap-4 text-sm"><div><dt className="text-muted-foreground">Name</dt><dd className="mt-1 font-semibold">{selectedStudent.name}</dd></div><div><dt className="text-muted-foreground">Student ID</dt><dd className="mt-1 font-semibold">{selectedStudent.id}</dd></div><div><dt className="text-muted-foreground">Email</dt><dd className="mt-1 break-all font-semibold">{selectedStudent.email}</dd></div><div><dt className="text-muted-foreground">Semester / section</dt><dd className="mt-1 font-semibold">{semesterName(selectedStudent.semester)} · {selectedStudent.section}</dd></div><div><dt className="text-muted-foreground">CGPA</dt><dd className="mt-1 font-semibold">{selectedStudent.cgpa.toFixed(1)}</dd></div><div><dt className="text-muted-foreground">Attendance</dt><dd className="mt-1 font-semibold">{pct(selectedStudent.attendance)}</dd></div></dl>}</DialogContent></Dialog>
  </>;

  if (active === 'faculty') {
    const filtered = faculty.filter((row) => `${row.name} ${row.email} ${row.designation} ${row.subjects.join(' ')}`.toLowerCase().includes(facultySearch.toLowerCase()));
    return <><PageHeading eyebrow="Faculty oversight" title="Faculty & workload" detail="Review teaching assignments and follow up on workload or attendance submissions." />
      <div className="mb-5 grid gap-4 sm:grid-cols-3">{[{ label: 'Faculty members', value: faculty.length }, { label: 'Weekly teaching hours', value: faculty.reduce((sum, row) => sum + row.weeklyHours, 0) }, { label: 'Submissions pending', value: faculty.filter((row) => !row.attendanceSubmitted).length }].map((item) => <Card key={item.label} className="rounded-md shadow-none"><CardContent className="p-4"><p className="text-sm text-muted-foreground">{item.label}</p><p className="mt-1 text-2xl font-bold">{item.value}</p></CardContent></Card>)}</div>
      <div className="grid gap-5 xl:grid-cols-[1.25fr_1fr]"><Panel title="Faculty directory"><div className="mb-4"><SearchBox value={facultySearch} onChange={setFacultySearch} placeholder="Search faculty or subject" /></div><DataTable headers={['Faculty', 'Subjects', 'Sections', 'Hours / week', 'Attendance']}>
        {filtered.length ? filtered.map((row) => <TableRow key={row.id}><TableCell><p className="font-medium">{row.name}</p><p className="text-xs text-muted-foreground">{row.designation}</p></TableCell><TableCell className="min-w-36">{row.subjects.join(', ')}</TableCell><TableCell>{row.sections}</TableCell><TableCell><Input aria-label={`Weekly hours for ${row.name}`} type="number" min={0} max={40} value={row.weeklyHours} className="h-9 w-20" onChange={(event) => setFaculty((current) => current.map((item) => item.id === row.id ? { ...item, weeklyHours: Math.max(0, Math.min(40, Number(event.target.value))) } : item))} /></TableCell><TableCell><StatusBadge>{row.attendanceSubmitted ? 'Submitted' : 'Pending'}</StatusBadge></TableCell></TableRow>) : <EmptyRow count={5} />}
      </DataTable></Panel><Panel title="Weekly workload distribution"><div className="h-72 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={hodWorkloadByFaculty} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis type="number" domain={[0, 24]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} /><YAxis type="category" dataKey="name" width={100} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} /><Tooltip /><Bar dataKey="hours" name="Weekly hours" fill="hsl(var(--primary))" radius={[0, 3, 3, 0]} /></BarChart></ResponsiveContainer></div><p className="text-xs text-muted-foreground">Workload edits apply to this local demonstration only.</p></Panel></div>
    </>;
  }

  if (active === 'subjects') {
    const filteredSubjects = subjects.filter((row) => row.semester === semester && `${row.code} ${row.name} ${row.faculty}`.toLowerCase().includes(subjectSearch.toLowerCase()));
    return <><PageHeading eyebrow="Academic structure" title="Subjects & sections" detail="Review demonstration course assignments and section coverage." />
      <div className="mb-5 flex flex-col gap-3 sm:flex-row"><SearchBox value={subjectSearch} onChange={setSubjectSearch} placeholder="Search subject or faculty" /><Button variant="outline" onClick={() => onNavigate('overview')}><Layers3 className="h-4 w-4" />Department summary</Button></div>
      <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]"><Panel title={`${filteredSubjects.length} courses · ${semesterName(semester)}`}><DataTable headers={['Code', 'Subject', 'Type', 'Credits', 'Assigned faculty', 'Status']}>
        {filteredSubjects.length ? filteredSubjects.map((row) => <TableRow key={row.code}><TableCell className="font-mono text-xs">{row.code}</TableCell><TableCell className="font-medium">{row.name}</TableCell><TableCell>{row.kind}</TableCell><TableCell>{row.credits}</TableCell><TableCell>{row.faculty}</TableCell><TableCell><StatusBadge>{row.status}</StatusBadge></TableCell></TableRow>) : <EmptyRow count={6} />}
      </DataTable></Panel><Panel title={`Sections · ${semesterName(semester)}`}><DataTable headers={['Section', 'Students', 'Coordinator', 'Faculty', 'Year']}>
        {sectionRows.filter((row) => row.semester === semester).map((row, index) => <TableRow key={`${row.name}-${row.semester}-${index}`}><TableCell className="font-semibold">{row.name}</TableCell><TableCell>{row.students}</TableCell><TableCell>{row.coordinator}</TableCell><TableCell>{row.faculty}</TableCell><TableCell>{row.academicYear}</TableCell></TableRow>)}
      </DataTable></Panel></div>
    </>;
  }

  if (active === 'attendance') {
    const filtered = currentAttendance.filter((row) => `${row.studentName} ${row.studentId} ${row.subject} ${row.section}`.toLowerCase().includes(attendanceSearch.toLowerCase()));
    const belowThreshold = currentAttendance.filter((row) => row.held > 0 && row.attended / row.held * 100 < threshold).length;
    const bySection = ['CSE-A', 'CSE-B'].map((section) => {
      const rows = currentAttendance.filter((row) => row.section === section);
      return { section, attendance: rows.length ? Math.round(rows.reduce((sum, row) => sum + row.attended / Math.max(row.held, 1) * 100, 0) / rows.length) : 0 };
    });
    return <><PageHeading eyebrow="Attendance oversight" title="Attendance management" detail="Monitoring and reporting only; demo records are not official attendance entries." action={<div className="flex items-center gap-2"><Label htmlFor="attendance-threshold" className="whitespace-nowrap">Alert below</Label><Input id="attendance-threshold" type="number" min="1" max="100" className="w-20" value={threshold} onChange={(event) => setThreshold(Math.min(100, Math.max(1, Number(event.target.value))))} /><span className="text-sm">%</span></div>} />
      <div className="mb-5 grid gap-4 sm:grid-cols-3">{[{ label: 'Average attendance', value: pct(attendanceAverage) }, { label: 'Records in view', value: currentAttendance.length }, { label: 'Below threshold', value: belowThreshold }].map((item) => <Card key={item.label} className="rounded-md shadow-none"><CardContent className="p-4"><p className="text-sm text-muted-foreground">{item.label}</p><p className="mt-1 text-2xl font-bold">{item.value}</p></CardContent></Card>)}</div>
      <div className="mb-5 grid gap-5 xl:grid-cols-2"><Panel title="Section comparison"><div className="h-56"><ResponsiveContainer width="100%" height="100%"><BarChart data={bySection} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="section" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} /><YAxis domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} /><Tooltip /><Bar dataKey="attendance" name="Attendance %" fill="hsl(var(--portal-cyan))" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer></div></Panel><Panel title="Attendance trend"><div className="h-56"><ResponsiveContainer width="100%" height="100%"><LineChart data={hodAttendanceTrend} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} /><YAxis domain={[60, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} /><Tooltip /><Line dataKey="attendance" name="Monthly %" stroke="hsl(var(--primary))" strokeWidth={3} /></LineChart></ResponsiveContainer></div></Panel></div>
      <Panel title="Student attendance details"><div className="mb-4"><SearchBox value={attendanceSearch} onChange={setAttendanceSearch} placeholder="Search student, section or subject" /></div><DataTable headers={['Student', 'Roll number', 'Section', 'Subject', 'Held', 'Attended', 'Attendance']}>
        {filtered.length ? filtered.map((row, index) => { const ratio = row.held ? row.attended / row.held * 100 : 0; return <TableRow key={`${row.studentId}-${row.subject}-${index}`}><TableCell className="font-medium">{row.studentName}</TableCell><TableCell>{row.studentId}</TableCell><TableCell>{row.section}</TableCell><TableCell>{row.subject}</TableCell><TableCell>{row.held}</TableCell><TableCell>{row.attended}</TableCell><TableCell className={ratio < threshold ? 'font-semibold text-destructive' : ''}>{pct(ratio)}</TableCell></TableRow>; }) : <EmptyRow count={7} />}
      </DataTable></Panel>
    </>;
  }

  if (active === 'performance') return <><PageHeading eyebrow="Academic outcomes" title="Academic performance" detail="Semester and course performance snapshots from demonstration data." />
    <div className="mb-5 grid gap-4 sm:grid-cols-3">{[{ label: 'Overall pass rate', value: '86%' }, { label: 'Average CGPA', value: '7.6' }, { label: 'Students needing support', value: students.filter((row) => row.status !== 'Good standing').length }].map((item) => <Card key={item.label} className="rounded-md shadow-none"><CardContent className="p-4"><p className="text-sm text-muted-foreground">{item.label}</p><p className="mt-1 text-2xl font-bold">{item.value}</p></CardContent></Card>)}</div>
    <div className="grid gap-5 xl:grid-cols-2"><Panel title="Subject-wise pass percentage"><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={hodSubjectPerformance} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} /><YAxis domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} /><Tooltip /><Bar dataKey="passRate" name="Pass rate %" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]}>{hodSubjectPerformance.map((row, index) => <Cell key={row.subject} fill={index % 2 ? 'hsl(var(--portal-cyan))' : 'hsl(var(--primary))'} />)}</Bar></BarChart></ResponsiveContainer></div></Panel>
      <Panel title="Semester result distribution"><div className="flex flex-col items-center gap-5 sm:flex-row"><div className="h-64 w-full sm:w-1/2"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{ name: 'Good standing', value: students.filter((row) => row.status === 'Good standing').length }, { name: 'Needs support', value: students.filter((row) => row.status !== 'Good standing').length }]} dataKey="value" nameKey="name" innerRadius={55} outerRadius={92} paddingAngle={3}><Cell fill="hsl(var(--portal-cyan))" /><Cell fill="hsl(var(--primary))" /></Pie><Tooltip /></PieChart></ResponsiveContainer></div><div className="w-full space-y-4">{[{ label: 'Good standing', value: students.filter((row) => row.status === 'Good standing').length, color: 'bg-portal-cyan' }, { label: 'Academic support', value: students.filter((row) => row.status !== 'Good standing').length, color: 'bg-primary' }].map((row) => <div key={row.label} className="flex items-center justify-between"><div className="flex items-center gap-2"><span className={`h-3 w-3 rounded-sm ${row.color}`} /><span className="text-sm">{row.label}</span></div><span className="font-semibold">{row.value}</span></div>)}<Button variant="outline" onClick={() => onNavigate('students')}>Review student directory</Button></div></div></Panel></div>
  </>;

  if (active === 'assignments') {
    const filtered = assignments.filter((row) => row.semester === semester && `${row.title} ${row.subject} ${row.faculty} ${row.section}`.toLowerCase().includes(assignmentSearch.toLowerCase()));
    return <><PageHeading eyebrow="Assessment oversight" title="Assignments & assessments" detail="Monitor submission progress and evaluation follow-up without changing faculty grading." />
      <div className="mb-5 grid gap-4 sm:grid-cols-3">{[{ label: 'Assignments', value: filtered.length }, { label: 'Submission rate', value: pct(filtered.length ? filtered.reduce((sum, row) => sum + row.submitted / Math.max(1, row.students) * 100, 0) / filtered.length : 0) }, { label: 'Delayed evaluation', value: filtered.filter((row) => row.evaluation === 'Delayed').length }].map((item) => <Card key={item.label} className="rounded-md shadow-none"><CardContent className="p-4"><p className="text-sm text-muted-foreground">{item.label}</p><p className="mt-1 text-2xl font-bold">{item.value}</p></CardContent></Card>)}</div>
      <Panel title={`${semesterName(semester)} assignment list`}><div className="mb-4"><SearchBox value={assignmentSearch} onChange={setAssignmentSearch} placeholder="Search title, subject or faculty" /></div><DataTable headers={['Assignment', 'Subject / faculty', 'Section', 'Due date', 'Submitted', 'Evaluation']}>
        {filtered.length ? filtered.map((row) => <TableRow key={row.title}><TableCell className="font-medium">{row.title}</TableCell><TableCell>{row.subject}<p className="text-xs text-muted-foreground">{row.faculty}</p></TableCell><TableCell>{row.section}</TableCell><TableCell>{row.dueDate}</TableCell><TableCell className="min-w-36"><span className="text-sm">{row.submitted}/{row.students}</span><Progress className="mt-1 h-1.5" value={row.submitted / Math.max(1, row.students) * 100} /></TableCell><TableCell><StatusBadge>{row.evaluation}</StatusBadge></TableCell></TableRow>) : <EmptyRow count={6} />}
      </DataTable></Panel>
    </>;
  }

  if (active === 'exams') return <><PageHeading eyebrow="Examination office" title="Examinations & results" detail="Review the sample assessment schedule and result publication status." />
    <div className="mb-5 grid gap-4 sm:grid-cols-3">{[{ label: 'Scheduled', value: exams.filter((row) => row.status === 'Scheduled').length }, { label: 'Results pending', value: exams.filter((row) => row.status === 'Results pending').length }, { label: 'Published', value: exams.filter((row) => row.status === 'Published').length }].map((item) => <Card key={item.label} className="rounded-md shadow-none"><CardContent className="p-4"><p className="text-sm text-muted-foreground">{item.label}</p><p className="mt-1 text-2xl font-bold">{item.value}</p></CardContent></Card>)}</div>
    <Panel title="Examination schedule and outcomes"><DataTable headers={['Examination', 'Subject', 'Section', 'Date', 'Pass rate', 'Backlogs', 'Status']}>
      {exams.filter((row) => row.semester === semester).map((row) => <TableRow key={`${row.name}-${row.subject}-${row.section}`}><TableCell className="font-medium">{row.name}</TableCell><TableCell>{row.subject}</TableCell><TableCell>{row.section}</TableCell><TableCell>{row.date}</TableCell><TableCell>{pct(row.passRate)}</TableCell><TableCell>{row.backlogs}</TableCell><TableCell><StatusBadge>{row.status}</StatusBadge></TableCell></TableRow>)}
    </DataTable><p className="mt-3 text-xs text-muted-foreground">Official examination records and result changes are not connected to this demonstration.</p></Panel>
  </>;

  if (active === 'leaves') {
    const visibleLeaves = leaves.filter((row) => leaveFilter === 'All requests' || row.status === leaveFilter);
    return <><PageHeading eyebrow="Department approvals" title="Leave approvals" detail="Review demonstration requests. Rejections require a recorded reason." action={<Select value={leaveFilter} onValueChange={setLeaveFilter}><SelectTrigger className="w-44"><SelectValue /></SelectTrigger><SelectContent>{['All requests', 'Pending', 'Approved', 'Rejected'].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>} />
      <div className="mb-5 grid gap-4 sm:grid-cols-3">{[{ label: 'Pending requests', value: pendingLeaves }, { label: 'Approved', value: leaves.filter((row) => row.status === 'Approved').length }, { label: 'Rejected', value: leaves.filter((row) => row.status === 'Rejected').length }].map((item) => <Card key={item.label} className="rounded-md shadow-none"><CardContent className="p-4"><p className="text-sm text-muted-foreground">{item.label}</p><p className="mt-1 text-2xl font-bold">{item.value}</p></CardContent></Card>)}</div>
      <Panel title="Request history"><DataTable headers={['Request', 'Applicant', 'Type', 'Dates', 'Days', 'Reason', 'Status', 'Decision']}>
        {visibleLeaves.length ? visibleLeaves.map((row) => <TableRow key={row.id}><TableCell className="font-mono text-xs">{row.id}</TableCell><TableCell className="min-w-32">{row.applicant}<p className="text-xs text-muted-foreground">{row.role}</p></TableCell><TableCell>{row.leaveType}</TableCell><TableCell className="whitespace-nowrap">{row.from} – {row.to}</TableCell><TableCell>{row.days}</TableCell><TableCell className="min-w-36">{row.reason}{row.decisionReason && <p className="mt-1 text-xs text-destructive">Decision: {row.decisionReason}</p>}</TableCell><TableCell><StatusBadge>{row.status}</StatusBadge></TableCell><TableCell><div className="flex gap-1">{row.status === 'Pending' ? <><Button size="sm" variant="outline" aria-label={`Approve ${row.id}`} onClick={() => setDecision({ item: row, status: 'Approved' })}><Check className="h-4 w-4" /></Button><Button size="sm" variant="outline" aria-label={`Reject ${row.id}`} onClick={() => setDecision({ item: row, status: 'Rejected' })}><X className="h-4 w-4" /></Button></> : <span className="text-xs text-muted-foreground">Processed</span>}</div></TableCell></TableRow>) : <EmptyRow count={8} />}
      </DataTable></Panel>
      <Dialog open={Boolean(decision)} onOpenChange={(open) => { if (!open) { setDecision(null); setDecisionReason(''); } }}><DialogContent><DialogHeader><DialogTitle>{decision?.status} request?</DialogTitle><DialogDescription>{decision?.item.applicant} · {decision?.item.id}. This changes local demonstration state only.</DialogDescription></DialogHeader>{decision?.status === 'Rejected' && <div className="space-y-2"><Label htmlFor="reject-reason">Reason for rejection</Label><Textarea id="reject-reason" value={decisionReason} onChange={(event) => setDecisionReason(event.target.value)} placeholder="Enter a reason" /></div>}<DialogFooter><Button variant="outline" onClick={() => setDecision(null)}>Cancel</Button><Button variant={decision?.status === 'Rejected' ? 'destructive' : 'default'} disabled={decision?.status === 'Rejected' && !decisionReason.trim()} onClick={saveLeaveDecision}>Confirm {decision?.status?.toLowerCase()}</Button></DialogFooter></DialogContent></Dialog>
    </>;
  }

  if (active === 'announcements') return <><PageHeading eyebrow="Department communication" title="Announcements" detail="Create and edit sample department announcements for selected audiences." action={<Button onClick={() => openAnnouncementForm()}><Plus className="h-4 w-4" />New announcement</Button>} />
    <div className="mb-5 grid gap-3 sm:grid-cols-3">{['All Department Students', 'All Department Faculty', `Semester ${semesterName(semester)}`].map((audience) => <Card key={audience} className="rounded-md shadow-none"><CardContent className="flex items-center gap-3 p-4"><Send className="h-4 w-4 text-primary" /><span className="text-sm">{audience}</span></CardContent></Card>)}</div>
    <div className="space-y-3">{announcements.map((row) => <Card key={row.id} className="rounded-md shadow-none"><CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><div className="mb-2 flex flex-wrap items-center gap-2"><h2 className="font-semibold">{row.title}</h2><StatusBadge>{row.priority}</StatusBadge><StatusBadge>{row.status}</StatusBadge></div><p className="text-sm text-muted-foreground">{row.description}</p><p className="mt-2 text-xs text-muted-foreground">{row.audience} · {row.publishedAt}</p></div><Button variant="outline" size="sm" onClick={() => openAnnouncementForm(row)}>Edit</Button></CardContent></Card>)}</div>
    <Dialog open={announcementFormOpen} onOpenChange={setAnnouncementFormOpen}><DialogContent className="max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{editingAnnouncement ? 'Edit announcement' : 'New announcement'}</DialogTitle><DialogDescription>Published content stays in local demonstration state.</DialogDescription></DialogHeader><form id="announcement-form" onSubmit={saveAnnouncement} className="space-y-4"><div className="space-y-2"><Label htmlFor="announcement-title">Title</Label><Input id="announcement-title" value={announcementTitle} onChange={(event) => setAnnouncementTitle(event.target.value)} required maxLength={120} /></div><div className="space-y-2"><Label htmlFor="announcement-description">Description</Label><Textarea id="announcement-description" value={announcementDescription} onChange={(event) => setAnnouncementDescription(event.target.value)} required maxLength={1000} /></div><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label>Audience</Label><Select value={announcementAudience} onValueChange={setAnnouncementAudience}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['All Department Students', 'All Department Faculty', 'Selected Semester', 'Selected Section', 'Selected Faculty Groups'].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label>Priority</Label><Select value={announcementPriority} onValueChange={(value) => setAnnouncementPriority(value as 'Normal' | 'Important')}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Normal">Normal</SelectItem><SelectItem value="Important">Important</SelectItem></SelectContent></Select></div></div><DialogFooter><Button type="button" variant="outline" onClick={() => setAnnouncementFormOpen(false)}>Cancel</Button><Button type="submit">Publish announcement</Button></DialogFooter></form></DialogContent></Dialog>
  </>;

  if (active === 'reports') return <><PageHeading eyebrow="Department insights" title="Reports & analytics" detail="Preview a report, then export its demonstration rows as CSV." />
    <Panel title="Report builder"><div className="grid gap-4 md:grid-cols-3"><div className="space-y-2"><Label>Report category</Label><Select value={reportType} onValueChange={(value) => { setReportType(value); setReportPreview(false); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['Student Information Report', 'Faculty Information Report', 'Attendance Report', 'Academic Performance Report', 'Subject-wise Result Report', 'Section-wise Performance Report', 'Faculty Workload Report', 'Assignment Submission Report', 'Examination Report', 'Leave Summary Report'].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label>Academic year</Label><Select defaultValue="2026–27"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="2026–27">2026–27</SelectItem><SelectItem value="2025–26">2025–26</SelectItem></SelectContent></Select></div><div className="space-y-2"><Label>Semester</Label><Select value={reportSemester} onValueChange={(value) => { setReportSemester(value); setReportPreview(false); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{semesters.map((value) => <SelectItem key={value} value={String(value)}>{semesterName(value)}</SelectItem>)}</SelectContent></Select></div></div><div className="mt-5 flex flex-wrap gap-2"><Button onClick={() => setReportPreview(true)}><FileBarChart className="h-4 w-4" />Preview report</Button><Button variant="outline" onClick={exportCsv}><Download className="h-4 w-4" />Export CSV</Button><Button variant="outline" onClick={() => window.print()}>Print</Button></div>
    {reportPreview && <div className="mt-6 border-t pt-5"><div className="mb-3 flex items-center justify-between"><div><h2 className="font-semibold">{reportType}</h2><p className="text-sm text-muted-foreground">{semesterName(Number(reportSemester))} · Academic year 2026–27 · Demonstration records</p></div><Badge variant="outline">Preview</Badge></div><DataTable headers={['Preview field', 'Value']}>{[['Department', 'CSE (AI&ML)'], ['Semester', semesterName(Number(reportSemester))], ['Sample student profiles', students.filter((row) => row.semester === Number(reportSemester)).length], ['Sample faculty profiles', faculty.length], ['Attendance records', attendance.filter((row) => row.semester === Number(reportSemester)).length]].map(([label, value]) => <TableRow key={String(label)}><TableCell>{label}</TableCell><TableCell className="font-medium">{value}</TableCell></TableRow>)}</DataTable></div>}
    <p className="mt-4 text-xs text-muted-foreground">Exports contain only seeded demonstration data. No official academic records are included.</p></Panel>
  </>;

  if (active === 'notifications') {
    const visibleNotifications = notifications.filter((row) => notificationFilter === 'All notifications' || (notificationFilter === 'Unread' ? !row.read : row.category === notificationFilter));
    const markAllRead = () => setNotifications((current) => current.map((row) => ({ ...row, read: true })));
    return <><PageHeading eyebrow="Updates" title="Notifications" detail="Department reminders and sample system updates." action={<Button variant="outline" onClick={markAllRead}>Mark all read</Button>} />
      <div className="mb-4 flex flex-wrap gap-2">{['All notifications', 'Unread', 'Attendance', 'Faculty', 'Assessment', 'Announcement', 'System'].map((value) => <Button key={value} size="sm" variant={notificationFilter === value ? 'default' : 'outline'} onClick={() => setNotificationFilter(value)}>{value}</Button>)}</div>
      <div className="space-y-2">{visibleNotifications.map((row) => <Card key={row.id} className={`rounded-md shadow-none ${row.read ? '' : 'border-primary/30'}`}><CardContent className="flex items-start gap-3 p-4"><span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${row.read ? 'bg-muted' : 'bg-primary'}`} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-semibold">{row.title}</h2><StatusBadge>{row.category}</StatusBadge></div><p className="mt-1 text-sm text-muted-foreground">{row.detail}</p><p className="mt-1 text-xs text-muted-foreground">{row.time}</p></div><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => { setNotifications((current) => current.map((item) => item.id === row.id ? { ...item, read: true } : item)); onNavigate(row.destination); }}>Open</Button>{!row.read && <Button size="sm" variant="ghost" onClick={() => setNotifications((current) => current.map((item) => item.id === row.id ? { ...item, read: true } : item))}>Mark read</Button>}</div></CardContent></Card>)}{visibleNotifications.length === 0 && <div className="rounded-md border bg-card p-10 text-center text-sm text-muted-foreground">No notifications in this view.</div>}</div>
    </>;
  }

  if (active === 'settings') return <><PageHeading eyebrow="Account" title="HOD profile & settings" detail="Profile preferences for this browser-only portal demonstration." />
    <div className="grid gap-5 xl:grid-cols-[1fr_1.1fr]"><Panel title="Profile information"><form className="space-y-4" onSubmit={(event) => { event.preventDefault(); setSavedProfile(true); }}><div className="flex items-center gap-3"><Avatar className="h-14 w-14"><AvatarFallback className="bg-secondary text-primary">{initials(hodName)}</AvatarFallback></Avatar><div><p className="font-semibold">{hodName}</p><p className="text-xs text-muted-foreground">HOD · CSE (AI&ML)</p></div></div><div className="space-y-2"><Label htmlFor="hod-name">Full name</Label><Input id="hod-name" value={hodName} onChange={(event) => { setHodName(event.target.value); setSavedProfile(false); }} required /></div><div className="space-y-2"><Label htmlFor="hod-faculty-id">Faculty ID</Label><Input id="hod-faculty-id" value="FAC-DEMO-01" disabled /></div><div className="space-y-2"><Label htmlFor="hod-email">Official email</Label><Input id="hod-email" type="email" value={hodEmail} onChange={(event) => { setHodEmail(event.target.value); setSavedProfile(false); }} required /></div><div className="space-y-2"><Label htmlFor="hod-phone">Contact number</Label><Input id="hod-phone" value={hodPhone} onChange={(event) => { setHodPhone(event.target.value); setSavedProfile(false); }} /></div><Button type="submit">Save profile</Button>{savedProfile && <p role="status" className="text-sm text-primary">Profile saved for this session.</p>}</form></Panel>
      <div className="space-y-5"><Panel title="Notification preferences"><div className="space-y-4">{[{ label: 'Department announcements', checked: settingsNotice, change: setSettingsNotice }, { label: 'Attendance shortage alerts', checked: settingsAttendance, change: setSettingsAttendance }, { label: 'Evaluation reminders', checked: settingsEvaluation, change: setSettingsEvaluation }].map((item) => <label key={item.label} className="flex cursor-pointer items-center justify-between gap-3 border-b pb-3 last:border-0 last:pb-0"><span className="text-sm font-medium">{item.label}</span><input aria-label={item.label} type="checkbox" className="h-4 w-4 accent-primary" checked={item.checked} onChange={(event) => item.change(event.target.checked)} /></label>)}</div></Panel><Panel title="Academic information"><dl className="grid grid-cols-2 gap-4 text-sm"><div><dt className="text-muted-foreground">Department</dt><dd className="mt-1 font-semibold">CSE (AI&ML)</dd></div><div><dt className="text-muted-foreground">Academic year</dt><dd className="mt-1 font-semibold">2026–27</dd></div><div><dt className="text-muted-foreground">Current semester</dt><dd className="mt-1 font-semibold">{semesterName(semester)}</dd></div><div><dt className="text-muted-foreground">Security settings</dt><dd className="mt-1 font-semibold">Available with future sign-in</dd></div></dl></Panel></div></div>
  </>;

  return <div className="rounded-md border bg-card p-10 text-center"><p className="font-semibold">This section is unavailable.</p><Button className="mt-4" onClick={() => onNavigate('dashboard')}>Back to dashboard</Button></div>;
};

export default HODViews;