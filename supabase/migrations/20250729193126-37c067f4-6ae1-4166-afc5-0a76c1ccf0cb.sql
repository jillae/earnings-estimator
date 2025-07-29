-- Utöka machines-tabellen med all nödvändig maskindata
ALTER TABLE public.machines 
DROP COLUMN IF EXISTS price,
ADD COLUMN price_eur numeric NOT NULL DEFAULT 0,
ADD COLUMN leasing_tariffs jsonb DEFAULT '{}',
ADD COLUMN leasing_min integer DEFAULT 0,
ADD COLUMN leasing_max integer DEFAULT 120,
ADD COLUMN credits_per_treatment integer DEFAULT 1,
ADD COLUMN description text,
ADD COLUMN category text DEFAULT 'treatment',
ADD COLUMN is_active boolean DEFAULT true;

-- Uppdatera befintliga kolumner för bättre struktur
ALTER TABLE public.machines 
ALTER COLUMN default_customer_price SET DEFAULT 2500,
ALTER COLUMN credit_min SET DEFAULT 0,
ALTER COLUMN credit_max SET DEFAULT 1000,
ALTER COLUMN flatrate_amount SET DEFAULT 0;

-- Lägg till RLS policies för admin-åtkomst
CREATE POLICY "Allow admin full access to machines" 
ON public.machines 
FOR ALL 
USING (false) -- Endast admin via service key
WITH CHECK (false);

-- Lägg till index för prestanda
CREATE INDEX IF NOT EXISTS idx_machines_category ON public.machines(category);
CREATE INDEX IF NOT EXISTS idx_machines_active ON public.machines(is_active);

-- Lägg till exempel-data för befintliga maskiner om tabellen är tom
INSERT INTO public.machines (
  name, 
  price_eur, 
  is_premium, 
  uses_credits, 
  credit_min, 
  credit_max, 
  flatrate_amount, 
  default_customer_price,
  default_leasing_period,
  leasing_min,
  leasing_max,
  credits_per_treatment,
  description,
  category,
  leasing_tariffs
) VALUES 
(
  'Emerald', 
  500000, 
  false, 
  true, 
  0, 
  1000, 
  600, 
  2500, 
  60,
  24,
  120,
  1,
  'Premium laser för estetiska behandlingar',
  'treatment',
  '{"36": 11000, "48": 9500, "60": 8500, "72": 7800}'
),
(
  'Zerona', 
  350000, 
  false, 
  true, 
  0, 
  800, 
  500, 
  2000, 
  60,
  24,
  120,
  1,
  'Laser för kroppsskulptering',
  'treatment',
  '{"36": 8000, "48": 7000, "60": 6200, "72": 5800}'
),
(
  'Soprano Ice', 
  280000, 
  false, 
  true, 
  0, 
  600, 
  400, 
  1800, 
  60,
  24,
  120,
  1,
  'Hårborttagningslaser',
  'treatment',
  '{"36": 6500, "48": 5800, "60": 5200, "72": 4800}'
)
ON CONFLICT (name) DO NOTHING;