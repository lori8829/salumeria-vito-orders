-- Fix function search path mutable security issue by setting search_path
-- for all existing functions

-- Update the update_daily_capacity function
CREATE OR REPLACE FUNCTION public.update_daily_capacity()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
BEGIN
  -- Insert or update daily capacity counter
  INSERT INTO public.category_daily_capacity (category_id, capacity_date, current_orders)
  VALUES (NEW.category_id, NEW.pickup_date, 1)
  ON CONFLICT (category_id, capacity_date)
  DO UPDATE SET current_orders = category_daily_capacity.current_orders + 1;
  
  RETURN NEW;
END;
$function$;

-- Update the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Update the handle_new_customer function
CREATE OR REPLACE FUNCTION public.handle_new_customer()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.customer_profiles (user_id, first_name, last_name, phone, email)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name', 
    NEW.raw_user_meta_data ->> 'phone',
    NEW.email
  );
  RETURN NEW;
END;
$function$;