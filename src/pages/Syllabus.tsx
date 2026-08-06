import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import SemesterGuard from '@/components/SemesterGuard';
import { useSubjects, useSyllabusUnits } from '@/hooks/useSemesterData';

const Syllabus = () => {
  const { data: subjects } = useSubjects();
  const { data: units, isLoading } = useSyllabusUnits();
  const [openSubject, setOpenSubject] = useState<string | null>(null);

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
              <h1 className="text-3xl font-bold text-gray-900">Syllabus</h1>
              <p className="text-gray-600">Unit-wise curriculum for every subject</p>
            </div>
          </div>

          {isLoading ? (
            <p className="text-gray-500">Loading syllabus…</p>
          ) : (
            <div className="space-y-4">
              {(subjects ?? []).map((s) => {
                const subjectUnits = (units ?? []).filter((u) => u.subject_id === s.id);
                const open = openSubject === s.id;
                return (
                  <Card key={s.id}>
                    <CardHeader className="cursor-pointer" onClick={() => setOpenSubject(open ? null : s.id)}>
                      <CardTitle className="flex items-center justify-between gap-3 text-lg">
                        <span className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                          {s.name}
                        </span>
                        <span className="flex items-center gap-2">
                          <Badge variant="outline">{s.code}</Badge>
                          <Badge variant="outline">{s.credits} credits</Badge>
                          <span className="text-sm text-blue-600">{open ? 'Hide' : 'View'}</span>
                        </span>
                      </CardTitle>
                      <p className="text-sm text-gray-600">{s.faculty} • {s.kind}</p>
                    </CardHeader>
                    {open && (
                      <CardContent className="space-y-3">
                        {subjectUnits.length === 0 && (
                          <p className="text-sm text-gray-500">No syllabus units available.</p>
                        )}
                        {subjectUnits.map((u) => (
                          <div key={u.id} className="border rounded-lg p-4">
                            <p className="font-medium text-gray-900">Unit {u.unit_no}: {u.title}</p>
                            <p className="text-xs text-gray-500 mb-2">{u.hours} hours</p>
                            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                              {(u.topics ?? []).map((t, i) => (
                                <li key={i}>{t}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </CardContent>
                    )}
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

export default Syllabus;
