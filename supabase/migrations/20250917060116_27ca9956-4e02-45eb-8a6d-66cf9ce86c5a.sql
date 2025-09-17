-- First, let's check and remove all policies that reference auth.email() which causes the permission denied error

-- Remove problematic policies from orders table
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins have full access to orders" ON public.orders;

-- The issue is likely in existing policies that reference auth.email()
-- Let's check what policies exist and recreate them without auth.email() references