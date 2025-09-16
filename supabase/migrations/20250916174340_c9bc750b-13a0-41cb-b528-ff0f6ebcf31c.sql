-- Remove the overly permissive policies that allow everyone to view order field values
DROP POLICY IF EXISTS "Everyone can view order field values" ON public.order_field_values;
DROP POLICY IF EXISTS "Everyone can insert order field values" ON public.order_field_values;

-- Remove the overly broad authenticated user policies
DROP POLICY IF EXISTS "Authenticated users can update order field values" ON public.order_field_values;
DROP POLICY IF EXISTS "Authenticated users can delete order field values" ON public.order_field_values;

-- Create secure policy for viewing order field values - only if user owns the order or is admin
CREATE POLICY "Users can view field values for their own orders" 
ON public.order_field_values 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_field_values.order_id 
    AND (
      orders.user_id = auth.uid() 
      OR orders.user_id IS NULL 
      OR auth.email() IN ('admin@pasticceria.com', 'owner@pasticceria.com')
    )
  )
);

-- Create secure policy for inserting order field values - only for owned orders or anonymous orders
CREATE POLICY "Users can insert field values for their orders" 
ON public.order_field_values 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_field_values.order_id 
    AND (
      orders.user_id = auth.uid() 
      OR orders.user_id IS NULL
      OR auth.email() IN ('admin@pasticceria.com', 'owner@pasticceria.com')
    )
  )
);

-- Create secure policy for updating order field values - only for owned orders or admins
CREATE POLICY "Users can update field values for their orders" 
ON public.order_field_values 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_field_values.order_id 
    AND (
      orders.user_id = auth.uid()
      OR auth.email() IN ('admin@pasticceria.com', 'owner@pasticceria.com')
    )
  )
);

-- Create secure policy for deleting order field values - only for owned orders or admins
CREATE POLICY "Users can delete field values for their orders" 
ON public.order_field_values 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_field_values.order_id 
    AND (
      orders.user_id = auth.uid()
      OR auth.email() IN ('admin@pasticceria.com', 'owner@pasticceria.com')
    )
  )
);