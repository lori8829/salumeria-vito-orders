-- Create tables for pastry shop data
CREATE TABLE public.cake_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.cake_bases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.cake_fillings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.cake_exteriors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.cake_decorations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.cake_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cake_bases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cake_fillings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cake_exteriors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cake_decorations ENABLE ROW LEVEL SECURITY;

-- Create policies for viewing (everyone can view)
CREATE POLICY "Everyone can view cake types" ON public.cake_types FOR SELECT USING (true);
CREATE POLICY "Everyone can view cake bases" ON public.cake_bases FOR SELECT USING (true);
CREATE POLICY "Everyone can view cake fillings" ON public.cake_fillings FOR SELECT USING (true);
CREATE POLICY "Everyone can view cake exteriors" ON public.cake_exteriors FOR SELECT USING (true);
CREATE POLICY "Everyone can view cake decorations" ON public.cake_decorations FOR SELECT USING (true);

-- Create policies for admin operations (authenticated users can manage)
CREATE POLICY "Authenticated users can insert cake types" ON public.cake_types FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update cake types" ON public.cake_types FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete cake types" ON public.cake_types FOR DELETE USING (true);

CREATE POLICY "Authenticated users can insert cake bases" ON public.cake_bases FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update cake bases" ON public.cake_bases FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete cake bases" ON public.cake_bases FOR DELETE USING (true);

CREATE POLICY "Authenticated users can insert cake fillings" ON public.cake_fillings FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update cake fillings" ON public.cake_fillings FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete cake fillings" ON public.cake_fillings FOR DELETE USING (true);

CREATE POLICY "Authenticated users can insert cake exteriors" ON public.cake_exteriors FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update cake exteriors" ON public.cake_exteriors FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete cake exteriors" ON public.cake_exteriors FOR DELETE USING (true);

CREATE POLICY "Authenticated users can insert cake decorations" ON public.cake_decorations FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update cake decorations" ON public.cake_decorations FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete cake decorations" ON public.cake_decorations FOR DELETE USING (true);

-- Update orders table for pastry shop
ALTER TABLE public.orders 
ADD COLUMN cake_design BOOLEAN DEFAULT false,
ADD COLUMN tiers INTEGER,
ADD COLUMN pickup_date DATE,
ADD COLUMN cake_type_id UUID,
ADD COLUMN people_count INTEGER,
ADD COLUMN base_id UUID,
ADD COLUMN filling_id UUID,
ADD COLUMN allergies TEXT,
ADD COLUMN exterior_id UUID,
ADD COLUMN print_option BOOLEAN DEFAULT false,
ADD COLUMN print_type TEXT CHECK (print_type IN ('describe', 'upload')),
ADD COLUMN print_description TEXT,
ADD COLUMN print_image_url TEXT,
ADD COLUMN decoration_id UUID,
ADD COLUMN inscription TEXT,
ADD COLUMN needs_transport BOOLEAN DEFAULT false,
ADD COLUMN is_restaurant BOOLEAN DEFAULT false,
ADD COLUMN delivery_address TEXT,
ADD COLUMN restaurant_contact TEXT;

-- Insert some default data
INSERT INTO public.cake_types (name) VALUES
('Torta di compleanno'),
('Torta nuziale'),
('Torta battesimo'),
('Torta comunione'),
('Torta laurea'),
('Torta personalizzata');

INSERT INTO public.cake_bases (name) VALUES
('Pan di spagna'),
('Base al cioccolato'),
('Base alla vaniglia'),
('Base red velvet'),
('Base carote'),
('Base limone');

INSERT INTO public.cake_fillings (name) VALUES
('Crema pasticcera'),
('Nutella'),
('Crema al cioccolato'),
('Crema alla vaniglia'),
('Crema ai frutti di bosco'),
('Crema al limone'),
('Crema al pistacchio');

INSERT INTO public.cake_exteriors (name) VALUES
('Pasta di zucchero'),
('Panna montata'),
('Ganache al cioccolato'),
('Glassa'),
('Naked cake'),
('Buttercream');

INSERT INTO public.cake_decorations (name) VALUES
('Fiori di zucchero'),
('Perline'),
('Nastri'),
('Figurine personalizzate'),
('Decorazioni gold/silver'),
('Frutta fresca'),
('Cioccolatini');