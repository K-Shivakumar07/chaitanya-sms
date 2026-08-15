CREATE TABLE public.faculty (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  department text NOT NULL DEFAULT 'CSE',
  designation text NOT NULL DEFAULT 'Assistant Professor',
  role text NOT NULL DEFAULT 'faculty',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.faculty TO anon, authenticated;
GRANT ALL ON public.faculty TO service_role;

ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faculty directory is publicly readable" ON public.faculty FOR SELECT USING (true);
CREATE POLICY "Faculty directory is publicly writable" ON public.faculty FOR INSERT WITH CHECK (true);
CREATE POLICY "Faculty directory is publicly updatable" ON public.faculty FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Faculty directory is publicly deletable" ON public.faculty FOR DELETE USING (true);

CREATE TRIGGER update_faculty_updated_at BEFORE UPDATE ON public.faculty
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['subjects','syllabus_units','timetable_slots','materials','notes','assignments','deadlines','announcements','activities']
  LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO anon, authenticated;', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role;', t);
    EXECUTE format('DROP POLICY IF EXISTS "Staff can insert %1$s" ON public.%1$I;', t);
    EXECUTE format('DROP POLICY IF EXISTS "Staff can update %1$s" ON public.%1$I;', t);
    EXECUTE format('DROP POLICY IF EXISTS "Staff can delete %1$s" ON public.%1$I;', t);
    EXECUTE format('CREATE POLICY "Staff can insert %1$s" ON public.%1$I FOR INSERT WITH CHECK (true);', t);
    EXECUTE format('CREATE POLICY "Staff can update %1$s" ON public.%1$I FOR UPDATE USING (true) WITH CHECK (true);', t);
    EXECUTE format('CREATE POLICY "Staff can delete %1$s" ON public.%1$I FOR DELETE USING (true);', t);
  END LOOP;
END $$;