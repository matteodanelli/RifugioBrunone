// Ogni voce corrisponde a una delle vecchie pagine .html in src/main/webapp
// (panorami.html, vitaalrifugio.html, piattidelrifugio.html, dafiumenero.html,
// alredorta.html, struttura.html, floraefauna.html). Tutte le foto sono state
// copiate 1:1 da src/main/webapp/photos/<slug>/{thumb,original}/. Restano da
// ottimizzare (WebP/AVIF) — vedi MIGRATION.md.
export interface Gallery {
  slug: string;
  title: string;
  cover: string;
  count: number;
  migrated: boolean;
}

export const GALLERIES: Gallery[] = [
  { slug: 'panorami', title: 'Panorami', cover: '/images/panorami.jpg', count: 36, migrated: true },
  { slug: 'vitaalrifugio', title: 'Vita al Rifugio', cover: '/images/vita.jpg', count: 9, migrated: true },
  { slug: 'piattidelrifugio', title: 'Piatti del Rifugio', cover: '/images/piatto.jpg', count: 5, migrated: true },
  { slug: 'dafiumenero', title: 'Salita da Fiumenero', cover: '/images/fiumenero.jpg', count: 11, migrated: true },
  { slug: 'alredorta', title: 'Salita al Redorta', cover: '/images/redorta.jpg', count: 7, migrated: true },
  { slug: 'struttura', title: 'Struttura', cover: '/images/struttura.jpg', count: 2, migrated: true },
  { slug: 'floraefauna', title: 'Flora e Fauna', cover: '/images/ff.jpg', count: 14, migrated: true },
];
