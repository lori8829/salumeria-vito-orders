-- Rimuovi il vecchio vincolo sullo stato
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Aggiorna tutti gli ordini esistenti con i nuovi stati
UPDATE public.orders 
SET status = CASE 
    WHEN status IN ('pending', 'Da contattare') THEN 'Ricevuto'
    WHEN status IN ('accepted', 'Accettato') THEN 'Confermato'
    WHEN status IN ('in_preparation', 'In preparazione') THEN 'In preparazione'
    WHEN status IN ('ready', 'Pronto') THEN 'Pronto'
    WHEN status IN ('completed', 'Ritirato') THEN 'Consegnato'
    ELSE status
END;

-- Aggiungi il nuovo vincolo con gli stati corretti
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('Ricevuto', 'Confermato', 'In preparazione', 'Pronto', 'Consegnato', 'archived'));