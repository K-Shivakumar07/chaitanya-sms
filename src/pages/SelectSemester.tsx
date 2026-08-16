import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSemester, romanSemester } from '@/context/SemesterContext';
import { useSemesters } from '@/hooks/useSemesterData';

const YEAR_LABEL = ['First Year', 'First Year', 'Second Year', 'Second Year', 'Third Year', 'Third Year', 'Fourth Year', 'Fourth Year'];

const SelectSemester = () => {
  const navigate = useNavigate();
  const { setSemester, semester } = useSemester();
  const { data: semesters, isLoading } = useSemesters();

  const choose = (n: number) => {
    setSemester(n);
    navigate('/dashboard');
  };

  const list = semesters ?? Array.from({ length: 8 }, (_, i) => ({
    id: String(i + 1),
    number: i + 1,
    title: `Semester ${romanSemester(i + 1)}`,
    description: null as string | null,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-600 text-white mb-4">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">B.Tech Student Management</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Select your semester to open your personalised dashboard with syllabus, timetable, materials,
            notes, assignments, announcements and deadlines.
          </p>
          <Button variant="ghost" className="mt-4" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-1" /> Switch module
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {isLoading && !semesters
            ? null
            : list.map((s) => (
                <Card
                  key={s.number}
                  onClick={() => choose(s.number)}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                    semester === s.number ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <p className="text-xs font-medium uppercase tracking-wide text-blue-600 mb-1">
                      {YEAR_LABEL[s.number - 1]}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">Sem {romanSemester(s.number)}</p>
                    <p className="text-sm text-gray-500 mb-4 min-h-[40px]">{s.description ?? s.title}</p>
                    <span className="inline-flex items-center text-sm font-medium text-blue-600">
                      Open dashboard <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </CardContent>
                </Card>
              ))}
        </div>
      </main>
    </div>
  );
};

export default SelectSemester;
