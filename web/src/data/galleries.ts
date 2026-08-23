// Ogni voce corrisponde a una delle vecchie pagine .html in src/main/webapp
// (panorami.html, vitaalrifugio.html, piattidelrifugio.html, dafiumenero.html,
// alredorta.html, struttura.html, floraefauna.html). Le foto vivono in
// src/assets/photos/<slug>/{thumb,original}/ e passano dalla pipeline immagini di
// Astro (conversione WebP, resize) invece di essere servite 1:1 da public/. Renderizzate
// tutte insieme nella sezione "Fotografie" di /il-rifugio/ (vedi src/pages/il-rifugio.astro).
export interface Gallery {
  slug: string;
  title: string;
  count: number;
  hidden?: boolean;
}

export const GALLERIES: Gallery[] = [
  { slug: 'panorami', title: 'Panorami', count: 36 },
  { slug: 'vitaalrifugio', title: 'Vita al Rifugio', count: 9 },
  { slug: 'piattidelrifugio', title: 'Piatti del Rifugio', count: 5 },
  { slug: 'dafiumenero', title: 'Salita da Fiumenero', count: 11 },
  { slug: 'alredorta', title: 'Salita al Redorta', count: 7 },
  // Foto poco significative rispetto alle altre gallerie: nascosta su richiesta, dati e
  // foto restano al loro posto — basta togliere "hidden" per farla ricomparire.
  { slug: 'struttura', title: 'Struttura', count: 2, hidden: true },
  { slug: 'floraefauna', title: 'Flora e Fauna', count: 14 },
];
