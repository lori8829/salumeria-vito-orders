-- Update the orders status check constraint to include all Italian status values
ALTER TABLE public.orders 
DROP CONSTRAINT orders_status_check;

ALTER TABLE public.orders 
ADD CONSTRAINT orders_status_check 
CHECK (status = ANY (ARRAY[
  'Da contattare'::text,
  'ricevuto'::text, 
  'accettato'::text,
  'in preparazione'::text,
  'in cottura'::text,
  'pronto'::text,
  'consegnato'::text,
  'archived'::text
]));