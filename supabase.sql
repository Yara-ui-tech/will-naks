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
