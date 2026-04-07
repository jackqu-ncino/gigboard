-- ============================================
-- FEATURED GIGS & PREMIUM PROFILES
-- ============================================

-- Add featured flag to gigs
ALTER TABLE gigs ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE gigs ADD COLUMN featured_until TIMESTAMPTZ;

-- Add premium flag to users (account-level, applies to their profile)
ALTER TABLE users ADD COLUMN is_premium BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN premium_until TIMESTAMPTZ;

-- Index for quickly finding featured/premium items
CREATE INDEX idx_gigs_featured ON gigs(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_users_premium ON users(is_premium) WHERE is_premium = TRUE;

-- Stripe customer tracking (so we can link Supabase users to Stripe customers)
ALTER TABLE users ADD COLUMN stripe_customer_id TEXT;
CREATE UNIQUE INDEX idx_users_stripe_customer ON users(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;
