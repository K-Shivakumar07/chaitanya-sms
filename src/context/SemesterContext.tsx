import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'selectedSemester';
const BRANCH_KEY = 'selectedBranch';

const readStored = (): number | null => {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const n = raw ? parseInt(raw, 10) : NaN;
  return Number.isInteger(n) && n >= 1 && n <= 8 ? n : null;
};

const readStoredBranch = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(BRANCH_KEY);
};

interface SemesterContextValue {
  semester: number | null;
  setSemester: (n: number) => void;
  clearSemester: () => void;
  branch: string | null;
  setBranch: (b: string) => void;
  clearBranch: () => void;
}

const SemesterContext = createContext<SemesterContextValue>({
  semester: null,
  setSemester: () => {},
  clearSemester: () => {},
  branch: null,
  setBranch: () => {},
  clearBranch: () => {},
});

export const SemesterProvider = ({ children }: { children: React.ReactNode }) => {
  const [semester, setSemesterState] = useState<number | null>(readStored);
  const [branch, setBranchState] = useState<string | null>(readStoredBranch);

  const setSemester = useCallback((n: number) => {
    window.localStorage.setItem(STORAGE_KEY, String(n));
    setSemesterState(n);
  }, []);

  const clearSemester = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setSemesterState(null);
  }, []);

  const setBranch = useCallback((b: string) => {
    window.localStorage.setItem(BRANCH_KEY, b);
    setBranchState(b);
  }, []);

  const clearBranch = useCallback(() => {
    window.localStorage.removeItem(BRANCH_KEY);
    setBranchState(null);
  }, []);

  const value = useMemo(
    () => ({ semester, setSemester, clearSemester, branch, setBranch, clearBranch }),
    [semester, setSemester, clearSemester, branch, setBranch, clearBranch],
  );

  return <SemesterContext.Provider value={value}>{children}</SemesterContext.Provider>;
};

export const useSemester = () => useContext(SemesterContext);

export const romanSemester = (n: number) =>
  ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][n - 1] ?? String(n);
