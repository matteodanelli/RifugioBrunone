# Stato della migrazione

Scaffold funzionante: layout condiviso, navigazione, home, e le pagine di contenuto principali
sono state riscritte da zero (non solo "impaginate") a partire dal testo delle vecchie pagine HTML.

## Fatto

- [x] Layout condiviso (`Layout.astro`, `Header.astro`, `Footer.astro`) con Tailwind
- [x] Home (`/`) — sfondo fotografico nell'hero, widget avvisi (letti a runtime, vedi sotto),
      card di navigazione
- [x] Il rifugio (`/il-rifugio/`) — storia (da `rifugio.html`) + sezione "Fotografie" con
      **tutte e 7 le gallerie del vecchio sito** (94 foto: panorami 36, dafiumenero 11,
      floraefauna 14, vitaalrifugio 9, alredorta 7, piattidelrifugio 5, struttura 2),
      copiate 1:1 da `src/main/webapp/photos/<slug>/` e con lightbox in vanilla JS. Le
      vecchie pagine separate `immagini.html` + una per galleria sono state assorbite qui:
      non esiste più una pagina "Immagini" a sé
- [x] Dove siamo (`/dove-siamo/`) — sentieri CAI, da `comeraggiungerci.html`
- [x] Ascensioni (`/ascensioni/`) — da `ascensioni.html`
- [x] Contatti (`/contatti/`) — solo il testo statico del vecchio `contatti.html`
      (gestore, telefoni, e-mail, link utili). Nessun form, nessun link Facebook: non
      c'era un form funzionante nel vecchio sito (vedi sotto) e non ne serve uno nel nuovo
- [x] Mappa (`/mappa/`) — sostituisce `mappa.html`, che incorporava una Google "My Maps"
      con URL `msid=…` ritirato da Google da anni (probabilmente già rotta). La nuova
      pagina usa OpenStreetMap (livello sentieri, nessuna API key, nessun tracking)
- [x] Avvisi — **non più una pagina a sé** (`/avvisi/` è stata rimossa): si vedono solo in
      home. Non sono più Markdown nel repo: vivono in **Cloudflare D1** e si gestiscono da
      `/admin/`, protetta da **Cloudflare Access**, senza che il gestore del rifugio debba
      toccare Git. Vedi README.md per il setup
- [x] Deploy su Cloudflare (Workers Builds / Git integration) — vedi README.md.
      `wrangler.jsonc` descrive sia gli asset statici sia un Worker scritto a mano
      (`worker/index.ts`) con binding D1, verificato con `wrangler deploy --dry-run`
- [x] Ottimizzazione immagini — tutte le foto (`src/assets/images/`, `src/assets/photos/`)
      passano dalla pipeline `astro:assets` (Sharp): conversione a WebP, thumbnail delle
      gallerie ridimensionate a 400px, foto a piena risoluzione della lightbox limitate a
      1600px. Risultato: **42&nbsp;MB → 20&nbsp;MB** di `dist/`. La versione a piena
      risoluzione resta dentro un `<template>` (non un semplice elemento nascosto via CSS),
      così il browser non la scarica finché non si clicca la foto — altrimenti tutte le
      foto della galleria partirebbero al caricamento della pagina. Uno script di post-build
      (`scripts/prune-unused-assets.mjs`, lanciato automaticamente da `postbuild`) rimuove
      inoltre delle copie JPG non ottimizzate che la pipeline immagini di Astro lascia in
      `dist/_astro/` senza che nessuna pagina le referenzi (una particolarità di come
      `astro:assets` gestisce le immagini importate via `import.meta.glob` anziché con un
      `import` statico diretto) — 40&nbsp;MB altrimenti sprecati a ogni build

## Da fare per completare la migrazione 1:1

**Setup produzione avvisi** — prima del primo deploy vero vanno fatti i 3 passaggi una
tantum descritti in README.md: creare il database D1, applicare la migration, configurare
l'applicazione Cloudflare Access su `/admin*`. Finché non sono fatti, `/admin/` risponde ma
le chiamate a `env.DB` falliscono e `wrangler.jsonc` ha ancora il placeholder
`<REPLACE_WITH_D1_DATABASE_ID>`.

**Avvisi reali** — i due avvisi inseriti dalla migration SQL sono di esempio (gli stessi
placeholder creati durante la migrazione dal vecchio sito). Se servono i dati storici
salvati nel Datastore di App Engine, vanno esportati prima di dismettere il progetto GAE
(`gcloud datastore export`) e poi inseriti in D1.

**Mappa Google** — se si preferisce Google Maps a OpenStreetMap, serve registrare una API
key per la Maps Embed API (`https://developers.google.com/maps/documentation/embed`) e
sostituire l'iframe in `src/pages/mappa.astro`.

**SEO/tracking** — da ripristinare/aggiornare: Google Analytics (l'ID `UA-53027708-1`
usato nel vecchio sito è Universal Analytics, dismesso da Google: va sostituito con GA4 o
un'alternativa privacy-friendly come Plausible/Umami), meta tag Open Graph, sitemap
(Astro la genera con `@astrojs/sitemap`).

**Redirect** — mappare i vecchi URL `.html` (es. `/rifugio.html`, `/immagini.html`,
`/panorami.html`) ai nuovi (es. `/il-rifugio/`) con un file `_redirects`, per non perdere
il posizionamento SEO esistente.

## Cosa NON serve più migrare

- `LoginServlet` / `UserService` (login Google per l'admin) — sostituito da Cloudflare
  Access davanti a `/admin/`.
- `GestoreAvvisiServlet` / `EliminaAvvisiServlet` / Datastore — sostituiti dal Worker +
  D1 (`worker/index.ts`, `migrations/`) e dalla pagina `/admin/`.
- `prototype.js`, `scriptaculous.js`, jQuery, Bootstrap 3, tema "Agency" — nessuna di queste
  dipendenze è più necessaria con Astro + Tailwind.
- `mail/contact_me.php`, `js/contact_me.js`, `js/jqBootstrapValidation.js` — nel vecchio
  sito non esisteva un form di contatto funzionante (vedi sopra) e non ne è previsto uno
  nel nuovo: la pagina Contatti resta solo testo statico, per scelta.
