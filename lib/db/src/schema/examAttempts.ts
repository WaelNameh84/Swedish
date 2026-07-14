import { pgTable, serial, integer, boolean, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const examAttemptsTable = pgTable("exam_attempts", {
  id: serial("id").primaryKey(),
  examType: text("exam_type").notNull(), // daily | weekly | monthly | level
  level: text("level"), // A1..C2, null for daily/weekly/monthly
  score: integer("score").notNull(),
  total: integer("total").notNull(),
  percentage: integer("percentage").notNull(),
  passed: boolean("passed").notNull().default(false),
  durationSeconds: integer("duration_seconds").notNull().default(0),
  details: jsonb("details").$type<Array<{ question: string; correct: boolean }>>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertExamAttemptSchema = createInsertSchema(examAttemptsTable).omit({ id: true, createdAt: true });
export type InsertExamAttempt = z.infer<typeof insertExamAttemptSchema>;
export type ExamAttempt = typeof examAttemptsTable.$inferSelect;
