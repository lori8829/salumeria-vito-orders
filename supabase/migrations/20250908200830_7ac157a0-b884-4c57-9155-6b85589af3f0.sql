-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'archived')),
  total_items INTEGER NOT NULL DEFAULT 0,
  archived_at TIMESTAMP WITH TIME ZONE NULL
);

-- Create order_items table to store individual items in each order
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  dish_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Everyone can view orders" 
ON public.orders 
FOR SELECT 
USING (true);

CREATE POLICY "Everyone can insert orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update orders" 
ON public.orders 
FOR UPDATE 
USING (true);

CREATE POLICY "Authenticated users can delete orders" 
ON public.orders 
FOR DELETE 
USING (true);

-- Create policies for order_items
CREATE POLICY "Everyone can view order items" 
ON public.order_items 
FOR SELECT 
USING (true);

CREATE POLICY "Everyone can insert order items" 
ON public.order_items 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update order items" 
ON public.order_items 
FOR UPDATE 
USING (true);

CREATE POLICY "Authenticated users can delete order items" 
ON public.order_items 
FOR DELETE 
USING (true);