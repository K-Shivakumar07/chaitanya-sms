DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['subjects','syllabus_units','timetable_slots','materials','notes','assignments','deadlines','announcements','activities']
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Staff can insert %1$s" ON public.%1$I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Staff can update %1$s" ON public.%1$I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Staff can delete %1$s" ON public.%1$I', t);
    EXECUTE format('CREATE POLICY "Public can insert %1$s" ON public.%1$I FOR INSERT TO anon, authenticated WITH CHECK (true)', t);
    EXECUTE format('CREATE POLICY "Public can update %1$s" ON public.%1$I FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true)', t);
    EXECUTE format('CREATE POLICY "Public can delete %1$s" ON public.%1$I FOR DELETE TO anon, authenticated USING (true)', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%1$I TO anon, authenticated', t);
    EXECUTE format('GRANT ALL ON public.%1$I TO service_role', t);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "Academic data is publicly readable" ON public.semesters;
CREATE POLICY "Academic data is publicly readable" ON public.semesters FOR SELECT USING (true);
CREATE POLICY "Public can insert semesters" ON public.semesters FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public can update semesters" ON public.semesters FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete semesters" ON public.semesters FOR DELETE TO anon, authenticated USING (true);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.semesters TO anon, authenticated;
GRANT ALL ON public.semesters TO service_role;