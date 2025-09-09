-- Add customer information and pickup time to orders table
ALTER TABLE public.orders 
ADD COLUMN customer_name text,
ADD COLUMN customer_surname text, 
ADD COLUMN customer_phone text,
ADD COLUMN pickup_time text;