-- Cleanup companion for demo_test_data.sql
-- Run with:  psql "$DATABASE_URL" -f backend/seeds/demo_cleanup.sql

CREATE TEMP TABLE seed_constants AS
SELECT
  '11111111-1111-1111-1111-111111111111'::uuid AS school_id,
  ARRAY[
    '33333333-3333-3333-3333-333333333333'::uuid,
    '33333333-3333-3333-3333-444444444444'::uuid
  ]::uuid[] AS student_ids,
  ARRAY[
    '22222222-2222-2222-2222-222222222222'::uuid
  ]::uuid[] AS parent_ids,
  ARRAY[
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1'::uuid,
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2'::uuid
  ]::uuid[] AS category_ids,
  ARRAY[
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1'::uuid,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2'::uuid,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3'::uuid,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4'::uuid
  ]::uuid[] AS item_ids,
  ARRAY[
    'cccccccc-cccc-cccc-cccc-ccccccccccc1'::uuid,
    'cccccccc-cccc-cccc-cccc-ccccccccccc2'::uuid
  ]::uuid[] AS order_ids,
  ARRAY[
    'dddddddd-dddd-dddd-dddd-ddddddddddd1'::uuid
  ]::uuid[] AS payment_ids;

DELETE FROM payments
WHERE payment_id = ANY((SELECT payment_ids FROM seed_constants)::uuid[]);

DELETE FROM order_items
WHERE order_id = ANY((SELECT order_ids FROM seed_constants)::uuid[]);

DELETE FROM orders
WHERE order_id = ANY((SELECT order_ids FROM seed_constants)::uuid[]);

DELETE FROM menu_items
WHERE item_id = ANY((SELECT item_ids FROM seed_constants)::uuid[]);

DELETE FROM menu_categories
WHERE category_id = ANY((SELECT category_ids FROM seed_constants)::uuid[]);

DELETE FROM parent_children
WHERE school_id = (SELECT school_id FROM seed_constants)
  AND (parent_id = ANY((SELECT parent_ids FROM seed_constants)::uuid[])
       OR student_id = ANY((SELECT student_ids FROM seed_constants)::uuid[]));

DELETE FROM parents
WHERE parent_id = ANY((SELECT parent_ids FROM seed_constants)::uuid[]);

DELETE FROM students
WHERE student_id = ANY((SELECT student_ids FROM seed_constants)::uuid[]);

DELETE FROM school_settings
WHERE school_id = (SELECT school_id FROM seed_constants);

DELETE FROM schools
WHERE school_id = (SELECT school_id FROM seed_constants);

DROP TABLE IF EXISTS seed_constants;
