-- Demo test data to cover parent ordering flows and admin reporting.
-- Run with:  psql "$DATABASE_URL" -f backend/seeds/demo_test_data.sql

BEGIN;

-- Canonical identifiers so this seed can be re-run or cleaned up easily.
WITH constants AS (
  SELECT
    '00000000-0000-0000-0000-000000000001'::uuid AS owner_id,
    '11111111-1111-1111-1111-111111111111'::uuid AS school_id,
    '22222222-2222-2222-2222-222222222222'::uuid AS parent_id,
    '33333333-3333-3333-3333-333333333333'::uuid AS student_a_id,
    '33333333-3333-3333-3333-444444444444'::uuid AS student_b_id,
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1'::uuid AS breakfast_cat_id,
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2'::uuid AS lunch_cat_id,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1'::uuid AS idli_item_id,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2'::uuid AS dosa_item_id,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3'::uuid AS thali_item_id,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4'::uuid AS wrap_item_id,
    'cccccccc-cccc-cccc-cccc-ccccccccccc1'::uuid AS order_today_id,
    'cccccccc-cccc-cccc-cccc-ccccccccccc2'::uuid AS order_tomorrow_id,
    'dddddddd-dddd-dddd-dddd-ddddddddddd1'::uuid AS payment_id
)
INSERT INTO schools (
  school_id, owner_id, school_code, name,
  address_line1, address_line2, city, state, postal_code, country, status,
  created_at, updated_at, created_by, updated_by
)
SELECT
  school_id,
  owner_id,
  'TEST01',
  'Green Valley Public School',
  '123 Demo Street',
  'Medavakkam',
  'Chennai',
  'Tamil Nadu',
  '600100',
  'IN',
  'trial',
  NOW(),
  NOW(),
  NULL,
  NULL
FROM constants
ON CONFLICT (school_id) DO UPDATE
SET name = EXCLUDED.name,
    school_code = EXCLUDED.school_code,
    updated_at = NOW();

INSERT INTO school_settings (
  school_id, theme_primary, theme_accent, logo_url,
  cutoff_time, timezone, support_contact, trial_expires_at,
  subscription_plan, created_at, updated_at, created_by, updated_by
)
SELECT
  school_id,
  '#2563EB',
  '#F97316',
  'https://cdn.example.com/logos/green-valley.png',
  TIME WITH TIME ZONE '09:00:00+05:30',
  'Asia/Kolkata',
  jsonb_build_object('email', 'support@greenvalley.test', 'phone', '+91-98765-00000'),
  (NOW() + INTERVAL '30 days'),
  'trial',
  NOW(),
  NOW(),
  NULL,
  NULL
FROM constants
ON CONFLICT (school_id) DO UPDATE
SET theme_primary = EXCLUDED.theme_primary,
    theme_accent = EXCLUDED.theme_accent,
    cutoff_time = EXCLUDED.cutoff_time,
    timezone = EXCLUDED.timezone,
    updated_at = NOW();

INSERT INTO parents (
  parent_id, school_id, name, mobile, email, status,
  created_at, updated_at, created_by, updated_by
)
SELECT
  parent_id,
  school_id,
  'Lakshmi Narayanan',
  '9876000001',
  'lakshmi.parent@test.com',
  'active',
  NOW(),
  NOW(),
  NULL,
  NULL
FROM constants
ON CONFLICT (parent_id) DO UPDATE
SET name = EXCLUDED.name,
    mobile = EXCLUDED.mobile,
    updated_at = NOW();

INSERT INTO students (
  student_id, school_id, name, roll_number, class_name, section,
  photo_url, is_active, allergy_flags,
  created_at, updated_at, created_by, updated_by
)
SELECT
  student_a_id,
  school_id,
  'Aadhya Narayanan',
  '3A-017',
  'Grade 3',
  'A',
  NULL,
  TRUE,
  ARRAY['nuts'],
  NOW(),
  NOW(),
  NULL,
  NULL
FROM constants
ON CONFLICT (student_id) DO UPDATE
SET name = EXCLUDED.name,
    class_name = EXCLUDED.class_name,
    section = EXCLUDED.section,
    updated_at = NOW();

INSERT INTO students (
  student_id, school_id, name, roll_number, class_name, section,
  photo_url, is_active, allergy_flags,
  created_at, updated_at, created_by, updated_by
)
SELECT
  student_b_id,
  school_id,
  'Dev Narayanan',
  '5B-011',
  'Grade 5',
  'B',
  NULL,
  TRUE,
  ARRAY['gluten'],
  NOW(),
  NOW(),
  NULL,
  NULL
FROM constants
ON CONFLICT (student_id) DO UPDATE
SET name = EXCLUDED.name,
    class_name = EXCLUDED.class_name,
    section = EXCLUDED.section,
    updated_at = NOW();

INSERT INTO parent_children (parent_id, student_id, school_id, relationship)
SELECT parent_id, student_a_id, school_id, 'mother' FROM constants
ON CONFLICT (parent_id, student_id) DO NOTHING;

INSERT INTO parent_children (parent_id, student_id, school_id, relationship)
SELECT parent_id, student_b_id, school_id, 'mother' FROM constants
ON CONFLICT (parent_id, student_id) DO NOTHING;

INSERT INTO menu_categories (
  category_id, school_id, name, type, description,
  created_at, updated_at, created_by, updated_by
)
SELECT
  breakfast_cat_id,
  school_id,
  'Breakfast Specials',
  'south_indian',
  'Light south Indian breakfast options',
  NOW(),
  NOW(),
  NULL,
  NULL
FROM constants
ON CONFLICT (category_id) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    updated_at = NOW();

INSERT INTO menu_categories (
  category_id, school_id, name, type, description,
  created_at, updated_at, created_by, updated_by
)
SELECT
  lunch_cat_id,
  school_id,
  'Lunch Classics',
  'north_indian',
  'Wholesome lunch combos',
  NOW(),
  NOW(),
  NULL,
  NULL
FROM constants
ON CONFLICT (category_id) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    updated_at = NOW();

INSERT INTO menu_items (
  item_id, school_id, category_id, name, description,
  price, currency, nutrition, allergens, availability, image_url,
  is_active, created_at, updated_at, created_by, updated_by
)
SELECT
  idli_item_id,
  school_id,
  breakfast_cat_id,
  'Idli & Sambar',
  'Steamed idlis with hot sambar',
  45.00,
  'INR',
  jsonb_build_object('calories', 180, 'protein_g', 6),
  ARRAY['nuts'],
  jsonb_build_object('days', ARRAY['Mon','Tue','Wed','Thu','Fri']),
  'https://cdn.example.com/menu/idli.png',
  TRUE,
  NOW(),
  NOW(),
  NULL,
  NULL
FROM constants
ON CONFLICT (item_id) DO UPDATE
SET name = EXCLUDED.name,
    price = EXCLUDED.price,
    updated_at = NOW();

INSERT INTO menu_items (
  item_id, school_id, category_id, name, description,
  price, currency, nutrition, allergens, availability, image_url,
  is_active, created_at, updated_at, created_by, updated_by
)
SELECT
  dosa_item_id,
  school_id,
  breakfast_cat_id,
  'Masala Dosa',
  'Crispy dosa with potato masala',
  65.00,
  'INR',
  jsonb_build_object('calories', 250, 'protein_g', 7),
  ARRAY['gluten'],
  jsonb_build_object('days', ARRAY['Mon','Wed','Fri']),
  'https://cdn.example.com/menu/dosa.png',
  TRUE,
  NOW(),
  NOW(),
  NULL,
  NULL
FROM constants
ON CONFLICT (item_id) DO UPDATE
SET name = EXCLUDED.name,
    price = EXCLUDED.price,
    updated_at = NOW();

INSERT INTO menu_items (
  item_id, school_id, category_id, name, description,
  price, currency, nutrition, allergens, availability, image_url,
  is_active, created_at, updated_at, created_by, updated_by
)
SELECT
  thali_item_id,
  school_id,
  lunch_cat_id,
  'Mini Veg Thali',
  'Rice, roti, dal, sabzi combo',
  120.00,
  'INR',
  jsonb_build_object('calories', 420, 'protein_g', 12),
  ARRAY['gluten'],
  jsonb_build_object('days', ARRAY['Mon','Tue','Wed','Thu','Fri']),
  'https://cdn.example.com/menu/thali.png',
  TRUE,
  NOW(),
  NOW(),
  NULL,
  NULL
FROM constants
ON CONFLICT (item_id) DO UPDATE
SET name = EXCLUDED.name,
    price = EXCLUDED.price,
    updated_at = NOW();

INSERT INTO menu_items (
  item_id, school_id, category_id, name, description,
  price, currency, nutrition, allergens, availability, image_url,
  is_active, created_at, updated_at, created_by, updated_by
)
SELECT
  wrap_item_id,
  school_id,
  lunch_cat_id,
  'Paneer Wrap',
  'Soft wrap with paneer tikka',
  90.00,
  'INR',
  jsonb_build_object('calories', 350, 'protein_g', 14),
  ARRAY['gluten','lactose'],
  jsonb_build_object('days', ARRAY['Tue','Thu']),
  'https://cdn.example.com/menu/wrap.png',
  TRUE,
  NOW(),
  NOW(),
  NULL,
  NULL
FROM constants
ON CONFLICT (item_id) DO UPDATE
SET name = EXCLUDED.name,
    price = EXCLUDED.price,
    updated_at = NOW();

-- Orders to power both parent history and admin dashboard widgets.
INSERT INTO orders (
  order_id, school_id, student_id, parent_id,
  status, payment_status, service_date, special_instructions,
  cut_off_locked, total_amount, currency,
  created_at, updated_at, created_by, updated_by
) SELECT
  order_today_id,
  school_id,
  student_a_id,
  parent_id,
  'confirmed',
  'paid',
  CURRENT_DATE,
  'Please add extra chutney',
  FALSE,
  210.00,
  'INR',
  NOW(),
  NOW(),
  NULL,
  NULL
FROM constants
ON CONFLICT (order_id) DO UPDATE
SET status = EXCLUDED.status,
    payment_status = EXCLUDED.payment_status,
    service_date = EXCLUDED.service_date,
    total_amount = EXCLUDED.total_amount,
    updated_at = NOW();

INSERT INTO orders (
  order_id, school_id, student_id, parent_id,
  status, payment_status, service_date, special_instructions,
  cut_off_locked, total_amount, currency,
  created_at, updated_at, created_by, updated_by
) SELECT
  order_tomorrow_id,
  school_id,
  student_b_id,
  parent_id,
  'pending',
  'pending',
  (CURRENT_DATE + INTERVAL '1 day')::date,
  NULL,
  FALSE,
  155.00,
  'INR',
  NOW(),
  NOW(),
  NULL,
  NULL
FROM constants
ON CONFLICT (order_id) DO UPDATE
SET status = EXCLUDED.status,
    payment_status = EXCLUDED.payment_status,
    service_date = EXCLUDED.service_date,
    total_amount = EXCLUDED.total_amount,
    updated_at = NOW();

INSERT INTO order_items (
  order_item_id, order_id, school_id, menu_item_id,
  name_snapshot, unit_price, quantity, preferences,
  created_at, updated_at, created_by, updated_by
) SELECT
  gen_random_uuid(),
  order_today_id,
  school_id,
  idli_item_id,
  'Idli & Sambar',
  45.00,
  2,
  ARRAY['extra chutney'],
  NOW(),
  NOW(),
  NULL,
  NULL
FROM constants
ON CONFLICT DO NOTHING;

INSERT INTO order_items (
  order_item_id, order_id, school_id, menu_item_id,
  name_snapshot, unit_price, quantity, preferences,
  created_at, updated_at, created_by, updated_by
) SELECT
  gen_random_uuid(),
  order_today_id,
  school_id,
  thali_item_id,
  'Mini Veg Thali',
  120.00,
  1,
  ARRAY[]::text[],
  NOW(),
  NOW(),
  NULL,
  NULL
FROM constants
ON CONFLICT DO NOTHING;

INSERT INTO order_items (
  order_item_id, order_id, school_id, menu_item_id,
  name_snapshot, unit_price, quantity, preferences,
  created_at, updated_at, created_by, updated_by
) SELECT
  gen_random_uuid(),
  order_tomorrow_id,
  school_id,
  dosa_item_id,
  'Masala Dosa',
  65.00,
  1,
  ARRAY['less oil'],
  NOW(),
  NOW(),
  NULL,
  NULL
FROM constants
ON CONFLICT DO NOTHING;

INSERT INTO order_items (
  order_item_id, order_id, school_id, menu_item_id,
  name_snapshot, unit_price, quantity, preferences,
  created_at, updated_at, created_by, updated_by
) SELECT
  gen_random_uuid(),
  order_tomorrow_id,
  school_id,
  wrap_item_id,
  'Paneer Wrap',
  90.00,
  1,
  ARRAY[]::text[],
  NOW(),
  NOW(),
  NULL,
  NULL
FROM constants
ON CONFLICT DO NOTHING;

INSERT INTO payments (
  payment_id, school_id, order_id, method, status,
  amount, transaction_ref, paid_at,
  created_at, updated_at, created_by, updated_by
) SELECT
  payment_id,
  school_id,
  order_today_id,
  'gpay_upi',
  'paid',
  210.00,
  'TXN-GPAY-123456',
  NOW(),
  NOW(),
  NOW(),
  NULL,
  NULL
FROM constants
ON CONFLICT (payment_id) DO UPDATE
SET status = EXCLUDED.status,
    amount = EXCLUDED.amount,
    transaction_ref = EXCLUDED.transaction_ref,
    paid_at = EXCLUDED.paid_at,
    updated_at = NOW();

COMMIT;
