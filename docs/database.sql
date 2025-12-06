-- XAndera School Canteen Platform - PostgreSQL DDL
-- Multi-tenant schema with school_id + audit columns everywhere

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ENUMS
CREATE TYPE subscription_plan AS ENUM ('trial', 'standard', 'premium');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE allergy_flag AS ENUM ('nuts', 'gluten', 'lactose', 'spicy');

-- CORE TABLES
CREATE TABLE schools (
    school_id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id        UUID NOT NULL,
    school_code     TEXT UNIQUE NOT NULL,
    name            TEXT NOT NULL,
    address_line1   TEXT NOT NULL,
    address_line2   TEXT,
    city            TEXT,
    state           TEXT,
    postal_code     TEXT,
    country         TEXT DEFAULT 'IN',
    status          TEXT NOT NULL DEFAULT 'trial',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID,
    updated_by      UUID
);

CREATE TABLE school_settings (
    school_id       UUID PRIMARY KEY REFERENCES schools (school_id) ON DELETE CASCADE,
    theme_primary   TEXT,
    theme_accent    TEXT,
    logo_url        TEXT,
    cutoff_time     TIME WITH TIME ZONE DEFAULT '09:00+05:30',
    timezone        TEXT DEFAULT 'Asia/Kolkata',
    support_contact JSONB,
    trial_expires_at TIMESTAMPTZ,
    subscription_plan subscription_plan DEFAULT 'trial',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID,
    updated_by      UUID
);

CREATE TABLE subscriptions (
    subscription_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id       UUID NOT NULL REFERENCES schools (school_id) ON DELETE CASCADE,
    plan            subscription_plan NOT NULL,
    status          TEXT NOT NULL DEFAULT 'active',
    started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    ends_at         TIMESTAMPTZ,
    metadata        JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID,
    updated_by      UUID
);

CREATE TABLE parents (
    parent_id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id       UUID NOT NULL,
    name            TEXT,
    mobile          TEXT NOT NULL,
    email           TEXT,
    status          TEXT DEFAULT 'active',
    firebase_uid    TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID,
    updated_by      UUID
);

CREATE TABLE students (
    student_id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id       UUID NOT NULL,
    name            TEXT NOT NULL,
    roll_number     TEXT,
    class_name      TEXT,
    section         TEXT,
    photo_url       TEXT,
    is_active       BOOLEAN DEFAULT true,
    allergy_flags   allergy_flag[] DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID,
    updated_by      UUID
);

CREATE TABLE parent_children (
    parent_id   UUID REFERENCES parents(parent_id) ON DELETE CASCADE,
    student_id  UUID REFERENCES students(student_id) ON DELETE CASCADE,
    school_id   UUID NOT NULL,
    relationship TEXT,
    PRIMARY KEY (parent_id, student_id)
);

CREATE TABLE menu_categories (
    category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id   UUID NOT NULL,
    name        TEXT NOT NULL,
    type        TEXT NOT NULL,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by  UUID,
    updated_by  UUID
);

CREATE TABLE menu_items (
    item_id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id       UUID NOT NULL,
    category_id     UUID NOT NULL REFERENCES menu_categories(category_id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    description     TEXT,
    price           NUMERIC(10,2) NOT NULL,
    currency        TEXT DEFAULT 'INR',
    nutrition       JSONB,
    allergens       allergy_flag[] DEFAULT '{}',
    availability    JSONB,
    version         INTEGER DEFAULT 1,
    image_url       TEXT,
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID,
    updated_by      UUID
);

CREATE TABLE orders (
    order_id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id       UUID NOT NULL,
    student_id      UUID NOT NULL REFERENCES students(student_id),
    parent_id       UUID NOT NULL REFERENCES parents(parent_id),
    status          order_status NOT NULL DEFAULT 'pending',
    payment_status  payment_status NOT NULL DEFAULT 'pending',
    service_date    DATE NOT NULL,
    special_instructions TEXT,
    cut_off_locked  BOOLEAN DEFAULT false,
    total_amount    NUMERIC(10,2) NOT NULL,
    currency        TEXT DEFAULT 'INR',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID,
    updated_by      UUID
);

CREATE TABLE order_items (
    order_item_id   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id        UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    school_id       UUID NOT NULL,
    menu_item_id    UUID NOT NULL,
    name_snapshot   TEXT NOT NULL,
    unit_price      NUMERIC(10,2) NOT NULL,
    quantity        INTEGER NOT NULL,
    preferences     TEXT[],
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE payments (
    payment_id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id       UUID NOT NULL,
    order_id        UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    method          TEXT NOT NULL,
    status          payment_status NOT NULL,
    amount          NUMERIC(10,2) NOT NULL,
    transaction_ref TEXT,
    paid_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID,
    updated_by      UUID
);

CREATE TABLE allergy_flags (
    flag_id     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id   UUID NOT NULL,
    student_id  UUID REFERENCES students(student_id) ON DELETE CASCADE,
    flag        allergy_flag NOT NULL,
    notes       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by  UUID,
    updated_by  UUID
);

CREATE TABLE feedback (
    feedback_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id   UUID NOT NULL,
    parent_id   UUID NOT NULL,
    order_id    UUID,
    rating      INTEGER CHECK (rating BETWEEN 1 AND 5),
    comments    TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by  UUID,
    updated_by  UUID
);

CREATE TABLE idempotency_keys (
    key             TEXT PRIMARY KEY,
    school_id       UUID NOT NULL,
    parent_id       UUID,
    response_code   INTEGER,
    response_body   JSONB,
    expires_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- INDEXES
CREATE INDEX idx_parents_school_mobile ON parents (school_id, mobile);
CREATE INDEX idx_students_school_roll ON students (school_id, roll_number);
CREATE INDEX idx_menu_items_school_category ON menu_items (school_id, category_id);
CREATE INDEX idx_orders_school_date ON orders (school_id, service_date);
CREATE INDEX idx_payments_school_status ON payments (school_id, status);
CREATE INDEX idx_idempotency_expires ON idempotency_keys (expires_at);

-- ROW LEVEL SECURITY
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_children ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergy_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE idempotency_keys ENABLE ROW LEVEL SECURITY;

-- Example policies
CREATE POLICY parents_self_access ON parents
    USING (parent_id = current_setting('app.current_parent_id', true)::uuid);

CREATE POLICY parents_school_admin ON parents
    USING (school_id = current_setting('app.current_school_id', true)::uuid)
    WITH CHECK (school_id = current_setting('app.current_school_id', true)::uuid);

CREATE POLICY students_parent_access ON students
    USING (
        EXISTS (
            SELECT 1 FROM parent_children pc
            WHERE pc.student_id = students.student_id
              AND pc.parent_id = current_setting('app.current_parent_id', true)::uuid
        )
    );

CREATE POLICY students_school_admin ON students
    USING (school_id = current_setting('app.current_school_id', true)::uuid)
    WITH CHECK (school_id = current_setting('app.current_school_id', true)::uuid);

CREATE POLICY orders_parent_access ON orders
    USING (parent_id = current_setting('app.current_parent_id', true)::uuid);

CREATE POLICY orders_school_admin ON orders
    USING (school_id = current_setting('app.current_school_id', true)::uuid);

CREATE POLICY platform_owner_full ON orders
    USING (current_setting('app.current_role', true) = 'platform_owner');

-- Similar school_id-based policies to be added for other tables.

-- PARTITIONING RECOMMENDATION
-- For orders + order_items, consider RANGE partitioning by service_date (monthly)
-- once daily order counts exceed ~100k to keep queries and RLS checks fast.
