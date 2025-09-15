-- Rimuoviamo le tabelle della gestione opzioni che non servono più
-- dato che ora le opzioni vengono configurate direttamente nei campi delle categorie

DROP TABLE IF EXISTS cake_bases CASCADE;
DROP TABLE IF EXISTS cake_decorations CASCADE;
DROP TABLE IF EXISTS cake_exteriors CASCADE;
DROP TABLE IF EXISTS cake_fillings CASCADE;
DROP TABLE IF EXISTS cake_types CASCADE;
DROP TABLE IF EXISTS dishes CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;