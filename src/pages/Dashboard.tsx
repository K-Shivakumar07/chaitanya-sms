import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Calendar, FileText, Download, Bell, BookOpen, UserCheck, LayoutDashboard, User, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import QuickStats from '@/components/QuickStats';
import RecentActivity from '@/components/RecentActivity';
import SemesterGuard from '@/components/SemesterGuard';
import { useSemester, romanSemester } from '@/context/SemesterContext';
import { useMaterials, useNotes, useAssignments } from '@/hooks/useSemesterData';
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
  { title: 'View Attendance', description: 'View your attendance record', icon: UserCheck, link: '/attendance', color: 'bg-teal-500' },
  { title: 'Online Fee Payment', description: 'Pay your college fees online', icon: CreditCard, link: 'http://cpg.chaitanya.edu.in/', color: 'bg-blue-500', external: true },
];

const studentNavigation: PortalNavItem[] = [
  { key: '/dashboard', title: 'Dashboard', icon: LayoutDashboard },
  { key: '/syllabus', title: 'Syllabus', icon: BookOpen },
  { key: '/timetable', title: 'Timetable', icon: Calendar },
  { key: '/materials', title: 'Study Materials', icon: Book },
  { key: '/notes', title: 'Notes & PDFs', icon: FileText },
  { key: '/assignments', title: 'Assignments', icon: Download },
  { key: '/announcements', title: 'Announcements', icon: Bell },
  { key: '/attendance', title: 'View Attendance', icon: UserCheck },
  { key: 'http://cpg.chaitanya.edu.in/', title: 'Online Fee Payment', icon: CreditCard },
  { key: '/profile', title: 'Profile', icon: User },
];

const Dashboard = () => {
  const { semester, branch } = useSemester();
  const { profile } = useStudentProfile();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
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
                  <SidebarTrigger className="mt-1 shrink-0 md:hidden" aria-label="Open student workspace" />
                  {searchQuery ? (
                    <div>
                      <h1 className="mb-2 text-3xl font-bold text-gray-900">
                        {`Search results for "${searchQuery}"`}
                      </h1>
                      <p className="text-gray-600">Found {totalResults} result(s) in this semester</p>
                    </div>
                  ) : (
                    <div className="min-w-0 flex-1">
                      <div className="portal-active-surface relative overflow-hidden rounded-2xl px-6 py-7 text-primary-foreground shadow-lg sm:px-8">
                        <div className="relative">
                          <p className="text-xs font-bold uppercase sm:text-sm">
                            B.Tech {yearLabel} Year <span aria-hidden="true">•</span> {semester ?? 1} Semester
                          </p>
                          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
                            Welcome back, {profile.name} <span aria-hidden="true">👋</span>
                          </h1>
                          <p className="mt-2 text-sm text-primary-foreground/85 sm:text-base">
                            Roll No: {profile.studentId} <span aria-hidden="true">•</span> {branchFullName}
                          </p>
                        </div>
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

              return feature.external ? (
                <a key={index} href={feature.link} target="_blank" rel="noopener noreferrer" className="group">
                  {card}
                </a>
              ) : (
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
