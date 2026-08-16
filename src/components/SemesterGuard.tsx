import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSemester } from '@/context/SemesterContext';

const SemesterGuard = ({ children }: { children: React.ReactNode }) => {
  const { semester } = useSemester();
  if (!semester) return <Navigate to="/student" replace />;
  return <>{children}</>;
};

export default SemesterGuard;
