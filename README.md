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

## Publiceren op Plesk

De GitHub-repository bevat de broncode. Een buildworkflow maakt bij elke push naar `main`
een uploadklare ZIP:

1. Open **Actions → Build website** in GitHub en wacht tot de workflow klaar is.
2. Download het artifact `alaina-bouw-plesk-website` en pak de ZIP uit.
3. Open in Plesk **Bestanden** voor je domein en ga naar de document root (meestal
   `httpdocs`).
4. Upload de inhoud van de ZIP rechtstreeks naar die map. `index.html`, `assets/`,
   `project-photos/` en `.htaccess` moeten direct in de document root staan.

De `.htaccess`-regel stuurt directe bezoeken aan app-pagina's zoals `/diensten` door naar
de React-app. Als Plesk nginx gebruikt zonder Apache `.htaccess`-ondersteuning, stel dan
een SPA-fallback naar `/index.html` in bij de hostinginstellingen.

De statische site en foto's worden met dit artifact meegeleverd. Het offerteformulier
vereist daarnaast een draaiende API-server en database; de backendcode staat in
`artifacts/api-server` en het databaseschema in `lib/db`. De websitebuild alleen start die
server niet. Configureer daarom ook een backend en routeer `/api` ernaartoe voordat je
offerteaanvragen live gebruikt.
