-- Lägg till handhållna maskiner som saknas i databasen
INSERT INTO public.machines (
  id, name, price_eur, is_premium, uses_credits, credit_min, credit_max,
  flatrate_amount, default_customer_price, default_leasing_period,
  leasing_min, leasing_max, credits_per_treatment, description, category, is_active,
  leasing_tariffs
) VALUES 
-- XLR8 Handhållen
('9999-xlr8-handheld-0000', 'XLR8', 9900, false, false, 0, 0, 0, 500, 60, 24, 120, 0, 
 'Instegsmodell av handhållen behandlingsutrustning', 'handheld', true, 
 '{"36": 0.032, "48": 0.028, "60": 0.025, "72": 0.022}'::jsonb),

-- EVRL Handhållen  
('9999-evrl-handheld-0000', 'EVRL', 17900, false, false, 0, 0, 0, 800, 60, 24, 120, 0,
 'Specialanpassad utrustning för särskilda behandlingar', 'handheld', true,
 '{"36": 0.032, "48": 0.028, "60": 0.025, "72": 0.022}'::jsonb),

-- GVL Handhållen
('9999-gvl-handheld-0000', 'GVL', 19900, false, false, 0, 0, 0, 1200, 60, 24, 120, 0,
 'Senaste modellen av handhållen behandlingsutrustning', 'handheld', true,
 '{"36": 0.032, "48": 0.028, "60": 0.025, "72": 0.022}'::jsonb),

-- Base Station Special
('9999-base-station-special', 'Base Station', 30900, false, false, 0, 0, 0, 3600, 60, 24, 120, 0,
 'Set om 3st. handhållna för högpresterande kliniker', 'special', true,
 '{"36": 0.032, "48": 0.028, "60": 0.025, "72": 0.022}'::jsonb),

-- Lunula Special 
('9999-lunula-special-0000', 'Lunula', 25900, false, false, 0, 0, 0, 4000, 60, 24, 120, 0,
 'Specialiserad behandlingsutrustning för medicinsk fotvård', 'special', true,
 '{"36": 0.032, "48": 0.028, "60": 0.025, "72": 0.022}'::jsonb)

ON CONFLICT (id) DO NOTHING;