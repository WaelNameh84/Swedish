import { pgTable, serial, boolean, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export type DictionaryExample = { sv: string; ar: string };
export type DictionaryConjugations = Record<string, string>;

export const dictionaryTable = pgTable("dictionary", {
  id: serial("id").primaryKey(),
  word: text("word").notNull().unique(),
  translation: text("translation").notNull(),
  phonetic: text("phonetic").notNull(),
  partOfSpeech: text("part_of_speech").notNull(), // substantiv | verb | adjektiv | adverb | preposition | pronomen | interjektion
  gender: text("gender"), // en | ett — for nouns only
  plural: text("plural"), // plural form for nouns
  level: text("level").notNull().default("A1"), // A1-C2
  category: text("category").notNull(), // mat, familj, arbete, natur, kropp, tid, etc.
  imageUrl: text("image_url"),
  audioUrl: text("audio_url"),
  examples: jsonb("examples")
    .$type<DictionaryExample[]>()
    .notNull()
    .default([]),
  synonyms: jsonb("synonyms").$type<string[]>().notNull().default([]),
  antonyms: jsonb("antonyms").$type<string[]>().notNull().default([]),
  conjugations: jsonb("conjugations").$type<DictionaryConjugations>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type DictionaryWord = typeof dictionaryTable.$inferSelect;
