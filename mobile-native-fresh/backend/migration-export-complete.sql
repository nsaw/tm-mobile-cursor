-- THOUGHTMARKS DATABASE MIGRATION - Complete Export with Array Fixes
-- Location: export-packages/database/
-- This export includes the full database schema with proper PostgreSQL array defaults
-- Generated: 2025-06-23

-- Drop existing tables if rebuilding from scratch
-- DROP TABLE IF EXISTS thoughtmarks CASCADE;
-- DROP TABLE IF EXISTS bins CASCADE;
-- DROP TABLE IF EXISTS email_verification_codes CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS user_roles CASCADE;

-- Create user roles table with proper JSON array defaults
CREATE TABLE IF NOT EXISTS user_roles (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    parent_role_id INTEGER REFERENCES user_roles(id) ON DELETE SET NULL,
    permissions JSON NOT NULL DEFAULT '[]'::json,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create users table with proper array defaults
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    display_name TEXT,
    firebase_uid TEXT NOT NULL UNIQUE,
    linked_accounts JSON DEFAULT '[]'::json,
    role_id INTEGER NOT NULL REFERENCES user_roles(id) ON DELETE RESTRICT DEFAULT 3,
    is_admin BOOLEAN NOT NULL DEFAULT false,
    is_premium BOOLEAN NOT NULL DEFAULT false,
    is_test_user BOOLEAN NOT NULL DEFAULT false,
    premium_expires_at TIMESTAMP,
    trial_started_at TIMESTAMP,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    consent_data TEXT,
    marketing_emails BOOLEAN NOT NULL DEFAULT true,
    ai_notifications BOOLEAN NOT NULL DEFAULT true,
    smart_reminders BOOLEAN NOT NULL DEFAULT true,
    privacy_consent BOOLEAN NOT NULL DEFAULT true,
    email_verified BOOLEAN NOT NULL DEFAULT false,
    last_login_at TIMESTAMP,
    subscription_tier TEXT,
    subscription_status TEXT NOT NULL DEFAULT 'active',
    billing_cycle TEXT,
    next_billing_date TIMESTAMP,
    subscription_started_at TIMESTAMP,
    subscription_expires_at TIMESTAMP,
    trial_type TEXT,
    is_friends_family BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create bins table
CREATE TABLE IF NOT EXISTS bins (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT NOT NULL DEFAULT '#C6D600',
    icon TEXT NOT NULL DEFAULT 'folder',
    parent_bin_id INTEGER REFERENCES bins(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create thoughtmarks table with FIXED array defaults
CREATE TABLE IF NOT EXISTS thoughtmarks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    -- FIXED: Use proper PostgreSQL array syntax for default
    tags TEXT[] NOT NULL DEFAULT '{}',
    attachments JSON DEFAULT '[]'::json,
    bin_id INTEGER REFERENCES bins(id) ON DELETE SET NULL,
    parent_thoughtmark_id INTEGER REFERENCES thoughtmarks(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_task BOOLEAN NOT NULL DEFAULT false,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    due_date TIMESTAMP,
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at TIMESTAMP,
    sort_order INTEGER NOT NULL DEFAULT 0,
    embedding TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create email verification codes table
CREATE TABLE IF NOT EXISTS email_verification_codes (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    type TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Insert default user roles
INSERT INTO user_roles (name, display_name, permissions, sort_order) VALUES
('superuser', 'Superuser', '["all"]'::json, 1),
('admin', 'Administrator', '["admin", "premium", "user"]'::json, 2),
('free', 'Free User', '["user"]'::json, 3),
('premium_basic', 'Premium Basic', '["premium_basic", "user"]'::json, 4),
('premium_pro', 'Premium Pro', '["premium_pro", "premium_basic", "user"]'::json, 5),
('demo', 'Demo User', '["demo", "user"]'::json, 6),
('template', 'Template User', '["template", "user"]'::json, 7)
ON CONFLICT (name) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_bins_user_id ON bins(user_id);
CREATE INDEX IF NOT EXISTS idx_thoughtmarks_user_id ON thoughtmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_thoughtmarks_bin_id ON thoughtmarks(bin_id);
CREATE INDEX IF NOT EXISTS idx_thoughtmarks_is_deleted ON thoughtmarks(is_deleted);
CREATE INDEX IF NOT EXISTS idx_thoughtmarks_tags ON thoughtmarks USING GIN(tags);

-- Migration notes:
-- 1. Changed tags column from .default([]) to DEFAULT '{}' (proper PostgreSQL syntax)
-- 2. All JSON arrays use '[]'::json syntax which works correctly
-- 3. Text arrays use '{}' syntax for empty array defaults
-- 4. This schema is fully compatible with Drizzle when using proper array handling
-- 5. Application code should still validate arrays to ensure they're never null/undefined 