// La pipeline immagini di Astro (astro:assets) lascia in dist/_astro/ anche delle copie
// non ottimizzate delle foto "original" usate solo per generare la versione WebP a piena
// risoluzione della lightbox (vedi src/pages/immagini/[slug].astro) — copie mai referenziate
// da nessuna pagina HTML generata. Questo script, eseguito dopo ogni build (postbuild),
// le individua e le rimuove: legge ogni file .html generato, e cancella da dist/_astro/
// qualunque asset il cui nome non compaia in nessuna pagina.
import { readdir, readFile, stat, unlink } from 'node:fs/promises';
import { join, extname } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const ASSETS_DIR = join(DIST, '_astro');

async function walk(dir, exts) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full, exts)));
    } else if (exts.includes(extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

const htmlFiles = await walk(DIST, ['.html']);
const htmlContents = await Promise.all(htmlFiles.map((f) => readFile(f, 'utf8')));
const combinedHtml = htmlContents.join('\n');

const assetFiles = await walk(ASSETS_DIR, ['.jpg', '.jpeg', '.png']);

let freedBytes = 0;
let removed = 0;
for (const file of assetFiles) {
  const name = file.slice(ASSETS_DIR.length + 1);
  if (!combinedHtml.includes(name)) {
    const { size } = await stat(file);
    await unlink(file);
    freedBytes += size;
    removed += 1;
  }
}

if (removed > 0) {
  console.log(
    `[prune-unused-assets] rimossi ${removed} file non referenziati da dist/_astro/ (${(freedBytes / 1024 / 1024).toFixed(1)} MB liberati)`,
  );
} else {
  console.log('[prune-unused-assets] nessun asset non referenziato trovato');
}
