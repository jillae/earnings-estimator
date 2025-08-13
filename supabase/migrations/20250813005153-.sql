-- Fix security issue: Restrict access to test_exports table
-- The current policy allows public access to sensitive business intelligence data
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Admin can manage test exports" ON public.test_exports;

-- Create a proper admin-only policy for all operations
-- Only authenticated admin users should access business intelligence data
CREATE POLICY "Admin users can manage test exports" 
ON public.test_exports 
FOR ALL 
USING (is_admin_user()) 
WITH CHECK (is_admin_user());

-- Ensure the table has RLS enabled (should already be enabled)
ALTER TABLE public.test_exports ENABLE ROW LEVEL SECURITY;