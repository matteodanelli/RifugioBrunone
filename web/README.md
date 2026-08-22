# Rifugio Brunone — nuovo sito (Astro)

Riscrittura del sito storico (Java Servlet/JSP su Google App Engine Standard legacy, in
`../src/main/webapp`) come sito moderno per **Cloudflare**: quasi tutto statico, con un
piccolo Worker scritto a mano solo per la gestione degli avvisi (letti da tutti, scritti
dal gestore del rifugio da un'area riservata, senza bisogno di Git).

## Stack

- [Astro](https://astro.build) — pagine statiche, zero JS lato client salvo dove serve
  (nav mobile, lightbox delle gallerie, widget avvisi)
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- `astro:assets` (Sharp) per l'ottimizzazione immagini: conversione WebP + resize a build
  time, foto sorgente in `src/assets/`
- Un Worker Cloudflare scritto a mano (`worker/index.ts`, non generato da Astro) + **D1**
  per gli avvisi, protetto da **Cloudflare Access** per la sola parte di scrittura

## Sviluppo locale

```bash
npm install
npm run dev       # http://localhost:4321 — sito Astro, senza le API avvisi
npm run build     # genera dist/ (+ pulizia automatica via postbuild)
npm run preview   # serve la build in locale
npm run check     # type-check di Astro + del Worker
```

Per testare anche le API avvisi in locale (Worker + D1 emulati):

```bash
npx wrangler d1 execute rifugio-brunone-avvisi --local --file=migrations/0001_create_avvisi.sql
npm run dev:worker   # wrangler dev, serve dist/ + le API su un'unica porta
```

`wrangler dev` serve però la build già pronta in `dist/`: dopo ogni modifica alle pagine
Astro va rilanciato `npm run build`.

## Gli avvisi (senza Git)

Prima erano file Markdown nel repo; ora vivono in **Cloudflare D1** (`migrations/0001_create_avvisi.sql`
per lo schema) e si gestiscono da **`/admin/`**, una pagina non collegata nel menu,
raggiungibile solo con l'URL diretto. Il gestore del rifugio pubblica/elimina avvisi da lì,
senza commit né conoscenza di Git.

Come funziona:

- `GET /api/avvisi` — pubblica, la usa il widget "Avvisi" in home (lettura client-side via
  `fetch`, non a build time: altrimenti ogni avviso richiederebbe un rebuild+deploy).
- `/admin/api/*` — protette da **Cloudflare Access**: solo chi supera il login (email del
  gestore) può leggere/scrivere. Il Worker fa anche un controllo di difesa in profondità
  sull'header `Cf-Access-Jwt-Assertion`.
- Tutto il resto della richiesta ricade sugli asset statici (`env.ASSETS.fetch()`).

### Setup una tantum

1. **Crea il database D1**:
   ```bash
   npx wrangler d1 create rifugio-brunone-avvisi
   ```
   Copia l'`database_id` restituito dentro `wrangler.jsonc` (sostituisce il placeholder
   `<REPLACE_WITH_D1_DATABASE_ID>`).

2. **Applica lo schema**:
   ```bash
   npx wrangler d1 migrations apply rifugio-brunone-avvisi --remote
   ```
   (Include due avvisi di esempio, gli stessi placeholder creati durante la migrazione dal
   vecchio sito — cancellali da `/admin/` quando ci sono avvisi reali.)

3. **Configura Cloudflare Access** (dashboard → Zero Trust → Access → Applications):
   - Nuova applicazione "Self-hosted", dominio `rifugiobrunone.it`, path `/admin*`.
   - Una policy che autorizza solo l'email del gestore (login "One-time PIN": riceve un
     codice via email, nessuna password da ricordare).
   - Fatto: da quel momento `/admin/` (pagina e API) richiede quel login.

## Deploy su Cloudflare (Workers Builds / Git integration)

Il repo Git contiene sia il vecchio progetto Java (root) sia questo sito (`web/`): nel
progetto Cloudflare va quindi impostata la **Root directory** su `web`.

Campi da compilare nella dashboard Cloudflare (Workers & Pages → il progetto → Settings →
Build):

| Campo | Valore |
|---|---|
| Root directory | `web` |
| Build command | `npm install && npm run build` |
| Deploy command | `npx wrangler deploy` |

`wrangler.jsonc` descrive sia gli asset statici (`assets.directory: ./dist`) sia il Worker
(`main: worker/index.ts`) con il binding D1 (`env.DB`). Verificato con
`npx wrangler deploy --dry-run`: legge ~195 file da `dist/` (~20&nbsp;MB, dopo
l'ottimizzazione immagini) e mostra i binding `env.DB` e `env.ASSETS`.

`npm run build` lancia in automatico anche `postbuild` (`scripts/prune-unused-assets.mjs`),
che ripulisce da `dist/_astro/` delle copie JPG non ottimizzate lasciate lì dalla pipeline
immagini di Astro (vedi commento in cima allo script) — senza questo passaggio `dist/`
pesa il doppio.

Infine collega il dominio `rifugiobrunone.it` in **Custom domains**.

## Struttura

```
src/
  assets/images/, assets/photos/  immagini sorgente (passano da astro:assets in build)
  layouts/Layout.astro             header + footer + <head> comuni
  components/                      Header, Footer
  data/galleries.ts                catalogo delle gallerie fotografiche
  pages/                           una pagina per route (index, il-rifugio, dove-siamo, ...)
  pages/il-rifugio.astro           storia + tutte le gallerie fotografiche, con lightbox
  pages/admin/index.astro          gestione avvisi (protetta da Cloudflare Access)
worker/index.ts                    Worker: API avvisi (pubblica + admin) + fallback statico
migrations/                        schema e seed data D1 per gli avvisi
scripts/prune-unused-assets.mjs    pulizia post-build degli asset non referenziati
wrangler.jsonc                     config di deploy: assets + Worker + binding D1
```

Per lo stato della migrazione e cosa manca vedi [MIGRATION.md](./MIGRATION.md).
