
CREATE TABLE public.semesters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number INT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.semesters TO anon, authenticated;
GRANT ALL ON public.semesters TO service_role;
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Academic data is publicly readable" ON public.semesters FOR SELECT USING (true);

CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  semester INT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  faculty TEXT NOT NULL,
  credits INT NOT NULL DEFAULT 3,
  kind TEXT NOT NULL DEFAULT 'theory',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.subjects TO anon, authenticated;
GRANT ALL ON public.subjects TO service_role;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Academic data is publicly readable" ON public.subjects FOR SELECT USING (true);

CREATE TABLE public.syllabus_units (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  semester INT NOT NULL,
  unit_no INT NOT NULL,
  title TEXT NOT NULL,
  topics TEXT[] NOT NULL DEFAULT '{}',
  hours INT NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.syllabus_units TO anon, authenticated;
GRANT ALL ON public.syllabus_units TO service_role;
ALTER TABLE public.syllabus_units ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Academic data is publicly readable" ON public.syllabus_units FOR SELECT USING (true);

CREATE TABLE public.timetable_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  semester INT NOT NULL,
  day TEXT NOT NULL,
  day_order INT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  subject_name TEXT NOT NULL,
  faculty TEXT NOT NULL,
  room TEXT NOT NULL,
  is_lab BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.timetable_slots TO anon, authenticated;
GRANT ALL ON public.timetable_slots TO service_role;
ALTER TABLE public.timetable_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Academic data is publicly readable" ON public.timetable_slots FOR SELECT USING (true);

CREATE TABLE public.materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  semester INT NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  subject_name TEXT NOT NULL,
  unit_no INT,
  title TEXT NOT NULL,
  description TEXT,
  file_type TEXT NOT NULL DEFAULT 'PDF',
  size_label TEXT NOT NULL DEFAULT '2.0 MB',
  file_url TEXT,
  uploaded_at DATE NOT NULL DEFAULT CURRENT_DATE,
  downloads INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.materials TO anon, authenticated;
GRANT ALL ON public.materials TO service_role;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Academic data is publicly readable" ON public.materials FOR SELECT USING (true);

CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  semester INT NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  subject_name TEXT NOT NULL,
  unit_no INT,
  title TEXT NOT NULL,
  faculty TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'PDF',
  pages INT NOT NULL DEFAULT 10,
  size_label TEXT NOT NULL DEFAULT '1.8 MB',
  file_url TEXT,
  uploaded_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.notes TO anon, authenticated;
GRANT ALL ON public.notes TO service_role;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Academic data is publicly readable" ON public.notes FOR SELECT USING (true);

CREATE TABLE public.assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  semester INT NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  subject_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  faculty TEXT NOT NULL,
  assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.assignments TO anon, authenticated;
GRANT ALL ON public.assignments TO service_role;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Academic data is publicly readable" ON public.assignments FOR SELECT USING (true);

CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  semester INT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  posted_by TEXT NOT NULL DEFAULT 'Department Office',
  posted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.announcements TO anon, authenticated;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Academic data is publicly readable" ON public.announcements FOR SELECT USING (true);

CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  semester INT NOT NULL,
  kind TEXT NOT NULL,
  title TEXT NOT NULL,
  detail TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.activities TO anon, authenticated;
GRANT ALL ON public.activities TO service_role;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Academic data is publicly readable" ON public.activities FOR SELECT USING (true);

CREATE TABLE public.deadlines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  semester INT NOT NULL,
  title TEXT NOT NULL,
  detail TEXT,
  category TEXT NOT NULL DEFAULT 'assignment',
  due_date DATE NOT NULL,
  urgent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.deadlines TO anon, authenticated;
GRANT ALL ON public.deadlines TO service_role;
ALTER TABLE public.deadlines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Academic data is publicly readable" ON public.deadlines FOR SELECT USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON public.assignments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_deadlines_updated_at BEFORE UPDATE ON public.deadlines
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_subjects_semester ON public.subjects(semester);
CREATE INDEX idx_syllabus_semester ON public.syllabus_units(semester);
CREATE INDEX idx_timetable_semester ON public.timetable_slots(semester);
CREATE INDEX idx_materials_semester ON public.materials(semester);
CREATE INDEX idx_notes_semester ON public.notes(semester);
CREATE INDEX idx_assignments_semester ON public.assignments(semester);
CREATE INDEX idx_announcements_semester ON public.announcements(semester);
CREATE INDEX idx_activities_semester ON public.activities(semester);
CREATE INDEX idx_deadlines_semester ON public.deadlines(semester);
