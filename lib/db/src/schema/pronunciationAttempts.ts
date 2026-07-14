import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const pronunciationAttemptsTable = pgTable("pronunciation_attempts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  targetText: text("target_text").notNull(),
  score: integer("score").notNull(),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPronunciationAttemptSchema = createInsertSchema(pronunciationAttemptsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertPronunciationAttempt = z.infer<typeof insertPronunciationAttemptSchema>;
export type PronunciationAttempt = typeof pronunciationAttemptsTable.$inferSelect;
