-- Fix the orders status check constraint to include 'Da contattare'
ALTER TABLE public.orders 
DROP CONSTRAINT orders_status_check;

ALTER TABLE public.orders 
ADD CONSTRAINT orders_status_check 
CHECK (status = ANY (ARRAY['Da contattare'::text, 'Ricevuto'::text, 'Confermato'::text, 'In preparazione'::text, 'Pronto'::text, 'Consegnato'::text, 'archived'::text]));