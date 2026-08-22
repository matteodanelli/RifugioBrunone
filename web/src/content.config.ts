import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Sostituisce l'entity "Notice" salvata su App Engine Datastore da GestoreAvvisiServlet.
// Ogni avviso è un file Markdown: aggiungerne uno nuovo (o modificarlo via Decap CMS,
// vedi MIGRATION.md) non richiede più login Google + servlet + datastore.
const avvisi = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/avvisi' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    important: z.boolean().default(false),
  }),
});

export const collections = { avvisi };
