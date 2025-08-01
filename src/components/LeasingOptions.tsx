
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useCalculator } from '@/context/CalculatorContext';

interface LeasingOption {
  id: string;
  name: string;
  rate: number;
}

interface InsuranceOption {
  id: string;
  name: string;
  rate: number;
}

interface LeasingOptionsProps {
  leasingPeriods: LeasingOption[];
  insuranceOptions: InsuranceOption[];
  selectedLeasingPeriodId: string;
  selectedInsuranceId: string;
  onLeasingPeriodChange: (id: string) => void;
  onInsuranceChange: (id: string) => void;
}

const LeasingOptions: React.FC<LeasingOptionsProps> = ({
  leasingPeriods,
  insuranceOptions,
  selectedLeasingPeriodId,
  selectedInsuranceId,
  onLeasingPeriodChange,
  onInsuranceChange
}) => {
  const { logSignificantInteraction } = useCalculator();

  const handleLeasingPeriodChange = (id: string) => {
    logSignificantInteraction('leasing_period_changed');
    onLeasingPeriodChange(id);
  };

  const handleInsuranceChange = (id: string) => {
    logSignificantInteraction('insurance_changed');
    onInsuranceChange(id);
  };
  return (
    <div className="calculator-grid animate-slide-in bg-slate-50/20 border border-slate-200 rounded-lg p-4 hover:bg-slate-50/30 transition-colors" style={{ animationDelay: '200ms' }}>
      <div className="input-group">
        <div className="h-14 flex items-center">
          <label htmlFor="leasing-period" className="input-label text-slate-800">
            Leasingperiod
          </label>
        </div>
        
        <Select value={selectedLeasingPeriodId} onValueChange={handleLeasingPeriodChange}>
          <SelectTrigger className="w-full" id="leasing-period">
            <SelectValue placeholder="Välj period" />
          </SelectTrigger>
          
          <SelectContent className="min-w-[200px] bg-white border shadow-lg z-50">
            {leasingPeriods.map((period) => (
              <SelectItem key={period.id} value={period.id}>
                {period.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="input-group">
        <div className="h-14 flex items-center">
          <label htmlFor="insurance" className="input-label text-slate-800">
            Försäkring
            <div className="text-xs text-slate-600 mt-1">
              Försäkring - fullvärdesförsäkring, självrisk 1500 kr
            </div>
          </label>
        </div>
        
        <Select value={selectedInsuranceId} onValueChange={handleInsuranceChange}>
          <SelectTrigger className="w-full" id="insurance">
            <SelectValue placeholder="Välj försäkring" />
          </SelectTrigger>
          
          <SelectContent className="min-w-[200px] bg-white border shadow-lg z-50">
            {insuranceOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LeasingOptions;
