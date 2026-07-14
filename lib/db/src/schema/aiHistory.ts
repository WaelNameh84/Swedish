import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const aiHistoryTable = pgTable("ai_history", {
  id: serial("id").primaryKey(),
  toolName: text("tool_name").notNull(),
  prompt: text("prompt").notNull(),
  response: text("response").notNull(),
  model: text("model").notNull().default("gemini"),
  tokensUsed: text("tokens_used").default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAiHistorySchema = createInsertSchema(aiHistoryTable).omit({ id: true, createdAt: true });
export type InsertAiHistory = z.infer<typeof insertAiHistorySchema>;
export type AiHistory = typeof aiHistoryTable.$inferSelect;
