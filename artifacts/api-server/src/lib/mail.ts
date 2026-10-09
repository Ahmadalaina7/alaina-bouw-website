import { readFile } from "node:fs/promises";
import { createTransport } from "nodemailer";
import type { LeadInput } from "@workspace/api-zod";
import type { LeadUpload } from "./uploads";

const BUSINESS_EMAIL = "info@alainabouw.nl";
const LOGO_CID = "alaina-bouw-logo";

const timelineLabels: Record<LeadInput["timeline"], string> = {
  asap: "Zo snel mogelijk",
  within_month: "Binnen een maand",
  one_to_three_months: "1 – 3 maanden",
  three_to_six_months: "3 – 6 maanden",
  exploring: "Ik oriënteer me nog",
};

const budgetLabels: Record<NonNullable<LeadInput["budget"]>, string> = {
  under_2500: "Tot € 2.500",
  "2500_5000": "€ 2.500 – 5.000",
  "5000_10000": "€ 5.000 – 10.000",
  "10000_25000": "€ 10.000 – 25.000",
  over_25000: "Meer dan € 25.000",
  undecided: "Weet ik nog niet",
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char]!;
  });
}

function getTransport() {
  const host = process.env.SMTP_HOST || "shared225.cloud86-host.io";
  const port = Number(process.env.SMTP_PORT || "465");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !Number.isInteger(port) || port < 1 || port > 65535 || !user || !pass) {
    throw new Error("SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS must be configured");
  }

  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === "true"
    : port === 465;

  return createTransport({
    host,
    port,
    secure,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
    auth: { user, pass },
  });
}

function layout(content: string): string {
  return `<!doctype html>
<html lang="nl">
  <body style="margin:0;background:#f7f5f2;padding:32px 16px;font-family:Arial,sans-serif;color:#1b1817">
    <table role="presentation" style="width:100%;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e3ddd5;border-radius:16px;border-spacing:0;overflow:hidden">
      <tr><td style="padding:28px 32px;border-bottom:1px solid #e3ddd5">
        <img src="cid:${LOGO_CID}" width="48" height="40" alt="Alaina Bouw" style="display:block;width:48px;height:40px">
        <p style="margin:12px 0 0;color:#a90f14;font-size:18px;font-weight:bold;letter-spacing:2px">ALAINA BOUW</p>
        <p style="margin:4px 0 0;color:#6b645e;font-size:11px;font-weight:bold;letter-spacing:3px">KLUSBEDRIJF</p>
      </td></tr>
      <tr><td style="padding:28px 32px 32px">${content}</td></tr>
      <tr><td style="padding:18px 32px;border-top:1px solid #e3ddd5;color:#6b645e;font-size:12px">
        Alaina Bouw Klusbedrijf · <a href="mailto:${BUSINESS_EMAIL}" style="color:#a90f14">${BUSINESS_EMAIL}</a>
      </td></tr>
    </table>
  </body>
</html>`;
}

function detail(label: string, value: string): string {
  return `<tr><td style="padding:9px 0;border-bottom:1px solid #eee9e3;color:#6b645e;vertical-align:top">${escapeHtml(label)}</td><td style="padding:9px 0;border-bottom:1px solid #eee9e3;color:#1b1817;vertical-align:top;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`;
}

export async function sendLeadEmails(data: LeadInput, reference: string, uploads: LeadUpload[] = []): Promise<void> {
  const transport = getTransport();
  const logo = await readFile(new URL("./assets/logo-mark.png", import.meta.url));
  const greetingName = escapeHtml(data.name.trim().split(/\s+/)[0] ?? data.name);
  const rows = [
    detail("Soort werk", data.service.replaceAll("-", " ")),
    detail("Omschrijving", data.description),
    detail("Gewenste planning", timelineLabels[data.timeline]),
    detail("Plaats", data.city),
    ...(data.postalCode ? [detail("Postcode", data.postalCode)] : []),
    ...(data.budget ? [detail("Budgetindicatie", budgetLabels[data.budget])] : []),
  ].join("");
  const attachmentNote = uploads.length
    ? `Bijlagen: ${uploads.map((file) => file.filename).join(", ")}`
    : "";
  const logoAttachment = {
    filename: "alaina-bouw-logo.png",
    content: logo,
    cid: LOGO_CID,
  };

  await transport.sendMail({
    from: `"Alaina Bouw Klusbedrijf" <${BUSINESS_EMAIL}>`,
    to: BUSINESS_EMAIL,
    replyTo: data.email,
    subject: `Nieuwe offerteaanvraag ${reference} – ${data.name}`,
    text: [
      `Nieuwe offerteaanvraag ${reference}`,
      `Naam: ${data.name}`,
      `E-mail: ${data.email}`,
      `Telefoon: ${data.phone}`,
      `Soort werk: ${data.service}`,
      `Omschrijving: ${data.description}`,
      `Planning: ${timelineLabels[data.timeline]}`,
      `Plaats: ${data.city}`,
      ...(data.postalCode ? [`Postcode: ${data.postalCode}`] : []),
      ...(data.budget ? [`Budget: ${budgetLabels[data.budget]}`] : []),
      `Contactvoorkeur: ${data.contactPreference}`,
      ...(attachmentNote ? [attachmentNote] : []),
      `Referentie: ${reference}`,
    ].join("\n"),
    html: layout(
      `<h1 style="margin:0 0 8px;font-size:24px">Nieuwe offerteaanvraag</h1>
       <p style="margin:0 0 20px;color:#6b645e">Referentie: <strong>${escapeHtml(reference)}</strong></p>
       <table role="presentation" style="width:100%;border-spacing:0;font-size:14px">
         ${detail("Naam", data.name)}
         ${detail("E-mail", data.email)}
         ${detail("Telefoon", data.phone)}
         ${rows}
         ${detail("Contactvoorkeur", data.contactPreference)}
         ${attachmentNote ? detail("Bijlagen", uploads.map((file) => file.filename).join(", ")) : ""}
       </table>`,
    ),
    attachments: [
      logoAttachment,
      ...uploads.map((file) => ({
        filename: file.filename,
        content: file.content,
        contentType: file.contentType,
      })),
    ],
  });

  await transport.sendMail({
    from: `"Alaina Bouw Klusbedrijf" <${BUSINESS_EMAIL}>`,
    to: data.email,
    replyTo: BUSINESS_EMAIL,
    subject: `We hebben uw aanvraag ontvangen (${reference})`,
    text: [
      `Beste ${data.name.trim().split(/\s+/)[0]},`,
      "",
      "Bedankt voor uw aanvraag. We hebben uw bericht goed ontvangen en nemen contact met u op.",
      "",
      `Soort werk: ${data.service}`,
      `Omschrijving: ${data.description}`,
      `Planning: ${timelineLabels[data.timeline]}`,
      `Plaats: ${data.city}`,
      ...(data.postalCode ? [`Postcode: ${data.postalCode}`] : []),
      ...(data.budget ? [`Budgetindicatie: ${budgetLabels[data.budget]}`] : []),
      ...(uploads.length ? [`Meegestuurde bestanden: ${uploads.length}`] : []),
      "",
      `Uw referentie: ${reference}`,
      "",
      "Met vriendelijke groet,",
      "Alaina Bouw Klusbedrijf",
    ].join("\n"),
    html: layout(
      `<h1 style="margin:0 0 12px;font-size:24px">Bedankt voor uw aanvraag, ${greetingName}</h1>
       <p style="margin:0 0 20px;line-height:1.65;color:#4b4541">We hebben uw bericht goed ontvangen en nemen contact met u op.</p>
       <p style="margin:0 0 16px;padding:14px 16px;border-radius:10px;background:#f7e7e6;color:#820b0f;font-size:14px">
         Uw referentie: <strong>${escapeHtml(reference)}</strong>
       </p>
       <h2 style="margin:24px 0 8px;font-size:17px">Uw aanvraag</h2>
       <table role="presentation" style="width:100%;border-spacing:0;font-size:14px">
         ${detail("Soort werk", data.service.replaceAll("-", " "))}
         ${detail("Omschrijving", data.description)}
         ${detail("Gewenste planning", timelineLabels[data.timeline])}
         ${detail("Plaats", data.city)}
         ${data.postalCode ? detail("Postcode", data.postalCode) : ""}
         ${data.budget ? detail("Budgetindicatie", budgetLabels[data.budget]) : ""}
         ${uploads.length ? detail("Meegestuurde bestanden", String(uploads.length)) : ""}
       </table>
       <p style="margin:24px 0 0;line-height:1.65;color:#4b4541">Met vriendelijke groet,<br><strong>Alaina Bouw Klusbedrijf</strong></p>`,
    ),
    attachments: [logoAttachment],
  });
}
