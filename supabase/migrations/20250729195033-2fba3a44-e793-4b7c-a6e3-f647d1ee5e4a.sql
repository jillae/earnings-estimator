-- Ta bort Soprano Ice och uppdatera till generiska exempeldata
DELETE FROM public.machines WHERE name = 'Soprano Ice';

-- Uppdatera Emerald till Exempel 1
UPDATE public.machines 
SET 
  name = 'Exempel 1',
  description = 'Generisk testmaskin för premium-segment',
  price_eur = 400000,
  credit_min = 0,
  credit_max = 800,
  flatrate_amount = 500,
  default_customer_price = 2200,
  leasing_tariffs = '{"36": 9000, "48": 8000, "60": 7200, "72": 6800}'::jsonb
WHERE name = 'Emerald';

-- Uppdatera Zerona till Exempel 2
UPDATE public.machines 
SET 
  name = 'Exempel 2',
  description = 'Generisk testmaskin för mellanpris-segment',
  price_eur = 250000,
  credit_min = 0,
  credit_max = 600,
  flatrate_amount = 350,
  default_customer_price = 1600,
  leasing_tariffs = '{"36": 6000, "48": 5200, "60": 4800, "72": 4400}'::jsonb
WHERE name = 'Zerona';

-- Lägg till Exempel 3
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
  is_active,
  leasing_tariffs
) VALUES (
  'Exempel 3', 
  150000, 
  false, 
  false, 
  0, 
  0, 
  0, 
  1200, 
  60,
  24,
  120,
  1,
  'Generisk testmaskin utan credit-system',
  'treatment',
  true,
  '{"36": 3500, "48": 3000, "60": 2800, "72": 2600}'::jsonb
);