
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from '@/utils/calculatorUtils';

interface TreatmentSettingsProps {
  treatmentsPerDay: number;
  customerPrice: number;
  onTreatmentsChange: (value: number) => void;
  onCustomerPriceChange: (value: number) => void;
}

const treatmentOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const priceOptions = [
  500, 750, 1000, 1250, 1500, 1750, 2000, 
  2250, 2500, 2750, 3000, 3500, 4000, 4500, 5000
];

const TreatmentSettings: React.FC<TreatmentSettingsProps> = ({
  treatmentsPerDay,
  customerPrice,
  onTreatmentsChange,
  onCustomerPriceChange
}) => {
  const handleTreatmentsChange = (value: string) => {
    onTreatmentsChange(parseInt(value, 10));
  };

  const handlePriceChange = (value: string) => {
    onCustomerPriceChange(parseInt(value, 10));
  };

  return (
    <div className="md:grid md:grid-cols-2 md:gap-6">
      <div className="input-group mb-0">
        <label htmlFor="treatments-per-day" className="input-label h-14 flex items-start">
          Antal behandlingar per dag
        </label>
        
        <Select 
          value={treatmentsPerDay.toString()} 
          onValueChange={handleTreatmentsChange}
        >
          <SelectTrigger className="w-full" id="treatments-per-day">
            <SelectValue placeholder="Välj antal" />
          </SelectTrigger>
          <SelectContent>
            {treatmentOptions.map((value) => (
              <SelectItem key={value} value={value.toString()}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="input-group mb-0">
        <label htmlFor="customer-price" className="input-label h-14 flex items-start">
          Kundpris per behandling (kr) ink moms
        </label>
        
        <Select 
          value={customerPrice.toString()} 
          onValueChange={handlePriceChange}
        >
          <SelectTrigger className="w-full" id="customer-price">
            <SelectValue placeholder="Välj pris" />
          </SelectTrigger>
          <SelectContent>
            {priceOptions.map((value) => (
              <SelectItem key={value} value={value.toString()}>
                {formatCurrency(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TreatmentSettings;
