import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";
import { registerChatRoutes } from "./replit_integrations/chat"; // Using chat for simple AI interactions if needed
// Actually, I'll use direct OpenAI client for the plot generation feature
// as it's a specific single-shot task, not a chat.

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Register AI Chat routes (standard requirement for the integration)
  registerChatRoutes(app);

  // === Novels ===
  app.get(api.novels.list.path, async (req, res) => {
    const novels = await storage.getAllNovels();
    res.json(novels);
  });

  app.get(api.novels.get.path, async (req, res) => {
    const novel = await storage.getNovel(Number(req.params.id));
    if (!novel) return res.status(404).json({ message: "Novel not found" });
    res.json(novel);
  });

  app.post(api.novels.create.path, async (req, res) => {
    try {
      const input = api.novels.create.input.parse(req.body);
      const novel = await storage.createNovel(input);
      res.status(201).json(novel);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.put(api.novels.update.path, async (req, res) => {
    const novel = await storage.updateNovel(Number(req.params.id), req.body);
    res.json(novel);
  });

  app.delete(api.novels.delete.path, async (req, res) => {
    await storage.deleteNovel(Number(req.params.id));
    res.status(204).send();
  });

  // === AI Plot Generation ===
  app.post(api.novels.generatePlot.path, async (req, res) => {
    try {
      const { genre, theme } = req.body;
      
      const prompt = `Generate a creative novel plot outline in Arabic.
      Genre: ${genre}
      Theme: ${theme || "General"}
      
      Output JSON with fields:
      - plot: A detailed summary (3-4 paragraphs)
      - suggestedTitle: A catchy title
      - characters: Array of 3 main characters { name, role, description }
      
      Ensure language is formal Arabic (Fusha). Ensure content is clean, ethical, and follows conservative values (no explicit content).`;

      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const content = JSON.parse(response.choices[0].message.content || "{}");
      res.json(content);
    } catch (error) {
      console.error("AI Generation Error:", error);
      res.status(500).json({ message: "Failed to generate plot" });
    }
  });

  // === Chapters ===
  app.get(api.chapters.list.path, async (req, res) => {
    const chapters = await storage.getChapters(Number(req.params.novelId));
    res.json(chapters);
  });

  app.get(api.chapters.get.path, async (req, res) => {
    const chapter = await storage.getChapter(Number(req.params.id));
    if (!chapter) return res.status(404).json({ message: "Chapter not found" });
    res.json(chapter);
  });

  app.post(api.chapters.create.path, async (req, res) => {
    const input = api.chapters.create.input.parse(req.body);
    const chapter = await storage.createChapter(input);
    res.status(201).json(chapter);
  });

  app.put(api.chapters.update.path, async (req, res) => {
    const chapter = await storage.updateChapter(Number(req.params.id), req.body);
    res.json(chapter);
  });

  app.delete(api.chapters.delete.path, async (req, res) => {
    await storage.deleteChapter(Number(req.params.id));
    res.status(204).send();
  });

  app.post(api.chapters.reorder.path, async (req, res) => {
    await storage.reorderChapters(req.body.orders);
    res.status(200).send();
  });

  // === AI Chapter Content Generation ===
  app.post(api.chapters.generateContent.path, async (req, res) => {
    try {
      const chapterId = Number(req.params.id);
      const { prompt: userPrompt } = req.body;
      
      const chapter = await storage.getChapter(chapterId);
      if (!chapter) return res.status(404).json({ message: "Chapter not found" });

      const novel = await storage.getNovel(chapter.novelId);
      const characters = await storage.getCharacters(chapter.novelId);
      const prevChapters = await storage.getChapters(chapter.novelId);
      
      const context = prevChapters
        .filter(c => c.orderIndex < chapter.orderIndex && c.content)
        .slice(-2) // Last 2 chapters for context
        .map(c => `Chapter ${c.orderIndex + 1}: ${c.title}\n${c.content?.replace(/<[^>]*>/g, '').substring(0, 500)}...`)
        .join("\n\n");

      const charList = characters.map(c => `- ${c.name} (${c.role}): ${c.description}`).join("\n");

      const prompt = `Write a full novel chapter in Arabic.
      Novel Title: ${novel?.title}
      Chapter Title: ${chapter.title}
      Characters:\n${charList}
      Context from previous chapters:\n${context}
      User Instructions: ${userPrompt || "Write a long, detailed, and engaging chapter based on the plot."}
      
      Requirements:
      - Language: High-quality formal Arabic (Fusha).
      - Style: Descriptive, literary, and professional.
      - Ethical: Clean content, respecting religious and social values.
      - Length: At least 1000 words.
      - Output format: HTML (paragraphs and dialogues).`;

      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [{ role: "user", content: prompt }],
      });

      const content = response.choices[0].message.content || "";
      
      // Update the chapter with the generated content
      await storage.updateChapter(chapterId, { content, status: "draft" });
      
      res.json({ content });
    } catch (error) {
      console.error("AI Generation Error:", error);
      res.status(500).json({ message: "Failed to generate chapter content" });
    }
  });

  // === Characters ===
  app.get(api.characters.list.path, async (req, res) => {
    const chars = await storage.getCharacters(Number(req.params.novelId));
    res.json(chars);
  });

  app.post(api.characters.create.path, async (req, res) => {
    const input = api.characters.create.input.parse(req.body);
    const char = await storage.createCharacter(input);
    res.status(201).json(char);
  });

  app.put(api.characters.update.path, async (req, res) => {
    const char = await storage.updateCharacter(Number(req.params.id), req.body);
    res.json(char);
  });

  app.delete(api.characters.delete.path, async (req, res) => {
    await storage.deleteCharacter(Number(req.params.id));
    res.status(204).send();
  });

  // === Settings ===
  app.get(api.settings.list.path, async (req, res) => {
    const items = await storage.getSettings(Number(req.params.novelId));
    res.json(items);
  });

  app.post(api.settings.create.path, async (req, res) => {
    const input = api.settings.create.input.parse(req.body);
    const item = await storage.createSetting(input);
    res.status(201).json(item);
  });

  app.put(api.settings.update.path, async (req, res) => {
    const item = await storage.updateSetting(Number(req.params.id), req.body);
    res.json(item);
  });

  app.delete(api.settings.delete.path, async (req, res) => {
    await storage.deleteSetting(Number(req.params.id));
    res.status(204).send();
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingNovels = await storage.getAllNovels();
  if (existingNovels.length === 0) {
    const novel = await storage.createNovel({
      title: "رحلة البحث عن الذات",
      genre: "دراما",
      summary: "قصة شاب يغادر قريته بحثًا عن معنى الحياة في المدينة الكبيرة، ليواجه تحديات تغير مجرى حياته.",
      status: "planning",
      targetWordCount: 50000,
    });

    await storage.createChapter({
      novelId: novel.id,
      title: "الفصل الأول: الوداع",
      content: "<p>كانت الشمس تغرب خلف التلال، معلنة نهاية يوم وبداية رحلة...</p>",
      orderIndex: 0,
      status: "draft",
    });

    await storage.createCharacter({
      novelId: novel.id,
      name: "أحمد",
      role: "البطل",
      description: "شاب طموح في العشرينات من عمره، يحلم بأن يصبح كاتبًا.",
      traits: ["طموح", "حنون", "متردد"],
    });

    await storage.createSetting({
      novelId: novel.id,
      name: "القرية",
      description: "مكان هادئ وبسيط حيث نشأ أحمد، مليء بالمزارع والبيوت القديمة.",
    });
  }
}
