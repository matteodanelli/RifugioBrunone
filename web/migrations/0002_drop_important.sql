-- Rimuove il concetto di avviso "importante": non più distinto in nessuna interfaccia
-- (né /admin/, né il widget in home). Applicare con:
--   npx wrangler d1 migrations apply rifugio-brunone-avvisi --remote
ALTER TABLE avvisi DROP COLUMN important;
