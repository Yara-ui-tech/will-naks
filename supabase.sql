-- Enable Realtime for all tables safely
DO $$ 
DECLARE
  table_list TEXT[] := ARRAY['contacts', 'donations', 'gallery', 'testimonials', 'profiles', 'scholarships', 'partners', 'volunteers', 'news', 'team', 'events', 'impact_stories', 'members', 'social_links', 'deductions'];
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(table_list) LOOP
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = t) THEN
      IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = t
      ) THEN
        EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE ' || quote_ident(t);
      END IF;
    END IF;
  END LOOP;
END $$;

-- Function to check if user is admin (avoids circular RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  -- 1. Fast-path: Check jwt email directly (this never queries the profiles table and prevents security recursion)
  IF (auth.jwt() ->> 'email') IN ('goyaracorp@gmail.com', 'tapiwanashe.mandiveyi@gmail.com') THEN
    RETURN true;
  END IF;

  -- 2. Query profiles table for other users promoted to administrative status
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 1. Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Allow public insertion
DROP POLICY IF EXISTS "Allow public insert contacts" ON contacts;
CREATE POLICY "Allow public insert contacts" ON contacts
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins manage contacts" ON contacts;
CREATE POLICY "Admins manage contacts" ON contacts
  FOR ALL USING (is_admin());

-- 2. Donations Table
CREATE TABLE IF NOT EXISTS donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  amount NUMERIC NOT NULL,
  donor_name TEXT,
  email TEXT,
  payment_status TEXT DEFAULT 'pending'
);

-- Enable RLS
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Allow public view of donations (needed for dynamic total calculations)
DROP POLICY IF EXISTS "Allow public view donations" ON donations;
CREATE POLICY "Allow public view donations" ON donations FOR SELECT USING (true);

-- Allow public insertion
DROP POLICY IF EXISTS "Allow public insert donations" ON donations;
CREATE POLICY "Allow public insert donations" ON donations
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins manage donations" ON donations;
CREATE POLICY "Admins manage donations" ON donations
  FOR ALL USING (is_admin());

-- 3. Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  url TEXT NOT NULL,
  caption TEXT,
  category TEXT
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public view gallery" ON gallery;
CREATE POLICY "Allow public view gallery" ON gallery FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage gallery" ON gallery;
CREATE POLICY "Admins manage gallery" ON gallery
  FOR ALL USING (is_admin());

-- 4. Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT NOT NULL,
  content TEXT NOT NULL,
  role TEXT,
  rating INTEGER DEFAULT 5,
  is_approved BOOLEAN DEFAULT false
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public view approved testimonials" ON testimonials;
CREATE POLICY "Allow public view approved testimonials" ON testimonials 
  FOR SELECT USING (is_approved = true);

DROP POLICY IF EXISTS "Allow public insert testimonials" ON testimonials;
CREATE POLICY "Allow public insert testimonials" ON testimonials
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins manage testimonials" ON testimonials;
CREATE POLICY "Admins manage testimonials" ON testimonials
  FOR ALL USING (is_admin());

-- 5. Admin Users Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user' -- 'admin' or 'user'
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies (safely dropping ALL old policies first to prevent database recursion leftovers)
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
    END LOOP;
END
$$;

CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins manage profiles" ON profiles
  FOR ALL USING (
    (auth.jwt() ->> 'email') IN ('goyaracorp@gmail.com', 'tapiwanashe.mandiveyi@gmail.com')
  );

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    new.id, 
    new.email,
    CASE 
      WHEN new.email IN ('goyaracorp@gmail.com', 'tapiwanashe.mandiveyi@gmail.com') THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Scholarship Applications
CREATE TABLE IF NOT EXISTS scholarships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  education_level TEXT NOT NULL,
  institution TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending'
);

ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view scholarships" ON scholarships;
CREATE POLICY "Public view scholarships" ON scholarships FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert scholarships" ON scholarships;
CREATE POLICY "Public insert scholarships" ON scholarships FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins manage scholarships" ON scholarships;
CREATE POLICY "Admins manage scholarships" ON scholarships FOR ALL USING (is_admin());

-- 7. Partner Requests
CREATE TABLE IF NOT EXISTS partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  org_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  message TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  website_url TEXT
);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view partners" ON partners;
CREATE POLICY "Public view partners" ON partners FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert partners" ON partners;
CREATE POLICY "Public insert partners" ON partners FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins manage partners" ON partners;
CREATE POLICY "Admins manage partners" ON partners FOR ALL USING (is_admin());

-- 8. Volunteer Signups
CREATE TABLE IF NOT EXISTS volunteers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  expertise TEXT NOT NULL,
  availability TEXT NOT NULL,
  status TEXT DEFAULT 'pending'
);

ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view volunteers" ON volunteers;
CREATE POLICY "Public view volunteers" ON volunteers FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert volunteers" ON volunteers;
CREATE POLICY "Public insert volunteers" ON volunteers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins manage volunteers" ON volunteers;
CREATE POLICY "Admins manage volunteers" ON volunteers FOR ALL USING (is_admin());

-- 9. News & Blog
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  category TEXT,
  author_id UUID REFERENCES auth.users(id)
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view news" ON news;
CREATE POLICY "Public view news" ON news FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage news" ON news;
CREATE POLICY "Admins manage news" ON news FOR ALL USING (is_admin());

-- 10. Team Table
CREATE TABLE IF NOT EXISTS team (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image_url TEXT,
  linkedin_url TEXT,
  display_order INTEGER DEFAULT 0
);

ALTER TABLE team ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view team" ON team;
CREATE POLICY "Public view team" ON team FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage team" ON team;
CREATE POLICY "Admins manage team" ON team FOR ALL USING (is_admin());

-- 11. Events Table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ,
  location TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'upcoming'
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view events" ON events;
CREATE POLICY "Public view events" ON events FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage events" ON events;
CREATE POLICY "Admins manage events" ON events FOR ALL USING (is_admin());

-- 12. Impact Stories Table
CREATE TABLE IF NOT EXISTS impact_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  year TEXT
);

ALTER TABLE impact_stories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view impact_stories" ON impact_stories;
CREATE POLICY "Public view impact_stories" ON impact_stories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage impact_stories" ON impact_stories;
CREATE POLICY "Admins manage impact_stories" ON impact_stories FOR ALL USING (is_admin());

-- 13. Members Table
CREATE TABLE IF NOT EXISTS members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  interests TEXT[],
  whatsapp_joined BOOLEAN DEFAULT false
);

ALTER TABLE members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view members" ON members;
CREATE POLICY "Public view members" ON members FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert members" ON members;
CREATE POLICY "Public insert members" ON members FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins manage members" ON members;
CREATE POLICY "Admins manage members" ON members FOR ALL USING (is_admin());

-- 14. Social Links Table
CREATE TABLE IF NOT EXISTS social_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL, -- e.g. 'Facebook', 'Instagram', 'X'
  url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view social_links" ON social_links;
CREATE POLICY "Public view social_links" ON social_links FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage social_links" ON social_links;
CREATE POLICY "Admins manage social_links" ON social_links FOR ALL USING (is_admin());

-- 15. Storage Setup for Images
-- Note: This requires the storage extension to be enabled (usually enabled by default in Supabase)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for 'images' bucket
DROP POLICY IF EXISTS "Public View Images" ON storage.objects;
CREATE POLICY "Public View Images" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Admins Manage Images" ON storage.objects;
DROP POLICY IF EXISTS "Admins Insert Images" ON storage.objects;
DROP POLICY IF EXISTS "Admins Update Images" ON storage.objects;
DROP POLICY IF EXISTS "Admins Delete Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Images" ON storage.objects;

-- Allow anyone to upload images to the public 'images' bucket
CREATE POLICY "Public Insert Images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images');

-- Allow anyone to update images in the public 'images' bucket
CREATE POLICY "Public Update Images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'images');

-- Allow anyone to delete images in the public 'images' bucket
CREATE POLICY "Public Delete Images" ON storage.objects
  FOR DELETE USING (bucket_id = 'images');


-- Retroactive fixes to ensure columns exist on historical installations
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS logo_url TEXT;

ALTER TABLE public.scholarships ADD COLUMN IF NOT EXISTS date_of_birth TEXT;
ALTER TABLE public.scholarships ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE public.scholarships ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.scholarships ADD COLUMN IF NOT EXISTS nationality TEXT;
ALTER TABLE public.scholarships ADD COLUMN IF NOT EXISTS birth_cert_no TEXT;
ALTER TABLE public.scholarships ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.scholarships ADD COLUMN IF NOT EXISTS parent_name TEXT;
ALTER TABLE public.scholarships ADD COLUMN IF NOT EXISTS parent_relationship TEXT;
ALTER TABLE public.scholarships ADD COLUMN IF NOT EXISTS parent_occupation TEXT;
ALTER TABLE public.scholarships ADD COLUMN IF NOT EXISTS monthly_income TEXT;
ALTER TABLE public.scholarships ADD COLUMN IF NOT EXISTS dependants_count INTEGER;
ALTER TABLE public.scholarships ADD COLUMN IF NOT EXISTS is_orphan BOOLEAN DEFAULT false;
ALTER TABLE public.scholarships ADD COLUMN IF NOT EXISTS carer_details TEXT;
ALTER TABLE public.scholarships ADD COLUMN IF NOT EXISTS subjects_strength TEXT;
ALTER TABLE public.scholarships ADD COLUMN IF NOT EXISTS career_aspirations TEXT;
ALTER TABLE public.scholarships ADD COLUMN IF NOT EXISTS chosen_programs TEXT[];


-- 16. Deductions / Fund Disbursements Table (Transparency Tracker)
CREATE TABLE IF NOT EXISTS public.deductions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  amount NUMERIC NOT NULL,
  purpose TEXT NOT NULL,
  recipient TEXT DEFAULT 'N/A',
  project_lead TEXT DEFAULT 'N/A'
);

-- Enable RLS
ALTER TABLE public.deductions ENABLE ROW LEVEL SECURITY;

-- Allow public viewing of how money is utilized
DROP POLICY IF EXISTS "Public view deductions" ON public.deductions;
CREATE POLICY "Public view deductions" ON public.deductions FOR SELECT USING (true);

-- Allow admins full control over disbursement tracking
DROP POLICY IF EXISTS "Admins manage deductions" ON public.deductions;
CREATE POLICY "Admins manage deductions" ON public.deductions FOR ALL USING (public.is_admin());


