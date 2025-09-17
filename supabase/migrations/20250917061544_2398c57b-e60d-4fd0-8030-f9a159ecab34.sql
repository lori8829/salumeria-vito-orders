-- Create admin_users table to control admin access
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Insert the authorized admin user
INSERT INTO public.admin_users (email) VALUES ('loripiero88@gmail.com');

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE email = user_email
  );
$$;

-- Create function to get current user email from auth
CREATE OR REPLACE FUNCTION public.get_current_user_email()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM auth.users WHERE id = auth.uid();
$$;

-- Update orders RLS policies to allow admin access
DROP POLICY IF EXISTS "Authenticated users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Anonymous orders viewable by creator" ON public.orders;

-- New policy: Users can view their own orders OR admins can view all orders
CREATE POLICY "Users can view own orders or admins can view all" 
ON public.orders 
FOR SELECT 
USING (
  (auth.uid() = user_id) OR 
  (user_id IS NULL) OR 
  (public.is_admin(public.get_current_user_email()))
);

-- Update other orders policies to include admin access
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
CREATE POLICY "Users can update own orders or admins can update all" 
ON public.orders 
FOR UPDATE 
USING (
  (auth.uid() = user_id) OR 
  (public.is_admin(public.get_current_user_email()))
);

-- Apply same logic to order_items
DROP POLICY IF EXISTS "Order items view policy" ON public.order_items;
CREATE POLICY "Order items view policy" 
ON public.order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND (
      (orders.user_id = auth.uid()) OR 
      (orders.user_id IS NULL) OR 
      (public.is_admin(public.get_current_user_email()))
    )
  )
);

-- Apply same logic to order_field_values
DROP POLICY IF EXISTS "Field values view policy" ON public.order_field_values;
CREATE POLICY "Field values view policy" 
ON public.order_field_values 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_field_values.order_id 
    AND (
      (orders.user_id = auth.uid()) OR 
      (orders.user_id IS NULL) OR 
      (public.is_admin(public.get_current_user_email()))
    )
  )
);

-- Admin users policies
CREATE POLICY "Admin users are viewable by admins only" 
ON public.admin_users 
FOR SELECT 
USING (public.is_admin(public.get_current_user_email()));

CREATE POLICY "Only existing admins can manage admin users" 
ON public.admin_users 
FOR ALL 
USING (public.is_admin(public.get_current_user_email()));