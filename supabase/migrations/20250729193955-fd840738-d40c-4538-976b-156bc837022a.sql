-- Skapa tabell för att spara testresultat-exports
CREATE TABLE IF NOT EXISTS public.test_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  export_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT,
  description TEXT
);

-- Lägg till RLS policy för admin-åtkomst
ALTER TABLE public.test_exports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage test exports" 
ON public.test_exports 
FOR ALL 
USING (false) -- Endast admin via service key
WITH CHECK (false);