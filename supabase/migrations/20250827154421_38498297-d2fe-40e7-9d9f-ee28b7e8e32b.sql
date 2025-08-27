-- 1) Rensa historisk PII i calculator_logs
UPDATE public.calculator_logs
SET user_name = NULL,
    user_email = NULL
WHERE user_name IS NOT NULL OR user_email IS NOT NULL;

-- 2) Funktion + triggers som alltid nollställer namn/e-post vid INSERT/UPDATE
CREATE OR REPLACE FUNCTION public.nullify_calculator_log_pii()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.user_name := NULL;
  NEW.user_email := NULL;
  RETURN NEW;
END;
$$;

-- Säkerställ att gamla triggers inte ligger kvar
DROP TRIGGER IF EXISTS trg_nullify_calculator_log_pii_ins ON public.calculator_logs;
DROP TRIGGER IF EXISTS trg_nullify_calculator_log_pii_upd ON public.calculator_logs;

-- Skapa idempotenta triggers
CREATE TRIGGER trg_nullify_calculator_log_pii_ins
BEFORE INSERT ON public.calculator_logs
FOR EACH ROW EXECUTE FUNCTION public.nullify_calculator_log_pii();

CREATE TRIGGER trg_nullify_calculator_log_pii_upd
BEFORE UPDATE ON public.calculator_logs
FOR EACH ROW EXECUTE FUNCTION public.nullify_calculator_log_pii();

-- 3) Ta bort känsligt index på e-post (vi lagrar inte detta längre)
DROP INDEX IF EXISTS public.idx_calculator_logs_user_email;

-- 4) Härda RLS: ta bort gammal permissiv policy och säkerställ korrekta policies
ALTER TABLE public.calculator_logs ENABLE ROW LEVEL SECURITY;

-- Ta bort legacy-policy om den skulle finnas kvar
DROP POLICY IF EXISTS "Alla kan lägga till calculator logs" ON public.calculator_logs;

-- Säkerställ policy: endast service role får INSERT
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'calculator_logs'
      AND policyname = 'Only service role can insert logs'
  ) THEN
    CREATE POLICY "Only service role can insert logs"
    ON public.calculator_logs
    FOR INSERT
    WITH CHECK (auth.role() = 'service_role'::text);
  END IF;
END$$;

-- Säkerställ policy: endast admin-användare får SELECT
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'calculator_logs'
      AND policyname = 'Admin users can read calculator logs'
  ) THEN
    CREATE POLICY "Admin users can read calculator logs"
    ON public.calculator_logs
    FOR SELECT
    USING (is_admin_user());
  END IF;
END$$;