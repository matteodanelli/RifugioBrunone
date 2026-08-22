import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Sito interamente statico: nessuna pagina è server-rendered (niente form contatti,
// niente altra logica dinamica), quindi non serve un adapter Cloudflare/Worker — solo
// `wrangler deploy` che pubblica la cartella `dist/` come asset statici. Vedi README.md.
export default defineConfig({
  site: 'https://www.rifugiobrunone.it',
  vite: {
    plugins: [tailwindcss()],
  },
});
