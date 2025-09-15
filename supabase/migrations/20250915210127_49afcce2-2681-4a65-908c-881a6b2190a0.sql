-- Update the default status for orders to be 'ricevuto' instead of 'Da contattare'
ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'ricevuto';