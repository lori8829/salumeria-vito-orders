-- Remove the overly permissive policy that allows everyone to view all orders
DROP POLICY IF EXISTS "Everyone can view orders" ON public.orders;

-- Remove the policy that allows everyone to insert orders without proper user association
DROP POLICY IF EXISTS "Everyone can insert orders" ON public.orders;

-- Create a secure policy for users to insert their own orders
CREATE POLICY "Users can insert their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create a policy for anonymous orders (for customers who aren't logged in)
-- This allows orders where user_id is NULL, but only during insertion
CREATE POLICY "Allow anonymous order creation" 
ON public.orders 
FOR INSERT 
WITH CHECK (user_id IS NULL);

-- Keep the existing policy that allows users to view their own orders
-- This policy already exists: "Users can view their own orders"

-- Create a policy for authenticated admins to view all orders
CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email IN (
      'admin@pasticceria.com', 
      'owner@pasticceria.com'
    )
  )
);

-- Create a policy for authenticated admins to update all orders
CREATE POLICY "Admins can update all orders" 
ON public.orders 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email IN (
      'admin@pasticceria.com', 
      'owner@pasticceria.com'
    )
  )
);

-- Ensure the existing user-specific policies remain active
-- "Users can view their own orders" should already exist and remain
-- "Authenticated users can update orders" - we'll keep this for user's own orders
-- "Authenticated users can delete orders" - we'll keep this for user's own orders