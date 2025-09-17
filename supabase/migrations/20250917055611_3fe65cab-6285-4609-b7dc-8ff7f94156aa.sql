-- Remove the overly permissive policies that allow everyone to view and insert order items
DROP POLICY IF EXISTS "Everyone can view order items" ON public.order_items;
DROP POLICY IF EXISTS "Everyone can insert order items" ON public.order_items;

-- Create secure policy for viewing order items - only if user owns the order or is admin
CREATE POLICY "Users can view items for their own orders" 
ON public.order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND (
      orders.user_id = auth.uid() 
      OR orders.user_id IS NULL 
      OR auth.email() IN ('admin@pasticceria.com', 'owner@pasticceria.com')
    )
  )
);

-- Create secure policy for inserting order items - only for owned orders or anonymous orders
CREATE POLICY "Users can insert items for their orders" 
ON public.order_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND (
      orders.user_id = auth.uid() 
      OR orders.user_id IS NULL
      OR auth.email() IN ('admin@pasticceria.com', 'owner@pasticceria.com')
    )
  )
);

-- Update existing policies to be more restrictive
DROP POLICY IF EXISTS "Authenticated users can update order items" ON public.order_items;
DROP POLICY IF EXISTS "Authenticated users can delete order items" ON public.order_items;

-- Create secure policy for updating order items - only for owned orders or admins
CREATE POLICY "Users can update items for their orders" 
ON public.order_items 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND (
      orders.user_id = auth.uid()
      OR auth.email() IN ('admin@pasticceria.com', 'owner@pasticceria.com')
    )
  )
);

-- Create secure policy for deleting order items - only for owned orders or admins
CREATE POLICY "Users can delete items for their orders" 
ON public.order_items 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND (
      orders.user_id = auth.uid()
      OR auth.email() IN ('admin@pasticceria.com', 'owner@pasticceria.com')
    )
  )
);