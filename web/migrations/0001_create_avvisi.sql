-- Sostituisce l'entity "Notice" del vecchio Datastore di App Engine e, dopo, la Content
-- Collection Markdown: ora gli avvisi vivono in D1, gestibili dal gestore del rifugio via
-- /admin/ senza toccare Git. Applicare con:
--   npx wrangler d1 migrations apply rifugio-brunone-avvisi --remote
CREATE TABLE IF NOT EXISTS avvisi (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  date TEXT NOT NULL,       -- formato YYYY-MM-DD
  important INTEGER NOT NULL DEFAULT 0
);

-- Dati di esempio (gli stessi due avvisi placeholder creati durante la migrazione dal
-- vecchio sito): rimuovili pure da /admin/ una volta che il gestore inserisce avvisi reali.
INSERT INTO avvisi (title, text, date, important) VALUES
  ('Apertura stagione estiva', 'Il rifugio è aperto dal 15 giugno tutti i giorni. Per i gruppi numerosi si consiglia la prenotazione telefonica.', '2016-06-15', 1),
  ('Manutenzione sentiero CAI 227', 'Sono in corso lavori di manutenzione ordinaria sul sentiero CAI 227 da Fiumenero: il percorso resta comunque percorribile senza deviazioni.', '2016-07-02', 0);
