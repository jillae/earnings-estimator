
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
    <div className="calculator-grid animate-slide-in bg-red-50/20 border border-red-200 rounded-lg p-4 hover:bg-red-50/30 transition-colors" style={{ animationDelay: '200ms' }}>
      <div className="input-group">
        <div className="h-14 flex items-center">
          <label htmlFor="leasing-period" className="input-label text-red-800 flex items-center">
            <span className="w-2 h-2 bg-red-400 rounded-sm mr-2"></span>
            Leasingperiod
          </label>
        </div>
        
        <Select value={selectedLeasingPeriodId} onValueChange={handleLeasingPeriodChange}>
          <SelectTrigger className="w-full" id="leasing-period">
            <SelectValue placeholder="Välj period" />
          </SelectTrigger>
          
          <SelectContent>
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
          <label htmlFor="insurance" className="input-label text-red-800 flex items-center">
            <span className="w-2 h-2 bg-red-400 rounded-sm mr-2"></span>
            Försäkring
            <div className="text-xs text-red-600 mt-1">
              Försäkring - fullvärdesförsäkring, självrisk 1500 kr
            </div>
          </label>
        </div>
        
        <Select value={selectedInsuranceId} onValueChange={handleInsuranceChange}>
          <SelectTrigger className="w-full" id="insurance">
            <SelectValue placeholder="Välj försäkring" />
          </SelectTrigger>
          
          <SelectContent>
            {insuranceOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <p className="text-xs text-red-600 col-span-2 mt-2">Påverkar kostnader • Välj period och försäkring</p>
    </div>
  );
};

export default LeasingOptions;
