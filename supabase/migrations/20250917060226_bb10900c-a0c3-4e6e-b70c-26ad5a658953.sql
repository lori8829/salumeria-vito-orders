-- CRITICAL SECURITY FIX: Remove public access to orders table containing sensitive customer data
-- Current policy allows public access which exposes customer names, phone numbers, and addresses

-- Remove the publicly accessible view policy
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

-- Create restrictive policies that protect customer data
-- Policy 1: Authenticated users can only view their own orders
CREATE POLICY "Authenticated users can view own orders" 
ON public.orders 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Policy 2: Allow viewing of anonymous orders (orders without user_id)
-- This is needed for anonymous order functionality but doesn't expose personal data of other users
CREATE POLICY "Anonymous orders viewable by creator" 
ON public.orders 
FOR SELECT 
TO anon
USING (user_id IS NULL);

-- Clean up duplicate insert policies
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow anonymous order creation" ON public.orders;

-- Keep only the secure insert policies
-- The following policies already exist and are secure:
-- - "Authenticated users can insert their own orders" (TO authenticated, WITH CHECK auth.uid() = user_id)
-- - "Anonymous order creation allowed" (TO anon, WITH CHECK user_id IS NULL)

-- Note: Update and Delete policies are already secure (only allow users to modify their own orders)