-- Fix RLS policies by removing references to auth.email() which causes permission denied errors
-- We'll use a simpler approach that doesn't require accessing the users table

-- Drop all existing problematic policies
DROP POLICY IF EXISTS "Secure order items view policy" ON public.order_items;
DROP POLICY IF EXISTS "Secure order items insert policy" ON public.order_items;
DROP POLICY IF EXISTS "Secure order items update policy" ON public.order_items;
DROP POLICY IF EXISTS "Secure order items delete policy" ON public.order_items;

-- Create new policies without auth.email() references
CREATE POLICY "Order items view policy" 
ON public.order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND (
      orders.user_id = auth.uid() 
      OR orders.user_id IS NULL
    )
  )
);

CREATE POLICY "Order items insert policy" 
ON public.order_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND (
      orders.user_id = auth.uid() 
      OR orders.user_id IS NULL
    )
  )
);

CREATE POLICY "Order items update policy" 
ON public.order_items 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Order items delete policy" 
ON public.order_items 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- Also fix similar issues in orders table policies
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins have full access to orders" ON public.orders;

-- Fix order_field_values policies as well
DROP POLICY IF EXISTS "Users can view field values for their own orders" ON public.order_field_values;
DROP POLICY IF EXISTS "Users can insert field values for their orders" ON public.order_field_values;  
DROP POLICY IF EXISTS "Users can update field values for their orders" ON public.order_field_values;
DROP POLICY IF EXISTS "Users can delete field values for their orders" ON public.order_field_values;

CREATE POLICY "Field values view policy" 
ON public.order_field_values 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_field_values.order_id 
    AND (
      orders.user_id = auth.uid() 
      OR orders.user_id IS NULL
    )
  )
);

CREATE POLICY "Field values insert policy" 
ON public.order_field_values 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_field_values.order_id 
    AND (
      orders.user_id = auth.uid() 
      OR orders.user_id IS NULL
    )
  )
);

CREATE POLICY "Field values update policy" 
ON public.order_field_values 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_field_values.order_id 
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Field values delete policy" 
ON public.order_field_values 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_field_values.order_id 
    AND orders.user_id = auth.uid()
  )
);