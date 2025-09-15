-- Create categories table for cake categories
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  is_configurable BOOLEAN NOT NULL DEFAULT true,
  min_lead_days INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the four cake categories
INSERT INTO public.categories (name, slug, is_configurable, min_lead_days) VALUES
  ('TORTE IN VETRINA', 'torte-in-vetrina', true, 0),
  ('TORTE DA FORNO', 'torte-da-forno', true, 0),
  ('CROSTATE', 'crostate', true, 0),
  ('CAKE DESIGN', 'cake-design', false, 7);

-- Create category fields table for dynamic form configuration
CREATE TABLE public.category_fields (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  field_key TEXT NOT NULL,
  field_label TEXT NOT NULL,
  field_type TEXT NOT NULL, -- 'date', 'time', 'select', 'number', 'text', 'textarea', 'radio', 'image'
  is_required BOOLEAN NOT NULL DEFAULT false,
  position INTEGER NOT NULL DEFAULT 0,
  options JSONB, -- for select options, radio options, etc.
  rules JSONB, -- for validation rules like min, max, etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(category_id, field_key)
);

-- Create category daily capacity table
CREATE TABLE public.category_daily_capacity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  capacity_date DATE NOT NULL,
  max_orders INTEGER NOT NULL DEFAULT 10,
  current_orders INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(category_id, capacity_date)
);

-- Add category_id to orders table and change structure
ALTER TABLE public.orders ADD COLUMN category_id UUID REFERENCES public.categories(id);

-- Create order field values table for dynamic field data
CREATE TABLE public.order_field_values (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  field_key TEXT NOT NULL,
  field_value TEXT,
  file_url TEXT, -- for image uploads
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update orders status default
ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'Da contattare';

-- Enable RLS on new tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_daily_capacity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_field_values ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for categories (public read, admin write)
CREATE POLICY "Everyone can view categories" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage categories" 
ON public.categories 
FOR ALL 
USING (true);

-- Create RLS policies for category_fields (public read, admin write)
CREATE POLICY "Everyone can view category fields" 
ON public.category_fields 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage category fields" 
ON public.category_fields 
FOR ALL 
USING (true);

-- Create RLS policies for category_daily_capacity (public read, admin write)
CREATE POLICY "Everyone can view daily capacity" 
ON public.category_daily_capacity 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage daily capacity" 
ON public.category_daily_capacity 
FOR ALL 
USING (true);

-- Create RLS policies for order_field_values (everyone can read/insert, admin can update/delete)
CREATE POLICY "Everyone can view order field values" 
ON public.order_field_values 
FOR SELECT 
USING (true);

CREATE POLICY "Everyone can insert order field values" 
ON public.order_field_values 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update order field values" 
ON public.order_field_values 
FOR UPDATE 
USING (true);

CREATE POLICY "Authenticated users can delete order field values" 
ON public.order_field_values 
FOR DELETE 
USING (true);

-- Function to update daily capacity when orders are created
CREATE OR REPLACE FUNCTION public.update_daily_capacity()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update daily capacity counter
  INSERT INTO public.category_daily_capacity (category_id, capacity_date, current_orders)
  VALUES (NEW.category_id, NEW.pickup_date, 1)
  ON CONFLICT (category_id, capacity_date)
  DO UPDATE SET current_orders = category_daily_capacity.current_orders + 1;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update daily capacity
CREATE TRIGGER update_daily_capacity_trigger
  AFTER INSERT ON public.orders
  FOR EACH ROW
  WHEN (NEW.category_id IS NOT NULL AND NEW.pickup_date IS NOT NULL)
  EXECUTE FUNCTION public.update_daily_capacity();