-- Grant necessary permissions first
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- Enable Row Level Security on all tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for all users" ON public.technologies;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.technologies;
DROP POLICY IF EXISTS "Enable update for university owners" ON public.technologies;
DROP POLICY IF EXISTS "Enable delete for university owners" ON public.technologies;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.universities;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.universities;
DROP POLICY IF EXISTS "Enable update for owners" ON public.universities;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.companies;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.companies;
DROP POLICY IF EXISTS "Enable update for owners" ON public.companies;

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.contacts;
DROP POLICY IF EXISTS "Enable read for involved parties" ON public.contacts;

-- Companies policies
CREATE POLICY "Enable read access for all users"
ON public.companies FOR SELECT
USING (true);

CREATE POLICY "Enable insert for authenticated users only"
ON public.companies FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for owners"
ON public.companies FOR UPDATE
USING (auth.uid() = id);

-- Universities policies
CREATE POLICY "Enable read access for all users"
ON public.universities FOR SELECT
USING (true);

CREATE POLICY "Enable insert for authenticated users only"
ON public.universities FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for owners"
ON public.universities FOR UPDATE
USING (auth.uid() = id);

-- Technologies policies
CREATE POLICY "Enable read access for all users"
ON public.technologies FOR SELECT
USING (true);

CREATE POLICY "Enable insert for authenticated users only"
ON public.technologies FOR INSERT
WITH CHECK (auth.uid() = university_id);

CREATE POLICY "Enable update for university owners"
ON public.technologies FOR UPDATE
USING (auth.uid() = university_id);

CREATE POLICY "Enable delete for university owners"
ON public.technologies FOR DELETE
USING (auth.uid() = university_id);

-- Contacts policies
CREATE POLICY "Enable insert for authenticated users"
ON public.contacts FOR INSERT
WITH CHECK (auth.uid() = company_id OR auth.uid() = university_id);

CREATE POLICY "Enable read for involved parties"
ON public.contacts FOR SELECT
USING (auth.uid() = company_id OR auth.uid() = university_id);

-- Disable RLS for service_role (admin operations bypass RLS)
ALTER TABLE public.companies FORCE ROW LEVEL SECURITY;
ALTER TABLE public.universities FORCE ROW LEVEL SECURITY;
ALTER TABLE public.technologies FORCE ROW LEVEL SECURITY;
ALTER TABLE public.contacts FORCE ROW LEVEL SECURITY;

-- Add policy for service_role to bypass all restrictions
CREATE POLICY "Service role bypass" ON public.companies FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role bypass" ON public.universities FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role bypass" ON public.technologies FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role bypass" ON public.contacts FOR ALL TO service_role USING (true) WITH CHECK (true);
