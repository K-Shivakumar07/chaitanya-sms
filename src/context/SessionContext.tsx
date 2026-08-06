import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export interface Student {
  name: string;
  rollNo: string;
  branch: string;
  section: string;
  email: string;
}

interface SessionValue {
  student: Student | null;
  semester: number | null;
  theme: 'light' | 'dark';
  signIn: (student: Student) => void;
  signOut: () => void;
  selectSemester: (semester: number) => void;
  clearSemester: () => void;
  toggleTheme: () => void;
}

const STUDENT_KEY = 'sms.student';
const SEMESTER_KEY = 'sms.semester';
const THEME_KEY = 'sms.theme';

const readStudent = (): Student | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STUDENT_KEY);
    return raw ? (JSON.parse(raw) as Student) : null;
  } catch {
    return null;
  }
};

const readSemester = (): number | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(SEMESTER_KEY);
  const n = raw ? Number(raw) : NaN;
  return Number.isInteger(n) && n >= 1 && n <= 8 ? n : null;
};

const readTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const SessionContext = createContext<SessionValue | undefined>(undefined);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [student, setStudent] = useState<Student | null>(readStudent);
  const [semester, setSemester] = useState<number | null>(readSemester);
  const [theme, setTheme] = useState<'light' | 'dark'>(readTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const signIn = useCallback((next: Student) => {
    localStorage.setItem(STUDENT_KEY, JSON.stringify(next));
    setStudent(next);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(STUDENT_KEY);
    localStorage.removeItem(SEMESTER_KEY);
    setStudent(null);
    setSemester(null);
  }, []);

  const selectSemester = useCallback((next: number) => {
    localStorage.setItem(SEMESTER_KEY, String(next));
    setSemester(next);
  }, []);

  const clearSemester = useCallback(() => {
    localStorage.removeItem(SEMESTER_KEY);
    setSemester(null);
  }, []);

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);

  const value = useMemo(
    () => ({ student, semester, theme, signIn, signOut, selectSemester, clearSemester, toggleTheme }),
    [student, semester, theme, signIn, signOut, selectSemester, clearSemester, toggleTheme],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside SessionProvider');
  return ctx;
};
