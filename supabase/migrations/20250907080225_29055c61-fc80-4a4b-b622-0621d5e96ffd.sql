-- Create dishes table to store dishes in database
CREATE TABLE public.dishes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create menu_items table for daily menu
CREATE TABLE public.menu_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dish_id uuid NOT NULL REFERENCES public.dishes(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(dish_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access (for customers)
CREATE POLICY "Everyone can view dishes" 
ON public.dishes 
FOR SELECT 
USING (true);

CREATE POLICY "Everyone can view menu items" 
ON public.menu_items 
FOR SELECT 
USING (true);

-- Create policies for authenticated users (admin) to manage dishes
CREATE POLICY "Authenticated users can insert dishes" 
ON public.dishes 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update dishes" 
ON public.dishes 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete dishes" 
ON public.dishes 
FOR DELETE 
TO authenticated
USING (true);

-- Create policies for authenticated users (admin) to manage menu items
CREATE POLICY "Authenticated users can insert menu items" 
ON public.menu_items 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update menu items" 
ON public.menu_items 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete menu items" 
ON public.menu_items 
FOR DELETE 
TO authenticated
USING (true);