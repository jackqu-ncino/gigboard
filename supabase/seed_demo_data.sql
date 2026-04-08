-- ============================================
-- GIGBOARD DEMO SEED DATA
-- 20 users (10 musicians, 10 gig posters)
-- 30 gigs (5 featured)
-- 10 musician profiles (3 premium)
-- ============================================
-- Run this in Supabase SQL Editor
-- Password for all demo users: DemoPass123!

-- ============================================
-- 1. CREATE AUTH USERS
-- ============================================

INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at)
VALUES
  -- Musicians (m1-m10)
  ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'sarah.guitar@demo.com',    crypt('DemoPass123!', gen_salt('bf')), NOW(), '{"full_name":"Sarah Chen","role":"musician"}'::jsonb,      'authenticated', 'authenticated', NOW() - INTERVAL '45 days', NOW()),
  ('a0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'mike.drums@demo.com',      crypt('DemoPass123!', gen_salt('bf')), NOW(), '{"full_name":"Mike Johnson","role":"musician"}'::jsonb,    'authenticated', 'authenticated', NOW() - INTERVAL '40 days', NOW()),
  ('a0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'jazz.keys@demo.com',       crypt('DemoPass123!', gen_salt('bf')), NOW(), '{"full_name":"Diana Ross-Williams","role":"musician"}'::jsonb, 'authenticated', 'authenticated', NOW() - INTERVAL '38 days', NOW()),
  ('a0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'carlos.bass@demo.com',     crypt('DemoPass123!', gen_salt('bf')), NOW(), '{"full_name":"Carlos Rivera","role":"musician"}'::jsonb,   'authenticated', 'authenticated', NOW() - INTERVAL '35 days', NOW()),
  ('a0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'emma.vocals@demo.com',     crypt('DemoPass123!', gen_salt('bf')), NOW(), '{"full_name":"Emma Thompson","role":"musician"}'::jsonb,   'authenticated', 'authenticated', NOW() - INTERVAL '30 days', NOW()),
  ('a0000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000000', 'jamal.sax@demo.com',       crypt('DemoPass123!', gen_salt('bf')), NOW(), '{"full_name":"Jamal Washington","role":"musician"}'::jsonb,'authenticated', 'authenticated', NOW() - INTERVAL '28 days', NOW()),
  ('a0000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000000', 'lily.violin@demo.com',     crypt('DemoPass123!', gen_salt('bf')), NOW(), '{"full_name":"Lily Park","role":"musician"}'::jsonb,       'authenticated', 'authenticated', NOW() - INTERVAL '25 days', NOW()),
  ('a0000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000000', 'tommy.dj@demo.com',        crypt('DemoPass123!', gen_salt('bf')), NOW(), '{"full_name":"Tommy Nguyen","role":"musician"}'::jsonb,    'authenticated', 'authenticated', NOW() - INTERVAL '22 days', NOW()),
  ('a0000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000000', 'rachel.folk@demo.com',     crypt('DemoPass123!', gen_salt('bf')), NOW(), '{"full_name":"Rachel Adams","role":"musician"}'::jsonb,    'authenticated', 'authenticated', NOW() - INTERVAL '20 days', NOW()),
  ('a0000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000000', 'marcus.trumpet@demo.com',  crypt('DemoPass123!', gen_salt('bf')), NOW(), '{"full_name":"Marcus Brown","role":"musician"}'::jsonb,    'authenticated', 'authenticated', NOW() - INTERVAL '18 days', NOW()),
  -- Gig Posters (p1-p10)
  ('b0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'blue.note@demo.com',       crypt('DemoPass123!', gen_salt('bf')), NOW(), '{"full_name":"The Blue Note Club","role":"poster"}'::jsonb,    'authenticated', 'authenticated', NOW() - INTERVAL '50 days', NOW()),
  ('b0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'riverside@demo.com',       crypt('DemoPass123!', gen_salt('bf')), NOW(), '{"full_name":"Riverside Amphitheater","role":"poster"}'::jsonb,'authenticated', 'authenticated', NOW() - INTERVAL '48 days', NOW()),
  ('b0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'mason.events@demo.com',    crypt('DemoPass123!', gen_salt('bf')), NOW(), '{"full_name":"Mason & Co Events","role":"poster"}'::jsonb,    'authenticated', 'authenticated', NOW() - INTERVAL '46 days', NOW()),
  ('b0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'sunset.bar@demo.com',      crypt('DemoPass123!', gen_salt('bf')), NOW(), '{"full_name":"Sunset Bar & Grill","role":"poster"}'::jsonb,   'authenticated', 'authenticated', NOW() - INTERVAL '44 days', NOW()),
  ('b0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'city.fest@demo.com',       crypt('DemoPass123!', gen_salt('bf')), NOW(), '{"full_name":"City Music Festival","role":"poster"}'::jsonb,   'authenticated', 'authenticated', NOW() - INTERVAL '42 days', NOW()),
  ('b0000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000000', 'oak.church@demo.com',      crypt('DemoPass123!', gen_salt('bf')), NOW(), '{"full_name":"Oak Street Church","role":"poster"}'::jsonb,    'authenticated', 'authenticated', NOW() - INTERVAL '40 days', NOW()),
  ('b0000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000000', 'luna.lounge@demo.com',     crypt('DemoPass123!', gen_salt('bf')), NOW(), '{"full_name":"Luna Lounge","role":"poster"}'::jsonb,          'authenticated', 'authenticated', NOW() - INTERVAL '38 days', NOW()),
  ('b0000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000000', 'harbour.hotel@demo.com',   crypt('DemoPass123!', gen_salt('bf')), NOW(), '{"full_name":"Harbour Grand Hotel","role":"poster"}'::jsonb,  'authenticated', 'authenticated', NOW() - INTERVAL '36 days', NOW()),
  ('b0000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000000', 'indie.records@demo.com',   crypt('DemoPass123!', gen_salt('bf')), NOW(), '{"full_name":"Indie Records Studio","role":"poster"}'::jsonb, 'authenticated', 'authenticated', NOW() - INTERVAL '34 days', NOW()),
  ('b0000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000000', 'park.events@demo.com',     crypt('DemoPass123!', gen_salt('bf')), NOW(), '{"full_name":"Central Park Events","role":"poster"}'::jsonb,  'authenticated', 'authenticated', NOW() - INTERVAL '32 days', NOW());

-- Auth identities (required by Supabase auth)
INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
SELECT id, id, id, json_build_object('sub', id, 'email', email)::jsonb, 'email', NOW(), NOW(), NOW()
FROM auth.users WHERE id IN (
  'a0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000004','a0000000-0000-0000-0000-000000000005','a0000000-0000-0000-0000-000000000006',
  'a0000000-0000-0000-0000-000000000007','a0000000-0000-0000-0000-000000000008','a0000000-0000-0000-0000-000000000009',
  'a0000000-0000-0000-0000-000000000010',
  'b0000000-0000-0000-0000-000000000001','b0000000-0000-0000-0000-000000000002','b0000000-0000-0000-0000-000000000003',
  'b0000000-0000-0000-0000-000000000004','b0000000-0000-0000-0000-000000000005','b0000000-0000-0000-0000-000000000006',
  'b0000000-0000-0000-0000-000000000007','b0000000-0000-0000-0000-000000000008','b0000000-0000-0000-0000-000000000009',
  'b0000000-0000-0000-0000-000000000010'
);

-- ============================================
-- 2. UPDATE PREMIUM MUSICIANS
-- ============================================

UPDATE users SET is_premium = TRUE, premium_until = NOW() + INTERVAL '30 days'
WHERE id IN (
  'a0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000006'
);

-- ============================================
-- 3. MUSICIAN PROFILES
-- ============================================

INSERT INTO profiles (id, user_id, bio, experience, city, state, availability, rate_min, rate_max, is_published) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
   'Lead guitarist with 12 years of stage experience. Toured with indie bands across the West Coast. Comfortable with rock, blues, and jazz styles. Available for studio sessions and live performances.',
   'professional', 'Los Angeles', 'CA', 'Weekends & evenings', 75, 150, TRUE),
  ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002',
   'Versatile drummer who can hold down any groove from jazz brushwork to heavy rock. Session musician with credits on 20+ albums. Own full kit and electronic setup.',
   'professional', 'Nashville', 'TN', 'Full-time available', 80, 175, TRUE),
  ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003',
   'Classically trained pianist turned jazz keyboardist. Berklee College of Music graduate. Specialize in jazz, gospel, and R&B. Also comfortable with synth and organ.',
   'professional', 'New York', 'NY', 'Weekday evenings & weekends', 100, 200, TRUE),
  ('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004',
   'Funky bass player with a deep pocket. 8 years gigging in the Austin music scene. Play electric and upright bass. Love funk, R&B, and Latin grooves.',
   'advanced', 'Austin', 'TX', 'Flexible schedule', 60, 120, TRUE),
  ('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005',
   'Powerful vocalist with a 3-octave range. Experience in musical theater, pop covers, and original songwriting. Great stage presence and audience engagement.',
   'advanced', 'Chicago', 'IL', 'Weekends preferred', 65, 130, TRUE),
  ('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000006',
   'Jazz saxophonist and multi-instrumentalist (alto, tenor, soprano sax + clarinet). 15 years performing at jazz clubs and festivals. Available for recording sessions too.',
   'professional', 'New Orleans', 'LA', 'Full-time available', 90, 180, TRUE),
  ('c0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000007',
   'Classically trained violinist now crossing into folk, indie, and film scoring. Member of the city chamber orchestra. Love collaborating with singer-songwriters.',
   'advanced', 'Portland', 'OR', 'Evenings & weekends', 70, 140, TRUE),
  ('c0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000008',
   'DJ and electronic music producer. Specialize in house, techno, and hip-hop sets. Full PA system available. Regular at clubs across Miami. Can also do wedding/corporate events.',
   'advanced', 'Miami', 'FL', 'Nights & weekends', 100, 300, TRUE),
  ('c0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000009',
   'Folk singer-songwriter who plays guitar, banjo, and mandolin. Perform original material and traditional Appalachian music. Cozy coffeehouse vibes are my specialty.',
   'intermediate', 'Asheville', 'NC', 'Flexible', 40, 80, TRUE),
  ('c0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000010',
   'Trumpet player with a background in jazz, funk, and brass band music. 6 years in a New Orleans-style brass band. Also play flugelhorn. Great for horn section work.',
   'advanced', 'Atlanta', 'GA', 'Weekends & some weekdays', 55, 110, TRUE);

-- ============================================
-- 4. PROFILE INSTRUMENTS
-- ============================================

INSERT INTO profile_instruments (profile_id, instrument_id)
SELECT 'c0000000-0000-0000-0000-000000000001'::uuid, id FROM instruments WHERE slug = 'guitar'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000002'::uuid, id FROM instruments WHERE slug = 'drums'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000003'::uuid, id FROM instruments WHERE slug = 'keyboard'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000004'::uuid, id FROM instruments WHERE slug = 'bass'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000005'::uuid, id FROM instruments WHERE slug = 'vocals'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000006'::uuid, id FROM instruments WHERE slug = 'saxophone'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000007'::uuid, id FROM instruments WHERE slug = 'violin'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000008'::uuid, id FROM instruments WHERE slug = 'dj'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000009'::uuid, id FROM instruments WHERE slug = 'guitar'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000009'::uuid, id FROM instruments WHERE slug = 'banjo'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000009'::uuid, id FROM instruments WHERE slug = 'mandolin'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000010'::uuid, id FROM instruments WHERE slug = 'trumpet';

-- ============================================
-- 5. PROFILE GENRES
-- ============================================

INSERT INTO profile_genres (profile_id, genre_id)
SELECT 'c0000000-0000-0000-0000-000000000001'::uuid, id FROM genres WHERE slug = 'rock'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000001'::uuid, id FROM genres WHERE slug = 'blues'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000001'::uuid, id FROM genres WHERE slug = 'jazz'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000002'::uuid, id FROM genres WHERE slug = 'rock'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000002'::uuid, id FROM genres WHERE slug = 'funk'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000002'::uuid, id FROM genres WHERE slug = 'pop'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000003'::uuid, id FROM genres WHERE slug = 'jazz'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000003'::uuid, id FROM genres WHERE slug = 'gospel'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000003'::uuid, id FROM genres WHERE slug = 'rnb-soul'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000004'::uuid, id FROM genres WHERE slug = 'funk'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000004'::uuid, id FROM genres WHERE slug = 'latin'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000004'::uuid, id FROM genres WHERE slug = 'rnb-soul'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000005'::uuid, id FROM genres WHERE slug = 'pop'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000005'::uuid, id FROM genres WHERE slug = 'contemporary'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000005'::uuid, id FROM genres WHERE slug = 'cover-band'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000006'::uuid, id FROM genres WHERE slug = 'jazz'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000006'::uuid, id FROM genres WHERE slug = 'blues'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000006'::uuid, id FROM genres WHERE slug = 'funk'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000007'::uuid, id FROM genres WHERE slug = 'classical'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000007'::uuid, id FROM genres WHERE slug = 'folk'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000007'::uuid, id FROM genres WHERE slug = 'indie'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000008'::uuid, id FROM genres WHERE slug = 'electronic'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000008'::uuid, id FROM genres WHERE slug = 'hip-hop'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000008'::uuid, id FROM genres WHERE slug = 'pop'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000009'::uuid, id FROM genres WHERE slug = 'folk'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000009'::uuid, id FROM genres WHERE slug = 'bluegrass'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000009'::uuid, id FROM genres WHERE slug = 'country'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000010'::uuid, id FROM genres WHERE slug = 'jazz'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000010'::uuid, id FROM genres WHERE slug = 'funk'
UNION ALL SELECT 'c0000000-0000-0000-0000-000000000010'::uuid, id FROM genres WHERE slug = 'rnb-soul';

-- ============================================
-- 6. GIGS (30 total, 5 featured)
-- ============================================

INSERT INTO gigs (id, posted_by, title, description, venue, city, state, gig_date, start_time, end_time, budget, musicians_needed, status, is_featured, featured_until, created_at) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005',
   'Summer Music Festival - Main Stage Performers',
   'Looking for talented musicians to perform on the main stage at our annual Summer Music Festival. This is a high-visibility gig with 5,000+ expected attendees. Professional sound and lighting provided. Multiple time slots available.',
   'Riverfront Park', 'Austin', 'TX', CURRENT_DATE + INTERVAL '60 days', '14:00', '22:00', 2500, 4, 'open',
   TRUE, NOW() + INTERVAL '30 days', NOW() - INTERVAL '3 days'),
  ('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000008',
   'Luxury Hotel Jazz Brunch - Recurring Weekly',
   'Seeking a jazz trio or quartet for our upscale Sunday brunch series. Elegant setting, appreciative crowd, and great tips. This is a recurring weekly gig with potential for long-term booking. Professional attire required.',
   'The Grand Ballroom', 'New York', 'NY', CURRENT_DATE + INTERVAL '14 days', '10:00', '14:00', 800, 3, 'open',
   TRUE, NOW() + INTERVAL '30 days', NOW() - INTERVAL '5 days'),
  ('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003',
   'Corporate Gala - Full Band Needed',
   'Annual corporate gala for a Fortune 500 company. Need a polished 5-piece band that can play a mix of jazz standards, classic rock, and current hits. Black tie event. Dinner service music followed by dance sets.',
   'Harbour Grand Ballroom', 'Chicago', 'IL', CURRENT_DATE + INTERVAL '45 days', '18:00', '23:00', 3500, 5, 'open',
   TRUE, NOW() + INTERVAL '30 days', NOW() - INTERVAL '2 days'),
  ('d0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002',
   'Amphitheater Opening Night - Rock/Indie Acts',
   'Brand new 2,000-seat outdoor amphitheater opening night. Looking for rock and indie bands to headline. Full backline and PA provided. Great exposure opportunity with press coverage.',
   'Riverside Amphitheater', 'Portland', 'OR', CURRENT_DATE + INTERVAL '30 days', '19:00', '23:00', 2000, 4, 'open',
   TRUE, NOW() + INTERVAL '30 days', NOW() - INTERVAL '7 days'),
  ('d0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000003',
   'Destination Wedding - Acoustic Duo/Trio',
   'Beautiful vineyard wedding seeking acoustic musicians for ceremony and cocktail hour. Looking for guitar/violin or similar combo. Romantic, elegant repertoire. Travel and accommodation covered.',
   'Napa Valley Vineyard', 'Napa', 'CA', CURRENT_DATE + INTERVAL '50 days', '15:00', '19:00', 1500, 2, 'open',
   TRUE, NOW() + INTERVAL '30 days', NOW() - INTERVAL '1 day'),
  ('d0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000001',
   'Friday Night Blues Jam',
   'Weekly blues jam at The Blue Note. Looking for a house band (guitar, bass, drums, keys) to anchor the jam session. Guest musicians sit in throughout the night. Relaxed, fun atmosphere.',
   'The Blue Note Club', 'Nashville', 'TN', CURRENT_DATE + INTERVAL '10 days', '20:00', '01:00', 400, 4, 'open',
   FALSE, NULL, NOW() - INTERVAL '8 days'),
  ('d0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000004',
   'Saturday Happy Hour - Solo Acoustic',
   'Chill solo acoustic performer needed for Saturday happy hours. Covers and originals welcome. Think Jack Johnson, John Mayer vibes. Outdoor patio setting.',
   'Sunset Bar & Grill', 'San Diego', 'CA', CURRENT_DATE + INTERVAL '12 days', '16:00', '19:00', 200, 1, 'open',
   FALSE, NULL, NOW() - INTERVAL '6 days'),
  ('d0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000006',
   'Sunday Morning Church Worship Band',
   'Looking for musicians to join our worship team. Need keyboard, guitar, bass, and drums. Contemporary worship style. Rehearsal on Thursday evenings.',
   'Oak Street Church', 'Atlanta', 'GA', CURRENT_DATE + INTERVAL '11 days', '08:00', '12:00', 300, 4, 'open',
   FALSE, NULL, NOW() - INTERVAL '10 days'),
  ('d0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000007',
   'Latin Night - Salsa Band',
   'Monthly Latin Night is back! Need a full salsa/Latin band - congas, timbales, bass, keys, horns, vocals. High-energy dance night. Enthusiastic crowd guaranteed.',
   'Luna Lounge', 'Miami', 'FL', CURRENT_DATE + INTERVAL '21 days', '21:00', '02:00', 600, 6, 'open',
   FALSE, NULL, NOW() - INTERVAL '4 days'),
  ('d0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000009',
   'Studio Session Drummer Needed',
   'Recording a 10-track indie rock album. Need a solid drummer with good feel and dynamics. Pro Tools studio with full mic setup. 3-day session.',
   'Indie Records Studio', 'Los Angeles', 'CA', CURRENT_DATE + INTERVAL '18 days', '10:00', '18:00', 900, 1, 'open',
   FALSE, NULL, NOW() - INTERVAL '3 days'),
  ('d0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000010',
   'Park Concert Series - Folk/Americana',
   'Free outdoor concert series in Central Park. Looking for folk and Americana acts for 45-minute sets. Family-friendly. Sound system provided.',
   'Central Park Bandshell', 'New York', 'NY', CURRENT_DATE + INTERVAL '25 days', '17:00', '20:00', 350, 3, 'open',
   FALSE, NULL, NOW() - INTERVAL '9 days'),
  ('d0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000001',
   'Jazz Quartet for Private Dinner Party',
   'Hosting an intimate dinner party for 30 guests. Need a classy jazz quartet (sax, piano, bass, drums). Great American Songbook plus some bossa nova. Smart casual dress.',
   'Private Residence', 'Nashville', 'TN', CURRENT_DATE + INTERVAL '16 days', '19:00', '22:00', 700, 4, 'open',
   FALSE, NULL, NOW() - INTERVAL '2 days'),
  ('d0000000-0000-0000-0000-000000000013', 'b0000000-0000-0000-0000-000000000004',
   'Beach Party DJ Set',
   'Annual beach party needs a DJ for a 4-hour set. Mix of house, tropical, and top 40. Must bring own equipment. 200+ attendees expected. Sunset setting.',
   'Ocean Beach', 'San Diego', 'CA', CURRENT_DATE + INTERVAL '35 days', '16:00', '20:00', 500, 1, 'open',
   FALSE, NULL, NOW() - INTERVAL '5 days'),
  ('d0000000-0000-0000-0000-000000000014', 'b0000000-0000-0000-0000-000000000002',
   'Open Mic Night Host Band',
   'Need a 3-piece band to host our weekly open mic night. Play short sets between performers, back up singer-songwriters, and keep the energy up. Must be versatile.',
   'Riverside Cafe', 'Portland', 'OR', CURRENT_DATE + INTERVAL '13 days', '19:00', '22:00', 250, 3, 'open',
   FALSE, NULL, NOW() - INTERVAL '11 days'),
  ('d0000000-0000-0000-0000-000000000015', 'b0000000-0000-0000-0000-000000000008',
   'Hotel Lobby Pianist - Evening Shift',
   'Seeking an elegant pianist for evening lobby performances at our 5-star hotel. Classical, jazz standards, and light pop arrangements. Grand piano provided. Recurring opportunity.',
   'Harbour Grand Hotel', 'New York', 'NY', CURRENT_DATE + INTERVAL '9 days', '18:00', '22:00', 350, 1, 'open',
   FALSE, NULL, NOW() - INTERVAL '7 days'),
  ('d0000000-0000-0000-0000-000000000016', 'b0000000-0000-0000-0000-000000000005',
   'Battle of the Bands - Open Registration',
   'Annual Battle of the Bands competition. Prizes for top 3: $2000, $1000, $500. Any genre welcome. Each band gets a 20-minute set. Professional judges panel.',
   'City Music Hall', 'Austin', 'TX', CURRENT_DATE + INTERVAL '40 days', '18:00', '23:00', NULL, 4, 'open',
   FALSE, NULL, NOW() - INTERVAL '6 days'),
  ('d0000000-0000-0000-0000-000000000017', 'b0000000-0000-0000-0000-000000000006',
   'Youth Music Camp Instructors',
   'Summer music camp needs instructors for guitar, drums, and vocals. Teaching kids ages 8-16. 2-week camp, mornings only. Must be patient and encouraging.',
   'Oak Street Community Center', 'Atlanta', 'GA', CURRENT_DATE + INTERVAL '55 days', '09:00', '13:00', 1200, 3, 'open',
   FALSE, NULL, NOW() - INTERVAL '4 days'),
  ('d0000000-0000-0000-0000-000000000018', 'b0000000-0000-0000-0000-000000000007',
   'Funk & Soul Night - Horn Section',
   'Our resident funk band needs a horn section for a special Funk & Soul Night. Trumpet, trombone, and sax. Must be able to read charts and improvise. High-energy show.',
   'Luna Lounge', 'Miami', 'FL', CURRENT_DATE + INTERVAL '22 days', '21:00', '01:00', 450, 3, 'open',
   FALSE, NULL, NOW() - INTERVAL '3 days'),
  ('d0000000-0000-0000-0000-000000000019', 'b0000000-0000-0000-0000-000000000009',
   'Podcast Theme Music Composer',
   'Looking for a musician to compose original theme music for a popular true crime podcast. 30-second intro and 15-second outro. Dark, atmospheric feel. One-time project.',
   'Remote / Indie Records Studio', 'Los Angeles', 'CA', CURRENT_DATE + INTERVAL '20 days', NULL, NULL, 400, 1, 'open',
   FALSE, NULL, NOW() - INTERVAL '1 day'),
  ('d0000000-0000-0000-0000-000000000020', 'b0000000-0000-0000-0000-000000000010',
   'Rooftop Cocktail Party - Jazz Duo',
   'Upscale rooftop cocktail event overlooking the skyline. Need a jazz duo (guitar + vocals, or sax + piano). Mellow, sophisticated vibe. 3-hour set.',
   'Sky Terrace Rooftop', 'New York', 'NY', CURRENT_DATE + INTERVAL '28 days', '18:00', '21:00', 550, 2, 'open',
   FALSE, NULL, NOW() - INTERVAL '2 days'),
  ('d0000000-0000-0000-0000-000000000021', 'b0000000-0000-0000-0000-000000000001',
   'Country Night - Full Band',
   'Monthly country night at The Blue Note. Need fiddle, steel guitar, guitar, bass, and drums. Modern and classic country covers. Line dancing crowd, so keep it upbeat!',
   'The Blue Note Club', 'Nashville', 'TN', CURRENT_DATE + INTERVAL '24 days', '20:00', '00:00', 500, 5, 'open',
   FALSE, NULL, NOW() - INTERVAL '5 days'),
  ('d0000000-0000-0000-0000-000000000022', 'b0000000-0000-0000-0000-000000000004',
   'Brewery Acoustic Afternoon',
   'Craft brewery looking for acoustic performers for Sunday afternoon sessions. Solo or duo. Any style that pairs well with good beer. Relaxed, dog-friendly patio.',
   'Hops & Harmony Brewery', 'San Diego', 'CA', CURRENT_DATE + INTERVAL '15 days', '13:00', '16:00', 175, 1, 'open',
   FALSE, NULL, NOW() - INTERVAL '8 days'),
  ('d0000000-0000-0000-0000-000000000023', 'b0000000-0000-0000-0000-000000000003',
   'Sweet 16 Party - Pop/Dance Band',
   'Fun Sweet 16 birthday party needs a pop/dance band that plays current hits. 3-4 piece band. Energetic and interactive with the crowd. Party runs 4 hours total.',
   'The Lakeside Pavilion', 'Chicago', 'IL', CURRENT_DATE + INTERVAL '32 days', '17:00', '21:00', 650, 4, 'open',
   FALSE, NULL, NOW() - INTERVAL '4 days'),
  ('d0000000-0000-0000-0000-000000000024', 'b0000000-0000-0000-0000-000000000002',
   'Busking Permit Showcase',
   'We are organizing a curated busking showcase downtown. Seeking 10 solo performers or duos for designated spots. All genres welcome. Tips plus flat appearance fee.',
   'Downtown District', 'Portland', 'OR', CURRENT_DATE + INTERVAL '19 days', '11:00', '17:00', 100, 1, 'open',
   FALSE, NULL, NOW() - INTERVAL '6 days'),
  ('d0000000-0000-0000-0000-000000000025', 'b0000000-0000-0000-0000-000000000008',
   'New Years Eve Gala Band',
   'Prestigious New Years Eve gala at the hotel. Need a 6-piece band covering jazz, Motown, and dance hits. Midnight countdown moment. Black tie. Top-tier compensation.',
   'Harbour Grand Hotel', 'New York', 'NY', CURRENT_DATE + INTERVAL '90 days', '20:00', '01:00', 4000, 6, 'open',
   FALSE, NULL, NOW() - INTERVAL '1 day'),
  ('d0000000-0000-0000-0000-000000000026', 'b0000000-0000-0000-0000-000000000006',
   'Gospel Choir Accompanist',
   'Our gospel choir needs a skilled pianist/organist for weekly rehearsals and Sunday services. Must be comfortable with gospel progressions and spontaneous worship.',
   'Oak Street Church', 'Atlanta', 'GA', CURRENT_DATE + INTERVAL '8 days', '09:00', '12:00', 250, 1, 'open',
   FALSE, NULL, NOW() - INTERVAL '9 days'),
  ('d0000000-0000-0000-0000-000000000027', 'b0000000-0000-0000-0000-000000000007',
   'Reggae Sunday Brunch',
   'Tropical vibes needed for our new Sunday Reggae Brunch series. 3-piece reggae/ska band. Steel drums a huge plus. Bottomless mimosas fuel the crowd.',
   'Luna Lounge Patio', 'Miami', 'FL', CURRENT_DATE + INTERVAL '17 days', '11:00', '15:00', 400, 3, 'open',
   FALSE, NULL, NOW() - INTERVAL '3 days'),
  ('d0000000-0000-0000-0000-000000000028', 'b0000000-0000-0000-0000-000000000009',
   'Film Score Recording - String Players',
   'Independent film needs string players for soundtrack recording. Violin, viola, and cello needed. Sight-reading required. 2-day session in professional studio.',
   'Indie Records Studio', 'Los Angeles', 'CA', CURRENT_DATE + INTERVAL '26 days', '10:00', '17:00', 600, 3, 'open',
   FALSE, NULL, NOW() - INTERVAL '2 days'),
  ('d0000000-0000-0000-0000-000000000029', 'b0000000-0000-0000-0000-000000000010',
   'Marathon Finish Line Entertainment',
   'City marathon needs high-energy musicians at the finish line to cheer runners. Drums, brass, and anything loud and celebratory. 6-hour commitment. Outdoor.',
   'Central Park Finish Line', 'New York', 'NY', CURRENT_DATE + INTERVAL '42 days', '07:00', '13:00', 300, 4, 'open',
   FALSE, NULL, NOW() - INTERVAL '7 days'),
  ('d0000000-0000-0000-0000-000000000030', 'b0000000-0000-0000-0000-000000000005',
   'Songwriter Showcase - Original Music Only',
   'Curated songwriter showcase at intimate 100-seat venue. 5 slots available for solo singer-songwriters performing original material. Great networking opportunity with local industry folks.',
   'The Listening Room', 'Austin', 'TX', CURRENT_DATE + INTERVAL '23 days', '19:00', '22:00', 150, 1, 'open',
   FALSE, NULL, NOW() - INTERVAL '4 days');

-- ============================================
-- 7. GIG INSTRUMENTS
-- ============================================

INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000001'::uuid, id, 1 FROM instruments WHERE slug = 'guitar';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000001'::uuid, id, 1 FROM instruments WHERE slug = 'bass';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000001'::uuid, id, 1 FROM instruments WHERE slug = 'drums';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000001'::uuid, id, 1 FROM instruments WHERE slug = 'keyboard';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000002'::uuid, id, 1 FROM instruments WHERE slug = 'saxophone';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000002'::uuid, id, 1 FROM instruments WHERE slug = 'keyboard';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000002'::uuid, id, 1 FROM instruments WHERE slug = 'bass';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000003'::uuid, id, 1 FROM instruments WHERE slug = 'guitar';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000003'::uuid, id, 1 FROM instruments WHERE slug = 'bass';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000003'::uuid, id, 1 FROM instruments WHERE slug = 'drums';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000003'::uuid, id, 1 FROM instruments WHERE slug = 'keyboard';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000003'::uuid, id, 1 FROM instruments WHERE slug = 'vocals';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000004'::uuid, id, 1 FROM instruments WHERE slug = 'guitar';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000004'::uuid, id, 1 FROM instruments WHERE slug = 'bass';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000004'::uuid, id, 1 FROM instruments WHERE slug = 'drums';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000004'::uuid, id, 1 FROM instruments WHERE slug = 'vocals';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000005'::uuid, id, 1 FROM instruments WHERE slug = 'guitar';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000005'::uuid, id, 1 FROM instruments WHERE slug = 'violin';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000006'::uuid, id, 1 FROM instruments WHERE slug = 'guitar';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000006'::uuid, id, 1 FROM instruments WHERE slug = 'bass';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000006'::uuid, id, 1 FROM instruments WHERE slug = 'drums';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000006'::uuid, id, 1 FROM instruments WHERE slug = 'keyboard';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000007'::uuid, id, 1 FROM instruments WHERE slug = 'guitar';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000008'::uuid, id, 1 FROM instruments WHERE slug = 'keyboard';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000008'::uuid, id, 1 FROM instruments WHERE slug = 'guitar';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000008'::uuid, id, 1 FROM instruments WHERE slug = 'bass';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000008'::uuid, id, 1 FROM instruments WHERE slug = 'drums';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000009'::uuid, id, 1 FROM instruments WHERE slug = 'keyboard';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000009'::uuid, id, 1 FROM instruments WHERE slug = 'bass';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000009'::uuid, id, 1 FROM instruments WHERE slug = 'trumpet';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000009'::uuid, id, 1 FROM instruments WHERE slug = 'vocals';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000010'::uuid, id, 1 FROM instruments WHERE slug = 'drums';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000011'::uuid, id, 1 FROM instruments WHERE slug = 'guitar';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000011'::uuid, id, 1 FROM instruments WHERE slug = 'banjo';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000011'::uuid, id, 1 FROM instruments WHERE slug = 'vocals';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000012'::uuid, id, 1 FROM instruments WHERE slug = 'saxophone';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000012'::uuid, id, 1 FROM instruments WHERE slug = 'keyboard';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000012'::uuid, id, 1 FROM instruments WHERE slug = 'bass';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000012'::uuid, id, 1 FROM instruments WHERE slug = 'drums';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000013'::uuid, id, 1 FROM instruments WHERE slug = 'dj';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000014'::uuid, id, 1 FROM instruments WHERE slug = 'guitar';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000014'::uuid, id, 1 FROM instruments WHERE slug = 'bass';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000014'::uuid, id, 1 FROM instruments WHERE slug = 'drums';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000015'::uuid, id, 1 FROM instruments WHERE slug = 'keyboard';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000016'::uuid, id, 1 FROM instruments WHERE slug = 'guitar';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000016'::uuid, id, 1 FROM instruments WHERE slug = 'bass';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000016'::uuid, id, 1 FROM instruments WHERE slug = 'drums';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000016'::uuid, id, 1 FROM instruments WHERE slug = 'vocals';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000017'::uuid, id, 1 FROM instruments WHERE slug = 'guitar';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000017'::uuid, id, 1 FROM instruments WHERE slug = 'drums';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000017'::uuid, id, 1 FROM instruments WHERE slug = 'vocals';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000018'::uuid, id, 1 FROM instruments WHERE slug = 'trumpet';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000018'::uuid, id, 1 FROM instruments WHERE slug = 'trombone';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000018'::uuid, id, 1 FROM instruments WHERE slug = 'saxophone';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000019'::uuid, id, 1 FROM instruments WHERE slug = 'keyboard';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000020'::uuid, id, 1 FROM instruments WHERE slug = 'guitar';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000020'::uuid, id, 1 FROM instruments WHERE slug = 'saxophone';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000021'::uuid, id, 1 FROM instruments WHERE slug = 'fiddle';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000021'::uuid, id, 1 FROM instruments WHERE slug = 'steel-guitar';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000021'::uuid, id, 1 FROM instruments WHERE slug = 'guitar';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000021'::uuid, id, 1 FROM instruments WHERE slug = 'bass';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000021'::uuid, id, 1 FROM instruments WHERE slug = 'drums';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000022'::uuid, id, 1 FROM instruments WHERE slug = 'guitar';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000023'::uuid, id, 1 FROM instruments WHERE slug = 'guitar';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000023'::uuid, id, 1 FROM instruments WHERE slug = 'bass';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000023'::uuid, id, 1 FROM instruments WHERE slug = 'drums';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000023'::uuid, id, 1 FROM instruments WHERE slug = 'vocals';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000024'::uuid, id, 1 FROM instruments WHERE slug = 'guitar';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000025'::uuid, id, 1 FROM instruments WHERE slug = 'guitar';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000025'::uuid, id, 1 FROM instruments WHERE slug = 'bass';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000025'::uuid, id, 1 FROM instruments WHERE slug = 'drums';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000025'::uuid, id, 1 FROM instruments WHERE slug = 'keyboard';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000025'::uuid, id, 1 FROM instruments WHERE slug = 'saxophone';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000025'::uuid, id, 1 FROM instruments WHERE slug = 'vocals';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000026'::uuid, id, 1 FROM instruments WHERE slug = 'keyboard';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000027'::uuid, id, 1 FROM instruments WHERE slug = 'guitar';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000027'::uuid, id, 1 FROM instruments WHERE slug = 'bass';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000027'::uuid, id, 1 FROM instruments WHERE slug = 'drums';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000028'::uuid, id, 1 FROM instruments WHERE slug = 'violin';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000028'::uuid, id, 2 FROM instruments WHERE slug = 'cello';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000029'::uuid, id, 2 FROM instruments WHERE slug = 'drums';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000029'::uuid, id, 1 FROM instruments WHERE slug = 'trumpet';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000029'::uuid, id, 1 FROM instruments WHERE slug = 'trombone';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000030'::uuid, id, 1 FROM instruments WHERE slug = 'guitar';
INSERT INTO gig_instruments (gig_id, instrument_id, quantity) SELECT 'd0000000-0000-0000-0000-000000000030'::uuid, id, 1 FROM instruments WHERE slug = 'vocals';

-- ============================================
-- 8. GIG GENRES
-- ============================================

INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000001'::uuid, id FROM genres WHERE slug = 'rock';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000001'::uuid, id FROM genres WHERE slug = 'indie';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000001'::uuid, id FROM genres WHERE slug = 'pop';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000002'::uuid, id FROM genres WHERE slug = 'jazz';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000003'::uuid, id FROM genres WHERE slug = 'jazz';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000003'::uuid, id FROM genres WHERE slug = 'rock';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000003'::uuid, id FROM genres WHERE slug = 'cover-band';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000004'::uuid, id FROM genres WHERE slug = 'rock';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000004'::uuid, id FROM genres WHERE slug = 'indie';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000005'::uuid, id FROM genres WHERE slug = 'wedding-event';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000005'::uuid, id FROM genres WHERE slug = 'classical';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000005'::uuid, id FROM genres WHERE slug = 'folk';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000006'::uuid, id FROM genres WHERE slug = 'blues';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000007'::uuid, id FROM genres WHERE slug = 'pop';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000007'::uuid, id FROM genres WHERE slug = 'folk';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000007'::uuid, id FROM genres WHERE slug = 'contemporary';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000008'::uuid, id FROM genres WHERE slug = 'gospel';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000008'::uuid, id FROM genres WHERE slug = 'contemporary';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000009'::uuid, id FROM genres WHERE slug = 'latin';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000010'::uuid, id FROM genres WHERE slug = 'rock';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000010'::uuid, id FROM genres WHERE slug = 'indie';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000011'::uuid, id FROM genres WHERE slug = 'folk';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000011'::uuid, id FROM genres WHERE slug = 'bluegrass';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000012'::uuid, id FROM genres WHERE slug = 'jazz';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000013'::uuid, id FROM genres WHERE slug = 'electronic';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000013'::uuid, id FROM genres WHERE slug = 'pop';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000013'::uuid, id FROM genres WHERE slug = 'hip-hop';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000014'::uuid, id FROM genres WHERE slug = 'rock';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000014'::uuid, id FROM genres WHERE slug = 'folk';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000014'::uuid, id FROM genres WHERE slug = 'pop';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000015'::uuid, id FROM genres WHERE slug = 'jazz';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000015'::uuid, id FROM genres WHERE slug = 'classical';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000015'::uuid, id FROM genres WHERE slug = 'pop';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000016'::uuid, id FROM genres WHERE slug = 'other';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000017'::uuid, id FROM genres WHERE slug = 'rock';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000017'::uuid, id FROM genres WHERE slug = 'pop';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000017'::uuid, id FROM genres WHERE slug = 'contemporary';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000018'::uuid, id FROM genres WHERE slug = 'funk';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000018'::uuid, id FROM genres WHERE slug = 'rnb-soul';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000019'::uuid, id FROM genres WHERE slug = 'other';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000020'::uuid, id FROM genres WHERE slug = 'jazz';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000021'::uuid, id FROM genres WHERE slug = 'country';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000022'::uuid, id FROM genres WHERE slug = 'folk';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000022'::uuid, id FROM genres WHERE slug = 'pop';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000022'::uuid, id FROM genres WHERE slug = 'contemporary';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000023'::uuid, id FROM genres WHERE slug = 'pop';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000023'::uuid, id FROM genres WHERE slug = 'hip-hop';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000023'::uuid, id FROM genres WHERE slug = 'contemporary';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000024'::uuid, id FROM genres WHERE slug = 'other';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000025'::uuid, id FROM genres WHERE slug = 'jazz';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000025'::uuid, id FROM genres WHERE slug = 'rnb-soul';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000025'::uuid, id FROM genres WHERE slug = 'pop';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000025'::uuid, id FROM genres WHERE slug = 'cover-band';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000026'::uuid, id FROM genres WHERE slug = 'gospel';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000027'::uuid, id FROM genres WHERE slug = 'reggae';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000028'::uuid, id FROM genres WHERE slug = 'classical';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000029'::uuid, id FROM genres WHERE slug = 'funk';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000029'::uuid, id FROM genres WHERE slug = 'other';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000030'::uuid, id FROM genres WHERE slug = 'folk';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000030'::uuid, id FROM genres WHERE slug = 'indie';
INSERT INTO gig_genres (gig_id, genre_id) SELECT 'd0000000-0000-0000-0000-000000000030'::uuid, id FROM genres WHERE slug = 'contemporary';

-- ============================================
-- 9. SAMPLE APPLICATIONS
-- ============================================

INSERT INTO applications (gig_id, musician_id, message, status) VALUES
  ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001',
   'I would love to play guitar at your vineyard wedding. I have extensive experience with acoustic ceremony music and cocktail hour sets. Available on the date!', 'pending'),
  ('d0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000002',
   'Professional session drummer here. I have experience recording indie rock albums and am comfortable in studio settings. My kit is ready to go.', 'accepted'),
  ('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003',
   'Berklee-trained jazz pianist here. I specialize in brunch/dinner jazz and know the Great American Songbook inside out. Would be thrilled to play your series.', 'pending'),
  ('d0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000004',
   'Bass player with deep Latin music experience. I have been playing salsa and Latin jazz in Austin for 8 years. Let me lay down the groove!', 'accepted'),
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000005',
   'Versatile vocalist who can handle jazz standards, pop, and rock covers. Great stage presence for corporate events. Professional and reliable.', 'pending'),
  ('d0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000006',
   'Experienced jazz saxophonist perfect for intimate dinner settings. I can lead a quartet or play as a sideman. Bossa nova is one of my specialties.', 'pending'),
  ('d0000000-0000-0000-0000-000000000028', 'a0000000-0000-0000-0000-000000000007',
   'Classical violinist with film scoring experience. I sight-read fluently and have recorded for several indie films. Available for the 2-day session.', 'pending'),
  ('d0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000008',
   'DJ Tommy here! I specialize in beach/outdoor sets with tropical house and danceable top 40 mixes. Full PA system included. Lets make it a party!', 'accepted'),
  ('d0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000009',
   'Folk singer-songwriter based in Asheville. I play guitar, banjo, and mandolin and have a 45-minute set of originals plus traditional folk songs ready to go.', 'pending'),
  ('d0000000-0000-0000-0000-000000000018', 'a0000000-0000-0000-0000-000000000010',
   'Trumpet player with 6 years in a brass band. I can read charts, improvise, and bring the energy. Lets bring the funk!', 'pending');

-- ============================================
-- DONE! Summary:
-- 20 users (password: DemoPass123!)
-- 10 musicians: sarah.guitar@demo.com through marcus.trumpet@demo.com
-- 10 posters: blue.note@demo.com through park.events@demo.com
-- 30 gigs (5 featured: gigs 1-5)
-- 3 premium musicians: Sarah Chen, Diana Ross-Williams, Jamal Washington
-- 10 sample applications
-- ============================================
