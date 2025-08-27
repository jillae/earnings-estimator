-- Secure calculator_logs RLS: restrict reads to admins and inserts to service role only
-- Ensure RLS is enabled
ALTER TABLE public.calculator_logs ENABLE ROW LEVEL SECURITY;

-- Drop old permissive policies if they exist
DROP POLICY IF EXISTS "Alla kan lägga till calculator logs" ON public.calculator_logs;
DROP POLICY IF EXISTS "Allow edge function inserts" ON public.calculator_logs;
DROP POLICY IF EXISTS "Allow service role to insert calculator logs" ON public.calculator_logs;
DROP POLICY IF EXISTS "Admin users can read calculator logs" ON public.calculator_logs;
DROP POLICY IF EXISTS "Endast admin kan läsa calculator logs" ON public.calculator_logs;

-- Allow only service role to insert (explicit; service_role bypasses RLS, but this documents intent)
CREATE POLICY "Only service role can insert logs"
ON public.calculator_logs
FOR INSERT
TO public
WITH CHECK (auth.role() = 'service_role');

-- Allow only admin users to read
CREATE POLICY "Admin users can read calculator logs"
ON public.calculator_logs
FOR SELECT
USING (public.is_admin_user());

-- Do not allow UPDATE/DELETE by anyone (no policies created)
