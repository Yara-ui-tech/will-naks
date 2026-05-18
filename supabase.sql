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
CREATE POLICY "Allow public view approved testimonials" ON testimonials 
  FOR SELECT USING (is_approved = true);
CREATE POLICY "Allow public insert testimonials" ON testimonials
  FOR INSERT WITH CHECK (true);

-- 5. Admin Users Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user' -- 'admin' or 'user'
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins can update profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
