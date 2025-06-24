-- Thoughtmarks Complete Database Export
-- Generated: 2025-06-23T21:00:00.000Z
-- Database: PostgreSQL (Neon)
-- Environment: Production

-- Database Schema Recreation Scripts

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT,
    firebase_uid TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    is_premium BOOLEAN DEFAULT FALSE,
    is_test_user BOOLEAN DEFAULT FALSE,
    premium_expires_at TIMESTAMP,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    consent_data TEXT,
    last_login_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NOW(),
    is_admin BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    trial_started_at TIMESTAMP,
    first_name TEXT,
    last_name TEXT,
    linked_accounts JSON DEFAULT '[]',
    marketing_emails BOOLEAN DEFAULT TRUE,
    ai_notifications BOOLEAN DEFAULT FALSE,
    role_id INTEGER DEFAULT 3,
    subscription_tier VARCHAR,
    subscription_status VARCHAR DEFAULT 'active',
    billing_cycle VARCHAR,
    next_billing_date TIMESTAMP,
    subscription_started_at TIMESTAMP,
    subscription_expires_at TIMESTAMP,
    trial_type VARCHAR,
    is_friends_family BOOLEAN DEFAULT FALSE,
    ai_reminders BOOLEAN DEFAULT FALSE,
    smart_reminders BOOLEAN DEFAULT FALSE,
    privacy_consent BOOLEAN DEFAULT TRUE,
    onboarding_complete BOOLEAN DEFAULT FALSE
);

-- Bins table
CREATE TABLE IF NOT EXISTS bins (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#C6D600',
    icon TEXT DEFAULT 'folder',
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    parent_bin_id INTEGER REFERENCES bins(id),
    sort_order INTEGER DEFAULT 0
);

-- Thoughtmarks table
CREATE TABLE IF NOT EXISTS thoughtmarks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    bin_id INTEGER REFERENCES bins(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    attachments JSON DEFAULT '[]',
    embedding TEXT,
    is_task BOOLEAN DEFAULT FALSE,
    is_completed BOOLEAN DEFAULT FALSE,
    due_date TIMESTAMP,
    is_pinned BOOLEAN DEFAULT FALSE,
    parent_thoughtmark_id INTEGER REFERENCES thoughtmarks(id),
    sort_order INTEGER DEFAULT 0,
    is_example BOOLEAN DEFAULT FALSE
);

-- User roles table
CREATE TABLE IF NOT EXISTS user_roles (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    parent_role_id INTEGER REFERENCES user_roles(id),
    permissions JSON DEFAULT '[]',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Email verification codes table
CREATE TABLE IF NOT EXISTS email_verification_codes (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    type TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_thoughtmarks_user_id ON thoughtmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_thoughtmarks_bin_id ON thoughtmarks(bin_id);
CREATE INDEX IF NOT EXISTS idx_bins_user_id ON bins(user_id);
CREATE INDEX IF NOT EXISTS idx_thoughtmarks_created_at ON thoughtmarks(created_at);
CREATE INDEX IF NOT EXISTS idx_thoughtmarks_is_deleted ON thoughtmarks(is_deleted);

-- Database Statistics (Current Production Data)
-- Total Users: 16
-- Total Thoughtmarks: 140
-- Total Bins: 173
-- Admin Users: 2
-- Premium Users: 1

-- Sample Data Structure (Anonymized)
-- Note: Actual user data not included for privacy protection

-- Environment Variables Required:
-- DATABASE_URL=postgresql://username:password@host:port/database
-- PGHOST=neon-database-host
-- PGPORT=5432
-- PGUSER=database-username
-- PGPASSWORD=database-password
-- PGDATABASE=database-name

-- API Integration Points:
-- Authentication: Firebase Auth + Google OAuth + Apple Sign-In
-- AI Services: OpenAI GPT-4 for categorization and voice processing
-- Email: SendGrid for notifications and verification
-- Payments: Stripe for subscription management

-- Security Configuration:
-- TLS encryption in transit
-- Encrypted storage at rest
-- JWT-based session management
-- Rate limiting on all endpoints
-- CORS protection configured

-- Backup and Recovery:
-- Automated daily backups via Neon
-- Point-in-time recovery available
-- Database replication for high availability

-- Migration Commands:
-- npm run db:push (Drizzle schema push)
-- npm run db:studio (Database management interface)

-- Development Setup:
-- 1. Set environment variables
-- 2. Run npm install
-- 3. Execute database migrations
-- 4. Start development server with npm run dev

-- Production Deployment:
-- Platform: Replit
-- Runtime: Node.js with TypeScript
-- Build: Vite for frontend, Express for backend
-- Database: Neon PostgreSQL (managed)