import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";

// User roles table for hierarchical permission management
export const userRoles = pgTable("user_roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // 'superuser', 'admin', 'premium_basic', 'premium_pro', 'premium_enterprise', 'free', 'demo', 'template'
  displayName: text("display_name").notNull(), // 'Superuser', 'Administrator', 'Premium Basic', etc.
  parentRoleId: integer("parent_role_id"), // Remove the circular reference for now
  permissions: json("permissions").notNull().default([]), // Array of permission strings
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  displayName: text("display_name"),
  firebaseUid: text("firebase_uid").notNull().unique(),
  linkedAccounts: json("linked_accounts").default([]), // Array of linked auth providers
  roleId: integer("role_id").notNull().default(3), // Default to 'free' role - remove circular reference for now
  // Legacy fields - kee{ { { { ping for backward compatibility but will be derived from role & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
  isAdmin: boolean("is_admin").notNull().default(false),
  isPremium: boolean("is_premium").notNull().default(false),
  isTestUser: boolean("is_test_user").notNull().default(false),
  premiumExpiresAt: timestamp("premium_expires_at"),
  trialStartedAt: timestamp("trial_started_at"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  consentData: text("consent_data"), // GDPR consent preferences
  marketingEmails: boolean("marketing_emails").notNull().default(true), // Default to enabled for marketing emails
  aiNotifications: boolean("ai_notifications").notNull().default(true), // AI insights and notifications (premium feature)
  smartReminders: boolean("smart_reminders").notNull().default(true), // AI smart reminders (premium feature)
  privacyConsent: boolean("privacy_consent").notNull().default(true), // Default privacy consent to enabled
  emailVerified: boolean("email_verified").notNull().default(false),
  lastLoginAt: timestamp("last_login_at"),
  // New subscription management fields
  subscriptionTier: text("subscription_tier"), // 'monthly', 'annual', 'lifetime'
  subscriptionStatus: text("subscription_status").notNull().default("active"), // 'active', 'cancelled', 'expired', 'expiring_soon', 'trial'
  billingCycle: text("billing_cycle"), // 'monthly', 'annual', 'lifetime'
  nextBillingDate: timestamp("next_billing_date"),
  subscriptionStartedAt: timestamp("subscription_started_at"),
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  // Promotional access fields
  trialType: text("trial_type"), // '14_day', '30_day'
  isFriendsFamily: boolean("is_friends_family").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const bins = pgTable("bins", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").notNull().default("#C6D600"),
  icon: text("icon").notNull().default("folder"),
  parentBinId: integer("parent_bin_id"), // Remove circular reference for now
  userId: integer("user_id").notNull(), // Remove circular reference for now
  sortOrder: integer("sort_order").notNull().default(0), // For maintaining custom order
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const thoughtmarks = pgTable("thoughtmarks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  // FIXED: Removed .default([]) - handle in application code to avoid Drizzle/PostgreSQL array default issues
  tags: text("tags").array().notNull(),
  attachments: json("attachments").default([]), // Array of file metadata objects
  binId: integer("bin_id"), // Remove circular reference for now
  parentThoughtmarkId: integer("parent_thoughtmark_id"), // Remove circular reference for now
  userId: integer("user_id").notNull(), // Remove circular reference for now
  isTask: boolean("is_task").notNull().default(false),
  isCompleted: boolean("is_completed").notNull().default(false),
  dueDate: timestamp("due_date"),
  isPinned: boolean("is_pinned").notNull().default(false),
  isDeleted: boolean("is_deleted").notNull().default(false),
  deletedAt: timestamp("deleted_at"),
  sortOrder: integer("sort_order").notNull().default(0), // For maintaining custom order within bins
  embedding: text("embedding"), // JSON string of embedding vector
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Email verification codes table
export const emailVerificationCodes = pgTable("email_verification_codes", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  code: text("code").notNull(),
  type: text("type").notNull(), // 'signup', 'password_reset'
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Export types
export type UserRole = typeof userRoles.$inferSelect;
export type User = typeof users.$inferSelect;
export type Bin = typeof bins.$inferSelect;
export type Thoughtmark = typeof thoughtmarks.$inferSelect;
export type EmailVerificationCode = typeof emailVerificationCodes.$inferSelect;

export type BinWithCount = Bin & { thoughtmarkCount: number };
export type ThoughtmarkWithBin = Thoughtmark & { binName?: string | null };

// Hierarchical types for nested content
export type BinWithChildren = Bin & { 
  children?: BinWithChildren[];
  thoughtmarkCount: number;
};
export type ThoughtmarkWithChildren = Thoughtmark & { 
  children?: ThoughtmarkWithChildren[];
  binName?: string | null;
};

// User content hierarchy for organizational queries
export type UserContentHierarchy = {
  user: User;
  bins: BinWithChildren[];
  thoughtmarks: ThoughtmarkWithChildren[];
}; 