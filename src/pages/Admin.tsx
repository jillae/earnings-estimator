
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DealerRevenueReport from '@/components/DealerRevenueReport';
import TestRunner from '@/components/TestRunner';
import MachineDataManager from '@/components/MachineDataManager';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { setActiveTariffYear } from '@/utils/leasingTariffUtils';

const Admin = () => {
  const navigate = useNavigate();
  const [includeInsurance, setIncludeInsurance] = useState(true);
  const [use2025Tariffs, setUse2025Tariffs] = useState(true);
  
  // Aktivera vald tariff när komponenten laddas eller när växling sker
  useEffect(() => {
    setActiveTariffYear(use2025Tariffs);
    toast.success(`Använder ${use2025Tariffs ? '2025' : '2024'} års leasingtariffer`);
  }, [use2025Tariffs]);
  
  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    toast.success('Du har loggat ut');
    navigate('/');
  };

  return (
    <div className="container mx-auto py-4 px-4">
      <div className="flex justify-between items-center mb-6">
        <Link to="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tillbaka till kalkylator
          </Button>
        </Link>
        <Button onClick={handleLogout} variant="destructive" size="sm">
          <LogOut className="mr-2 h-4 w-4" />
          Logga ut
        </Button>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      
      <Tabs defaultValue="dealer-revenue" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="dealer-revenue">Återförsäljarintäkt</TabsTrigger>
          <TabsTrigger value="testing">Beräkningstester</TabsTrigger>
          <TabsTrigger value="settings">Inställningar</TabsTrigger>
          <TabsTrigger value="machines">Maskindata</TabsTrigger>
        </TabsList>
        <TabsContent value="dealer-revenue" className="mt-4">
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Återförsäljarintäkt - Analys</h2>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="insurance-toggle"
                  checked={includeInsurance}
                  onCheckedChange={setIncludeInsurance}
                />
                <Label htmlFor="insurance-toggle">Inkludera försäkring</Label>
              </div>
            </div>
            
            <DealerRevenueReport includeInsurance={includeInsurance} />
          </div>
        </TabsContent>
        <TabsContent value="testing" className="mt-4">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-bold mb-4">Beräkningstester</h2>
            <p className="text-gray-600 mb-4">Verifiera att alla beräkningar fungerar korrekt med befintliga hårdkodade värden.</p>
            <TestRunner />
          </div>
        </TabsContent>
        <TabsContent value="settings" className="mt-4">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-bold mb-4">Administrativa inställningar</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="font-medium">Leasingtariffer</h3>
                  <p className="text-sm text-gray-500">Välj vilka leasingtariffer som ska användas i kalkylatorn</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="tariff-toggle" className={!use2025Tariffs ? "font-bold" : ""}>2024</Label>
                  <Switch
                    id="tariff-toggle"
                    checked={use2025Tariffs}
                    onCheckedChange={setUse2025Tariffs}
                  />
                  <Label htmlFor="tariff-toggle" className={use2025Tariffs ? "font-bold" : ""}>2025</Label>
                </div>
              </div>
              
              <p className="text-gray-500">Fler inställningar kommer att läggas till här.</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="machines" className="mt-4">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-bold mb-4">Maskindata-hantering</h2>
            <p className="text-gray-600 mb-4">Hantera all maskindata som används i kalkylatorn.</p>
            <MachineDataManager />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
