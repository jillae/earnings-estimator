-- Skapa tabell för calculator logs
CREATE TABLE public.calculator_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  action TEXT NOT NULL,
  user_name TEXT,
  user_email TEXT,
  data JSONB,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Skapa index för bättre prestanda
CREATE INDEX idx_calculator_logs_session_id ON public.calculator_logs(session_id);
CREATE INDEX idx_calculator_logs_timestamp ON public.calculator_logs(timestamp);
CREATE INDEX idx_calculator_logs_user_email ON public.calculator_logs(user_email);

-- Aktivera Row Level Security
ALTER TABLE public.calculator_logs ENABLE ROW LEVEL SECURITY;

-- Skapa policy för att tillåta insert för alla (logs behöver inte autentisering)
CREATE POLICY "Alla kan lägga till calculator logs" 
ON public.calculator_logs 
FOR INSERT 
WITH CHECK (true);

-- Skapa policy för läsning (endast admin kan läsa logs)
CREATE POLICY "Endast admin kan läsa calculator logs" 
ON public.calculator_logs 
FOR SELECT 
USING (false); -- Kommer uppdateras när admin-funktionalitet implementeras