import { createInsertSchema } from "drizzle-zod";
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const leadDeliveryStatus = pgEnum("lead_delivery_status", [
  "pending",
  "delivered",
]);

export const leadsTable = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  service: text("service").notNull(),
  description: text("description").notNull(),
  timeline: text("timeline").notNull(),
  postalCode: text("postal_code"),
  city: text("city").notNull(),
  budget: text("budget"),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  contactPreference: text("contact_preference").notNull(),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  deliveryStatus: leadDeliveryStatus("delivery_status")
    .notNull()
    .default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  notifiedAt: timestamp("notified_at", { withTimezone: true }),
});

export const insertLeadSchema = createInsertSchema(leadsTable).omit({
  id: true,
  deliveryStatus: true,
  createdAt: true,
  notifiedAt: true,
});
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leadsTable.$inferSelect;