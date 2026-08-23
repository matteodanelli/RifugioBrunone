# Stato della migrazione

Scaffold funzionante: layout condiviso, navigazione, home, e le pagine di contenuto principali
sono state riscritte da zero (non solo "impaginate") a partire dal testo delle vecchie pagine HTML.

## Pagine attuali

```
/                → Home: sfondo fotografico, widget avvisi (letto da D1 a runtime)
/dove-siamo/     → "Accesso al rifugio" (voce di menu: "Info") — sentieri CAI, mappa
                   OpenStreetMap e ascensioni, tutto in una pagina
/il-rifugio/     → Storia del rifugio + sezione "Fotografie" con tutte le 7 gallerie
/contatti/       → Solo testo statico (gestore, telefoni, e-mail, link utili)
/admin/          → Gestione avvisi, protetta da Cloudflare Access
```

Le vecchie `/avvisi/`, `/immagini/` (+ una pagina per galleria), `/mappa/` e `/ascensioni/`
sono state rimosse: i loro contenuti sono stati assorbiti nelle pagine sopra.

## Fatto

- [x] Layout condiviso (`Layout.astro`, `Header.astro` con menu hamburger su mobile,
      `Footer.astro`) con Tailwind
- [x] Home — hero fotografico (testo in alto, icona Facebook sull'immagine), widget avvisi
- [x] Il rifugio — storia (da `rifugio.html`) + tutte e 7 le gallerie del vecchio sito
      (94 foto, copiate 1:1 da `src/main/webapp/photos/<slug>/`), lightbox in vanilla JS
      centrata correttamente, senza flash della foto precedente al cambio immagine
- [x] Dove siamo — sentieri CAI (da `comeraggiungerci.html`), mappa OpenStreetMap
      integrata (con overlay "clicca per attivare", per non zoomarla scorrendo la pagina),
      ascensioni (da `ascensioni.html`)
- [x] Contatti — solo testo statico. Nessun form: non ce n'era uno funzionante nel vecchio
      sito e non ne serve uno nel nuovo (vedi sotto)
- [x] Avvisi — vivono in **Cloudflare D1**, gestiti da `/admin/` (protetta da **Cloudflare
      Access**) senza che il gestore debba toccare Git; letti a runtime dalla home tramite
      l'API pubblica `GET /api/avvisi`
- [x] Deploy su Cloudflare (Workers Builds / Git integration) — vedi README.md.
      `wrangler.jsonc` descrive sia gli asset statici sia un Worker scritto a mano
      (`worker/index.ts`) con binding D1
- [x] Ottimizzazione immagini — pipeline `astro:assets` (Sharp): conversione a WebP,
      foto a piena risoluzione (niente più miniature separate) limitate a 1600px. Uno
      script di post-build (`scripts/prune-unused-assets.mjs`) ripulisce delle copie JPG
      non ottimizzate lasciate da `astro:assets`
- [x] Redirect — `public/_redirects` mappa i vecchi URL `.html`/`.jsp` del sito Java
      (`/rifugio.html`, `/mappa.html`, `/ascensioni.html`, `/immagini.html`, una voce per
      ogni vecchia galleria, ecc.) ai nuovi percorsi con 301, per non perdere il
      posizionamento SEO quando il dominio passa a Cloudflare. Verificato con
      `wrangler dev`: redirect funzionanti, pagine normali non toccate

## Da fare

**Setup produzione avvisi** — se non ancora fatto: creare il database D1, applicare la
migration, configurare l'applicazione Cloudflare Access su `/admin*` (i 3 passaggi one-time
descritti in README.md). Finché Access non è configurato, `/admin/` è raggiungibile ma
**nessuno** — nemmeno il gestore — può pubblicare/cancellare avvisi (il Worker blocca ogni
scrittura senza l'header che solo Access inietta dopo un login riuscito). La lettura
pubblica (`GET /api/avvisi`, il widget in home) invece funziona già, indipendentemente da
Access.

**Avvisi reali** — i due avvisi caricati dalla migration SQL sono di esempio (gli stessi
placeholder creati durante la migrazione dal vecchio sito): da sostituire o cancellare da
`/admin/` una volta operativo. Se servono i dati storici salvati nel Datastore di App
Engine, vanno esportati prima di dismettere il progetto GAE (`gcloud datastore export`) e
inseriti in D1 a mano.

**Mappa Google** — se si preferisce Google Maps a OpenStreetMap, serve registrare una API
key per la Maps Embed API (`https://developers.google.com/maps/documentation/embed`) e
sostituire l'iframe in `src/pages/dove-siamo.astro`.

**SEO/tracking** — da ripristinare/aggiornare: Google Analytics (l'ID `UA-53027708-1`
usato nel vecchio sito è Universal Analytics, dismesso da Google: va sostituito con GA4 o
un'alternativa privacy-friendly come Plausible/Umami), meta tag Open Graph, sitemap
(Astro la genera con `@astrojs/sitemap`).

**Dismissione del vecchio progetto App Engine** — una volta confermato che il nuovo sito
è stabile in produzione: spegnere/eliminare l'app Java su App Engine (risparmio di costo)
e, se non già fatto, esportare i dati dal Datastore prima di cancellarla (vedi sopra).

## Cosa NON serve più migrare

- `LoginServlet` / `UserService` (login Google per l'admin) — sostituito da Cloudflare
  Access davanti a `/admin/`.
- `GestoreAvvisiServlet` / `EliminaAvvisiServlet` / Datastore — sostituiti dal Worker +
  D1 (`worker/index.ts`, `migrations/`) e dalla pagina `/admin/`.
- `prototype.js`, `scriptaculous.js`, jQuery, Bootstrap 3, tema "Agency" — nessuna di queste
  dipendenze è più necessaria con Astro + Tailwind.
- `mail/contact_me.php`, `js/contact_me.js`, `js/jqBootstrapValidation.js` — nel vecchio
  sito non esisteva un form di contatto funzionante e non ne è previsto uno nel nuovo: la
  pagina Contatti resta solo testo statico, per scelta.
