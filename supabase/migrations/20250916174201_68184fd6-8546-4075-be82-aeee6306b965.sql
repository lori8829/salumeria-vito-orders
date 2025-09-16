-- Remove the overly permissive policy that allows everyone to view all orders
DROP POLICY IF EXISTS "Everyone can view orders" ON public.orders;

-- Remove the policy that allows everyone to insert orders without proper user association  
DROP POLICY IF EXISTS "Everyone can insert orders" ON public.orders;

-- Create a secure policy for authenticated users to insert their own orders
CREATE POLICY "Authenticated users can insert their own orders" 
ON public.orders 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create a policy for anonymous order creation (customers who aren't logged in)
CREATE POLICY "Anonymous order creation allowed" 
ON public.orders 
FOR INSERT 
TO anon
WITH CHECK (user_id IS NULL);

-- Create admin policies for full access (replace the existing overly broad ones)
CREATE POLICY "Admins have full access to orders" 
ON public.orders 
FOR ALL
TO authenticated
USING (
  auth.email() IN (
    'admin@pasticceria.com', 
    'owner@pasticceria.com'
  )
);

-- Update the existing broad update policy to be more restrictive
DROP POLICY IF EXISTS "Authenticated users can update orders" ON public.orders;
CREATE POLICY "Users can update their own orders" 
ON public.orders 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Update the existing broad delete policy to be more restrictive  
DROP POLICY IF EXISTS "Authenticated users can delete orders" ON public.orders;
CREATE POLICY "Users can delete their own orders" 
ON public.orders 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);