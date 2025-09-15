-- Remove the constraint entirely first
ALTER TABLE public.orders 
DROP CONSTRAINT IF EXISTS orders_status_check;

-- Update all existing orders to use consistent Italian status values
UPDATE public.orders 
SET status = CASE 
  WHEN status = 'pending' THEN 'Da contattare'
  WHEN status = 'completed' THEN 'consegnato'
  WHEN status = 'archived' THEN 'archived'
  ELSE status
END;

-- Now add the new constraint
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