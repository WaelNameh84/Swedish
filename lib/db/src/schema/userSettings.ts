import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const userSettingsTable = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  // UI
  appLanguage: text("app_language").notNull().default("ar"),
  darkMode: text("dark_mode").notNull().default("system"), // "light" | "dark" | "system"
  // Notifications
  notificationsEnabled: boolean("notifications_enabled").notNull().default(true),
  dailyReminderEnabled: boolean("daily_reminder_enabled").notNull().default(true),
  reminderTime: text("reminder_time").notNull().default("09:00"),
  // AI keys (stored encrypted / hashed reference only — actual secrets via env)
  geminiApiKey: text("gemini_api_key").default(""),
  imageGenApiKey: text("image_gen_api_key").default(""),
  translationApiKey: text("translation_api_key").default(""),
  openaiApiKey: text("openai_api_key").default(""),
  // Audio
  audioEnabled: boolean("audio_enabled").notNull().default(true),
  audioSpeed: text("audio_speed").notNull().default("1.0"),
  audioVoice: text("audio_voice").notNull().default("default"),
  // Reading
  readingSpeed: text("reading_speed").notNull().default("medium"),
  // Privacy & Security
  dataCollectionEnabled: boolean("data_collection_enabled").notNull().default(true),
  analyticsEnabled: boolean("analytics_enabled").notNull().default(true),
  twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSettingsSchema = createInsertSchema(userSettingsTable).omit({ id: true, updatedAt: true });
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UserSettings = typeof userSettingsTable.$inferSelect;
