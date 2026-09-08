CREATE TABLE public.attendance_records (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  semester integer NOT NULL,
  student_name text NOT NULL,
  roll_no text NOT NULL,
  subject_name text NOT NULL,
  period text NOT NULL DEFAULT to_char(now(), 'Mon YYYY'),
  classes_held integer NOT NULL DEFAULT 0,
  classes_attended integer NOT NULL DEFAULT 0,
  remarks text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance_records TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance_records TO authenticated;
GRANT ALL ON public.attendance_records TO service_role;

ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Attendance is publicly readable" ON public.attendance_records FOR SELECT USING (true);
CREATE POLICY "Public can insert attendance" ON public.attendance_records FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public can update attendance" ON public.attendance_records FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete attendance" ON public.attendance_records FOR DELETE TO anon, authenticated USING (true);

CREATE TRIGGER update_attendance_records_updated_at BEFORE UPDATE ON public.attendance_records
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();