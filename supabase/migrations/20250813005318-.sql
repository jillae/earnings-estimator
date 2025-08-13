-- Fix security issue: Ensure admin_users table is properly secured
-- Verify RLS is enabled and policies are restrictive

-- First, ensure RLS is enabled on admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Drop any potentially insecure policies and recreate them properly
DROP POLICY IF EXISTS "Admin users can view all admin accounts" ON public.admin_users;
DROP POLICY IF EXISTS "Admin users can update admin accounts" ON public.admin_users;
DROP POLICY IF EXISTS "Only existing admins can create new admin accounts" ON public.admin_users;

-- Create secure policies that only allow authenticated admin users to access admin data
-- SELECT: Only existing active admin users can view admin accounts
CREATE POLICY "Admin users can view admin accounts" 
ON public.admin_users 
FOR SELECT 
USING (is_admin_user());

-- UPDATE: Only existing active admin users can update admin accounts
CREATE POLICY "Admin users can update admin accounts" 
ON public.admin_users 
FOR UPDATE 
USING (is_admin_user()) 
WITH CHECK (is_admin_user());

-- INSERT: Only existing active admin users can create new admin accounts
CREATE POLICY "Admin users can create admin accounts" 
ON public.admin_users 
FOR INSERT 
WITH CHECK (is_admin_user());

-- DELETE: Only existing active admin users can delete admin accounts
CREATE POLICY "Admin users can delete admin accounts" 
ON public.admin_users 
FOR DELETE 
USING (is_admin_user());