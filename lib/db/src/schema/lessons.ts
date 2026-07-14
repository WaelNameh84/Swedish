import { pgTable, serial, integer, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const lessonsTable = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleSv: text("title_sv").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull().default("beginner"),
  level: text("level").notNull().default("A1"),          // A1 A2 B1 B2 C1 C2
  skill: text("skill").notNull().default("grammar"),     // reading writing listening speaking grammar tests
  description: text("description"),
  durationMinutes: integer("duration_minutes").notNull().default(15),
  isLocked: boolean("is_locked").notNull().default(false),
  completionPercentage: integer("completion_percentage").notNull().default(0),
  imageUrl: text("image_url"),
  lastAccessedAt: timestamp("last_accessed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLessonSchema = createInsertSchema(lessonsTable).omit({ id: true, createdAt: true });
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessonsTable.$inferSelect;
