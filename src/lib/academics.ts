import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];
export type Semester = Tables['semesters']['Row'];
export type Subject = Tables['subjects']['Row'];
export type SyllabusUnit = Tables['syllabus_units']['Row'];
export type TimetableSlot = Tables['timetable_slots']['Row'];
export type Material = Tables['materials']['Row'];
export type Note = Tables['notes']['Row'];
export type Assignment = Tables['assignments']['Row'];
export type Announcement = Tables['announcements']['Row'];
export type Activity = Tables['activities']['Row'];
export type Deadline = Tables['deadlines']['Row'];

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export const romanSemester = (n: number) =>
  ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][n - 1] ?? String(n);

const unwrap = <T,>({ data, error }: { data: T | null; error: unknown }) => {
  if (error) throw error;
  return (data ?? []) as unknown as T;
};

export const fetchSemesters = async () =>
  unwrap<Semester[]>(await supabase.from('semesters').select('*').order('number'));

export const fetchSubjects = async (semester: number) =>
  unwrap<Subject[]>(await supabase.from('subjects').select('*').eq('semester', semester).order('code'));

export const fetchSyllabus = async (semester: number) =>
  unwrap<SyllabusUnit[]>(
    await supabase.from('syllabus_units').select('*').eq('semester', semester).order('unit_no'),
  );

export const fetchTimetable = async (semester: number) =>
  unwrap<TimetableSlot[]>(
    await supabase
      .from('timetable_slots')
      .select('*')
      .eq('semester', semester)
      .order('day_order')
      .order('start_time'),
  );

export const fetchMaterials = async (semester: number) =>
  unwrap<Material[]>(
    await supabase.from('materials').select('*').eq('semester', semester).order('uploaded_at', { ascending: false }),
  );

export const fetchNotes = async (semester: number) =>
  unwrap<Note[]>(
    await supabase.from('notes').select('*').eq('semester', semester).order('uploaded_at', { ascending: false }),
  );

export const fetchAssignments = async (semester: number) =>
  unwrap<Assignment[]>(
    await supabase.from('assignments').select('*').eq('semester', semester).order('due_date'),
  );

export const fetchAnnouncements = async (semester: number) =>
  unwrap<Announcement[]>(
    await supabase
      .from('announcements')
      .select('*')
      .eq('semester', semester)
      .order('posted_at', { ascending: false }),
  );

export const fetchActivities = async (semester: number) =>
  unwrap<Activity[]>(
    await supabase
      .from('activities')
      .select('*')
      .eq('semester', semester)
      .order('occurred_at', { ascending: false })
      .limit(12),
  );

export const fetchDeadlines = async (semester: number) =>
  unwrap<Deadline[]>(
    await supabase.from('deadlines').select('*').eq('semester', semester).order('due_date'),
  );

export const todayName = () =>
  ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];

export const formatDate = (value?: string | null) => {
  if (!value) return '';
  const d = new Date(value);
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};

export const daysUntil = (value: string) => {
  const due = new Date(value);
  due.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - now.getTime()) / 86400000);
};

export const relativeTime = (value: string) => {
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
};
