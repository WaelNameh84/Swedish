import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const grammarTable = pgTable("grammar", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleAr: text("title_ar").notNull(),
  explanation: text("explanation").notNull(),
  explanationAr: text("explanation_ar").notNull(),
  examples: text("examples").notNull().default("[]"),
  level: text("level").notNull().default("beginner"),
  category: text("category").notNull().default("general"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGrammarSchema = createInsertSchema(grammarTable).omit({ id: true, createdAt: true });
export type InsertGrammar = z.infer<typeof insertGrammarSchema>;
export type Grammar = typeof grammarTable.$inferSelect;
