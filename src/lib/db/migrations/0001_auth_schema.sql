-- MOCK AUTH SCHEMA FOR LOCAL ENVIRONMENT COMPATIBILITY
CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE IF NOT EXISTS auth.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  raw_user_meta_data JSONB
);

-- TRIGGER FUNCTION FOR AUTO-CREATING PROFILES ROW ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', 'Valued Customer'), 'customer')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- BIND TRIGGER TO AUTH.USERS TABLE
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ENABLE ROW LEVEL SECURITY (RLS) ON USER-FACING TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_ride_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installment_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- EXPLICIT RLS POLICIES
-- Profiles Policy
DROP POLICY IF EXISTS "User owns profile" ON public.profiles;
CREATE POLICY "User owns profile" ON public.profiles
  FOR ALL TO public
  USING (auth.uid() = id);

-- Leads Policy (anyone can submit a lead, only admin/assigned dealer can read/write)
DROP POLICY IF EXISTS "Anyone can create leads" ON public.leads;
CREATE POLICY "Anyone can create leads" ON public.leads
  FOR INSERT TO public
  WITH CHECK (true);

-- Bookings Policy
DROP POLICY IF EXISTS "Users can view own bookings" ON public.test_ride_bookings;
CREATE POLICY "Users can view own bookings" ON public.test_ride_bookings
  FOR SELECT TO public
  USING (auth.uid() = user_id);

-- Reservations Policy
DROP POLICY IF EXISTS "Users can view own reservations" ON public.reservations;
CREATE POLICY "Users can view own reservations" ON public.reservations
  FOR SELECT TO public
  USING (auth.uid() = user_id);

-- Installment Applications Policy
DROP POLICY IF EXISTS "Users can view own applications" ON public.installment_applications;
CREATE POLICY "Users can view own applications" ON public.installment_applications
  FOR SELECT TO public
  USING (auth.uid() = user_id);

-- Reviews Policy (public select for approved reviews, anyone can insert)
DROP POLICY IF EXISTS "Public select approved reviews" ON public.reviews;
CREATE POLICY "Public select approved reviews" ON public.reviews
  FOR SELECT TO public
  USING (is_approved = true);

DROP POLICY IF EXISTS "Anyone can write reviews" ON public.reviews;
CREATE POLICY "Anyone can write reviews" ON public.reviews
  FOR INSERT TO public
  WITH CHECK (true);
