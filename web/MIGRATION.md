# Stato della migrazione

Scaffold funzionante: layout condiviso, navigazione, home, e le pagine di contenuto principali
sono state riscritte da zero (non solo "impaginate") a partire dal testo delle vecchie pagine HTML.

## Fatto

- [x] Layout condiviso (`Layout.astro`, `Header.astro`, `Footer.astro`) con Tailwind
- [x] Home (`/`) con estratto avvisi + card di navigazione
- [x] Il rifugio (`/il-rifugio/`) — storia, da `rifugio.html`
- [x] Dove siamo (`/dove-siamo/`) — sentieri CAI, da `comeraggiungerci.html`
- [x] Ascensioni (`/ascensioni/`) — da `ascensioni.html`
- [x] Contatti (`/contatti/`) — solo il testo statico del vecchio `contatti.html`
      (gestore, telefoni, e-mail, Facebook, link utili). Nessun form: non ce n'era uno
      funzionante nel vecchio sito (vedi sotto) e non ne serve uno nel nuovo
- [x] Avvisi (`/avvisi/`) — Content Collection Markdown al posto di Datastore + `avvisi.jsp`
- [x] Immagini: indice gallerie (`/immagini/`) + pagina galleria dinamica con lightbox
      vanilla JS. **Tutte e 7 le gallerie sono migrate per intero** (94 foto totali:
      panorami 36, dafiumenero 11, floraefauna 14, vitaalrifugio 9, alredorta 7,
      piattidelrifugio 5, struttura 2), copiate 1:1 da `src/main/webapp/photos/<slug>/`
- [x] Mappa (`/mappa/`) — sostituisce `mappa.html`, che incorporava una Google "My Maps"
      con URL `msid=…` ritirato da Google da anni (probabilmente già rotta). La nuova
      pagina usa OpenStreetMap (livello sentieri, nessuna API key, nessun tracking)
- [x] Deploy su Cloudflare (Workers Builds / Git integration) — vedi README.md. Il sito è
      interamente statico (nessuna pagina server-rendered): niente adapter Cloudflare,
      solo `wrangler.jsonc` che pubblica `dist/` come asset — verificato con
      `wrangler deploy --dry-run`

## Da fare per completare la migrazione 1:1

**Ottimizzazione immagini** — le ~94 foto (42&nbsp;MB) sono state copiate 1:1 in
`public/photos/`. Vale la pena, come passaggio successivo, **ottimizzarle** (WebP/AVIF,
dimensioni ridotte): è la parte che pesa di più sulle performance del vecchio sito.
`astro:assets` può generarle automaticamente se le immagini vengono importate come moduli
invece che servite da `public/`.

**Mappa Google** — se si preferisce Google Maps a OpenStreetMap, serve registrare una API
key per la Maps Embed API (`https://developers.google.com/maps/documentation/embed`) e
sostituire l'iframe in `src/pages/mappa.astro`.

**Avvisi reali** — i due file in `src/content/avvisi/` sono di esempio. Se servono i dati
storici salvati nel Datastore di App Engine, vanno esportati prima di dismettere il progetto
GAE (`gcloud datastore export`) e poi convertiti in Markdown.

**Editing avvisi da parte del gestore** — oggi richiede un commit Git. Se il gestore del
rifugio deve poter pubblicare avvisi da solo senza toccare codice: **Decap CMS** (gratuito,
git-based), un editor web che scrive direttamente i file Markdown in `src/content/avvisi/`,
protetto da login (es. Cloudflare Access con Google).

**SEO/tracking** — da ripristinare/aggiornare: Google Analytics (l'ID `UA-53027708-1`
usato nel vecchio sito è Universal Analytics, dismesso da Google: va sostituito con GA4 o
un'alternativa privacy-friendly come Plausible/Umami), meta tag Open Graph, sitemap
(Astro la genera con `@astrojs/sitemap`).

**Redirect** — mappare i vecchi URL `.html` (es. `/rifugio.html`) ai nuovi (es.
`/il-rifugio/`) con un file `_redirects` per Cloudflare Pages, per non perdere il
posizionamento SEO esistente.

## Cosa NON serve più migrare

- `LoginServlet` / `UserService` (login Google per l'admin) — sostituito da Cloudflare
  Access, se si adotta Decap CMS, o non più necessario se gli avvisi si editano via Git.
- `GestoreAvvisiServlet` / `EliminaAvvisiServlet` / Datastore — sostituiti dalla Content
  Collection Markdown.
- `prototype.js`, `scriptaculous.js`, jQuery, Bootstrap 3, tema "Agency" — nessuna di queste
  dipendenze è più necessaria con Astro + Tailwind.
- `mail/contact_me.php`, `js/contact_me.js`, `js/jqBootstrapValidation.js` — nel vecchio
  sito non esisteva un form di contatto funzionante (vedi sopra) e non ne è previsto uno
  nel nuovo: la pagina Contatti resta solo testo statico, per scelta.
