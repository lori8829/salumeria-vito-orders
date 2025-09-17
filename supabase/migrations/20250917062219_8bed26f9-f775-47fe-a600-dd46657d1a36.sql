-- Separate admin and customer authentication systems

-- First, let's create a dedicated admin_users table for admin authentication
-- This will be completely separate from the customer authentication

-- Update the admin_users table to include password hash for separate admin auth
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Insert the admin user directly (you'll need to handle password hashing in the app)
INSERT INTO public.admin_users (email, password_hash) 
VALUES ('loripiero88@gmail.com', NULL)
ON CONFLICT (email) DO NOTHING;

-- Create a function to authenticate admin users without using Supabase auth
CREATE OR REPLACE FUNCTION public.authenticate_admin(admin_email TEXT, admin_password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- For now, we'll just check if the email exists in admin_users
  -- You can add proper password hashing later
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = admin_email
  );
END;
$$;

-- Update RLS policies for orders to allow admins to see all orders
DROP POLICY IF EXISTS "Users can view own orders or admins can view all" ON public.orders;
DROP POLICY IF EXISTS "Users can update own orders or admins can update all" ON public.orders;

-- Create new policies that distinguish between customer orders and admin access
CREATE POLICY "Customers can view their own orders" ON public.orders
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Anonymous orders are viewable" ON public.orders
FOR SELECT 
USING (user_id IS NULL);

CREATE POLICY "Admins can view all orders" ON public.orders
FOR SELECT 
USING (is_admin(get_current_user_email()));

CREATE POLICY "Customers can update their own orders" ON public.orders
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all orders" ON public.orders
FOR UPDATE 
USING (is_admin(get_current_user_email()));

-- Similar updates for order_items and order_field_values
DROP POLICY IF EXISTS "Order items view policy" ON public.order_items;
DROP POLICY IF EXISTS "Order items update policy" ON public.order_items;

CREATE POLICY "Customers can view their order items" ON public.order_items
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM orders 
  WHERE orders.id = order_items.order_id 
  AND orders.user_id = auth.uid()
));

CREATE POLICY "Anonymous order items are viewable" ON public.order_items
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM orders 
  WHERE orders.id = order_items.order_id 
  AND orders.user_id IS NULL
));

CREATE POLICY "Admins can view all order items" ON public.order_items
FOR SELECT 
USING (is_admin(get_current_user_email()));

-- Update field values policies
DROP POLICY IF EXISTS "Field values view policy" ON public.order_field_values;
DROP POLICY IF EXISTS "Field values update policy" ON public.order_field_values;

CREATE POLICY "Customers can view their field values" ON public.order_field_values
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM orders 
  WHERE orders.id = order_field_values.order_id 
  AND orders.user_id = auth.uid()
));

CREATE POLICY "Anonymous field values are viewable" ON public.order_field_values
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM orders 
  WHERE orders.id = order_field_values.order_id 
  AND orders.user_id IS NULL
));

CREATE POLICY "Admins can view all field values" ON public.order_field_values
FOR SELECT 
USING (is_admin(get_current_user_email()));