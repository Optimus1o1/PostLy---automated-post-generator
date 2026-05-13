-- ╔═══════════════════════════════════════════════════╗
-- ║ POSTLY — Supabase Schema (Run in SQL Editor)     ║
-- ║ This creates ALL tables needed for production.    ║
-- ╚═══════════════════════════════════════════════════╝

-- ──────────────────────────────────────────
--  1. PROFILES (auto-created on signup)
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  plan_type TEXT DEFAULT 'free',
  credits INT DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup (includes full_name from metadata)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ──────────────────────────────────────────
--  2. BRAND PROFILES
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS brand_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  persona_type TEXT NOT NULL,
  business_name TEXT NOT NULL,
  niche TEXT,
  target_audience TEXT,
  brand_voice TEXT,
  default_platform TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE brand_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own brands" ON brand_profiles FOR ALL USING (auth.uid() = user_id);


-- ──────────────────────────────────────────
--  3. CALENDARS
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS calendars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  brand_id UUID REFERENCES brand_profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  platform TEXT NOT NULL,
  frequency TEXT NOT NULL,
  start_date DATE NOT NULL,
  number_of_days INT NOT NULL,
  status TEXT DEFAULT 'ready',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE calendars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own calendars" ON calendars FOR ALL USING (auth.uid() = user_id);


-- ──────────────────────────────────────────
--  4. CALENDAR POSTS
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS calendar_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  calendar_id UUID REFERENCES calendars(id) ON DELETE CASCADE NOT NULL,
  post_date DATE NOT NULL,
  post_type TEXT NOT NULL,
  caption TEXT NOT NULL DEFAULT '',
  hashtags TEXT[] DEFAULT '{}',
  image_idea TEXT DEFAULT '',
  link TEXT DEFAULT '',
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE calendar_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage posts via calendars" ON calendar_posts FOR ALL
USING (
  calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid())
);
