import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// === TABLE DEFINITIONS ===

export const novels = pgTable("novels", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  genre: text("genre").notNull(), // e.g., Historical, Drama, Sci-Fi
  summary: text("summary"),
  targetWordCount: integer("target_word_count").default(50000),
  status: text("status").default("planning"), // planning, in_progress, completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const chapters = pgTable("chapters", {
  id: serial("id").primaryKey(),
  novelId: integer("novel_id").notNull(),
  title: text("title").notNull(),
  content: text("content"), // HTML or Markdown content
  orderIndex: integer("order_index").notNull(),
  status: text("status").default("draft"), // draft, final
  createdAt: timestamp("created_at").defaultNow(),
});

export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  novelId: integer("novel_id").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(), // Protagonist, Antagonist, Supporting
  description: text("description"),
  traits: jsonb("traits"), // Array of strings e.g. ["Brave", "Stubborn"]
  createdAt: timestamp("created_at").defaultNow(),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  novelId: integer("novel_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===

export const novelsRelations = relations(novels, ({ many }) => ({
  chapters: many(chapters),
  characters: many(characters),
  settings: many(settings),
}));

export const chaptersRelations = relations(chapters, ({ one }) => ({
  novel: one(novels, {
    fields: [chapters.novelId],
    references: [novels.id],
  }),
}));

export const charactersRelations = relations(characters, ({ one }) => ({
  novel: one(novels, {
    fields: [characters.novelId],
    references: [novels.id],
  }),
}));

export const settingsRelations = relations(settings, ({ one }) => ({
  novel: one(novels, {
    fields: [settings.novelId],
    references: [novels.id],
  }),
}));

// === ZOD SCHEMAS ===

export const insertNovelSchema = createInsertSchema(novels).omit({ id: true, createdAt: true, updatedAt: true });
export const insertChapterSchema = createInsertSchema(chapters).omit({ id: true, createdAt: true });
export const insertCharacterSchema = createInsertSchema(characters).omit({ id: true, createdAt: true });
export const insertSettingSchema = createInsertSchema(settings).omit({ id: true, createdAt: true });

// === TYPES ===

export type Novel = typeof novels.$inferSelect;
export type InsertNovel = z.infer<typeof insertNovelSchema>;

export type Chapter = typeof chapters.$inferSelect;
export type InsertChapter = z.infer<typeof insertChapterSchema>;

export type Character = typeof characters.$inferSelect;
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;

// === API REQUEST TYPES ===

export type CreateNovelRequest = InsertNovel;
export type UpdateNovelRequest = Partial<InsertNovel>;

export type CreateChapterRequest = InsertChapter;
export type UpdateChapterRequest = Partial<InsertChapter>;

export type CreateCharacterRequest = InsertCharacter;
export type UpdateCharacterRequest = Partial<InsertCharacter>;

export type CreateSettingRequest = InsertSetting;
export type UpdateSettingRequest = Partial<InsertSetting>;

// AI Types
export interface GeneratePlotRequest {
  genre: string;
  theme?: string;
}

export interface GeneratePlotResponse {
  plot: string;
  suggestedTitle: string;
  characters: { name: string; role: string; description: string }[];
}
