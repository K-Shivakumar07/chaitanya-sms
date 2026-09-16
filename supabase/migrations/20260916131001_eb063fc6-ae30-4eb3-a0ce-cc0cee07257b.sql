CREATE POLICY "course files readable" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'course-files');
CREATE POLICY "course files uploadable" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'course-files');
CREATE POLICY "course files updatable" ON storage.objects FOR UPDATE TO anon, authenticated USING (bucket_id = 'course-files') WITH CHECK (bucket_id = 'course-files');
CREATE POLICY "course files deletable" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'course-files');