-- FIXA KRITISK RLS-BUG: Tillåt läsning av maskindata för anon-rollen
-- Problemet är att befintliga policies blockerar ALL åtkomst

-- Ta bort felaktiga restrictive policies
DROP POLICY IF EXISTS "Allow public read access to machines" ON public.machines;
DROP POLICY IF EXISTS "Allow admin full access to machines" ON public.machines;

-- Skapa korrekt policy för offentlig läsning av maskindata
CREATE POLICY "Allow public read access to machines" 
ON public.machines 
FOR SELECT 
USING (true); -- Tillåt alla att läsa maskindata

-- Skapa separat policy för admin write-åtkomst (kräver service key)
CREATE POLICY "Allow admin write access to machines" 
ON public.machines 
FOR ALL 
USING (false) -- Endast admin via service key kan skriva
WITH CHECK (false);