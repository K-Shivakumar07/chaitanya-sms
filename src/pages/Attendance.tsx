import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, UserCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import SemesterGuard from '@/components/SemesterGuard';
import { useAttendance } from '@/hooks/useSemesterData';

const percent = (a: number, h: number) => (h ? Math.round((a / h) * 100) : 0);

const Attendance = () => {
  const { data, isLoading } = useAttendance();
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
              <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
              <p className="text-gray-600">Attendance marks entered by your faculty</p>
            </div>
          </div>

          {isLoading ? (
            <p className="text-gray-500">Loading attendance…</p>
          ) : rows.length === 0 ? (
            <div className="text-center py-12">
              <UserCheck className="w-14 h-14 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No attendance has been uploaded yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rows.map((r) => {
                const p = percent(r.classes_attended, r.classes_held);
                return (
                  <Card key={r.id}>
                    <CardContent className="p-5 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {r.roll_no} • {r.student_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {r.subject_name} • {r.period}
                        </p>
                        {r.remarks && <p className="text-xs text-gray-500 mt-1">{r.remarks}</p>}
                      </div>
                      <div className="text-right">
                        <Badge variant={p >= 75 ? 'default' : 'destructive'}>{p}%</Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {r.classes_attended} / {r.classes_held} classes
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </SemesterGuard>
  );
};

export default Attendance;
