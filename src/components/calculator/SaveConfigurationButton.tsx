import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useCalculator } from '@/context/CalculatorContext';
import { useToast } from '@/hooks/use-toast';

export const SaveConfigurationButton: React.FC = () => {
  const { 
    selectedMachine,
    clinicSize,
    paymentOption,
    selectedLeasingPeriodId,
    selectedInsuranceId,
    selectedSlaLevel,
    selectedDriftpaket,
    treatmentsPerDay,
    customerPrice,
    leasingCost,
    netResults
  } = useCalculator();
  
  const { toast } = useToast();

  const handleSaveConfiguration = () => {
    const configuration = {
      selectedMachine: selectedMachine?.name || '',
      clinicSize,
      paymentOption,
      selectedLeasingPeriodId,
      selectedInsuranceId,
      selectedSlaLevel,
      selectedDriftpaket,
      treatmentsPerDay,
      customerPrice,
      leasingCost,
      netPerMonth: netResults.netPerMonthExVat,
      netPerYear: netResults.netPerYearExVat,
      savedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('calculator_saved_configuration', JSON.stringify(configuration));
      toast({
        title: "Konfiguration sparad",
        description: "Din konfiguration har sparats lokalt i webbläsaren.",
      });
    } catch (error) {
      toast({
        title: "Fel vid sparande",
        description: "Kunde inte spara konfigurationen. Försök igen.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={handleSaveConfiguration}
      className="w-full flex items-center justify-center gap-2 h-12 bg-slate-100 hover:bg-slate-200 border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-800 transition-all duration-200 font-medium"
    >
      <Save size={18} />
      Spara konfiguration
    </Button>
  );
};