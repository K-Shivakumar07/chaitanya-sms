import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSemester } from '@/context/SemesterContext';

const SemesterGuard = ({ children }: { children: React.ReactNode }) => {
  const { semester, branch } = useSemester();
  if (!semester || !branch) return <Navigate to="/student" replace />;
  return <>{children}</>;
};

export default SemesterGuard;
