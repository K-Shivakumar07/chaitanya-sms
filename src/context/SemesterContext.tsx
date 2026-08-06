import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'selectedSemester';

const readStored = (): number | null => {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const n = raw ? parseInt(raw, 10) : NaN;
  return Number.isInteger(n) && n >= 1 && n <= 8 ? n : null;
};

interface SemesterContextValue {
  semester: number | null;
  setSemester: (n: number) => void;
  clearSemester: () => void;
}

const SemesterContext = createContext<SemesterContextValue>({
  semester: null,
  setSemester: () => {},
  clearSemester: () => {},
});

export const SemesterProvider = ({ children }: { children: React.ReactNode }) => {
  const [semester, setSemesterState] = useState<number | null>(readStored);

  const setSemester = useCallback((n: number) => {
    window.localStorage.setItem(STORAGE_KEY, String(n));
    setSemesterState(n);
  }, []);

  const clearSemester = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setSemesterState(null);
  }, []);

  const value = useMemo(
    () => ({ semester, setSemester, clearSemester }),
    [semester, setSemester, clearSemester],
  );

  return <SemesterContext.Provider value={value}>{children}</SemesterContext.Provider>;
};

export const useSemester = () => useContext(SemesterContext);

export const romanSemester = (n: number) =>
  ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][n - 1] ?? String(n);
