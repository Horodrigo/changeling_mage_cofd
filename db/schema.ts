import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const rulesets = sqliteTable("rulesets", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  name: text("name").notNull(),
  version: integer("version").notNull().default(1),
  gameLine: text("game_line").notNull(),
  configJson: text("config_json").notNull().default("{}"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const characters = sqliteTable("characters", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  name: text("name").notNull(),
  concept: text("concept").notNull().default(""),
  gameLine: text("game_line").notNull(),
  rulesetId: text("ruleset_id").notNull(),
  rulesetVersion: integer("ruleset_version").notNull().default(1),
  schemaVersion: integer("schema_version").notNull().default(1),
  characterData: text("character_data").notNull().default("{}"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("characters_owner_name_idx").on(table.ownerId, table.name)]);

export const sources = sqliteTable("sources", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull().unique(),
  title: text("title").notNull(),
  sourceType: text("source_type").notNull(),
  edition: integer("edition"),
  gameLine: text("game_line").notNull(),
  language: text("language").notNull().default("en"),
  reviewStatus: text("review_status").notNull().default("PENDING"),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(false),
  notes: text("notes").notNull().default(""),
  importedAt: text("imported_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const rules = sqliteTable("rules", {
  id: text("id").primaryKey(),
  originalName: text("original_name").notNull(),
  translatedName: text("translated_name"),
  category: text("category").notNull(),
  gameLine: text("game_line").notNull(),
  sourceId: text("source_id"),
  sourcePage: integer("source_page"),
  sourceSection: text("source_section"),
  sourceType: text("source_type").notNull(),
  originalText: text("original_text"),
  translatedText: text("translated_text"),
  structuredData: text("structured_data").notNull().default("{}"),
  reviewStatus: text("review_status").notNull().default("PENDING"),
  needsReview: integer("needs_review", { mode: "boolean" }).notNull().default(true),
});

export const translations = sqliteTable("translations", {
  id: text("id").primaryKey(),
  originalTerm: text("original_term").notNull().unique(),
  translatedTerm: text("translated_term"),
  status: text("status").notNull().default("PENDING"),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
