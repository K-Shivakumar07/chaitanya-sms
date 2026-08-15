import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type AppRole = 'student' | 'faculty' | 'admin';

const STORAGE_KEY = 'selectedRole';

const readStored = (): AppRole | null => {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw === 'student' || raw === 'faculty' || raw === 'admin' ? raw : null;
};

interface RoleContextValue {
  role: AppRole | null;
  setRole: (r: AppRole) => void;
  clearRole: () => void;
}

const RoleContext = createContext<RoleContextValue>({
  role: null,
  setRole: () => {},
  clearRole: () => {},
});

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRoleState] = useState<AppRole | null>(readStored);

  const setRole = useCallback((r: AppRole) => {
    window.localStorage.setItem(STORAGE_KEY, r);
    setRoleState(r);
  }, []);

  const clearRole = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setRoleState(null);
  }, []);

  const value = useMemo(() => ({ role, setRole, clearRole }), [role, setRole, clearRole]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export const useRole = () => useContext(RoleContext);
