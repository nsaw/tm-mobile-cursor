// Drizzle Migration Helper - Utilities for handling PostgreSQL array defaults
// This provides a complete framework for managing Drizzle array issues

import { sql } from "drizzle-orm";
import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// FIXED SCHEMA - Use this to replace your current schema.ts
export const thoughtmarksFixed = pgTable("thoughtmarks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  // SOLUTION 1: Remove .default([]) and handle in app code
  tags: text("tags").array().notNull(),
  // SOLUTION 2: Use raw SQL for proper PostgreSQL syntax
  // tags: text("tags").array().notNull().default(sql`'{}'`),
  attachments: json("attachments").default([]), // JSON arrays work fine
  binId: integer("bin_id").references(() => bins.id, { onDelete: "set null" }),
  parentThoughtmarkId: integer("parent_thoughtmark_id").references(() => thoughtmarksFixed.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull(),
  isTask: boolean("is_task").notNull().default(false),
  isCompleted: boolean("is_completed").notNull().default(false),
  dueDate: timestamp("due_date"),
  isPinned: boolean("is_pinned").notNull().default(false),
  isDeleted: boolean("is_deleted").notNull().default(false),
  deletedAt: timestamp("deleted_at"),
  sortOrder: integer("sort_order").notNull().default(0),
  embedding: text("embedding"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const bins = pgTable("bins", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").notNull().default("#C6D600"),
  icon: text("icon").notNull().default("folder"),
  parentBinId: integer("parent_bin_id").references(() => bins.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// APPLICATION HELPERS - Use these in your routes/storage
export function normalizeThoughtmarkData(data: any): any {
  return {
    ...data,
    tags: Array.isArray(data.tags) ? data.tags : [],
    attachments: Array.isArray(data.attachments) ? data.attachments : [],
  };
}

export function createThoughtmarkWithDefaults(data: Partial<any>) {
  return normalizeThoughtmarkData({
    tags: [], // Always provide default
    attachments: [],
    isTask: false,
    isCompleted: false,
    isPinned: false,
    isDeleted: false,
    sortOrder: 0,
    ...data,
  });
}

// VALIDATION SCHEMAS - Updated for array handling
export const insertThoughtmarkSchemaFixed = createInsertSchema(thoughtmarksFixed).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  isDeleted: true,
  deletedAt: true,
}).extend({
  tags: z.array(z.string()).default([]), // Ensure array validation
});

export const insertBinSchemaFixed = createInsertSchema(bins).omit({
  id: true,
  createdAt: true,
  userId: true,
});

// MIGRATION UTILITIES
export async function migrateArrayDefaults(db: any) {
  // Fix existing array columns to use proper PostgreSQL defaults
  await db.execute(sql`ALTER TABLE thoughtmarks ALTER COLUMN tags SET DEFAULT '{}'`);
  
  // Update any existing NULL values
  await db.execute(sql`UPDATE thoughtmarks SET tags = '{}' WHERE tags IS NULL`);
  
  console.log("Array defaults migration completed");
}

export async function validateArrayColumns(db: any) {
  // Check that all array columns have proper defaults
  const result = await db.execute(sql`
    SELECT column_name, data_type, column_default 
    FROM information_schema.columns 
    WHERE table_name = 'thoughtmarks' 
    AND column_name = 'tags'
  `);
  
  console.log("Array column validation:", result);
  return result;
}

// DRIZZLE PUSH COMPATIBILITY
// Run this before using `npm run db:push`
export async function prepareDrizzlePush(db: any) {
  console.log("Preparing database for Drizzle push...");
  
  // Ensure array columns have proper defaults before schema push
  await migrateArrayDefaults(db);
  
  // Validate the changes
  await validateArrayColumns(db);
  
  console.log("Database prepared for Drizzle push");
}

// EXPORT TYPES
export type ThoughtmarkFixed = typeof thoughtmarksFixed.$inferSelect;
export type InsertThoughtmarkFixed = z.infer<typeof insertThoughtmarkSchemaFixed>;
export type BinFixed = typeof bins.$inferSelect;
export type InsertBinFixed = z.infer<typeof insertBinSchemaFixed>;