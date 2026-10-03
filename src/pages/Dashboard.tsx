import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Calendar, FileText, Download, Bell, BookOpen, UserCheck, LayoutDashboard, User, GraduationCap, Hash, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import QuickStats from '@/components/QuickStats';
import RecentActivity from '@/components/RecentActivity';
import SemesterGuard from '@/components/SemesterGuard';
import { useSemester, romanSemester } from '@/context/SemesterContext';
import { useMaterials, useNotes, useAssignments, useSubjects } from '@/hooks/useSemesterData';
import { buildDocumentIndex, searchDocuments } from '@/data/documents';
import { useSearchParams } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import PortalSidebar, { type PortalNavItem } from '@/components/PortalSidebar';
import { useNavigate } from 'react-router-dom';
import { useStudentProfile } from '@/hooks/useStudentProfile';

const features = [
  { title: 'Syllabus', description: 'Unit-wise curriculum for every subject', icon: BookOpen, link: '/syllabus', color: 'bg-blue-500' },
  { title: 'Timetable', description: 'Day-wise class schedule', icon: Calendar, link: '/timetable', color: 'bg-green-500' },
  { title: 'Study Materials', description: 'Slides, references and resources', icon: Book, link: '/materials', color: 'bg-purple-500' },
  { title: 'Notes & PDFs', description: 'Download subject notes', icon: FileText, link: '/notes', color: 'bg-orange-500' },
  { title: 'Assignments', description: 'Pending and completed assignments', icon: Download, link: '/assignments', color: 'bg-red-500' },
  { title: 'Announcements', description: 'Notices from the department', icon: Bell, link: '/announcements', color: 'bg-yellow-500' },
  { title: 'Attendance', description: 'View your attendance record', icon: UserCheck, link: '/attendance', color: 'bg-teal-500' },
];

const studentNavigation: PortalNavItem[] = [
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

const Dashboard = () => {
  const { semester, branch } = useSemester();
  const { profile } = useStudentProfile();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const { data: subjectsData } = useSubjects();
  const subjects = subjectsData ?? [];

  const branchFullName =
    ({
      'CSE(DS)': 'Computer Science & Engineering (Data Science)',
      CSE: 'Computer Science & Engineering',
      'AI&ML': 'Computer Science & Engineering (AI&ML)',
      ECE: 'Electronics & Communication Engineering',
      EEE: 'Electrical & Electronics Engineering',
      MECH: 'Mechanical Engineering',
      CIVIL: 'Civil Engineering',
    } as Record<string, string>)[branch ?? ''] ?? branch ?? 'B.Tech Program';
  const yearLabel = ['1st', '2nd', '3rd', '4th'][Math.ceil((semester ?? 1) / 2) - 1] ?? '1st';

  const { data: materials } = useMaterials();
  const { data: notes } = useNotes();
  const { data: assignments } = useAssignments();

  const docs = buildDocumentIndex(materials, notes, assignments);
  const documentResults = searchQuery ? searchDocuments(docs, searchQuery) : [];
  const filteredFeatures = searchQuery
    ? features.filter(
        (f) =>
          f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : features;
  const totalResults = filteredFeatures.length + documentResults.length;

  return (
    <SemesterGuard>
      <SidebarProvider className="h-screen min-h-0 overflow-hidden">
        <div className="flex h-screen min-h-0 w-full flex-col overflow-hidden bg-gray-50">
          <div className="relative z-20 shrink-0">
            <Header />
          </div>
          <div className="flex min-h-0 w-full flex-1 overflow-hidden">
            <PortalSidebar
              label="Student workspace"
              items={studentNavigation}
              activeKey="/dashboard"
              onSelect={(key) => navigate(key)}
              studentStyle
            />

            <main className="min-w-0 flex-1 overflow-y-auto overscroll-contain px-4 py-8 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex items-start gap-3">
                  <SidebarTrigger className="mt-1 shrink-0" aria-label="Toggle student workspace" />
                  {searchQuery ? (
                    <div>
                      <h1 className="mb-2 text-3xl font-bold text-gray-900">
                        {`Search results for "${searchQuery}"`}
                      </h1>
                      <p className="text-gray-600">Found {totalResults} result(s) in this semester</p>
                    </div>
                  ) : (
                    <div className="min-w-0 flex-1 space-y-4">
                      <div className="portal-active-surface relative overflow-hidden rounded-2xl px-6 py-6 text-white shadow-lg">
                        <span className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
                        <span className="pointer-events-none absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-[hsl(var(--portal-cyan)/0.25)] blur-2xl" />
                        <div className="relative">
                          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider">
                            <GraduationCap className="h-3.5 w-3.5" />
                            B.Tech {branch ?? ''} · Semester {romanSemester(semester ?? 1)} Active
                          </span>
                          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
                            Welcome back, {profile.name} <span aria-hidden="true">👋</span>
                          </h1>
                          <p className="mt-1.5 text-sm text-white/85">
                            Roll No: {profile.studentId} · Chaitanya (Deemed to be University) · {subjects.length} Enrolled Courses
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <Card className="flex-row items-center gap-4 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--portal-soft-blue))] text-[hsl(var(--portal-blue-strong))]">
                            <Hash className="h-5 w-5" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Roll Number</p>
                            <p className="truncate text-sm font-semibold text-foreground">{profile.studentId}</p>
                          </div>
                        </Card>

                        <Card className="flex-row items-center gap-4 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--portal-soft-blue))] text-[hsl(var(--portal-blue-strong))]">
                            <Award className="h-5 w-5" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Program</p>
                            <p className="truncate text-sm font-semibold text-foreground">{branchFullName}</p>
                          </div>
                        </Card>

                        <Card className="flex-row items-center gap-4 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--portal-soft-blue))] text-[hsl(var(--portal-blue-strong))]">
                            <GraduationCap className="h-5 w-5" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Academic Year</p>
                            <p className="truncate text-sm font-semibold text-foreground">B.Tech {yearLabel} Year</p>
                          </div>
                        </Card>

                        <Card className="flex-row items-center gap-4 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--portal-soft-cyan))] text-[hsl(var(--portal-cyan))]">
                            <Calendar className="h-5 w-5" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Semester</p>
                            <p className="truncate text-sm font-semibold text-foreground">Semester {romanSemester(semester ?? 1)} · Active</p>
                          </div>
                        </Card>
                      </div>
                    </div>
                  )}
                </div>

          {searchQuery && documentResults.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Documents</h2>
              <div className="space-y-3">
                {documentResults.map((doc, index) => (
                  <Link key={index} to={doc.link}>
                    <Card className="hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4 flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-gray-900">{doc.title}</p>
                          <p className="text-sm text-gray-600">{doc.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{doc.subject} • {doc.meta}</p>
                        </div>
                        <Badge variant="outline">{doc.kindLabel}</Badge>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {searchQuery && totalResults === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-500">Try a subject name, unit number, or a section like notes or assignments.</p>
            </div>
          )}

          {!searchQuery && <QuickStats />}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredFeatures.map((feature, index) => {
              const card = (
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4 border-l-transparent hover:border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${feature.color} text-white`}>
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );

              return (
                <Link key={index} to={feature.link} className="group">
                  {card}
                </Link>
              );

            })}
          </div>

                {!searchQuery && <RecentActivity />}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </SemesterGuard>
  );
};

export default Dashboard;
