import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const conversationsTable = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleAr: text("title_ar").notNull(),
  scenario: text("scenario").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull().default("beginner"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const conversationLinesTable = pgTable("conversation_lines", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id")
    .notNull()
    .references(() => conversationsTable.id, { onDelete: "cascade" }),
  orderIndex: integer("order_index").notNull(),
  speaker: text("speaker").notNull(),
  speakerName: text("speaker_name").notNull(),
  textSv: text("text_sv").notNull(),
  textAr: text("text_ar").notNull(),
  phonetic: text("phonetic"),
});

export const insertConversationSchema = createInsertSchema(conversationsTable).omit({ id: true, createdAt: true });
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversationsTable.$inferSelect;

export const insertConversationLineSchema = createInsertSchema(conversationLinesTable).omit({ id: true });
export type InsertConversationLine = z.infer<typeof insertConversationLineSchema>;
export type ConversationLine = typeof conversationLinesTable.$inferSelect;
