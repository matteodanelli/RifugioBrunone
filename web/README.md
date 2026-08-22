# Rifugio Brunone — nuovo sito (Astro)

Riscrittura del sito storico (Java Servlet/JSP su Google App Engine Standard legacy, in
`../src/main/webapp`) come sito statico moderno per **Cloudflare** (nessun form contatti,
nessuna logica server-side: solo pagine statiche).

## Stack

- [Astro](https://astro.build) — pagine statiche, zero JS lato client salvo dove serve
  (nav mobile, lightbox delle gallerie)
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Content Collections in Markdown per gli "avvisi" (sostituisce App Engine Datastore + JSP)

## Sviluppo locale

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # output in dist/
npm run preview   # serve la build in locale
```

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

Il sito è interamente statico (nessuna pagina server-rendered), quindi `wrangler.jsonc`
nella root del progetto descrive solo gli asset da pubblicare (`assets.directory: ./dist`),
senza Worker né binding. Verificato con `npx wrangler deploy --dry-run`: legge 239 file da
`dist/` e non richiede alcun binding.

Infine collega il dominio `rifugiobrunone.it` in **Custom domains**.

## Struttura

```
src/
  layouts/Layout.astro         header + footer + <head> comuni
  components/                  Header, Footer
  content/avvisi/*.md          avvisi (sostituiscono le entity "Notice" su Datastore)
  data/galleries.ts            catalogo delle gallerie fotografiche
  pages/                       una pagina per route (index, il-rifugio, dove-siamo, ...)
  pages/immagini/[slug].astro  galleria dinamica con lightbox in vanilla JS
wrangler.jsonc                 config di deploy (assets-only, nessun Worker)
```

Per lo stato della migrazione e cosa manca vedi [MIGRATION.md](./MIGRATION.md).
