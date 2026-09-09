import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Award,
  BarChart3,
  Laptop,
  Bot,
  Zap,
  Plug,
  Cog,
  Building2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSemester, romanSemester } from '@/context/SemesterContext';
import { useSemesters, useSubjects } from '@/hooks/useSemesterData';

const BRANCHES: { code: string; name: string; icon: React.ElementType }[] = [
  { code: 'CSE(DS)', name: 'CSE (Data Science)', icon: BarChart3 },
  { code: 'CSE', name: 'Computer Science & Engineering', icon: Laptop },
  { code: 'AI&ML', name: 'AI & Machine Learning', icon: Bot },
  { code: 'ECE', name: 'Electronics & Communication', icon: Zap },
  { code: 'EEE', name: 'Electrical & Electronics', icon: Plug },
  { code: 'MECH', name: 'Mechanical Engineering', icon: Cog },
  { code: 'CIVIL', name: 'Civil Engineering', icon: Building2 },
];

const YEAR_LABEL = ['1st Year', '1st Year', '2nd Year', '2nd Year', '3rd Year', '3rd Year', '4th Year', '4th Year'];

const SelectSemester = () => {
  const navigate = useNavigate();
  const { semester, setSemester, branch, setBranch } = useSemester();
  const { data: semesters, isLoading } = useSemesters();
  const { data: subjects } = useSubjects();

  const chooseSemester = (n: number) => {
    setSemester(n);
    navigate('/dashboard');
  };

  const list = semesters ?? Array.from({ length: 8 }, (_, i) => ({
    id: String(i + 1),
    number: i + 1,
    title: `Semester ${romanSemester(i + 1)}`,
    description: null as string | null,
  }));

  const selectedBranch = BRANCHES.find((b) => b.code === branch);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100">
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
            <GraduationCap className="w-4 h-4 mr-1.5" /> B.Tech Student Academic Portal
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Select Your B.Tech Branch &amp; Semester
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose your active academic branch and select from Semester 1 through Semester 8 to
            customize your student management dashboard.
          </p>
          <Button variant="ghost" className="mt-4" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-1" /> Switch module
            </Link>
          </Button>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-sm">
                1
              </span>
              <h2 className="text-xl font-bold text-gray-900">Select B.Tech Specialization / Branch</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {BRANCHES.map((b) => {
                const Icon = b.icon;
                const active = branch === b.code;
                return (
                  <button
                    key={b.code}
                    type="button"
                    onClick={() => setBranch(b.code)}
                    className={`text-left rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                      active
                        ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-indigo-200'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${active ? 'text-indigo-600' : 'text-gray-500'}`} />
                    <p className={`font-semibold ${active ? 'text-indigo-700' : 'text-gray-900'}`}>{b.code}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{b.name}</p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm ${
                    branch ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  2
                </span>
                <h2 className="text-xl font-bold text-gray-900">Select Active Semester (Sem 1 to Sem 8)</h2>
              </div>
              {selectedBranch && (
                <p className="text-sm text-gray-500">
                  Showing 8 Semesters for <span className="font-semibold text-gray-800">B.Tech {selectedBranch.code}</span>
                </p>
              )}
            </div>

            {!branch ? (
              <p className="text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl p-6 text-center">
                Select your branch above to unlock semester selection.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {isLoading && !semesters
                  ? null
                  : list.map((s) => (
                      <button
                        key={s.number}
                        type="button"
                        onClick={() => chooseSemester(s.number)}
                        className={`text-left rounded-xl border-2 p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                          semester === s.number
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 bg-white hover:border-indigo-200'
                        }`}
                      >
                        <Badge variant="secondary" className="mb-3 text-xs">
                          {YEAR_LABEL[s.number - 1]} • Sem {romanSemester(s.number)}
                        </Badge>
                        <p className="text-2xl font-bold text-gray-900 mb-2">Semester {s.number}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span className="inline-flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" /> {s.number === semester && subjects ? subjects.length : '—'} Subjects
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" /> Credits
                          </span>
                        </div>
                        <span className="inline-flex items-center text-sm font-medium text-indigo-600">
                          Open dashboard <ArrowRight className="w-4 h-4 ml-1" />
                        </span>
                      </button>
                    ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SelectSemester;
