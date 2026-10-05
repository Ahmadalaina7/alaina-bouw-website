# Alaina Bouw Klusbedrijf – website

pnpm-workspace met de website, de API voor het aanvraagformulier en gedeelde libraries.

| Map | Inhoud |
| --- | --- |
| `artifacts/alaina-bouw-website` | Website (React + Vite + Tailwind CSS) |
| `artifacts/api-server` | API die offerteaanvragen opslaat (`POST /api/leads`) |
| `lib/db` | Databaseschema (PostgreSQL, Drizzle) |
| `lib/api-spec`, `lib/api-zod`, `lib/api-client-react` | OpenAPI-specificatie en gegenereerde client/validatie |

## Bedrijfsgegevens invullen

Alle bedrijfsgegevens staan in één bestand:
`artifacts/alaina-bouw-website/src/config/site.ts`.

Vul daar `phone`, `whatsapp`, `email`, `address`, `kvk` en `btw` in. Lege velden worden
automatisch verborgen. Zodra een telefoonnummer is ingevuld, verschijnen er ook belknoppen
in de header, het mobiele menu en de actiebalk onderin op mobiel.

Diensten, projectfoto's en de werkwijze staan in hetzelfde bestand.

## Lokaal ontwikkelen

```bash
pnpm install
pnpm --filter @workspace/alaina-bouw-website run dev      # website op http://localhost:5173

# Voor het formulier: API + database (de website stuurt /api door naar poort 8080)
DATABASE_URL=postgres://... pnpm --filter @workspace/db run push-force
DATABASE_URL=postgres://... PORT=8080 pnpm --filter @workspace/api-server run dev
```

## Productie-build

```bash
pnpm run typecheck
pnpm --filter @workspace/alaina-bouw-website run build
```

De statische website staat daarna in `artifacts/alaina-bouw-website/dist/public`.
Laat de webserver alle onbekende paden naar `index.html` doorsturen (single-page app).

Het formulier verstuurt naar `/api/leads`. Start daarvoor `@workspace/api-server` met
`PORT` en `DATABASE_URL`. Optioneel stuurt `LEAD_WEBHOOK_URL` (https) elke aanvraag door,
bijvoorbeeld naar e-mail of een automatiseringstool.
