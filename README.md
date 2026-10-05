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

## Publiceren op Cloud86

De GitHub-repository bevat de broncode; upload niet de repository zelf naar de webserver.
Maak eerst lokaal de productieversie:

```bash
pnpm install
pnpm --filter @workspace/alaina-bouw-website run build
```

Upload daarna **de inhoud** van `artifacts/alaina-bouw-website/dist/public` naar de
documentroot van het domein in Cloud86 (bij DirectAdmin is dat doorgaans
`domains/<jouwdomein>/public_html`). De map bevat onder andere `index.html`, `assets/`
en `.htaccess`. Zet de bestanden zelf in de documentroot, niet de map `dist/public`.

Het `.htaccess`-bestand zorgt dat directe bezoeken aan app-pagina's zoals `/diensten`
naar de React-app worden doorgestuurd. De offerteaanvraag wordt niet door deze statische
website opgeslagen: daarvoor moet ook de API-server draaien en moet `/api` naar die server
worden doorgestuurd. Zonder die backend kan de website wel worden bekeken, maar werkt het
versturen van offerteaanvragen niet.
