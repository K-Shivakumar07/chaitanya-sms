-- Roles infrastructure
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('student', 'faculty', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('faculty', 'admin')
  )
$$;

-- Academic tables: public read stays, writes restricted to staff
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['subjects','syllabus_units','timetable_slots','materials','notes','assignments','announcements','deadlines','activities']
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Staff can insert %1$s" ON public.%1$I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Staff can update %1$s" ON public.%1$I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Staff can delete %1$s" ON public.%1$I', t);

    EXECUTE format('REVOKE INSERT, UPDATE, DELETE ON public.%I FROM anon', t);
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);

    EXECUTE format('CREATE POLICY "Staff can insert %1$s" ON public.%1$I FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()))', t);
    EXECUTE format('CREATE POLICY "Staff can update %1$s" ON public.%1$I FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()))', t);
    EXECUTE format('CREATE POLICY "Staff can delete %1$s" ON public.%1$I FOR DELETE TO authenticated USING (public.is_staff(auth.uid()))', t);
  END LOOP;
END $$;

-- Faculty directory: authenticated-only reads, admin-only writes
DROP POLICY IF EXISTS "Faculty directory is publicly readable" ON public.faculty;
DROP POLICY IF EXISTS "Faculty directory is publicly writable" ON public.faculty;
DROP POLICY IF EXISTS "Faculty directory is publicly updatable" ON public.faculty;
DROP POLICY IF EXISTS "Faculty directory is publicly deletable" ON public.faculty;

REVOKE ALL ON public.faculty FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faculty TO authenticated;
GRANT ALL ON public.faculty TO service_role;

CREATE POLICY "Authenticated users can view faculty"
  ON public.faculty FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert faculty"
  ON public.faculty FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update faculty"
  ON public.faculty FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete faculty"
  ON public.faculty FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));