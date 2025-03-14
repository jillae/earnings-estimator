
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

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
  return (
    <div className="calculator-grid animate-slide-in" style={{ animationDelay: '200ms' }}>
      <div className="input-group">
        <label htmlFor="leasing-period" className="input-label">
          Leasingperiod
        </label>
        
        <Select value={selectedLeasingPeriodId} onValueChange={onLeasingPeriodChange}>
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
        <label htmlFor="insurance" className="input-label">
          Försäkring
        </label>
        
        <Select value={selectedInsuranceId} onValueChange={onInsuranceChange}>
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
    </div>
  );
};

export default LeasingOptions;
