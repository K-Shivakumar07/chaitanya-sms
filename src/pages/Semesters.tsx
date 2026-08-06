import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSession } from '@/context/SessionContext';

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

const Semesters = () => {
  const navigate = useNavigate();
  const { student, selectSemester, signOut } = useSession();

  const choose = (n: number) => {
    selectSemester(n);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display font-semibold">StudyHub</p>
              <p className="text-xs text-muted-foreground">{student?.name} • {student?.rollNo}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate('/login'); }}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <h1 className="font-display text-3xl font-bold">Choose your semester</h1>
        <p className="mb-8 text-muted-foreground">Each semester has its own syllabus, timetable, materials and assistant context.</p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {SEMESTERS.map((n) => (
            <Card
              key={n}
              onClick={() => choose(n)}
              className="cursor-pointer transition-all hover:-translate-y-1 hover:shadow-card"
            >
              <CardContent className="flex flex-col items-center gap-2 p-8">
                <span className="font-display text-3xl font-bold text-primary">{ROMAN[n - 1]}</span>
                <span className="text-sm text-muted-foreground">Semester {n}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Semesters;
