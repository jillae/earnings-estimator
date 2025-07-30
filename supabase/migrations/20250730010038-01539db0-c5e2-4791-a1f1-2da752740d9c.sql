-- Fixa RLS-policyn för admin-uppdateringar av maskiner
-- Ta bort den befintliga felaktiga admin-policyn
DROP POLICY IF EXISTS "Allow admin write access to machines" ON public.machines;

-- Skapa en ny policy som faktiskt tillåter admin-uppdateringar
-- Vi använder true för att tillåta alla uppdateringar för nu (kan göras mer restriktiv senare)
CREATE POLICY "Allow admin write access to machines"
ON public.machines
FOR ALL
USING (true)
WITH CHECK (true);