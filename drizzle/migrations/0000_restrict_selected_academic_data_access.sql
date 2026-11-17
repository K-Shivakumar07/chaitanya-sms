DROP POLICY IF EXISTS "Academic data is publicly readable" ON public.timetable_slots;
DROP POLICY IF EXISTS "Public can insert timetable_slots" ON public.timetable_slots;
DROP POLICY IF EXISTS "Public can update timetable_slots" ON public.timetable_slots;
DROP POLICY IF EXISTS "Public can delete timetable_slots" ON public.timetable_slots;
CREATE POLICY "Students and staff can read timetable_slots" ON public.timetable_slots FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'student'::public.app_role) OR public.is_staff(auth.uid()));
CREATE POLICY "Staff can manage timetable_slots" ON public.timetable_slots FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Academic data is publicly readable" ON public.notes;
DROP POLICY IF EXISTS "Public can insert notes" ON public.notes;
DROP POLICY IF EXISTS "Public can update notes" ON public.notes;
DROP POLICY IF EXISTS "Public can delete notes" ON public.notes;
CREATE POLICY "Students and staff can read notes" ON public.notes FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'student'::public.app_role) OR public.is_staff(auth.uid()));
CREATE POLICY "Staff can manage notes" ON public.notes FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Attendance is publicly readable" ON public.attendance_records;
DROP POLICY IF EXISTS "Public can insert attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Public can update attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Public can delete attendance" ON public.attendance_records;
CREATE POLICY "Staff can read attendance_records" ON public.attendance_records FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can manage attendance_records" ON public.attendance_records FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Academic data is publicly readable" ON public.assignments;
DROP POLICY IF EXISTS "Public can insert assignments" ON public.assignments;
DROP POLICY IF EXISTS "Public can update assignments" ON public.assignments;
DROP POLICY IF EXISTS "Public can delete assignments" ON public.assignments;
CREATE POLICY "Students and staff can read assignments" ON public.assignments FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'student'::public.app_role) OR public.is_staff(auth.uid()));
CREATE POLICY "Staff can manage assignments" ON public.assignments FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Academic data is publicly readable" ON public.materials;
DROP POLICY IF EXISTS "Public can insert materials" ON public.materials;
DROP POLICY IF EXISTS "Public can update materials" ON public.materials;
DROP POLICY IF EXISTS "Public can delete materials" ON public.materials;
CREATE POLICY "Students and staff can read materials" ON public.materials FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'student'::public.app_role) OR public.is_staff(auth.uid()));
CREATE POLICY "Staff can manage materials" ON public.materials FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Academic data is publicly readable" ON public.subjects;
DROP POLICY IF EXISTS "Public can insert subjects" ON public.subjects;
DROP POLICY IF EXISTS "Public can update subjects" ON public.subjects;
DROP POLICY IF EXISTS "Public can delete subjects" ON public.subjects;
CREATE POLICY "Students and staff can read subjects" ON public.subjects FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'student'::public.app_role) OR public.is_staff(auth.uid()));
CREATE POLICY "Staff can manage subjects" ON public.subjects FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Academic data is publicly readable" ON public.activities;
DROP POLICY IF EXISTS "Public can insert activities" ON public.activities;
DROP POLICY IF EXISTS "Public can update activities" ON public.activities;
DROP POLICY IF EXISTS "Public can delete activities" ON public.activities;
CREATE POLICY "Students and staff can read activities" ON public.activities FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'student'::public.app_role) OR public.is_staff(auth.uid()));
CREATE POLICY "Staff can manage activities" ON public.activities FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Academic data is publicly readable" ON public.announcements;
DROP POLICY IF EXISTS "Public can insert announcements" ON public.announcements;
DROP POLICY IF EXISTS "Public can update announcements" ON public.announcements;
DROP POLICY IF EXISTS "Public can delete announcements" ON public.announcements;
CREATE POLICY "Students and staff can read announcements" ON public.announcements FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'student'::public.app_role) OR public.is_staff(auth.uid()));
CREATE POLICY "Staff can manage announcements" ON public.announcements FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Academic data is publicly readable" ON public.semesters;
DROP POLICY IF EXISTS "Public can insert semesters" ON public.semesters;
DROP POLICY IF EXISTS "Public can update semesters" ON public.semesters;
DROP POLICY IF EXISTS "Public can delete semesters" ON public.semesters;
CREATE POLICY "Students and staff can read semesters" ON public.semesters FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'student'::public.app_role) OR public.is_staff(auth.uid()));
CREATE POLICY "Staff can manage semesters" ON public.semesters FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Academic data is publicly readable" ON public.deadlines;
DROP POLICY IF EXISTS "Public can insert deadlines" ON public.deadlines;
DROP POLICY IF EXISTS "Public can update deadlines" ON public.deadlines;
DROP POLICY IF EXISTS "Public can delete deadlines" ON public.deadlines;
CREATE POLICY "Students and staff can read deadlines" ON public.deadlines FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'student'::public.app_role) OR public.is_staff(auth.uid()));
CREATE POLICY "Staff can manage deadlines" ON public.deadlines FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Academic data is publicly readable" ON public.syllabus_units;
DROP POLICY IF EXISTS "Public can insert syllabus_units" ON public.syllabus_units;
DROP POLICY IF EXISTS "Public can update syllabus_units" ON public.syllabus_units;
DROP POLICY IF EXISTS "Public can delete syllabus_units" ON public.syllabus_units;
CREATE POLICY "Students and staff can read syllabus_units" ON public.syllabus_units FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'student'::public.app_role) OR public.is_staff(auth.uid()));
CREATE POLICY "Staff can manage syllabus_units" ON public.syllabus_units FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "course files readable" ON storage.objects;
DROP POLICY IF EXISTS "course files uploadable" ON storage.objects;
DROP POLICY IF EXISTS "course files updatable" ON storage.objects;
DROP POLICY IF EXISTS "course files deletable" ON storage.objects;
CREATE POLICY "Course files available to students and staff" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'course-files' AND (public.has_role(auth.uid(), 'student'::public.app_role) OR public.is_staff(auth.uid())));
CREATE POLICY "Staff can manage course files" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'course-files' AND public.is_staff(auth.uid())) WITH CHECK (bucket_id = 'course-files' AND public.is_staff(auth.uid()));