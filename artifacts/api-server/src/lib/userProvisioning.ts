import { db } from "@workspace/db";
import { userProgressTable, userSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

// JIT (just-in-time) provisioning: the first time a signed-in Clerk user
// hits an endpoint that needs their progress/settings row, create it. There
// is no separate "signup writes a DB row" step — Clerk owns the account,
// these tables just mirror per-account app state keyed by Clerk's userId.

export async function getOrCreateUserProgress(userId: string) {
  const existing = await db.select().from(userProgressTable).where(eq(userProgressTable.userId, userId)).limit(1);
  if (existing.length > 0) return existing[0];
  const [created] = await db.insert(userProgressTable).values({ userId }).returning();
  return created;
}

export async function getOrCreateUserSettings(userId: string) {
  const existing = await db.select().from(userSettingsTable).where(eq(userSettingsTable.userId, userId)).limit(1);
  if (existing.length > 0) return existing[0];
  const [created] = await db.insert(userSettingsTable).values({ userId }).returning();
  return created;
}
