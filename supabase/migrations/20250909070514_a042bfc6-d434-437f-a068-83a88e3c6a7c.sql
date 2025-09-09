-- Add has_time_restriction field to menu_items table
ALTER TABLE public.menu_items 
ADD COLUMN has_time_restriction BOOLEAN NOT NULL DEFAULT false;