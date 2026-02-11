import { db } from "./db";
import {
  novels, chapters, characters, settings,
  type Novel, type InsertNovel, type UpdateNovelRequest,
  type Chapter, type InsertChapter, type UpdateChapterRequest,
  type Character, type InsertCharacter, type UpdateCharacterRequest,
  type Setting, type InsertSetting, type UpdateSettingRequest
} from "@shared/schema";
import { eq, asc } from "drizzle-orm";

export interface IStorage {
  // Novels
  getAllNovels(): Promise<Novel[]>;
  getNovel(id: number): Promise<Novel | undefined>;
  createNovel(novel: InsertNovel): Promise<Novel>;
  updateNovel(id: number, updates: UpdateNovelRequest): Promise<Novel>;
  deleteNovel(id: number): Promise<void>;

  // Chapters
  getChapters(novelId: number): Promise<Chapter[]>;
  getChapter(id: number): Promise<Chapter | undefined>;
  createChapter(chapter: InsertChapter): Promise<Chapter>;
  updateChapter(id: number, updates: UpdateChapterRequest): Promise<Chapter>;
  deleteChapter(id: number): Promise<void>;
  reorderChapters(orders: { id: number; orderIndex: number }[]): Promise<void>;

  // Characters
  getCharacters(novelId: number): Promise<Character[]>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  updateCharacter(id: number, updates: UpdateCharacterRequest): Promise<Character>;
  deleteCharacter(id: number): Promise<void>;

  // Settings
  getSettings(novelId: number): Promise<Setting[]>;
  createSetting(setting: InsertSetting): Promise<Setting>;
  updateSetting(id: number, updates: UpdateSettingRequest): Promise<Setting>;
  deleteSetting(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Novels
  async getAllNovels(): Promise<Novel[]> {
    return await db.select().from(novels).orderBy(asc(novels.title));
  }

  async getNovel(id: number): Promise<Novel | undefined> {
    const [novel] = await db.select().from(novels).where(eq(novels.id, id));
    return novel;
  }

  async createNovel(insertNovel: InsertNovel): Promise<Novel> {
    const [novel] = await db.insert(novels).values(insertNovel).returning();
    return novel;
  }

  async updateNovel(id: number, updates: UpdateNovelRequest): Promise<Novel> {
    const [novel] = await db.update(novels)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(novels.id, id))
      .returning();
    return novel;
  }

  async deleteNovel(id: number): Promise<void> {
    // Cascade delete is handled by DB constraints ideally, but we'll delete explicitly if needed.
    // Drizzle relations don't auto-cascade delete in application code unless configured in DB.
    // Assuming simple delete for now.
    await db.delete(novels).where(eq(novels.id, id));
  }

  // Chapters
  async getChapters(novelId: number): Promise<Chapter[]> {
    return await db.select().from(chapters)
      .where(eq(chapters.novelId, novelId))
      .orderBy(asc(chapters.orderIndex));
  }

  async getChapter(id: number): Promise<Chapter | undefined> {
    const [chapter] = await db.select().from(chapters).where(eq(chapters.id, id));
    return chapter;
  }

  async createChapter(insertChapter: InsertChapter): Promise<Chapter> {
    const [chapter] = await db.insert(chapters).values(insertChapter).returning();
    return chapter;
  }

  async updateChapter(id: number, updates: UpdateChapterRequest): Promise<Chapter> {
    const [chapter] = await db.update(chapters)
      .set(updates)
      .where(eq(chapters.id, id))
      .returning();
    return chapter;
  }

  async deleteChapter(id: number): Promise<void> {
    await db.delete(chapters).where(eq(chapters.id, id));
  }

  async reorderChapters(orders: { id: number; orderIndex: number }[]): Promise<void> {
    await db.transaction(async (tx) => {
      for (const { id, orderIndex } of orders) {
        await tx.update(chapters).set({ orderIndex }).where(eq(chapters.id, id));
      }
    });
  }

  // Characters
  async getCharacters(novelId: number): Promise<Character[]> {
    return await db.select().from(characters).where(eq(characters.novelId, novelId));
  }

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const [character] = await db.insert(characters).values(insertCharacter).returning();
    return character;
  }

  async updateCharacter(id: number, updates: UpdateCharacterRequest): Promise<Character> {
    const [character] = await db.update(characters)
      .set(updates)
      .where(eq(characters.id, id))
      .returning();
    return character;
  }

  async deleteCharacter(id: number): Promise<void> {
    await db.delete(characters).where(eq(characters.id, id));
  }

  // Settings
  async getSettings(novelId: number): Promise<Setting[]> {
    return await db.select().from(settings).where(eq(settings.novelId, novelId));
  }

  async createSetting(insertSetting: InsertSetting): Promise<Setting> {
    const [setting] = await db.insert(settings).values(insertSetting).returning();
    return setting;
  }

  async updateSetting(id: number, updates: UpdateSettingRequest): Promise<Setting> {
    const [setting] = await db.update(settings)
      .set(updates)
      .where(eq(settings.id, id))
      .returning();
    return setting;
  }

  async deleteSetting(id: number): Promise<void> {
    await db.delete(settings).where(eq(settings.id, id));
  }
}

export const storage = new DatabaseStorage();
