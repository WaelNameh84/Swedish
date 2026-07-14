import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// Stores WebAuthn (fingerprint/Face ID) credentials registered per device so
// a signed-in user can enable biometric quick sign-in on that device. The
// actual account/session is still owned by Clerk — this table only maps a
// platform authenticator credential to a Clerk userId so a later biometric
// assertion can be verified and exchanged for a real Clerk sign-in token.
export const webauthnCredentialsTable = pgTable("webauthn_credentials", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  credentialId: text("credential_id").notNull().unique(),
  publicKey: text("public_key").notNull(), // base64url-encoded COSE public key
  counter: integer("counter").notNull().default(0),
  deviceLabel: text("device_label").notNull().default("هذا الجهاز"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWebauthnCredentialSchema = createInsertSchema(webauthnCredentialsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertWebauthnCredential = z.infer<typeof insertWebauthnCredentialSchema>;
export type WebauthnCredential = typeof webauthnCredentialsTable.$inferSelect;
