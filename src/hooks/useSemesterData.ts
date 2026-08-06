import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSemester } from '@/context/SemesterContext';

export interface SubjectRow {
  id: string;
  semester: number;
  code: string;
  name: string;
  short_name: string;
  faculty: string;
  credits: number;
  kind: string;
}

export interface SyllabusUnitRow {
  id: string;
  subject_id: string;
  semester: number;
  unit_no: number;
  title: string;
  topics: string[];
  hours: number;
}

export interface TimetableSlotRow {
  id: string;
  semester: number;
  day: string;
  day_order: number;
  start_time: string;
  end_time: string;
  subject_name: string;
  faculty: string;
  room: string;
  is_lab: boolean;
}

export interface MaterialRow {
  id: string;
  semester: number;
  subject_name: string;
  unit_no: number | null;
  title: string;
  description: string | null;
  file_type: string;
  size_label: string;
  uploaded_at: string;
  downloads: number;
}

export interface NoteRow {
  id: string;
  semester: number;
  subject_name: string;
  unit_no: number | null;
  title: string;
  faculty: string;
  file_type: string;
  pages: number;
  size_label: string;
  uploaded_at: string;
}

export interface AssignmentRow {
  id: string;
  semester: number;
  subject_name: string;
  title: string;
  description: string | null;
  faculty: string;
  assigned_date: string;
  due_date: string;
  status: string;
  priority: string;
}

export interface AnnouncementRow {
  id: string;
  semester: number | null;
  title: string;
  body: string;
  category: string;
  posted_by: string;
  posted_at: string;
}

export interface DeadlineRow {
  id: string;
  semester: number;
  title: string;
  detail: string | null;
  category: string;
  due_date: string;
  urgent: boolean;
}

export interface ActivityRow {
  id: string;
  semester: number;
  kind: string;
  title: string;
  detail: string | null;
  occurred_at: string;
}

export interface SemesterRow {
  id: string;
  number: number;
  title: string;
  description: string | null;
}

const enabledKey = (semester: number | null) => semester ?? 0;

export const useSemesters = () =>
  useQuery({
    queryKey: ['semesters'],
    queryFn: async () => {
      const { data, error } = await supabase.from('semesters').select('*').order('number');
      if (error) throw error;
      return (data ?? []) as SemesterRow[];
    },
  });

export const useSubjects = () => {
  const { semester } = useSemester();
  return useQuery({
    queryKey: ['subjects', enabledKey(semester)],
    enabled: !!semester,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('semester', semester!)
        .order('code');
      if (error) throw error;
      return (data ?? []) as SubjectRow[];
    },
  });
};

export const useSyllabusUnits = () => {
  const { semester } = useSemester();
  return useQuery({
    queryKey: ['syllabus_units', enabledKey(semester)],
    enabled: !!semester,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('syllabus_units')
        .select('*')
        .eq('semester', semester!)
        .order('unit_no');
      if (error) throw error;
      return (data ?? []) as SyllabusUnitRow[];
    },
  });
};

export const useTimetable = () => {
  const { semester } = useSemester();
  return useQuery({
    queryKey: ['timetable_slots', enabledKey(semester)],
    enabled: !!semester,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('timetable_slots')
        .select('*')
        .eq('semester', semester!)
        .order('day_order')
        .order('start_time');
      if (error) throw error;
      return (data ?? []) as TimetableSlotRow[];
    },
  });
};

export const useMaterials = () => {
  const { semester } = useSemester();
  return useQuery({
    queryKey: ['materials', enabledKey(semester)],
    enabled: !!semester,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('semester', semester!)
        .order('uploaded_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as MaterialRow[];
    },
  });
};

export const useNotes = () => {
  const { semester } = useSemester();
  return useQuery({
    queryKey: ['notes', enabledKey(semester)],
    enabled: !!semester,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('semester', semester!)
        .order('uploaded_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as NoteRow[];
    },
  });
};

export const useAssignments = () => {
  const { semester } = useSemester();
  return useQuery({
    queryKey: ['assignments', enabledKey(semester)],
    enabled: !!semester,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('semester', semester!)
        .order('due_date');
      if (error) throw error;
      return (data ?? []) as AssignmentRow[];
    },
  });
};

export const useAnnouncements = () => {
  const { semester } = useSemester();
  return useQuery({
    queryKey: ['announcements', enabledKey(semester)],
    enabled: !!semester,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .or(`semester.eq.${semester},semester.is.null`)
        .order('posted_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as AnnouncementRow[];
    },
  });
};

export const useDeadlines = () => {
  const { semester } = useSemester();
  return useQuery({
    queryKey: ['deadlines', enabledKey(semester)],
    enabled: !!semester,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deadlines')
        .select('*')
        .eq('semester', semester!)
        .order('due_date');
      if (error) throw error;
      return (data ?? []) as DeadlineRow[];
    },
  });
};

export const useActivities = () => {
  const { semester } = useSemester();
  return useQuery({
    queryKey: ['activities', enabledKey(semester)],
    enabled: !!semester,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('semester', semester!)
        .order('occurred_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as ActivityRow[];
    },
  });
};
