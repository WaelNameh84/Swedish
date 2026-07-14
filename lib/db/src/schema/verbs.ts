import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export type VerbExample = { sv: string; ar: string };

export const verbsTable = pgTable("verbs", {
  id: serial("id").primaryKey(),

  // Core forms
  infinitiv: text("infinitiv").notNull().unique(), // att tala — المصدر
  presens: text("presens").notNull(),              // talar — المضارع
  preteritum: text("preteritum").notNull(),        // talade — الماضي
  supinum: text("supinum").notNull(),              // talat — اسم المفعول (المصدر المضارع)
  imperativ: text("imperativ").notNull(),          // tala! — الأمر
  futurum: text("futurum").notNull(),              // ska tala / kommer att tala — المستقبل
  presensParticip: text("presens_particip").notNull(), // talande — اسم الفاعل
  perfektParticip: text("perfekt_particip").notNull(), // talad/talat — اسم المفعول

  // Passive forms (passiv)
  passivPresens: text("passiv_presens"),           // talas
  passivPreteritum: text("passiv_preteritum"),     // talades

  // Metadata
  translation: text("translation").notNull(),      // Arabic translation
  phonetic: text("phonetic").notNull(),            // IPA of infinitiv
  group: text("group").notNull(),                  // 1 | 2a | 2b | 3 | oregelbundet
  level: text("level").notNull().default("A1"),    // A1-C2
  category: text("category").notNull(),            // rörelse | kommunikation | känsla | etc.
  imageUrl: text("image_url"),
  notes: text("notes"),                            // Grammar notes in Arabic

  examples: jsonb("examples")
    .$type<VerbExample[]>()
    .notNull()
    .default([]),

  // Quiz data: sentences with blanks for each form
  quizSentences: jsonb("quiz_sentences")
    .$type<Array<{ form: string; sentence: string; answer: string; translation: string }>>()
    .notNull()
    .default([]),

  createdAt: timestamp("created_at").defaultNow(),
});

export type Verb = typeof verbsTable.$inferSelect;
