import { pgTable, serial, integer, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { lessonsTable } from "./lessons";

// section_type values:
//   "intro"      – Arabic intro + learning objectives
//   "vocabulary" – word list with SV/AR/phonetic/example
//   "grammar"    – rule explanation + examples
//   "reading"    – SV passage + AR translation + comprehension Qs
//   "listening"  – transcript (future audio) + Qs
//   "exercise"   – interactive fill/mcq/translate items
//   "quiz"       – graded questions, tracked for completion %

export const lessonSectionsTable = pgTable("lesson_sections", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id")
    .notNull()
    .references(() => lessonsTable.id, { onDelete: "cascade" }),
  orderIndex: integer("order_index").notNull(),
  sectionType: text("section_type").notNull(),
  titleAr: text("title_ar").notNull(),
  content: jsonb("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type LessonSection = typeof lessonSectionsTable.$inferSelect;
