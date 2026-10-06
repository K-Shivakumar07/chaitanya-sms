import { useCallback, useEffect, useState } from 'react';

export interface StudentProfile {
  name: string;
  studentId: string;
  email: string;
  phone: string;
  address: string;
  enrollmentDate: string;
  program: string;
  major: string;
  year: string;
  gpa: string;
  avatar: string;
}

const STORAGE_KEY = 'studentProfile';
const EVENT = 'student-profile-changed';

export const defaultProfile: StudentProfile = {
  name: 'Student Name',
  studentId: 'STU2024001',
  email: 'student@chaitanya.net.in',
  phone: '+91 00000 00000',
  address: 'Chaitanya (Deemed to be University), Hyderabad',
  enrollmentDate: '2023-09-01',
  program: 'B.Tech',
  major: 'Computer Science & Engineering',
  year: 'Final Year',
  gpa: '8.5',
  avatar: '',
};

const read = (): StudentProfile => {
  if (typeof window === 'undefined') return defaultProfile;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultProfile, ...JSON.parse(raw) } : defaultProfile;
  } catch {
    return defaultProfile;
  }
};

export const useStudentProfile = () => {
  const [profile, setProfile] = useState<StudentProfile>(read);

  useEffect(() => {
    const sync = () => setProfile(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const save = useCallback((next: StudentProfile) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setProfile(next);
      window.dispatchEvent(new Event(EVENT));
      return true;
    } catch {
      return false;
    }
  }, []);

  return { profile, save };
};

export const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('') || 'ST';
