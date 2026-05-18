-- Supabase Schema for WILL-NAKS FOUNDATION

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

-- 5. Admin Users Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user' -- 'admin' or 'user'
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;
CREATE POLICY "Admins can update profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

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
CREATE POLICY "Public insert scholarships" ON scholarships FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage scholarships" ON scholarships FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

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
CREATE POLICY "Public insert partners" ON partners FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage partners" ON partners FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

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
CREATE POLICY "Public insert volunteers" ON volunteers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage volunteers" ON volunteers FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

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
CREATE POLICY "Public view news" ON news FOR SELECT USING (true);
CREATE POLICY "Admins manage news" ON news FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
