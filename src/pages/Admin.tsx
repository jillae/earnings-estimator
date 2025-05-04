
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DealerRevenueReport from '@/components/DealerRevenueReport';

const Admin = () => {
  const navigate = useNavigate();
  
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
          <TabsTrigger value="settings">Inställningar</TabsTrigger>
        </TabsList>
        <TabsContent value="dealer-revenue" className="mt-4">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-bold mb-4">Återförsäljarintäkt - Analys</h2>
            <DealerRevenueReport includeInsurance={true} />
          </div>
        </TabsContent>
        <TabsContent value="settings" className="mt-4">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-bold mb-4">Administrativa inställningar</h2>
            <p className="text-gray-500">Här kommer framtida inställningar.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
