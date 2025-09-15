-- First update existing orders to use Italian status values
UPDATE public.orders 
SET status = CASE 
  WHEN status = 'pending' THEN 'Da contattare'
  WHEN status = 'completed' THEN 'consegnato'
  WHEN status = 'archived' THEN 'archived'
  ELSE status
END;

-- Drop the old constraint
ALTER TABLE public.orders 
DROP CONSTRAINT orders_status_check;

-- Add the new constraint with Italian status values
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