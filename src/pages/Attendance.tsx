import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, UserCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import SemesterGuard from '@/components/SemesterGuard';
import { useAttendance } from '@/hooks/useSemesterData';
import { useStudentProfile } from '@/hooks/useStudentProfile';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const percent = (a: number, h: number) => (h ? Math.round((a / h) * 100) : 0);

const Attendance = () => {
  const { profile } = useStudentProfile();
  const { data, isLoading, isError } = useAttendance(profile.studentId);
  const rows = data ?? [];

  return (
    <SemesterGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">View Attendance</h1>
              <p className="text-gray-600">Attendance records for {profile.studentId}</p>
            </div>
            <a
              href="http://www.chaitanya.net.in/cgcstudent/hyd/index.php"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto"
            >
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                External Link
              </Button>
            </a>
          </div>

          {isLoading ? (
            <p className="text-gray-500">Loading attendance…</p>
          ) : isError ? (
            <div className="py-12 text-center">
              <p className="text-destructive">Attendance records could not be loaded. Please try again.</p>
            </div>
          ) : rows.length === 0 ? (
            <div className="text-center py-12">
              <UserCheck className="w-14 h-14 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No attendance has been uploaded yet.</p>
            </div>
          ) : (
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead className="text-center">Held</TableHead>
                      <TableHead className="text-center">Attended</TableHead>
                      <TableHead className="text-right">Attendance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((record) => {
                      const attendancePercent = percent(record.classes_attended, record.classes_held);
                      return (
                        <TableRow key={record.id}>
                          <TableCell>
                            <p className="font-semibold text-foreground">{record.subject_name}</p>
                            {record.remarks && <p className="mt-1 text-xs text-muted-foreground">{record.remarks}</p>}
                          </TableCell>
                          <TableCell>{record.period}</TableCell>
                          <TableCell className="text-center">{record.classes_held}</TableCell>
                          <TableCell className="text-center">{record.classes_attended}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant={attendancePercent >= 75 ? 'default' : 'destructive'}>
                              {attendancePercent}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </SemesterGuard>
  );
};

export default Attendance;
