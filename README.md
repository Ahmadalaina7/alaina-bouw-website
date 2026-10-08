# Alaina Bouw Klusbedrijf – website

pnpm-workspace met de website, de API voor het aanvraagformulier en gedeelde libraries.

| Map | Inhoud |
| --- | --- |
| `artifacts/alaina-bouw-website` | Website (React + Vite + Tailwind CSS) |
| `api` | PHP-mailendpoint voor de Cloud86/Plesk-deployment (`POST /api/leads`) |
| `artifacts/api-server` | Optionele Node.js API voor lokale/andere deployments |
| `lib/db` | Databaseschema (PostgreSQL, Drizzle) |
| `lib/api-spec`, `lib/api-zod`, `lib/api-client-react` | OpenAPI-specificatie en gegenereerde client/validatie |

## Bedrijfsgegevens invullen

Alle bedrijfsgegevens staan in één bestand:
`artifacts/alaina-bouw-website/src/config/site.ts`.

Vul daar `phone`, `whatsapp`, `email`, `address`, `kvk` en `btw` in. Lege velden worden
automatisch verborgen. Zodra een telefoonnummer is ingevuld, verschijnen er ook belknoppen
in de desktop-header en het mobiele menu.

Diensten, projectfoto's en de werkwijze staan in hetzelfde bestand.

## Lokaal ontwikkelen

```bash
pnpm install
pnpm --filter @workspace/alaina-bouw-website run dev      # website op http://localhost:5173

# Optionele Node.js API voor lokaal ontwikkelen (database nodig)
DATABASE_URL=postgres://... pnpm --filter @workspace/db run push-force
DATABASE_URL=postgres://... PORT=8080 pnpm --filter @workspace/api-server run dev
```

### E-mail voor offerteaanvragen op Cloud86

De PHP-handler stuurt elke aanvraag naar `info@alainabouw.nl` en stuurt de aanvrager een
ontvangstbevestiging met het bedrijfslogo. Er is geen Formspree-account, Node.js-app of
database nodig op Cloud86. PHPMailer is opgenomen in `api/vendor`.

1. Controleer in Plesk bij **Websites & Domains → PHP Settings** dat PHP 8.1 of hoger actief is
   en de extensie `mbstring` is ingeschakeld.
2. Kopieer in de Plesk File Manager `api/config.example.php` naar `api/config.local.php`.
3. Vul in `config.local.php` het mailboxwachtwoord van `info@alainabouw.nl` in bij `smtp_password`.
   De SMTP-host is `shared225.cloud86-host.io` en de SSL-poort is `465`.
4. Haal/deploy de nieuwste repositorybestanden op naar de document root van het domein.
   De lokale `api/config.local.php` wordt door Git genegeerd en wordt niet gepubliceerd.
5. Test het offerteformulier met je eigen e-mailadres.

Bewaar het wachtwoord alleen in `api/config.local.php` op de Cloud86-hosting, nooit in Git.
Toegang tot dat configuratiebestand wordt via `api/.htaccess` geblokkeerd. Als SMTP ontbreekt
of verzending mislukt, verschijnt een foutmelding en wordt de aanvraag niet als verzonden bevestigd.

## Productie-build

```bash
pnpm run typecheck
pnpm --filter @workspace/alaina-bouw-website run build
```

De statische website staat daarna in `artifacts/alaina-bouw-website/dist/public`.
Laat de webserver alle onbekende paden naar `index.html` doorsturen (single-page app).

Het formulier verstuurt naar `/api/leads`. Op Cloud86 herschrijft `.htaccess` deze route naar
`api/leads.php`; het PHP-endpoint verstuurt de aanvraag- en bevestigingsmails via Cloud86 SMTP.

## Publiceren via Git in Plesk

Plesk moet de Git-repository deployen naar de document root van het domein (meestal
`httpdocs`). De repository-hoofdmap bevat de gebouwde `index.html`, `assets/`,
`project-photos/` en `.htaccess`, zodat Plesk geen Node.js-app hoeft te starten.

Bij iedere push naar `main` bouwt GitHub Actions de website en commit het bijgewerkte
statische resultaat terug naar `main`. Stel in Plesk Git de branch in op `main` en kies
automatische deployment. Haal de huidige branch in Plesk op/deploy hem na de eerste
configuratie; de workflow-run die de statische bestanden toevoegt, is te vinden onder
**GitHub → Actions → Build website**.

De `.htaccess`-regel stuurt directe bezoeken aan app-pagina's zoals `/diensten` door naar
de React-app. Als Plesk nginx gebruikt zonder Apache `.htaccess`-ondersteuning, stel dan
een SPA-fallback naar `/index.html` in bij de hostinginstellingen.

Als Plesk nginx gebruikt zonder Apache `.htaccess`-ondersteuning, moet `/api/leads` apart naar
`/api/leads.php` worden gerouteerd. Zonder PHP-ondersteuning of de lokale mailconfiguratie kan
het formulier geen e-mails versturen.
