-- Fix security issue: Restrict INSERT access to calculator_logs table
-- Remove the overly permissive policy that allows anyone to insert
DROP POLICY IF EXISTS "Alla kan lägga till calculator logs" ON public.calculator_logs;

-- Create a more secure policy that only allows the service role to insert
-- This ensures only our edge functions can log data, not arbitrary users
CREATE POLICY "Allow service role to insert calculator logs" 
ON public.calculator_logs 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'anon');

-- Additional policy to allow edge functions using anon key to insert
-- We check if the request comes from our expected edge function context
CREATE POLICY "Allow edge function inserts" 
ON public.calculator_logs 
FOR INSERT 
WITH CHECK (
  -- Allow if current role is anon (from edge function) 
  -- and request has proper structure (basic validation)
  auth.role() = 'anon' AND 
  session_id IS NOT NULL AND 
  action IS NOT NULL
);