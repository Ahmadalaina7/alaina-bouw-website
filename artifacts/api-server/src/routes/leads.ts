import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { CreateLeadBody, CreateLeadResponse } from "@workspace/api-zod";
import { db, leadsTable } from "@workspace/db";

const router: IRouter = Router();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const requestWindows = new Map<string, { count: number; resetAt: number }>();

function referenceFor(id: string): string {
  return `AB-${id.replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  let window = requestWindows.get(ip);

  if (!window || window.resetAt <= now) {
    window = { count: 0, resetAt: now + WINDOW_MS };
    requestWindows.set(ip, window);
  }

  window.count += 1;

  if (requestWindows.size > 5000) {
    for (const [key, value] of requestWindows) {
      if (value.resetAt <= now) requestWindows.delete(key);
    }
  }

  return window.count > MAX_REQUESTS_PER_WINDOW;
}

router.post("/leads", async (req, res): Promise<void> => {
  if (isRateLimited(req.ip || "unknown")) {
    res.status(429).json({ error: "Er zijn te veel aanvragen verstuurd. Probeer het later opnieuw." });
    return;
  }

  const parsed = CreateLeadBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Controleer de ingevulde gegevens en probeer het opnieuw." });
    return;
  }

  // Honeypot: appear successful to bots, but do not store or notify.
  if (parsed.data.website?.trim()) {
    res.status(201).json(
      CreateLeadResponse.parse({ reference: referenceFor(randomUUID()) }),
    );
    return;
  }

  const data = parsed.data;
  if (
    !data.service.trim() ||
    data.description.trim().length < 10 ||
    data.city.trim().length < 2 ||
    data.name.trim().length < 2 ||
    data.phone.trim().length < 6
  ) {
    res.status(400).json({ error: "Controleer de ingevulde gegevens en probeer het opnieuw." });
    return;
  }

  const [lead] = await db
    .insert(leadsTable)
    .values({
      service: data.service.trim(),
      description: data.description.trim(),
      timeline: data.timeline,
      postalCode: data.postalCode?.trim() || null,
      city: data.city.trim(),
      budget: data.budget ?? null,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim().toLowerCase(),
      contactPreference: data.contactPreference,
      utmSource: data.utmSource?.slice(0, 200) ?? null,
      utmMedium: data.utmMedium?.slice(0, 200) ?? null,
      utmCampaign: data.utmCampaign?.slice(0, 200) ?? null,
    })
    .returning({ id: leadsTable.id });

  if (!lead) {
    throw new Error("Lead insert did not return a record");
  }

  const reference = referenceFor(lead.id);
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;

  if (webhookUrl) {
    try {
      const url = new URL(webhookUrl);
      if (url.protocol !== "https:") {
        throw new Error("Lead webhook URL must use HTTPS");
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, ...data, website: undefined }),
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        throw new Error(`Lead webhook returned ${response.status}`);
      }

      await db
        .update(leadsTable)
        .set({ deliveryStatus: "delivered", notifiedAt: new Date() })
        .where(eq(leadsTable.id, lead.id));
    } catch {
      req.log.warn({ leadId: lead.id }, "Lead saved, but notification delivery failed");
    }
  }

  res.status(201).json(CreateLeadResponse.parse({ reference }));
});

export default router;