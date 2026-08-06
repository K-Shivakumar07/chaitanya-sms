import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ClipboardList, CalendarDays } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import SemesterGuard from '@/components/SemesterGuard';
import { useAssignments } from '@/hooks/useSemesterData';

const FILTERS = ['all', 'pending', 'in-progress', 'submitted'] as const;

const statusColor = (status: string) => {
  if (status === 'submitted') return 'bg-green-100 text-green-800';
  if (status === 'in-progress') return 'bg-yellow-100 text-yellow-800';
  return 'bg-orange-100 text-orange-800';
};

const priorityColor = (priority: string) => {
  if (priority === 'high') return 'bg-red-100 text-red-800';
  if (priority === 'medium') return 'bg-blue-100 text-blue-800';
  return 'bg-gray-100 text-gray-800';
};

const Assignments = () => {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all');
  const { data, isLoading } = useAssignments();

  const assignments = (data ?? []).filter((a) => filter === 'all' || a.status === filter);

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
              <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
              <p className="text-gray-600">Track pending and completed assignments</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {FILTERS.map((f) => (
              <Button
                key={f}
                size="sm"
                variant={filter === f ? 'default' : 'outline'}
                onClick={() => setFilter(f)}
                className="capitalize"
              >
                {f.replace('-', ' ')}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <p className="text-gray-500">Loading assignments…</p>
          ) : assignments.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="w-14 h-14 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No assignments in this view.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.map((a) => (
                <Card key={a.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">{a.title}</p>
                        <p className="text-sm text-gray-600">{a.subject_name} • {a.faculty}</p>
                        <p className="text-sm text-gray-600 mt-2">{a.description}</p>
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" /> Assigned {a.assigned_date} • Due {a.due_date}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Badge className={statusColor(a.status)}>{a.status}</Badge>
                        <Badge className={priorityColor(a.priority)}>{a.priority}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </SemesterGuard>
  );
};

export default Assignments;
