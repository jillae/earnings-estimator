import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DealerRevenueReport from '@/components/DealerRevenueReport';
import TestRunner from '@/components/TestRunner';
import MachineDataManager from '@/components/MachineDataManager';
import ScrollToTop from '@/components/ScrollToTop';
import { SecureAdminAuth } from '@/components/SecureAdminAuth';
import { setActiveTariffYear } from '@/utils/leasingTariffUtils';

const Admin = () => {
  const [includeInsurance, setIncludeInsurance] = useState(true);
  const [use2025Tariffs, setUse2025Tariffs] = useState(false);

  useEffect(() => {
    // Sätt aktiv tariffår när komponenten laddas eller när tariffer ändras
    setActiveTariffYear(use2025Tariffs);
  }, [use2025Tariffs]);

  return (
    <SecureAdminAuth>
      <div className="container mx-auto py-10">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">
              Hantera systemet och visa rapporter
            </p>
          </div>

          <Tabs defaultValue="revenue" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="revenue">Återförsäljarintäkt</TabsTrigger>
              <TabsTrigger value="tests">Beräkningstester</TabsTrigger>
              <TabsTrigger value="settings">Inställningar</TabsTrigger>
              <TabsTrigger value="machines">Maskindata</TabsTrigger>
            </TabsList>

            <TabsContent value="revenue" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Återförsäljarintäkt</CardTitle>
                  <CardDescription>
                    Analysera intäkter från återförsäljare baserat på kalkylatorn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="include-insurance"
                        checked={includeInsurance}
                        onCheckedChange={setIncludeInsurance}
                      />
                      <Label htmlFor="include-insurance">
                        Inkludera försäkring i beräkningar
                      </Label>
                    </div>
                  </div>
                  <DealerRevenueReport includeInsurance={includeInsurance} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tests" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Beräkningstester</CardTitle>
                  <CardDescription>
                    Kör tester för att verifiera att alla beräkningar fungerar korrekt
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TestRunner />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Inställningar</CardTitle>
                  <CardDescription>
                    Konfigurera systemets beteende och inställningar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="use-2025-tariffs"
                        checked={use2025Tariffs}
                        onCheckedChange={setUse2025Tariffs}
                      />
                      <Label htmlFor="use-2025-tariffs">
                        Använd 2025 års leasingtariffer (annars 2024)
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="machines" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Maskindata</CardTitle>
                  <CardDescription>
                    Hantera maskindata och inställningar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MachineDataManager />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <ScrollToTop />
      </div>
    </SecureAdminAuth>
  );
};

export default Admin;