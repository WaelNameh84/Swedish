import { pgTable, serial, boolean, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const wordsTable = pgTable("words", {
  id: serial("id").primaryKey(),
  word: text("word").notNull(),
  translation: text("translation").notNull(),
  phonetic: text("phonetic").notNull(),
  category: text("category").notNull(),
  isNew: boolean("is_new").notNull().default(true),
  learnedAt: timestamp("learned_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWordSchema = createInsertSchema(wordsTable).omit({ id: true, createdAt: true });
export type InsertWord = z.infer<typeof insertWordSchema>;
export type Word = typeof wordsTable.$inferSelect;
