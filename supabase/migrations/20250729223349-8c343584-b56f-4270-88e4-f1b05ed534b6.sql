-- Först, rensa befintliga placeholder-maskiner
DELETE FROM public.machines WHERE name LIKE 'Exempel%';

-- Lägg till riktiga maskiner med korrekta leasing-tariffer
INSERT INTO public.machines (
  id, name, description, price_eur, category, is_premium, uses_credits, 
  credits_per_treatment, credit_min, credit_max, leasing_min, leasing_max,
  flatrate_amount, default_customer_price, default_leasing_period, 
  leasing_tariffs, is_active
) VALUES 
(
  gen_random_uuid(),
  'Emerald',
  'Unik premiumlösning för fettreduktion med avancerad laser-teknologi',
  99500,
  'treatment',
  true,
  true,
  1,
  149,
  299,
  20666,
  33863,
  5996,
  3500,
  60,
  '{"36": 2.205, "48": 1.89, "60": 1.75, "72": 1.65}'::jsonb,
  true
),
(
  gen_random_uuid(),
  'Zerona',
  'Icke-invasiv kroppsskulptering med kliniskt bevisade resultat',
  65000,
  'treatment',
  false,
  true,
  1,
  99,
  199,
  13500,
  22000,
  3996,
  2500,
  60,
  '{"36": 2.205, "48": 1.89, "60": 1.75, "72": 1.65}'::jsonb,
  true
),
(
  gen_random_uuid(),
  'FX 635',
  'Professionell behandlingslaser för hudföryngring',
  45000,
  'treatment',
  false,
  true,
  1,
  79,
  159,
  9300,
  15300,
  2796,
  2000,
  60,
  '{"36": 2.205, "48": 1.89, "60": 1.75, "72": 1.65}'::jsonb,
  true
),
(
  gen_random_uuid(),
  'FX 405',
  'Kompakt behandlingslaser för mindre kliniker',
  35000,
  'treatment',
  false,
  true,
  1,
  69,
  139,
  7200,
  11900,
  2196,
  1800,
  60,
  '{"36": 2.205, "48": 1.89, "60": 1.75, "72": 1.65}'::jsonb,
  true
);

-- Fixa RLS-policy för test_exports så admin kan spara
DROP POLICY IF EXISTS "Admin can manage test exports" ON public.test_exports;

CREATE POLICY "Admin can manage test exports" ON public.test_exports
FOR ALL USING (true) WITH CHECK (true);