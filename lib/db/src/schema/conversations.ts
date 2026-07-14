import { pgTable, serial, integer, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export type VocabItem = { sv: string; ar: string; phonetic?: string };
export type GrammarTip = { title: string; explanation: string; example: string; exampleAr: string };
export type UsefulPhrase = { sv: string; ar: string; phonetic?: string };
export type ConversationQuizQuestion = { question: string; options: string[]; correct: number; explanation?: string };

export const conversationsTable = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),         // Swedish title
  titleAr: text("title_ar").notNull(),    // Arabic title
  scenario: text("scenario").notNull(),   // short slug: airport | hospital | ...
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull().default("beginner"),
  emoji: text("emoji"),
  imageUrl: text("image_url"),
  durationMinutes: integer("duration_minutes").default(10),
  // Rich content
  vocabList: jsonb("vocab_list").$type<VocabItem[]>().default([]),
  grammarTips: jsonb("grammar_tips").$type<GrammarTip[]>().default([]),
  culturalNotes: text("cultural_notes"),
  usefulPhrases: jsonb("useful_phrases").$type<UsefulPhrase[]>().default([]),
  quiz: jsonb("quiz").$type<ConversationQuizQuestion[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const conversationLinesTable = pgTable("conversation_lines", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id")
    .notNull()
    .references(() => conversationsTable.id, { onDelete: "cascade" }),
  orderIndex: integer("order_index").notNull(),
  speaker: text("speaker").notNull(),       // "A" | "B"
  speakerName: text("speaker_name").notNull(),
  speakerRole: text("speaker_role"),        // e.g. "مسافر" / "موظف الاستقبال"
  textSv: text("text_sv").notNull(),
  textAr: text("text_ar").notNull(),
  phonetic: text("phonetic"),
  noteAr: text("note_ar"),                 // optional grammar/usage note
});

export const insertConversationSchema = createInsertSchema(conversationsTable).omit({ id: true, createdAt: true });
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversationsTable.$inferSelect;

export const insertConversationLineSchema = createInsertSchema(conversationLinesTable).omit({ id: true });
export type InsertConversationLine = z.infer<typeof insertConversationLineSchema>;
export type ConversationLine = typeof conversationLinesTable.$inferSelect;
