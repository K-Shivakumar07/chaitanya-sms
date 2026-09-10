import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  BarChart3,
  Laptop,
  Bot,
  Zap,
  Plug,
  Cog,
  Building2,
  Check,
  Orbit,
  CalendarDays,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <div className="relative min-h-screen overflow-hidden bg-portal-canvas font-portal text-portal-ink">
      <div className="portal-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute left-[4%] top-28 hidden h-28 w-28 animate-portal-drift rounded-[1.75rem] border border-portal-glass/70 bg-portal-soft-cyan/70 shadow-portal-card backdrop-blur-xl motion-reduce:animate-none lg:block" aria-hidden="true">
        <Orbit className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-portal-cyan" />
      </div>
      <div className="pointer-events-none absolute right-[3%] top-48 hidden h-32 w-32 animate-portal-float rounded-[1.75rem] border border-portal-glass/80 bg-portal-soft-blue/75 shadow-portal-card backdrop-blur-xl motion-reduce:animate-none xl:flex xl:items-center xl:justify-center" aria-hidden="true">
        <GraduationCap className="h-14 w-14 text-portal-blue" />
      </div>

      <main className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-10">
        <div className="portal-glass-highlight overflow-hidden rounded-[2rem] border border-portal-glass/80 p-5 shadow-portal-shell backdrop-blur-2xl sm:p-8 lg:p-10">
          <header className="relative mb-9 border-b border-portal-line pb-8 text-center">
            <Button variant="ghost" size="sm" className="mb-6 text-portal-ink/70 hover:bg-portal-soft-blue hover:text-portal-blue sm:absolute sm:left-0 sm:top-0 sm:mb-0" asChild>
              <Link to="/">
                <ArrowLeft /> Switch module
              </Link>
            </Button>
            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-portal-blue/15 bg-portal-soft-blue px-4 py-2 text-xs font-bold text-portal-blue">
              <GraduationCap className="h-4 w-4" /> B.Tech Student Academic Portal
            </div>
            <h1 className="mx-auto max-w-3xl font-display text-3xl font-extrabold text-portal-ink sm:text-4xl lg:text-5xl">
              Select Your B.Tech <span className="text-portal-blue">Branch &amp; Semester</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-portal-ink/60 sm:text-base">
              Build your academic pathway, then enter a dashboard tailored to your current semester.
            </p>
          </header>

          <section aria-labelledby="branch-title">
            <div className="mb-5 flex items-center gap-3">
              <span className="portal-active-surface flex h-9 w-9 items-center justify-center rounded-lg font-display text-sm font-bold text-primary-foreground shadow-portal-active">01</span>
              <div>
                <h2 id="branch-title" className="font-display text-lg font-bold sm:text-xl">Engineering branch</h2>
                <p className="text-xs text-portal-ink/55 sm:text-sm">Choose your specialization</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {BRANCHES.map((b) => {
                const Icon = b.icon;
                const active = branch === b.code;
                return (
                  <Button
                    key={b.code}
                    type="button"
                    variant="ghost"
                    aria-pressed={active}
                    onClick={() => setBranch(b.code)}
                    className={`group relative h-36 justify-start overflow-hidden whitespace-normal rounded-2xl border p-5 text-left transition-all duration-300 motion-safe:hover:-translate-y-2 focus-visible:ring-portal-cyan ${
                      active
                        ? 'portal-active-surface border-portal-blue text-primary-foreground shadow-portal-active'
                        : 'border-portal-line/80 bg-portal-glass/90 text-portal-ink shadow-portal-card hover:border-portal-blue/35 hover:bg-portal-glass hover:shadow-portal-card-hover'
                    }`}
                  >
                    <span className="flex h-full w-full flex-col items-start justify-between">
                      <span className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 motion-safe:group-hover:scale-110 ${active ? 'bg-portal-glass/20' : 'bg-portal-soft-blue text-portal-blue'}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <strong className="block font-display text-base font-bold">{b.code}</strong>
                        <span className={`mt-1 block text-xs leading-4 ${active ? 'text-primary-foreground/75' : 'text-portal-ink/55'}`}>{b.name}</span>
                      </span>
                    </span>
                    {active && <Check className="absolute right-4 top-4 h-5 w-5" aria-hidden="true" />}
                  </Button>
                );
              })}
              <div className="hidden items-center justify-center rounded-2xl border border-dashed border-portal-line bg-portal-glass-muted/60 p-5 text-center lg:flex">
                <div>
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-portal-soft-cyan text-portal-cyan">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <p className="font-display text-sm font-bold">7 pathways</p>
                  <p className="mt-1 text-xs text-portal-ink/50">One focused workspace</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-9 border-t border-portal-line pt-8" aria-labelledby="semester-title">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg font-display text-sm font-bold shadow-portal-card ${branch ? 'portal-active-surface text-primary-foreground' : 'bg-portal-glass-muted text-portal-ink/35'}`}>02</span>
                <div>
                  <h2 id="semester-title" className="font-display text-lg font-bold sm:text-xl">Academic semester</h2>
                  <p className="text-xs text-portal-ink/55 sm:text-sm">Select a semester to enter your dashboard</p>
                </div>
              </div>
              {selectedBranch && (
                <div className="flex items-center gap-2 rounded-lg border border-portal-line bg-portal-glass/80 px-3 py-2 text-xs text-portal-ink/60">
                  <span className="h-2 w-2 rounded-full bg-portal-cyan" />
                  B.Tech <strong className="font-bold text-portal-ink">{selectedBranch.code}</strong> selected
                </div>
              )}
            </div>

            {!branch ? (
              <div className="flex min-h-28 items-center justify-center rounded-2xl border border-dashed border-portal-line bg-portal-glass-muted/65 px-5 text-center text-sm text-portal-ink/50">
                Select an engineering branch above to unlock all eight semesters.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
                {isLoading && !semesters
                  ? null
                  : list.map((s) => {
                      const active = semester === s.number;
                      return (
                        <Button
                          key={s.number}
                          type="button"
                          variant="ghost"
                          onClick={() => chooseSemester(s.number)}
                          className={`group h-28 flex-col gap-1 rounded-xl border transition-all duration-300 motion-safe:hover:-translate-y-1 focus-visible:ring-portal-cyan ${
                            active
                              ? 'portal-active-surface border-portal-blue text-primary-foreground shadow-portal-active'
                              : 'border-portal-line bg-portal-glass/90 text-portal-ink shadow-portal-card hover:border-portal-blue/35 hover:bg-portal-soft-blue hover:text-portal-blue hover:shadow-portal-card-hover'
                          }`}
                        >
                          <span className="font-display text-2xl font-extrabold">{String(s.number).padStart(2, '0')}</span>
                          <span className={`text-[11px] font-semibold ${active ? 'text-primary-foreground/75' : 'text-portal-ink/50'}`}>{YEAR_LABEL[s.number - 1]}</span>
                          <span className={`text-[10px] ${active ? 'text-primary-foreground/70' : 'text-portal-ink/45'}`}>Sem {romanSemester(s.number)}</span>
                        </Button>
                      );
                    })}
              </div>
            )}
          </section>

          <footer className="mt-8 flex flex-col gap-3 border-t border-portal-line pt-6 text-xs text-portal-ink/55 sm:flex-row sm:items-center sm:justify-between">
            <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-portal-cyan" /> Academic workspace ready</span>
            <span className="inline-flex items-center gap-2 font-semibold text-portal-blue">Choose a semester to continue <ArrowRight className="h-4 w-4" /></span>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default SelectSemester;
