-- Enable Realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE contacts;
ALTER PUBLICATION supabase_realtime ADD TABLE donations;
ALTER PUBLICATION supabase_realtime ADD TABLE gallery;
ALTER PUBLICATION supabase_realtime ADD TABLE testimonials;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE scholarships;
ALTER PUBLICATION supabase_realtime ADD TABLE partners;
ALTER PUBLICATION supabase_realtime ADD TABLE volunteers;
ALTER PUBLICATION supabase_realtime ADD TABLE news;
ALTER PUBLICATION supabase_realtime ADD TABLE team;
ALTER PUBLICATION supabase_realtime ADD TABLE events;
ALTER PUBLICATION supabase_realtime ADD TABLE impact_stories;
ALTER PUBLICATION supabase_realtime ADD TABLE members;
ALTER PUBLICATION supabase_realtime ADD TABLE social_links;

-- Function to check if user is admin (avoids circular RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
  payment_status TEXT DEFAULT 'pending'
);

-- Enable RLS
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

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

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins manage profiles" ON profiles;
CREATE POLICY "Admins manage profiles" ON profiles
  FOR ALL USING (is_admin());

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
  email TEXT NOT NULL
);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
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
  availability TEXT NOT NULL
);

ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
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
CREATE POLICY "Admins Manage Images" ON storage.objects
  FOR ALL USING (bucket_id = 'images' AND is_admin());

