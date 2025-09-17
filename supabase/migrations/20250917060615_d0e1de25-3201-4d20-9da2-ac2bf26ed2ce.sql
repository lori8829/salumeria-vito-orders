-- Fix the status default value to match the check constraint
-- The constraint requires 'Ricevuto' (capital R) but default is 'ricevuto' (lowercase r)

ALTER TABLE public.orders 
ALTER COLUMN status SET DEFAULT 'Ricevuto';