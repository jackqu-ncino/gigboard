-- ============================================
-- GIGBOARD DATABASE SCHEMA
-- ============================================

-- Reference tables
CREATE TABLE instruments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE genres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (extends Supabase auth.users)
CREATE TYPE user_role AS ENUM ('musician', 'poster', 'both', 'admin');

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'musician',
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Musician profiles
CREATE TYPE experience_level AS ENUM ('beginner', 'intermediate', 'advanced', 'professional');

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  experience experience_level DEFAULT 'intermediate',
  city TEXT,
  state TEXT,
  availability TEXT,
  rate_min NUMERIC(10,2),
  rate_max NUMERIC(10,2),
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profile_instruments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  instrument_id UUID NOT NULL REFERENCES instruments(id) ON DELETE CASCADE,
  UNIQUE(profile_id, instrument_id)
);

CREATE TABLE profile_genres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  genre_id UUID NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
  UNIQUE(profile_id, genre_id)
);

-- Gig postings
CREATE TYPE gig_status AS ENUM ('open', 'filled', 'cancelled');

CREATE TABLE gigs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  posted_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  venue TEXT,
  city TEXT,
  state TEXT,
  gig_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  budget NUMERIC(10,2),
  musicians_needed INTEGER DEFAULT 1,
  status gig_status DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE gig_instruments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id UUID NOT NULL REFERENCES gigs(id) ON DELETE CASCADE,
  instrument_id UUID NOT NULL REFERENCES instruments(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  UNIQUE(gig_id, instrument_id)
);

CREATE TABLE gig_genres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id UUID NOT NULL REFERENCES gigs(id) ON DELETE CASCADE,
  genre_id UUID NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
  UNIQUE(gig_id, genre_id)
);

-- Applications
CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id UUID NOT NULL REFERENCES gigs(id) ON DELETE CASCADE,
  musician_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT,
  status application_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(gig_id, musician_id)
);

-- Indexes
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_city_state ON profiles(city, state);
CREATE INDEX idx_profiles_published ON profiles(is_published) WHERE is_published = TRUE;
CREATE INDEX idx_gigs_posted_by ON gigs(posted_by);
CREATE INDEX idx_gigs_status ON gigs(status);
CREATE INDEX idx_gigs_date ON gigs(gig_date);
CREATE INDEX idx_gigs_city_state ON gigs(city, state);
CREATE INDEX idx_gigs_open_date ON gigs(status, gig_date) WHERE status = 'open';
CREATE INDEX idx_applications_gig ON applications(gig_id);
CREATE INDEX idx_applications_musician ON applications(musician_id);
CREATE INDEX idx_profile_instruments_profile ON profile_instruments(profile_id);
CREATE INDEX idx_profile_genres_profile ON profile_genres(profile_id);
CREATE INDEX idx_gig_instruments_gig ON gig_instruments(gig_id);
CREATE INDEX idx_gig_genres_gig ON gig_genres(gig_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER gigs_updated_at BEFORE UPDATE ON gigs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gig_instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE gig_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;

-- Admin helper
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM users WHERE id = auth.uid()),
    FALSE
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- RLS Policies: instruments & genres
CREATE POLICY "Anyone can read instruments" ON instruments FOR SELECT USING (TRUE);
CREATE POLICY "Admin can manage instruments" ON instruments FOR ALL USING (is_admin());
CREATE POLICY "Anyone can read genres" ON genres FOR SELECT USING (TRUE);
CREATE POLICY "Admin can manage genres" ON genres FOR ALL USING (is_admin());

-- RLS Policies: users
CREATE POLICY "Users can read all users" ON users FOR SELECT USING (TRUE);
CREATE POLICY "Users can update own record" ON users FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Users can insert own record" ON users FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "Admin full access to users" ON users FOR ALL USING (is_admin());

-- RLS Policies: profiles
CREATE POLICY "Anyone can read published profiles" ON profiles
  FOR SELECT USING (is_published = TRUE OR user_id = auth.uid() OR is_admin());
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (user_id = auth.uid() OR is_admin());
CREATE POLICY "Users can delete own profile" ON profiles
  FOR DELETE USING (user_id = auth.uid() OR is_admin());

-- RLS Policies: profile_instruments & profile_genres
CREATE POLICY "Read profile instruments" ON profile_instruments FOR SELECT USING (TRUE);
CREATE POLICY "Manage own profile instruments" ON profile_instruments
  FOR ALL USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR is_admin()
  );
CREATE POLICY "Read profile genres" ON profile_genres FOR SELECT USING (TRUE);
CREATE POLICY "Manage own profile genres" ON profile_genres
  FOR ALL USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR is_admin()
  );

-- RLS Policies: gigs
CREATE POLICY "Anyone can read open gigs" ON gigs
  FOR SELECT USING (status = 'open' OR posted_by = auth.uid() OR is_admin());
CREATE POLICY "Authenticated users can create gigs" ON gigs
  FOR INSERT WITH CHECK (posted_by = auth.uid());
CREATE POLICY "Posters can update own gigs" ON gigs
  FOR UPDATE USING (posted_by = auth.uid() OR is_admin());
CREATE POLICY "Posters can delete own gigs" ON gigs
  FOR DELETE USING (posted_by = auth.uid() OR is_admin());

-- RLS Policies: gig_instruments & gig_genres
CREATE POLICY "Read gig instruments" ON gig_instruments FOR SELECT USING (TRUE);
CREATE POLICY "Manage gig instruments" ON gig_instruments
  FOR ALL USING (
    gig_id IN (SELECT id FROM gigs WHERE posted_by = auth.uid()) OR is_admin()
  );
CREATE POLICY "Read gig genres" ON gig_genres FOR SELECT USING (TRUE);
CREATE POLICY "Manage gig genres" ON gig_genres
  FOR ALL USING (
    gig_id IN (SELECT id FROM gigs WHERE posted_by = auth.uid()) OR is_admin()
  );

-- RLS Policies: applications
CREATE POLICY "Musicians see own applications" ON applications
  FOR SELECT USING (musician_id = auth.uid() OR is_admin());
CREATE POLICY "Posters see applications to their gigs" ON applications
  FOR SELECT USING (gig_id IN (SELECT id FROM gigs WHERE posted_by = auth.uid()));
CREATE POLICY "Musicians can apply" ON applications
  FOR INSERT WITH CHECK (musician_id = auth.uid());
CREATE POLICY "Musicians can withdraw" ON applications
  FOR UPDATE USING (musician_id = auth.uid() AND status = 'pending');
CREATE POLICY "Posters can accept/reject" ON applications
  FOR UPDATE USING (
    gig_id IN (SELECT id FROM gigs WHERE posted_by = auth.uid()) OR is_admin()
  );

-- Auto-create user record on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'musician')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
