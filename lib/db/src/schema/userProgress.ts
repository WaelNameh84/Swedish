import { pgTable, serial, integer, numeric, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const userProgressTable = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  level: integer("level").notNull().default(1),
  levelName: text("level_name").notNull().default("Nybörjare"),
  xpPoints: integer("xp_points").notNull().default(0),
  xpToNextLevel: integer("xp_to_next_level").notNull().default(500),
  streakDays: integer("streak_days").notNull().default(0),
  totalDaysLearned: integer("total_days_learned").notNull().default(0),
  totalMinutesLearned: integer("total_minutes_learned").notNull().default(0),
  completionPercentage: numeric("completion_percentage", { precision: 5, scale: 2 }).notNull().default("0"),
  displayName: text("display_name").notNull().default("متعلّم السويدية"),
  avatarEmoji: text("avatar_emoji").notNull().default("🧑‍🎓"),
  avatarColor: text("avatar_color").notNull().default("blue"),
  joinedGroupIds: jsonb("joined_group_ids").$type<string[]>().notNull().default([]),
  friendIds: jsonb("friend_ids").$type<string[]>().notNull().default([]),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserProgressSchema = createInsertSchema(userProgressTable).omit({ id: true, updatedAt: true });
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgressTable.$inferSelect;
