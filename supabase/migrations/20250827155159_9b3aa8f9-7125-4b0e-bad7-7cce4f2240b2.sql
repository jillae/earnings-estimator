-- Hårdsäkra åtkomst: ta bort alla tabellprivilegier för anon på calculator_logs
REVOKE ALL PRIVILEGES ON TABLE public.calculator_logs FROM anon;

-- Säkerställ att RLS är aktiv (idempotent)
ALTER TABLE public.calculator_logs ENABLE ROW LEVEL SECURITY;