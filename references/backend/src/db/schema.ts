import { pgTable, serial, text, timestamp, boolean, integer, varchar, json, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'inactive', 'cancelled', 'free']);
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high']);

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  displayName: text('display_name'),
  firebaseUid: text('firebase_uid').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  isPremium: boolean('is_premium').default(false),
  isTestUser: boolean('is_test_user').default(false),
  premiumExpiresAt: timestamp('premium_expires_at'),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  consentData: text('consent_data'),
  lastLoginAt: timestamp('last_login_at'),
  updatedAt: timestamp('updated_at').defaultNow(),
  isAdmin: boolean('is_admin').default(false),
  emailVerified: boolean('email_verified').default(false),
  trialStartedAt: timestamp('trial_started_at'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  linkedAccounts: json('linked_accounts').default('[]'),
  marketingEmails: boolean('marketing_emails').default(true),
  aiNotifications: boolean('ai_notifications').default(false),
  roleId: integer('role_id').default(3),
  subscriptionTier: varchar('subscription_tier'),
  subscriptionStatus: subscriptionStatusEnum('subscription_status').default('active'),
  billingCycle: varchar('billing_cycle'),
  nextBillingDate: timestamp('next_billing_date'),
  subscriptionStartedAt: timestamp('subscription_started_at'),
  subscriptionExpiresAt: timestamp('subscription_expires_at'),
  trialType: varchar('trial_type'),
  isFriendsFamily: boolean('is_friends_family').default(false),
  aiReminders: boolean('ai_reminders').default(false),
  smartReminders: boolean('smart_reminders').default(false),
  privacyConsent: boolean('privacy_consent').default(true),
  onboardingComplete: boolean('onboarding_complete').default(false),
});

// Bins table
export const bins = pgTable('bins', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  color: text('color').default('#C6D600'),
  icon: text('icon').default('folder'),
  userId: integer('user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  parentBinId: integer('parent_bin_id').references(() => bins.id),
  sortOrder: integer('sort_order').default(0),
});

// Thoughtmarks table
export const thoughtmarks = pgTable('thoughtmarks', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  tags: text('tags').array().default([]),
  binId: integer('bin_id').references(() => bins.id),
  userId: integer('user_id').notNull().references(() => users.id),
  isDeleted: boolean('is_deleted').default(false),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  attachments: json('attachments').default('[]'),
  embedding: text('embedding'),
  isTask: boolean('is_task').default(false),
  isCompleted: boolean('is_completed').default(false),
  dueDate: timestamp('due_date'),
  isPinned: boolean('is_pinned').default(false),
  parentThoughtmarkId: integer('parent_thoughtmark_id').references(() => thoughtmarks.id),
  sortOrder: integer('sort_order').default(0),
  isExample: boolean('is_example').default(false),
  priority: priorityEnum('priority'),
  completedAt: timestamp('completed_at'),
  aiSummary: text('ai_summary'),
  aiCategorySuggestions: text('ai_category_suggestions').array().default([]),
  voiceNoteUrl: text('voice_note_url'),
  voiceTranscription: text('voice_transcription'),
  isArchived: boolean('is_archived').default(false),
});

// User roles table
export const userRoles = pgTable('user_roles', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  displayName: text('display_name').notNull(),
  parentRoleId: integer('parent_role_id').references(() => userRoles.id),
  permissions: json('permissions').default('[]'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Email verification codes table
export const emailVerificationCodes = pgTable('email_verification_codes', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  code: text('code').notNull(),
  type: text('type').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  used: boolean('used').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Export all tables
export * from 'drizzle-orm'; 